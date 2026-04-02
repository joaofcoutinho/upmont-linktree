import { NextRequest, NextResponse } from "next/server";
import type { CadastroData } from "@/types/cadastro";
import { setupDatabase, insertCadastro } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const dados: CadastroData = await req.json();

    await setupDatabase();
    const row = await insertCadastro(
      dados.nome,
      dados.telefone,
      dados.email,
      dados.perfil
    );
    console.log(`[DB] Cadastro salvo — id: ${row.id}`);

    return NextResponse.json({ ok: true, id: row.id });
  } catch (err) {
    console.error("[API] erro:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
