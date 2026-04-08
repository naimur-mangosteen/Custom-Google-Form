import styles from './page.module.css';
import UrlInput from '@/components/UrlInput';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.topbar}>
        <span className={styles.mark}>✦ CGF</span>
        <span className={styles.meta}>VOL.01 — FORMS REFRAMED</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} /> STEP_01 / PASTE A GOOGLE FORM URL
        </p>

        <h1 className={styles.title}>
          Forms,<br />
          <span className={styles.lineHL}><mark>reframed.</mark></span>
        </h1>

        <p className={styles.lede}>
          Drop a Google Form link and get a clean, branded version you can share in seconds —
          <em> same questions, better skin.</em> No code, no sign-up.
        </p>

        <div className={styles.inputBlock}>
          <UrlInput />
          <p className={styles.hint}>
            Form must be public — set sharing to <code>Anyone with the link</code> · Free · No sign-up
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© NAIMUR RAHMAN</span>
        <span className={styles.rule} />
        <span>SET IN FRAUNCES &amp; JETBRAINS MONO</span>
      </footer>
    </main>
  );
}
