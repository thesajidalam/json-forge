<div align="center">

<a href="https://json-forge.js.org">
  <img src="public/favicon.svg" alt="JsonForge Logo" width="80" height="80">
</a>

# JsonForge

**The most powerful JSON formatter, validator & toolkit — built for developers.**

Format. Validate. Transform. Inspect. Diff. Export. All in your browser, zero dependencies, instant.

[![Live Demo](https://img.shields.io/badge/Live_Demo-json--forge.js.org-0ea5e9?style=for-the-badge&logo=googlechrome&logoColor=white)](https://json-forge.js.org)
[![MIT License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/thesajidalam/json-forge?style=for-the-badge&logo=github&color=f59e0b)](https://github.com/thesajidalam/json-forge)
[![GitHub Forks](https://img.shields.io/github/forks/thesajidalam/json-forge?style=for-the-badge&logo=github&color=8b5cf6)](https://github.com/thesajidalam/json-forge/network/members)

<img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
<img src="https://img.shields.io/badge/Vite-B6C3FF?style=flat-square&logo=vite&logoColor=black" alt="Vite">
<img src="https://img.shields.io/badge/Built_with-Zero_Deps-10b981?style=flat-square" alt="Zero Dependencies">

<br><br>

*Every developer Googles "json formatter" at least once a day.*
*Most tools are bloated, ugly, or unreliable.*
*JsonForge was built to be the last JSON tool you'll ever need.*

</div>

---

<br>

## 🎯 Why JsonForge?

| | Other Tools | **JsonForge** |
|---|---|---|
| **Speed** | Slow on large payloads | Instant — handles megabytes in ms |
| **Validation** | "Invalid JSON" | Exact **line & column** error reporting |
| **Features** | Format only | Format, Minify, Validate, Tree View, Diff, CSV, YAML, TypeScript |
| **Themes** | Light OR Dark | Beautiful **dark & light** themes with glass morphism |
| **UX** | Desktop only | Fully **responsive** — works on mobile |
| **Privacy** | Sends data to servers | **100% client-side** — your data never leaves your browser |
| **Dependencies** | 15+ packages | **Zero** runtime dependencies beyond React |
| **Bundle Size** | Megabytes | **~56 KB** gzipped JS + **~6 KB** gzipped CSS |

<br>

## ⚡ Features

<div align="center">

```
Format  ·  Minify  ·  Validate  ·  Tree View  ·  Diff  ·  CSV  ·  YAML  ·  TypeScript  ·  Export  ·  Themes
```

</div>

<br>

### 📝 Format & Validate

Paste any JSON — valid or broken — and get instant results. Errors are pinpointed with exact **line and column** numbers so you can fix them fast.

### 🌲 Tree View

Explore deeply nested JSON with an interactive expandable/collapsible tree. Search across all keys to find exactly what you need.

### 🔀 JSON Diff

Compare two JSON objects side-by-side. See additions, removals, and modifications at a glance with color-coded indicators.

### 🔄 Convert & Export

| Export Format | Description |
|:---:|---|
| **JSON** | Pretty-printed or minified with customizable indentation |
| **CSV** | Auto-flattened from arrays of objects, proper escaping |
| **YAML** | Fully recursive with correct quoting and nesting |
| **TypeScript** | Auto-generated interfaces from your JSON structure |

### 🎨 Themes & Polish

- **Dark mode** with deep slate palette and glass morphism effects
- **Light mode** with clean whites and subtle shadows
- Syntax-highlighted output with color-coded keys, strings, numbers, booleans, and nulls
- Custom scrollbars, smooth transitions, and micro-animations
- Line numbers with hover highlighting

<br>

## 📸 Screenshots

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─ Input Panel ────────────┐  ┌─ Output Panel ──────────────────┐ │
│  │                           │  │ [Text] [Tree] [Diff]            │ │
│  │  {                        │  │ [JSON] [CSV] [YAML] [TS]        │ │
│  │    "name": "JsonForge",   │  │                                 │ │
│  │    "version": "1.0.0",    │  │  1  {                           │ │
│  │    "features": {          │  │  2    "name": "JsonForge",      │ │
│  │      "format": true,      │  │  3    "version": "1.0.0",       │ │
│  │      "validate": true     │  │  4    "features": {             │ │
│  │    }                      │  │  5      "format": true,         │ │
│  │  }                        │  │  6      "validate": true        │ │
│  │                           │  │  7    }                         │ │
│  │  ✓ Valid                  │  │  8  }                           │ │
│  │                           │  │                                 │ │
│  └───────────────────────────┘  └─────────────────────────────────┘ │
│                                                                     │
│  JsonForge │ JSON │ 42 keys · 4 deep · 1.2 KB          ? help     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

> Visit **[json-forge.js.org](https://json-forge.js.org)** to see the real thing.

</div>

<br>

## 🚀 Quick Start

### Option 1 — Use Online (Recommended)

No installation needed. Just open **[json-forge.js.org](https://json-forge.js.org)** and start working.

### Option 2 — Run Locally

```bash
# Clone the repository
git clone https://github.com/thesajidalam/json-forge.git
cd json-forge

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

### Option 3 — Build for Production

```bash
# Build optimized static files
npm run build

# Preview the production build
npm run preview
```

The `dist/` directory contains everything you need to deploy anywhere.

<br>

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|:---:|---|---|
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | **Format** | Pretty-print the JSON input |
| <kbd>Ctrl</kbd> + <kbd>L</kbd> | **Clear** | Reset all input and output |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | **Download** | Export the current output as a file |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | **Copy** | Copy output to clipboard |
| <kbd>?</kbd> | **Help** | Toggle the help modal |
| <kbd>Esc</kbd> | **Close** | Dismiss any open modal |

<br>

## 🧰 Tech Stack

<div align="center">

| Layer | Technology | Why |
|:---:|:---:|---|
| **UI** | [React 18](https://react.dev) | Declarative, fast rendering with hooks |
| **Language** | [TypeScript](https://www.typescriptlang.org) | Type safety, better DX, fewer bugs |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | Utility-first, zero runtime CSS |
| **Build** | [Vite](https://vitejs.dev) | Lightning-fast HMR and optimized builds |
| **Deploy** | [GitHub Pages](https://pages.github.com) | Free, reliable, global CDN |

</div>

<br>

### Bundle Analysis

```
Asset               Size       Gzipped
──────────────────────────────────────
index.js            175.4 KB    56.2 KB
index.css            35.1 KB     6.1 KB
──────────────────────────────────────
Total               210.5 KB    62.3 KB
```

> Zero runtime dependencies. Only React and dev tooling.

<br>

## 📁 Project Structure

```
json-forge/
├── public/
│   └── favicon.svg              # App icon
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Top bar with branding & actions
│   │   ├── JsonInput.tsx        # Code editor with line numbers
│   │   ├── JsonOutput.tsx       # Tree view renderer
│   │   ├── Toolbar.tsx          # Action buttons & view toggles
│   │   ├── DiffView.tsx         # Side-by-side diff comparison
│   │   ├── ThemeToggle.tsx      # Dark/light mode switch
│   │   └── HelpModal.tsx        # Keyboard shortcuts & tips
│   ├── hooks/
│   │   └── useTheme.ts          # Theme persistence hook
│   ├── utils/
│   │   ├── json.ts              # Parse, format, minify
│   │   ├── convert.ts           # CSV, YAML, TypeScript generators
│   │   ├── diff.ts              # Deep JSON diffing algorithm
│   │   └── tree.ts              # Tree structure builder
│   ├── App.tsx                  # Main orchestrator
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + custom components
├── .github/
│   └── workflows/
│       └── deploy.yml           # Auto-deploy on push to main
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

<br>

## 🎛️ Features Deep Dive

### Real-time Validation

As you type, JsonForge parses your JSON and reports:
- **Syntax errors** with exact line and column numbers
- **Valid/Invalid badge** in the input panel header
- **Error bar** at the bottom with detailed error messages
- Auto-scrolls to the error line in the editor

### Configurable Indentation

Choose between **2**, **4**, or **8** space indentation from the toolbar. The setting applies to both Format and output generation.

### Word Wrap Toggle

Long lines too wide? Toggle word wrap to wrap them within the viewport, or keep them on a single line for precise editing.

### Drag & Drop

Drop any `.json`, `.txt`, or `.geojson` file directly onto the page. No file picker needed.

### File Upload & Download

- Upload JSON files via the toolbar button
- Download output in the current format (`.json`, `.csv`, `.yaml`, `.ts`)
- Copy output to clipboard with one click

### JSON Statistics

The status bar shows live stats for your JSON:
- Total key count
- Maximum nesting depth
- File size
- Number of arrays and objects

<br>

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

<br>

## 📋 Roadmap

- [ ] JSONPath query support
- [ ] JSON Schema validation
- [ ] Save/load sessions
- [ ] Custom syntax themes
- [ ] URL/endpoint fetcher
- [ ] JSON5 / JSONC support
- [ ] Collaborative editing

<br>

## 🙏 Acknowledgments

Built with care by [@thesajidalam](https://github.com/thesajidalam)

Inspired by the daily need for a better JSON tool that actually respects developers' time and eyes.

<br>

---

<div align="center">

**[Try JsonForge Now →](https://json-forge.js.org)**

<br>

Made with **React** + **TypeScript** + **Tailwind CSS** + **Vite**

[![Star History](https://img.shields.io/badge/Star_History-Track_Stars-f59e0b?style=for-the-badge&logo=starship&logoColor=white)](https://www.star-history.com/?repos=thesajidalam%2Fjson-forge&type=date&legend=top-left)

</div>
