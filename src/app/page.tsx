import Image from "next/image";
import CadastroForm from "@/components/CadastroForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* Fundo com blur — fora do wrapper para não sobrepor */}
      <div className={styles.bg}>
        <Image
          src="/fundo.png"
          alt=""
          fill
          className={styles.bgImage}
          priority
        />
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.pageWrapper}>

        {/* Branding */}
        <header className={styles.brandHeader}>
          <div className={styles.logoWrap}>
            <Image
              src="/logo.png"
              alt="Upmont Incorporadora"
              width={140}
              height={140}
              className={styles.logo}
              priority
            />
          </div>
          <div className={styles.divider} />
          <p className={styles.brandTagline}>Transformamos espaços em experiências</p>
        </header>

        {/* Card */}
        <main className={styles.card}>
          <CadastroForm />
        </main>

        <footer className={styles.pageFooter}>
          <p>&copy; {new Date().getFullYear()} Upmont Incorporadora &mdash; Todos os direitos reservados</p>
        </footer>

      </div>
    </>
  );
}
