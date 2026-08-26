<div align="center">

<img src="public/logo.svg" alt="JsonForge" width="320">

<br>

**The only JSON tool you'll ever need.**

Format. Validate. Transform. Inspect. Diff. Export. All in your browser — zero dependencies, instant, private.

<br>

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-json--forge.sajidalamhere.workers.dev-0ea5e9?style=for-the-badge&logo=cloudflare&logoColor=white)](https://json-forge.sajidalamhere.workers.dev)
[![MIT License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/thesajidalam/json-forge?style=for-the-badge&logo=github&color=f59e0b)](https://github.com/thesajidalam/json-forge)

<img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Cloudflare_Pages-Deployed-10b981?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare">

</div>

---

<br>

## The Problem

Every developer has a tab open with some JSON formatter. They're all either bloated, ugly, unreliable, or **send your data to a server**. You deserve better.

## The Solution

JsonForge is a **client-side, zero-dependency, open-source** JSON toolkit that runs entirely in your browser. Your data never leaves your machine. It's fast, beautiful, and does everything you need — format, validate, transform, diff, export — without the overhead.

<br>

## Why JsonForge

<table>
<tr>
<td width="50%" valign="top">

### Format & Validate
Paste any JSON and get instant formatting with **exact line & column** error reporting. No more guessing what went wrong.

### Tree View
Explore deeply nested structures with an interactive expandable tree. Search across all keys instantly.

### JSON Diff
Compare two JSON objects side-by-side. Additions, removals, and modifications — all color-coded.

</td>
<td width="50%" valign="top">

### Convert & Export
Export to **JSON**, **CSV**, **YAML**, or auto-generate **TypeScript interfaces** from your data structure.

### 6 Premium Themes
Light, Dark, Bold Dark, Midnight, Monochrome, and Nord. Pick the one that matches your workflow.

### 100% Private
Everything runs locally. Zero network requests. Your data never touches a server. Enterprise-grade privacy by default.

</td>
</tr>
</table>

<br>

## Compare

| | Other Tools | **JsonForge** |
|:--|:--|:--|
| **Speed** | Slow on large payloads | Instant — handles megabytes in ms |
| **Validation** | "Invalid JSON" | Exact **line & column** error reporting |
| **Features** | Format only | Format, Minify, Validate, Tree, Diff, CSV, YAML, TypeScript |
| **Themes** | Light OR Dark | **6 themes** — Light, Dark, Bold, Midnight, Mono, Nord |
| **Privacy** | Sends data to servers | **100% client-side** — your data stays on your machine |
| **Dependencies** | 15+ packages | **Zero** runtime dependencies |
| **Bundle** | Megabytes | **~57 KB** JS + **~5 KB** CSS gzipped |

<br>

---

<br>

## Quick Start

### Online (Recommended)

**[Open json-forge.sajidalamhere.workers.dev](https://json-forge.sajidalamhere.workers.dev)** — nothing to install, works instantly.

### Run Locally

```bash
git clone https://github.com/thesajidalam/json-forge.git
cd json-forge
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

<br>

---

<br>

## Features

### Keyboard Shortcuts

| Shortcut | Action |
|:--|:--|
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Format JSON |
| <kbd>Ctrl</kbd> + <kbd>L</kbd> | Clear input |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | Download output |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | Copy output |
| <kbd>?</kbd> | Toggle help |
| <kbd>Esc</kbd> | Close modals |

### Editor

- Line numbers with error highlighting
- Synced scrolling between line numbers and editor
- Auto-scroll to error lines
- Configurable indentation (2, 4, 8 spaces)
- Word wrap toggle
- Drag & drop file upload
- Syntax-highlighted output with color-coded token types

### Export Formats

| Format | Description |
|:--|:--|
| **JSON** | Pretty-printed or minified, configurable indent |
| **CSV** | Auto-flattened from arrays of objects |
| **YAML** | Recursive with correct quoting and nesting |
| **TypeScript** | Auto-generated interfaces from JSON structure |

<br>

---

<br>

## Tech Stack

<div align="center">

| | Technology | Purpose |
|:--|:--|:--|
| **UI** | [React 18](https://react.dev) | Declarative rendering, hooks |
| **Language** | [TypeScript](https://typescriptlang.org) | Type safety, better DX |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS, CSS variables |
| **Build** | [Vite 6](https://vitejs.dev) | Fast HMR, optimized builds |
| **Deploy** | [Cloudflare Pages](https://pages.cloudflare.com) | Global edge network |

</div>

<br>

### Bundle Size

```
Asset              Size        Gzipped
──────────────────────────────────────
index.js           183.9 KB    57.2 KB
index.css           23.3 KB     5.2 KB
──────────────────────────────────────
Total              207.2 KB    62.4 KB
```

<br>

---

<br>

## Project Structure

```
json-forge/
├── public/
│   ├── favicon.svg           # App icon
│   ├── logo.svg              # Main logo
│   └── logo-light.svg        # Light variant
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Logo, branding, theme picker
│   │   ├── JsonInput.tsx     # Editor with line numbers
│   │   ├── JsonOutput.tsx    # Interactive tree view
│   │   ├── Toolbar.tsx       # Actions, tabs, controls
│   │   ├── DiffView.tsx      # JSON comparison
│   │   ├── ThemeToggle.tsx   # 6-theme dropdown picker
│   │   └── HelpModal.tsx     # Shortcuts & tips
│   ├── hooks/
│   │   └── useTheme.ts       # Theme state & persistence
│   ├── lib/
│   │   └── themes.ts         # Theme definitions
│   ├── utils/
│   │   ├── json.ts           # Parse, format, minify
│   │   ├── convert.ts        # CSV, YAML, TypeScript
│   │   ├── diff.ts           # Deep diff algorithm
│   │   └── tree.ts           # Tree builder
│   ├── App.tsx               # Main app orchestrator
│   ├── main.tsx              # Entry point
│   └── index.css             # Design system + theme vars
├── .github/workflows/
│   └── deploy.yml            # GitHub Pages CI/CD
├── tailwind.config.js        # Theme-aware Tailwind config
├── vite.config.ts
└── package.json
```

<br>

---

<br>

## Themes

Six carefully crafted themes with CSS custom properties for instant switching:

| Theme | Description |
|:--|:--|
| **Light** | Clean white, brand blue accent |
| **Dark** | Slate-blue, developer-friendly |
| **Bold Dark** | Pure black, high contrast — for focused work |
| **Midnight** | Deep indigo with purple tones |
| **Monochrome** | Pure grayscale — no distractions |
| **Nord** | Arctic blue-green palette |

<br>

---

<br>

## Contributing

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/json-forge.git
cd json-forge

# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Lint
npm run lint
```

Open a PR with a clear description of your changes.

<br>

---

<br>

## Roadmap

- [ ] JSONPath query support
- [ ] JSON Schema validation
- [ ] Save/load sessions
- [ ] Custom syntax themes
- [ ] URL/endpoint fetcher
- [ ] JSON5 / JSONC support
- [ ] Collaborative editing

<br>

---

<br>

<div align="center">

**[Try JsonForge Now](https://json-forge.sajidalamhere.workers.dev)**

<br>

Built by [@thesajidalam](https://github.com/thesajidalam)

MIT License — Use it however you want.

</div>
