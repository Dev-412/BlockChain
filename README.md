# ⬡ ArbitrumX — Web3 Explorer

A 4-page Web3 educational website built with pure HTML, CSS, and JavaScript. Covers Arbitrum Layer 2 concepts, blockchain fundamentals, live crypto prices, and an interactive block mining simulator.

> **Arbitrum Builder Pods Assignment**

🌐 Live Demo:
https://dev-412.github.io/Arbitrum-Workshop/

## 🌐 Live Pages

| Page | Description |
|------|-------------|
| **Home / Landing** | Introduces Arbitrum & Layer 2 scaling — why Ethereum needed it, how it works, and real-world benefits |
| **Concepts** | Side-by-side comparison cards: Web2 vs Web3, Ethereum vs Bitcoin, Public vs Private Keys, Blockchain vs Traditional DB |
| **Live Prices** | Real-time crypto dashboard (BTC, ETH, SOL, POL, ARB) powered by the CoinGecko API with search & auto-refresh |
| **Block Simulator** | Interactive mining simulator using SHA-256 — mine blocks, find nonces, and see chain immutability in action |

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom dark theme with glassmorphism, gradients, and micro-animations
- **Vanilla JavaScript** — No frameworks or libraries
- **Web Crypto API** — SHA-256 hashing for the block simulator
- **CoinGecko API** — Free, keyless crypto price data

## 📁 Project Structure

```
├── index.html          → Home / Landing page
├── concepts.html       → Web3 Concepts comparison cards
├── prices.html         → Live Crypto Prices dashboard
├── simulator.html      → Block Mining Simulator
├── css/
│   └── styles.css      → Global design system & responsive styles
└── js/
    ├── main.js         → Navigation, hamburger menu, scroll animations
    ├── prices.js       → CoinGecko API integration, search, auto-refresh
    └── simulator.js    → SHA-256 mining engine, chain linking, immutability
```

## 🚀 How to Run

Open `index.html` directly in a browser, or serve locally:

```bash
npx http-server . -p 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## ✨ Key Features

- **Responsive design** with mobile hamburger menu
- **Scroll reveal animations** using Intersection Observer
- **Glassmorphism UI** with frosted-glass cards and gradient backgrounds
- **Live API data** — prices auto-refresh every 60 seconds
- **Chain immutability demo** — edit Block 1 and watch Block 2 break

## 👤 Author

**Dev** · Arbitrum Builder Pods
