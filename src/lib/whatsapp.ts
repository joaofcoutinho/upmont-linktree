import type { CadastroData } from "@/types/cadastro";

const WA_NUMBER = "5527992670152";

export function buildWhatsAppURL(dados: CadastroData): string {
  const message =
    `*Cadastro de Clientes*\n` +
    `Nome: ${dados.nome}\n` +
    `Telefone: ${dados.telefone}\n` +
    `E-mail: ${dados.email}\n` +
    `Perfil: ${dados.perfil}`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
