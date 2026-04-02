import { NextRequest, NextResponse } from "next/server";
import type { CadastroData, RDStationPayload } from "@/types/cadastro";

const RD_TOKEN = process.env.RD_STATION_TOKEN ?? "";
const RD_API_URL = "https://api.rd.services/platform/events";

export async function POST(req: NextRequest) {
  try {
    const dados: CadastroData = await req.json();

    if (!RD_TOKEN) {
      // Token não configurado — não bloqueia o fluxo do cliente
      return NextResponse.json({ ok: false, reason: "token_missing" }, { status: 200 });
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

    const res = await fetch(`${RD_API_URL}?api_key=${RD_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[RD Station] erro:", res.status, text);
      return NextResponse.json({ ok: false, status: res.status }, { status: 200 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[RD Station] exceção:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
