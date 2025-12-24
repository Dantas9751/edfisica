export interface User {
  id: number;
  name: string;
  matricula: string;
  qtd_token: number;
  tipo: "adm" | "aluno";
  created_at: string;
  updated_at: string;
}
