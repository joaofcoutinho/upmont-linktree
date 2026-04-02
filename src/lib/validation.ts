import type { CadastroData, FormErrors } from "@/types/cadastro";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(dados: Partial<CadastroData>): FormErrors {
  const errors: FormErrors = {};

  if (!dados.nome?.trim()) {
    errors.nome = "Informe seu nome.";
  }

  const telLimpo = (dados.telefone ?? "").replace(/\D/g, "");
  if (telLimpo.length < 10) {
    errors.telefone = "Informe um telefone válido.";
  }

  if (!EMAIL_RE.test(dados.email ?? "")) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!dados.perfil) {
    errors.perfil = "Selecione um perfil.";
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function maskPhone(value: string): string {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}
