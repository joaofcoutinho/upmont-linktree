import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida no .env.local");
}

export const sql = neon(process.env.DATABASE_URL);

/** Cria a tabela se ainda não existir */
export async function setupDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS cadastros (
      id         SERIAL PRIMARY KEY,
      nome       TEXT        NOT NULL,
      telefone   TEXT        NOT NULL,
      email      TEXT        NOT NULL,
      perfil     TEXT        NOT NULL,
      criado_em  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

/** Insere um novo cadastro */
export async function insertCadastro(
  nome: string,
  telefone: string,
  email: string,
  perfil: string
) {
  const [row] = await sql`
    INSERT INTO cadastros (nome, telefone, email, perfil)
    VALUES (${nome}, ${telefone}, ${email}, ${perfil})
    RETURNING id, criado_em
  `;
  return row;
}
