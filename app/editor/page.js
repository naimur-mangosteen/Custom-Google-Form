'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FormPreview from '@/components/FormPreview';
import styles from './page.module.css';

const FONT_OPTIONS = [
    { label: 'Fraunces (Serif)', value: '"Fraunces", Georgia, serif', import: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;800&display=swap' },
    { label: 'Inter', value: '"Inter", sans-serif', import: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
    { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace', import: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' },
    { label: 'Lora (Serif)', value: '"Lora", serif', import: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap' },
    { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif', import: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap' },
    { label: 'System Sans', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
];

const PRESETS = [
    {
        name: 'Paper',
        primary: '#0c0c0c',
        background: '#f4f1ea',
        text: '#0c0c0c',
        accent: '#f0ff3f',
        borderRadius: '0px',
        fontFamily: '"Fraunces", Georgia, serif',
        style: 'brutalist',
    },
    {
        name: 'Mono',
        primary: '#111111',
        background: '#ffffff',
        text: '#111111',
        accent: '#111111',
        borderRadius: '2px',
        fontFamily: '"JetBrains Mono", monospace',
        style: 'minimal',
    },
    {
        name: 'Soft',
        primary: '#7c3aed',
        background: '#faf7ff',
        text: '#1f1147',
        accent: '#a78bfa',
        borderRadius: '14px',
        fontFamily: '"Inter", sans-serif',
        style: 'soft',
    },
    {
        name: 'Midnight',
        primary: '#f0ff3f',
        background: '#0a0a0a',
        text: '#f4f1ea',
        accent: '#f0ff3f',
        borderRadius: '4px',
        fontFamily: '"Space Grotesk", sans-serif',
        style: 'dark',
    },
    {
        name: 'Editorial',
        primary: '#c0341d',
        background: '#fffaf0',
        text: '#1a1a1a',
        accent: '#c0341d',
        borderRadius: '0px',
        fontFamily: '"Lora", serif',
        style: 'editorial',
    },
];

function Editor() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const url = searchParams.get('url');

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [embedOpen, setEmbedOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const [theme, setTheme] = useState(PRESETS[0]);

    useEffect(() => {
        const selected = FONT_OPTIONS.find(f => f.value === theme.fontFamily);
        if (selected?.import) {
            const id = `dynamic-font-${selected.label}`;
            if (!document.getElementById(id)) {
                const link = document.createElement('link');
                link.href = selected.import;
                link.rel = 'stylesheet';
                link.id = id;
                document.head.appendChild(link);
            }
        }
    }, [theme.fontFamily]);

    useEffect(() => {
        if (!url) return;
        const fetchForm = async () => {
            try {
                const res = await fetch(`/api/parse?url=${encodeURIComponent(url)}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load form');
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

    const applyPreset = (preset) => setTheme(preset);

    const handleCopy = () => {
        navigator.clipboard.writeText(getEmbedCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getEmbedCode = () => {
        if (!form) return '';
        const selected = FONT_OPTIONS.find(f => f.value === theme.fontFamily);
        const fontImport = selected?.import ? `<link href="${selected.import}" rel="stylesheet">\n` : '';
        const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        const v = theme.style || 'minimal';
        const { primary, background, text, accent = primary, borderRadius, fontFamily } = theme;

        // Variant-specific overrides
        const variantCss = {
            brutalist: `
  .cgf-card { border: 2.5px solid ${text}; box-shadow: 14px 14px 0 ${text}; }
  .cgf-input, .cgf-textarea, .cgf-select { border: 2px solid ${text}; background: ${text}0a; }
  .cgf-button { border: 2px solid ${text}; box-shadow: 5px 5px 0 ${text}; text-transform: uppercase; letter-spacing: .06em; }
  .cgf-button:hover { box-shadow: 7px 7px 0 ${text}; transform: translate(-2px,-2px); }`,
            minimal: `
  .cgf-card { border: none; padding: 32px; }
  .cgf-input, .cgf-textarea, .cgf-select { border: none; border-bottom: 1.5px solid ${text}4d; border-radius: 0; padding: 10px 2px; background: transparent; }
  .cgf-input:focus, .cgf-textarea:focus, .cgf-select:focus { box-shadow: none; border-bottom-color: ${primary}; outline: none; }`,
            soft: `
  .cgf-card { border: none; box-shadow: 0 30px 60px -20px ${primary}38; }
  .cgf-input, .cgf-textarea, .cgf-select { background: ${primary}0f; border: 1px solid ${primary}24; }
  .cgf-button { box-shadow: 0 14px 24px -10px ${primary}99; }`,
            dark: `
  .cgf-card { border: 1px solid ${text}2e; }
  .cgf-input, .cgf-textarea, .cgf-select { background: ${text}0f; border-color: ${text}2e; color: ${text}; }
  .cgf-button { color: ${background}; font-weight: 800; }`,
            editorial: `
  .cgf-card { border: none; border-top: 4px double ${text}; border-bottom: 4px double ${text}; border-radius: 0; padding: 40px 36px; }
  .cgf-title { font-style: italic; font-weight: 900; }
  .cgf-button { border-radius: 0; border-bottom: 3px solid ${text}; text-transform: uppercase; letter-spacing: .1em; }`,
        }[v] || '';

        const css = `<style>
  .cgf-wrap { font-family: ${fontFamily}; color: ${text}; max-width: 680px; margin: 0 auto; }
  .cgf-card {
    background: ${background};
    color: ${text};
    border-radius: ${borderRadius};
    padding: 44px 44px 40px;
    border: 1px solid ${text}1f;
  }
  .cgf-header { margin-bottom: 32px; padding-bottom: 18px; border-bottom: 1px solid ${text}1f; }
  .cgf-title { font-size: 2rem; font-weight: 800; line-height: 1.1; letter-spacing: -.02em; margin: 0 0 8px; }
  .cgf-desc { color: ${text}a6; font-size: .95rem; line-height: 1.5; margin: 0; }
  .cgf-form { display: flex; flex-direction: column; gap: 26px; }
  .cgf-field { display: flex; flex-direction: column; gap: 8px; }
  .cgf-label { font-weight: 700; font-size: .95rem; }
  .cgf-required { color: ${accent}; margin-left: 4px; }
  .cgf-help { font-size: .8rem; color: ${text}99; margin: 0; }
  .cgf-input, .cgf-textarea, .cgf-select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid ${text}40;
    border-radius: ${borderRadius};
    font-size: 1rem;
    background: transparent;
    color: ${text};
    font-family: inherit;
    transition: border-color .15s, box-shadow .15s;
    box-sizing: border-box;
  }
  .cgf-input:focus, .cgf-textarea:focus, .cgf-select:focus {
    outline: none;
    border-color: ${primary};
    box-shadow: 0 0 0 3px ${primary}2e;
  }
  .cgf-options { display: flex; flex-direction: column; gap: 10px; }
  .cgf-options label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: .95rem; }
  .cgf-options input { accent-color: ${primary}; width: 16px; height: 16px; }
  .cgf-button {
    background: ${primary};
    color: ${background};
    padding: 14px 28px;
    border: none;
    border-radius: ${borderRadius};
    font-weight: 700;
    font-size: 1rem;
    align-self: flex-start;
    margin-top: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: transform .15s, opacity .15s, box-shadow .15s;
  }
  .cgf-button:hover { opacity: .92; transform: translateY(-1px); }${variantCss}
</style>`;

        const renderField = (f) => {
            const req = f.required ? ' required' : '';
            const star = f.required ? ' <span class="cgf-required">*</span>' : '';
            const help = f.helpText ? `\n      <p class="cgf-help">${esc(f.helpText)}</p>` : '';
            let input = '';
            if (f.type === 'short_text') {
                input = `<input type="text" name="${f.name}" class="cgf-input"${req}>`;
            } else if (f.type === 'long_text') {
                input = `<textarea name="${f.name}" class="cgf-textarea" rows="3"${req}></textarea>`;
            } else if (f.type === 'dropdown') {
                const opts = f.options.map(o => `        <option value="${esc(o)}">${esc(o)}</option>`).join('\n');
                input = `<select name="${f.name}" class="cgf-select"${req}>\n        <option value="">Choose an option</option>\n${opts}\n      </select>`;
            } else if (f.type === 'radio') {
                const opts = f.options.map(o => `        <label><input type="radio" name="${f.name}" value="${esc(o)}"${req}> <span>${esc(o)}</span></label>`).join('\n');
                input = `<div class="cgf-options">\n${opts}\n      </div>`;
            } else if (f.type === 'checkbox') {
                const opts = f.options.map(o => `        <label><input type="checkbox" name="${f.name}" value="${esc(o)}"> <span>${esc(o)}</span></label>`).join('\n');
                input = `<div class="cgf-options">\n${opts}\n      </div>`;
            }
            return `    <div class="cgf-field">
      <label class="cgf-label">${esc(f.label)}${star}</label>${help}
      ${input}
    </div>`;
        };

        const fields = form.fields.map(renderField).join('\n');
        const desc = form.description ? `\n    <p class="cgf-desc">${esc(form.description)}</p>` : '';

        return `<!-- Custom Google Form — generated by CGF -->
${fontImport}${css}

<div class="cgf-wrap">
  <div class="cgf-card">
    <div class="cgf-header">
      <h2 class="cgf-title">${esc(form.title)}</h2>${desc}
    </div>
    <form class="cgf-form" action="${form.action}" method="POST" target="_blank">
${fields}
      <button type="submit" class="cgf-button">Submit</button>
    </form>
  </div>
</div>`;
    };

    const highlight = (code) => {
        const escaped = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return escaped
            .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-c">$1</span>')
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-c">$1</span>')
            .replace(/(^|\n)(\s*)([\.#\-\w][\w\-\.\s,#:>]*)(\s*\{)/g, '$1$2<span class="hl-sel">$3</span>$4')
            .replace(/([\w\-]+)(\s*:)(\s*[^;{}\n]+)(;)/g, '<span class="hl-prop">$1</span>$2<span class="hl-val">$3</span>$4')
            .replace(/(&lt;\/?)([a-zA-Z][\w\-]*)/g, '$1<span class="hl-tag">$2</span>')
            .replace(/([\w\-]+)=(&quot;[^&]*?&quot;)/g, '<span class="hl-attr">$1</span>=<span class="hl-str">$2</span>');
    };

    if (!url) return <div className={styles.stateWrap}>No URL provided.</div>;

    if (loading) {
        return (
            <div className={styles.stateWrap}>
                <div className={styles.stateInner}>
                    <span className={styles.stateLabel}>◐ LOADING</span>
                    <h2 className={styles.stateTitle}>Fetching your form…</h2>
                </div>
            </div>
        );
    }

    if (error) {
        const isAuth = /sign-in|signin|restrict/i.test(error);
        return (
            <div className={styles.stateWrap}>
                <div className={styles.stateInner}>
                    <span className={styles.stateLabelErr}>● {isAuth ? 'RESTRICTED FORM' : 'ERROR'}</span>
                    <h2 className={styles.stateTitle}>
                        {isAuth ? 'This form needs to be public.' : 'Something went sideways.'}
                    </h2>
                    <p className={styles.stateBody}>{error}</p>
                    {isAuth && (
                        <ol className={styles.stateSteps}>
                            <li>Open your form in Google Forms</li>
                            <li>Click <b>Settings → Responses</b></li>
                            <li>Turn off <b>“Restrict to users”</b> and <b>“Collect emails”</b></li>
                            <li>Click <b>Send</b> and copy the link under the 🔗 tab</li>
                        </ol>
                    )}
                    <button className={styles.stateBtn} onClick={() => router.push('/')}>← Try another link</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.editorLayout}>
            <aside className={styles.sidebar}>
                <button className={styles.backButton} onClick={() => router.push('/')}>← BACK</button>
                <div className={styles.sidebarHead}>
                    <span className={styles.sidebarTag}>VOL.01 / EDITOR</span>
                    <h2 className={styles.sidebarTitle}>Customize</h2>
                </div>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>01 — Presets</h3>
                    <div className={styles.presetGrid}>
                        {PRESETS.map(p => (
                            <button
                                key={p.name}
                                className={`${styles.preset} ${theme.name === p.name ? styles.presetActive : ''}`}
                                onClick={() => applyPreset(p)}
                            >
                                <span className={styles.presetSwatch}>
                                    <span style={{ background: p.background }} />
                                    <span style={{ background: p.primary }} />
                                    <span style={{ background: p.accent }} />
                                </span>
                                <span className={styles.presetName}>{p.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>02 — Colors</h3>
                    <div className={styles.colorRow}>
                        <label>Primary
                            <input type="color" value={theme.primary} onChange={(e) => handleThemeChange('primary', e.target.value)} />
                        </label>
                        <label>Background
                            <input type="color" value={theme.background} onChange={(e) => handleThemeChange('background', e.target.value)} />
                        </label>
                        <label>Text
                            <input type="color" value={theme.text} onChange={(e) => handleThemeChange('text', e.target.value)} />
                        </label>
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>03 — Type</h3>
                    <select className={styles.select} value={theme.fontFamily} onChange={(e) => handleThemeChange('fontFamily', e.target.value)}>
                        {FONT_OPTIONS.map(f => <option key={f.label} value={f.value}>{f.label}</option>)}
                    </select>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>04 — Radius</h3>
                    <div className={styles.radiusRow}>
                        {['0px', '4px', '8px', '14px', '24px'].map(r => (
                            <button
                                key={r}
                                className={`${styles.radiusBtn} ${theme.borderRadius === r ? styles.radiusActive : ''}`}
                                onClick={() => handleThemeChange('borderRadius', r)}
                                style={{ borderRadius: r }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </section>

                <button className={styles.embedButton} onClick={() => setEmbedOpen(true)}>
                    GET EMBED CODE →
                </button>
            </aside>

            <main className={styles.previewArea}>
                <div className={styles.previewBar}>
                    <span>● ● ●</span>
                    <span className={styles.previewUrl}>{form.title}</span>
                    <span className={styles.previewBadge}>LIVE PREVIEW</span>
                </div>
                <div className={styles.previewStage}>
                    <FormPreview form={form} theme={theme} />
                </div>
            </main>

            {embedOpen && (
                <div className={styles.modalOverlay} onClick={() => setEmbedOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHead}>
                            <h3>EMBED CODE</h3>
                            <button onClick={() => setEmbedOpen(false)}>✕</button>
                        </div>
                        <pre className={styles.codeBlock}>
                            <code dangerouslySetInnerHTML={{ __html: highlight(getEmbedCode()) }} />
                        </pre>
                        <div className={styles.modalActions}>
                            <button className={styles.copyBtn} onClick={handleCopy}>
                                {copied ? '✓ COPIED' : 'COPY CODE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className={styles.stateWrap}>Loading…</div>}>
            <Editor />
        </Suspense>
    );
}
