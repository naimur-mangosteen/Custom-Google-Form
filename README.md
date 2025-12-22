# Custom Google Form Redesigner 🎨

> **Transform standard Google Forms into beautiful, on-brand experiences.**

[**Live Demo**](https://custom-google-form-six.vercel.app/)

A Next.js application that parses public Google Forms, provides a powerful visual editor to customize their appearance, and generates a simple copy-pasteable embed code for your website.

![Custom Google Form Redesigner Demo](https://placehold.co/1200x600/4F46E5/FFF?text=Custom+Google+Form+Redesigner)

## ✨ Features

- **🚀 URL Parsing**: Instantly fetches and analyzes any public Google Form.
- **🎨 Visual Editor**: Real-time customization of:
  - **Colors**: Primary brand color and background.
  - **Typography**: Choose from curated fonts (Inter, Roboto, Lora, etc.).
  - **Styling**: Adjust border radius, spacing, and layout.
- **📦 Embed Generation**: Generates a standalone HTML/CSS snippet.
  - No external dependencies needed for the embed.
  - Google Fonts included automatically.
  - Fully responsive design.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (CSS Modules + CSS Variables)
- **Parsing**: [Cheerio](https://cheerio.js.org/) (Server-side HTML parsing)
- **Deployment**: Vercel (Recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naimur-mangosteen/Custom-Google-Form.git
   cd Custom-Google-Form
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Visit `http://localhost:3000` to start redesigning forms.

## 🚢 Deployment

The easiest way to make this app live is to use [Vercel](https://vercel.com).

1. Push your code to GitHub (done!).
2. Go to [Vercel](https://vercel.com/new).
3. Import your **Custom-Google-Form** repository.
4. Vercel will auto-detect Next.js. Click **Deploy**.

Within minutes, you'll have a live URL to share with anyone!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
