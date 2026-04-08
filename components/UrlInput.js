'use client';
import { useState } from 'react';
import styles from './UrlInput.module.css';
import { useRouter } from 'next/navigation';

export default function UrlInput() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        // Basic validation
        const googleFormRegex = /^https:\/\/docs\.google\.com\/forms\/d\/(e\/)?[a-zA-Z0-9_-]+\/viewform/;
        if (!googleFormRegex.test(url)) {
            alert('Please enter a valid Google Form URL (ending in /viewform)');
            return;
        }

        setLoading(true);
        // Encode the URL and navigate to the editor
        router.push(`/editor?url=${encodeURIComponent(url)}`);
    };

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Paste Google Form link here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Loading...' : 'Customize'}
                </button>
            </form>
        </div>
    );
}
