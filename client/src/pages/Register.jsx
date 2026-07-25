import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { registerClient } from '../api/authApi';
import './Auth.css';
const Register = () => {
    const navigate = useNavigate();
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [genero, setGenero] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [message, setMessage] = useState('');
    const formatCpfCnpj = (v) => {
        const digits = v.replace(/\D/g, '');
        if (digits.length <= 11) {
            return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, a, b, c, d) => {
                return `${a}.${b}.${c}${d ? `-${d}` : ''}`;
            });
        }
        return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (m, a, b, c, d, e) => {
            return `${a}.${b}.${c}/${d}${e ? `-${e}` : ''}`;
        });
    };
    const formatTelefone = (v) => {
        const d = v.replace(/\D/g, '');
        if (d.length <= 10)
            return d.replace(/(\d{2})(\d{4})(\d{0,4})/, (m, a, b, c) => `${a} ${b}${c ? `-${c}` : ''}`);
        return d.replace(/(\d{2})(\d{5})(\d{0,4})/, (m, a, b, c) => `${a} ${b}${c ? `-${c}` : ''}`);
    };
    const formatCep = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d{0,3})/, (m, a, b) => (b ? `${a}-${b}` : a));
    const validateCpf = (v) => {
        const cpf = v.replace(/\D/g, '');
        if (cpf.length !== 11)
            return false;
        if (/^(\d)\1{10}$/.test(cpf))
            return false;
        let sum = 0;
        for (let i = 0; i < 9; i++)
            sum += Number(cpf[i]) * (10 - i);
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev !== Number(cpf[9]))
            return false;
        sum = 0;
        for (let i = 0; i < 10; i++)
            sum += Number(cpf[i]) * (11 - i);
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev !== Number(cpf[10]))
            return false;
        return true;
    };
    const handleCepBlur = async (v) => {
        const digits = v.replace(/\D/g, '');
        if (digits.length !== 8) {
            setMessage('CEP inválido.');
            return;
        }
        try {
            const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await res.json();
            if (data.erro) {
                setMessage('CEP não encontrado.');
                return;
            }
            setCidade(data.localidade || '');
            setEstado(data.uf || '');
            setMessage('');
        }
        catch (err) {
            setMessage('Falha ao buscar CEP.');
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        if (!nomeCompleto || !cpfCnpj || !email || !telefone || !dataNascimento || !genero || !cep || !cidade || !estado) {
            setMessage('Preencha todos os campos para continuar.');
            return;
        }
        try {
            const client = await registerClient({
                nome_completo: nomeCompleto,
                cpf_cnpj: cpfCnpj,
                email,
                telefone,
                data_nascimento: dataNascimento,
                genero,
                cep,
                cidade,
                estado,
            });
            localStorage.setItem('djClient', JSON.stringify({ name: client.nome_completo || nomeCompleto, email: client.email }));
            navigate('/');
        }
        catch (error) {
            setMessage(error.message || 'Falha ao cadastrar cliente.');
        }
    };
    return (<div className="page-shell">
      <Header />
      <main className="auth-page">
        <section className="auth-card">
          <h2>Cadastro de Cliente</h2>
          <p>Crie sua conta para acessar orçamentos e receber propostas personalizadas.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="nomeCompleto">Nome completo</label>
            <input id="nomeCompleto" type="text" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} placeholder="Seu nome"/>
            <label htmlFor="cpfCnpj">CPF / CNPJ</label>
            <input id="cpfCnpj" type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} onBlur={e => {
            const formatted = formatCpfCnpj(e.target.value);
            setCpfCnpj(formatted);
            if (!validateCpf(formatted))
                setMessage('CPF inválido.');
            else
                setMessage('');
        }} placeholder="000.000.000-00 ou 00.000.000/0000-00"/>
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@exemplo.com"/>
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} onBlur={e => setTelefone(formatTelefone(e.target.value))} placeholder="(00) 00000-0000"/>
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <input id="dataNascimento" type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)}/>
            <label htmlFor="genero">Gênero</label>
            <select id="genero" value={genero} onChange={e => setGenero(e.target.value)}>
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="prefiro_nao_dizer">Prefiro não dizer</option>
            </select>
            <label htmlFor="cep">CEP</label>
            <input id="cep" type="text" value={cep} onChange={e => setCep(e.target.value)} onBlur={e => {
            const formatted = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{0,3})/, (m, a, b) => (b ? `${a}-${b}` : a));
            setCep(formatted);
            handleCepBlur(formatted);
        }} placeholder="00000-000"/>
            <label htmlFor="cidade">Cidade</label>
            <input id="cidade" type="text" value={cidade} onChange={e => setCidade(e.target.value)}/>
            <label htmlFor="estado">Estado</label>
            <input id="estado" type="text" value={estado} onChange={e => setEstado(e.target.value)}/>
            <button type="submit" className="auth-button">Cadastrar</button>
            {message && <p className="auth-message">{message}</p>}
          </form>
          <p className="auth-footer">
            Já tem conta? <Link to="/login">Faça login</Link>
          </p>
        </section>
      </main>
    </div>);
};
export default Register;
