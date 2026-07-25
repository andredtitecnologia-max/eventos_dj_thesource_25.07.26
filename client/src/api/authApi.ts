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

const baseUrl = "/api/auth";

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Falha na comunicação com o servidor");
  }
  return data;
}

export async function registerClient(payload: RegisterPayload) {
  const response = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function loginClient(payload: LoginPayload) {
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}
