type RegisterPayload = {
  nome_completo: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  genero: string;
  cep: string;
  cidade: string;
  estado: string;
};

type LoginPayload = {
  email: string;
  password?: string;
};

const STORAGE_KEY = "djTheSourceUsers";

function getUsers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Array<RegisterPayload>) : [];
}

function saveUsers(users: Array<RegisterPayload>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export async function registerClient(payload: RegisterPayload) {
  const users = getUsers();
  if (
    users.find(
      (user) =>
        user.email === payload.email || user.cpf_cnpj === payload.cpf_cnpj,
    )
  ) {
    throw new Error(
      "E-mail ou CPF/CNPJ já cadastrado. Faça login ou use outro.",
    );
  }
  users.push(payload);
  saveUsers(users);
  return payload;
}

export async function loginClient(payload: LoginPayload) {
  const users = getUsers();
  const user = users.find((user) => user.email === payload.email);
  if (!user) {
    throw new Error("E-mail não cadastrado.");
  }
  return { name: user.nome_completo, email: user.email };
}
