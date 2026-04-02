"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import type { CadastroData, FormErrors, Perfil } from "@/types/cadastro";
import { validate, hasErrors, maskPhone } from "@/lib/validation";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import styles from "./CadastroForm.module.css";

// ── Ícones SVG profissionais (sem emoji) ──────────────
function IconCorretor() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconInvestimento() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}

function IconMoradia() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

// ── WhatsApp icon ─────────────────────────────────────
function IconWhatsApp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Dados dos perfis ──────────────────────────────────
const PERFIS: { value: Perfil; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "Corretor",     label: "Corretor",     icon: <IconCorretor />,     desc: "Parceria comercial" },
  { value: "Investimento", label: "Investimento", icon: <IconInvestimento />, desc: "Investir em imóveis"  },
  { value: "Moradia",      label: "Moradia",      icon: <IconMoradia />,      desc: "Comprar meu imóvel"  },
];

const INITIAL: Partial<CadastroData> = { nome: "", telefone: "", email: "", perfil: undefined };

export default function CadastroForm() {
  const [dados, setDados]     = useState<Partial<CadastroData>>(INITIAL);
  const [errors, setErrors]   = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // ── Handlers ─────────────────────────────────────
  function handleText(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handlePhone(e: ChangeEvent<HTMLInputElement>) {
    const masked = maskPhone(e.target.value);
    setDados((prev) => ({ ...prev, telefone: masked }));
    if (errors.telefone) setErrors((prev) => ({ ...prev, telefone: undefined }));
  }

  function handlePerfil(value: Perfil) {
    setDados((prev) => ({ ...prev, perfil: value }));
    if (errors.perfil) setErrors((prev) => ({ ...prev, perfil: undefined }));
  }

  // ── Submit ────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const erros = validate(dados);
    if (hasErrors(erros)) {
      setErrors(erros);
      return;
    }

    const payload = dados as CadastroData;
    setLoading(true);

    try {
      await fetch("/api/rd-station", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Não bloqueia o fluxo se o RD Station falhar
    }

    window.location.href = buildWhatsAppURL(payload);
  }

  // ── Render ────────────────────────────────────────
  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* Nome */}
      <div className={styles.fieldGroup}>
        <label htmlFor="nome" className={styles.label}>
          Nome completo <span className={styles.required}>*</span>
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          className={`${styles.input} ${errors.nome ? styles.inputError : ""}`}
          placeholder="Seu nome completo"
          autoComplete="name"
          value={dados.nome ?? ""}
          onChange={handleText}
        />
        {errors.nome && <span className={styles.errorMsg}>{errors.nome}</span>}
      </div>

      {/* Telefone */}
      <div className={styles.fieldGroup}>
        <label htmlFor="telefone" className={styles.label}>
          Telefone / WhatsApp <span className={styles.required}>*</span>
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          className={`${styles.input} ${errors.telefone ? styles.inputError : ""}`}
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          maxLength={15}
          value={dados.telefone ?? ""}
          onChange={handlePhone}
        />
        {errors.telefone && <span className={styles.errorMsg}>{errors.telefone}</span>}
      </div>

      {/* E-mail */}
      <div className={styles.fieldGroup}>
        <label htmlFor="email" className={styles.label}>
          E-mail <span className={styles.required}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          placeholder="seu@email.com"
          autoComplete="email"
          value={dados.email ?? ""}
          onChange={handleText}
        />
        {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
      </div>

      {/* Perfil */}
      <div className={styles.fieldGroup}>
        <span className={styles.label}>
          Perfil <span className={styles.required}>*</span>
        </span>
        <div className={styles.profileOptions} role="radiogroup" aria-label="Selecione seu perfil">
          {PERFIS.map((p) => (
            <label
              key={p.value}
              className={`${styles.profileCard} ${dados.perfil === p.value ? styles.profileCardSelected : ""}`}
              htmlFor={`perfil-${p.value.toLowerCase()}`}
            >
              <input
                type="radio"
                id={`perfil-${p.value.toLowerCase()}`}
                name="perfil"
                value={p.value}
                className={styles.radioHidden}
                checked={dados.perfil === p.value}
                onChange={() => handlePerfil(p.value)}
              />
              <div className={styles.profileInner}>
                <span className={styles.profileIcon}>{p.icon}</span>
                <span className={styles.profileLabel}>{p.label}</span>
                <span className={styles.profileDesc}>{p.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.perfil && <span className={styles.errorMsg}>{errors.perfil}</span>}
      </div>

      {/* Submit */}
      <button type="submit" className={styles.btnSubmit} disabled={loading}>
        <span>{loading ? "Aguarde…" : "Continuar no WhatsApp"}</span>
        {!loading && <IconWhatsApp />}
      </button>

    </form>
  );
}
