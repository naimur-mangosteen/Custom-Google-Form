import styles from './page.module.css';
import UrlInput from '@/components/UrlInput';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="container">
        <div className="card">
          <h1 className={styles.title}>Custom Google Forms</h1>
          <p className={styles.description}>
            Transform your standard Google Forms into beautiful, branded experiences in seconds.
          </p>
          <UrlInput />
        </div>
      </div>
    </main>
  );
}
