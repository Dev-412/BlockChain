// ===== PRICES.JS — CoinGecko API integration =====

const COINS = [
  { id: 'bitcoin',       name: 'Bitcoin',  symbol: 'BTC',   iconClass: 'btc',   icon: '₿' },
  { id: 'ethereum',      name: 'Ethereum', symbol: 'ETH',   iconClass: 'eth',   icon: 'Ξ' },
  { id: 'solana',        name: 'Solana',   symbol: 'SOL',   iconClass: 'sol',   icon: '◎' },
  { id: 'polygon-ecosystem-token', name: 'Polygon', symbol: 'POL', iconClass: 'matic', icon: '⬡' },
  { id: 'arbitrum',      name: 'Arbitrum', symbol: 'ARB',   iconClass: 'arb',   icon: '◆' },
];

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
let autoRefreshTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchPrices();
  startAutoRefresh();

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('spinning');
      fetchPrices().finally(() => {
        setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
      });
    });
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.price-card[data-coin]');
      cards.forEach(card => {
        const coinName = card.dataset.coin.toLowerCase();
        const coinSymbol = card.dataset.symbol.toLowerCase();
        card.style.display = (coinName.includes(query) || coinSymbol.includes(query)) ? '' : 'none';
      });
    });
  }
});

async function fetchPrices() {
  const ids = COINS.map(c => c.id).join(',');
  const url = `${API_URL}?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const grid = document.getElementById('prices-grid');
  const updatedEl = document.getElementById('last-updated');

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    grid.innerHTML = '';

    COINS.forEach(coin => {
      const info = data[coin.id];
      if (!info || info.usd == null) return;

      const price = info.usd || 0;
      const change = info.usd_24h_change != null ? info.usd_24h_change : 0;
      const isUp = change >= 0;

      const card = document.createElement('div');
      card.className = 'glass-card price-card';
      card.dataset.coin = coin.name;
      card.dataset.symbol = coin.symbol;

      const barWidth = Math.min(Math.abs(change) * 10, 100);
      const barColor = isUp ? 'var(--accent-green)' : 'var(--accent-red)';

      card.innerHTML = `
        <div class="price-pulse live"></div>
        <div class="price-card-header">
          <div class="coin-info">
            <div class="coin-icon ${coin.iconClass}">${coin.icon}</div>
            <div>
              <div class="coin-name">${coin.name}</div>
              <div class="coin-symbol">${coin.symbol}</div>
            </div>
          </div>
        </div>
        <div class="price-value">$${formatPrice(price)}</div>
        <span class="price-change ${isUp ? 'up' : 'down'}">
          ${isUp ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%
        </span>
        <div class="price-bar">
          <div class="price-bar-fill" style="width: ${barWidth}%; background: ${barColor};"></div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Show message if no coins loaded
    if (grid.children.length === 0) {
      grid.innerHTML = `
        <div class="glass-card price-card" style="grid-column: 1/-1; text-align: center; padding: 48px;">
          <h3 style="color: var(--accent-orange); margin-bottom: 12px;">⚠ No Price Data Available</h3>
          <p style="color: var(--text-secondary);">CoinGecko may be rate-limiting. Please try refreshing in a moment.</p>
        </div>
      `;
    }

    if (updatedEl) {
      const now = new Date();
      updatedEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
  } catch (err) {
    console.error('Failed to fetch prices:', err);
    grid.innerHTML = `
      <div class="glass-card price-card" style="grid-column: 1/-1; text-align: center; padding: 48px;">
        <h3 style="color: var(--accent-red); margin-bottom: 12px;">⚠ Failed to Load Prices</h3>
        <p style="color: var(--text-secondary);">${err.message}. Please try refreshing.</p>
      </div>
    `;
  }
}

function formatPrice(price) {
  if (price == null || isNaN(price)) return '0.00';
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(4);
}

function startAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(fetchPrices, 60000);
}
