'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FormPreview from '@/components/FormPreview';
import styles from './page.module.css';

function Editor() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [embedOpen, setEmbedOpen] = useState(false);

    // Theme State
    const [theme, setTheme] = useState({
        primary: '#4F46E5',
        background: '#FFFFFF',
        text: '#111827',
        borderRadius: '8px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    });

    // Font Options
    const fontOptions = [
        { label: 'System Sans', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
        { label: 'Inter', value: '"Inter", sans-serif', import: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
        { label: 'Roboto', value: '"Roboto", sans-serif', import: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
        { label: 'Open Sans', value: '"Open Sans", sans-serif', import: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap' },
        { label: 'Lora (Serif)', value: '"Lora", serif', import: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap' },
        { label: 'Monospace', value: '"Courier New", Courier, monospace' }
    ];

    useEffect(() => {
        // Dynamically load selected font in the editor preview
        const selectedFont = fontOptions.find(f => f.value === theme.fontFamily);
        if (selectedFont && selectedFont.import) {
            const link = document.createElement('link');
            link.href = selectedFont.import;
            link.rel = 'stylesheet';
            link.id = 'dynamic-font'; // Simple ID to prevent duplicates, though replacing effectively works

            const existing = document.getElementById('dynamic-font');
            if (existing) {
                existing.href = selectedFont.import;
            } else {
                document.head.appendChild(link);
            }
        }
    }, [theme.fontFamily]);

    useEffect(() => {
        if (!url) return;

        const fetchForm = async () => {
            try {
                const res = await fetch(`/api/parse?url=${encodeURIComponent(url)}`);
                if (!res.ok) throw new Error('Failed to load form');
                const data = await res.json();
                setForm(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchForm();
    }, [url]);

    const handleThemeChange = (key, value) => {
        setTheme(prev => ({ ...prev, [key]: value }));
    };

    const getEmbedCode = () => {
        if (!form) return '';

        const selectedFont = fontOptions.find(f => f.value === theme.fontFamily);
        const fontImport = selectedFont?.import ? `<link href="${selectedFont.import}" rel="stylesheet">` : '';

        const css = `
<style>
  .cgf-form {
    max-width: 600px;
    margin: 0 auto;
    background: ${theme.background};
    color: ${theme.text};
    padding: 2rem;
    border-radius: ${theme.borderRadius};
    font-family: ${theme.fontFamily};
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .cgf-field { margin-bottom: 1.5rem; }
  .cgf-label { 
    display: block; 
    font-size: 1.1rem; 
    font-weight: 700; 
    margin-bottom: 0.5rem; 
  }
  .cgf-input, .cgf-select, .cgf-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: inherit;
  }
  .cgf-input:focus, .cgf-select:focus, .cgf-textarea:focus {
    outline: 2px solid ${theme.primary};
    border-color: transparent;
  }
  .cgf-button {
    background: ${theme.primary};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
  }
  .cgf-button:hover { opacity: 0.9; }
</style>
`;

        // Static HTML generation loop
        const fieldsHtml = form.fields.map(f => {
            let inputHtml = '';
            if (f.type === 'short_text') inputHtml = `<input type="text" name="${f.name}" class="cgf-input" ${f.required ? 'required' : ''}>`;
            else if (f.type === 'long_text') inputHtml = `<textarea name="${f.name}" class="cgf-textarea" rows="3" ${f.required ? 'required' : ''}></textarea>`;
            else if (f.type === 'dropdown') {
                const opts = f.options.map(o => `<option value="${o}">${o}</option>`).join('');
                inputHtml = `<select name="${f.name}" class="cgf-select" ${f.required ? 'required' : ''}><option value="">Select...</option>${opts}</select>`;
            }
            else if (f.type === 'radio') {
                // simplified radio for embed
                inputHtml = f.options.map(o => `<div><label><input type="radio" name="${f.name}" value="${o}" ${f.required ? 'required' : ''}> ${o}</label></div>`).join('');
            }
            else if (f.type === 'checkbox') {
                inputHtml = f.options.map(o => `<div><label><input type="checkbox" name="${f.name}" value="${o}"> ${o}</label></div>`).join('');
            }
            else inputHtml = `<!-- Unsupported type: ${f.type} -->`;

            return `
      <div class="cgf-field">
        <label class="cgf-label">${f.label} ${f.required ? '<span style="color:red">*</span>' : ''}</label>
        ${inputHtml}
      </div>`;
        }).join('');

        return `
<!-- Custom Google Form Embed -->
${fontImport}
${css}
<div class="cgf-form">
  <h2>${form.title}</h2>
  <form action="${form.action}" method="POST">
    ${fieldsHtml}
    <button type="submit" class="cgf-button">Submit</button>
  </form>
</div>
`;
    };

    if (!url) return <div className="container">No URL provided</div>;
    if (loading) return <div className="container">Loading form...</div>;
    if (error) return <div className="container">Error: {error}</div>;

    return (
        <div className={styles.editorLayout}>
            <aside className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Customize</h2>

                <div className={styles.controlGroup}>
                    <label>Primary Color</label>
                    <input type="color" value={theme.primary} onChange={(e) => handleThemeChange('primary', e.target.value)} />
                </div>

                <div className={styles.controlGroup}>
                    <label>Background Color</label>
                    <input type="color" value={theme.background} onChange={(e) => handleThemeChange('background', e.target.value)} />
                </div>

                <div className={styles.controlGroup}>
                    <label>Font Family</label>
                    <select value={theme.fontFamily} onChange={(e) => handleThemeChange('fontFamily', e.target.value)}>
                        {fontOptions.map(f => (
                            <option key={f.label} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.controlGroup}>
                    <label>Border Radius</label>
                    <select value={theme.borderRadius} onChange={(e) => handleThemeChange('borderRadius', e.target.value)}>
                        <option value="0px">Square (0px)</option>
                        <option value="4px">Small (4px)</option>
                        <option value="8px">Medium (8px)</option>
                        <option value="16px">Large (16px)</option>
                    </select>
                </div>

                <button className={styles.embedButton} onClick={() => setEmbedOpen(true)}>
                    Get Embed Code
                </button>
            </aside>

            <main className={styles.previewArea}>
                <FormPreview form={form} theme={theme} />
            </main>

            {embedOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Embed Code</h3>
                        <textarea readOnly className={styles.codeBlock} value={getEmbedCode()} />
                        <div className={styles.modalActions}>
                            <button onClick={() => navigator.clipboard.writeText(getEmbedCode())}>Copy Code</button>
                            <button onClick={() => setEmbedOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Editor />
        </Suspense>
    );
}
