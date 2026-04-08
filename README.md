# Custom Google Form Redesigner

> **Forms, reframed.** Drop a Google Form link and get a clean, branded version you can share in seconds — same questions, better skin.

[**Live Demo**](https://custom-google-form-six.vercel.app/)

A Next.js app with an editorial-brutalist design that parses public Google Forms, lets you restyle them through a preset-driven visual editor, and exports a copy-paste embed snippet for any website.

## ✨ Features

- **🔗 One-link parsing** — Paste any *public* Google Form URL. The server reads `FB_PUBLIC_LOAD_DATA_` and extracts title, description, fields, options, and the submission action URL.
- **🎨 Five design presets** — Each renders the same form in a distinct visual language:
  - **Paper** — editorial brutalism, hard ink shadows, highlighter accent
  - **Mono** — minimal monospace with hairline underlines
  - **Soft** — pillowy purple with soft glow
  - **Midnight** — dark mode with electric-yellow CTA
  - **Editorial** — italic serif with double rules
- **🎛 Fine-grained controls** — Override primary / background / text color, font family, and border radius on top of any preset.
- **👁 Live preview** — Variant-aware form preview updates in real time.
- **📦 Embed export** — Generates a standalone, dependency-free HTML + CSS snippet (with Google Fonts auto-imported) styled to match the chosen variant. Code is shown with syntax highlighting in the modal and one-click copy.
- **🚫 Restricted-form detection** — Forms requiring Google sign-in surface a clear error state with a step-by-step fix instead of a generic failure.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: Vanilla CSS Modules + CSS variables
- **Typography**: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (mono)
- **Parsing**: [Cheerio](https://cheerio.js.org/) for server-side HTML extraction
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/naimur-mangosteen/Custom-Google-Form.git
cd Custom-Google-Form
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste a Google Form link.

> ⚠️ **The form must be public.** In Google Forms, open *Settings → Responses* and disable "Restrict to users in [domain]" and "Collect email addresses", then share with **Anyone with the link**.

## 🧱 Project Structure

```
app/
  page.js              # Homepage — paste-URL hero
  editor/page.js       # Visual editor with presets, controls, embed modal
  api/parse/route.js   # Form parser endpoint
components/
  UrlInput.js          # Hero input box
  FormPreview.js       # Variant-aware live preview
lib/
  googleFormParser.js  # Cheerio-based parser, sign-in detection
```

## 🚢 Deployment

1. Push to GitHub.
2. Import the repo on [Vercel](https://vercel.com/new).
3. Vercel auto-detects Next.js — click **Deploy**.

## 🤝 Contributing

Pull requests are welcome.

## 📄 License

MIT
