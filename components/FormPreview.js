'use client';
import styles from './FormPreview.module.css';

export default function FormPreview({ form, theme = {} }) {
    if (!form) return null;

    // Apply theme variables dynamically to this container
    // In a real app we might pass this via style prop or a wrapper
    const style = {
        '--theme-primary': theme.primary || '#0c0c0c',
        '--theme-bg': theme.background || '#f4f1ea',
        '--theme-text': theme.text || '#0c0c0c',
        '--theme-accent': theme.accent || theme.primary || '#0c0c0c',
        '--theme-radius': theme.borderRadius || '0px',
        '--theme-font': theme.fontFamily || 'inherit',
    };
    const variant = theme.style || 'minimal';

    return (
        <div className={`${styles.previewContainer} ${styles[`variant_${variant}`] || ''}`} style={style}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{form.title}</h1>
                    {form.description && <p className={styles.description}>{form.description}</p>}
                </div>

                <form action={form.action} method="POST" target="_blank" className={styles.form}>
                    {form.fields.map((field) => (
                        <div key={field.id} className={styles.fieldWrapper}>
                            <label className={styles.label}>
                                {field.label} {field.required && <span className={styles.required}>*</span>}
                            </label>
                            {field.helpText && <p className={styles.helpText}>{field.helpText}</p>}

                            <div className={styles.inputWrapper}>
                                {renderInput(field)}
                            </div>
                        </div>
                    ))}

                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div>
        </div>
    );
}

function renderInput(field) {
    switch (field.type) {
        case 'short_text':
            return <input type="text" name={field.name} required={field.required} className={styles.textInput} />;

        case 'long_text':
            return <textarea name={field.name} required={field.required} className={styles.textarea} rows={3} />;

        case 'radio':
            return (
                <div className={styles.radioGroup}>
                    {field.options.map((opt, i) => (
                        <label key={i} className={styles.radioLabel}>
                            <input type="radio" name={field.name} value={opt} required={field.required} />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            );

        case 'checkbox':
            return (
                <div className={styles.checkboxGroup}>
                    {field.options.map((opt, i) => (
                        <label key={i} className={styles.checkboxLabel}>
                            <input type="checkbox" name={field.name} value={opt} />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            );

        case 'dropdown':
            return (
                <select name={field.name} required={field.required} className={styles.select}>
                    <option value="">Choose an option</option>
                    {field.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                    ))}
                </select>
            );

        default:
            return <div className={styles.error}>Unsupported field type: {field.type}</div>;
    }
}
