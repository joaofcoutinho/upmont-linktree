import { NextRequest, NextResponse } from "next/server";
import type { CadastroData, RDStationPayload } from "@/types/cadastro";
import { setupDatabase, insertCadastro } from "@/lib/db";

const RD_TOKEN = process.env.RD_STATION_TOKEN ?? "";
const RD_API_URL = "https://api.rd.services/platform/events";

export async function POST(req: NextRequest) {
  try {
    const dados: CadastroData = await req.json();
    console.log("[API] dados recebidos:", dados);

    // ── 1. Salva no banco de dados ─────────────────
    await setupDatabase();
    const row = await insertCadastro(
      dados.nome,
      dados.telefone,
      dados.email,
      dados.perfil
    );
    console.log(`[DB] Cadastro salvo — id: ${row.id}`);

    // ── 2. Envia ao RD Station ─────────────────────
    console.log("[RD Station] token configurado:", !!RD_TOKEN);

    if (!RD_TOKEN) {
      console.warn("[RD Station] token ausente — pulando envio");
      return NextResponse.json({ ok: true, id: row.id, rd: "token_missing" });
    }

    const payload: RDStationPayload = {
      event_type: "CONVERSION",
      event_family: "CDP",
      payload: {
        conversion_identifier: "cadastro-upmont-linktree",
        name: dados.nome,
        email: dados.email,
        mobile_phone: dados.telefone,
        cf_perfil: dados.perfil,
        tags: ["linktree", "cadastro", dados.perfil.toLowerCase()],
        traffic_source: "linktree-upmont",
      },
    };

    console.log("[RD Station] payload:", JSON.stringify(payload));

    const res = await fetch(`${RD_API_URL}?api_key=${RD_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resBody = await res.text();
    console.log("[RD Station] status:", res.status, "| resposta:", resBody);

    return NextResponse.json({ ok: true, id: row.id, rd_status: res.status });
  } catch (err) {
    console.error("[API] erro:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
