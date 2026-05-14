// ===== SIMULATOR.JS — Block mining with Web Crypto SHA-256 =====

const DIFFICULTY_PREFIX = '00';

// State for both blocks
const blocks = {
  1: { data: '', prevHash: '0000000000000000', nonce: 0, hash: '' },
  2: { data: '', prevHash: '', nonce: 0, hash: '' },
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize block state from DOM
  blocks[1].data = document.getElementById('block-1-data').value;
  blocks[1].prevHash = document.getElementById('block-1-prev').value;
  blocks[1].nonce = parseInt(document.getElementById('block-1-nonce').value) || 0;

  blocks[2].data = document.getElementById('block-2-data').value;
  blocks[2].nonce = parseInt(document.getElementById('block-2-nonce').value) || 0;

  // Compute initial hashes
  computeAndDisplay(1);
  computeAndDisplay(2);

  // Mine buttons
  document.getElementById('mine-btn-1').addEventListener('click', () => mineBlock(1));
  document.getElementById('mine-btn-2').addEventListener('click', () => mineBlock(2));

  // Live recalculation on input changes
  ['block-1-data', 'block-1-nonce'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      syncBlockState(1);
      computeAndDisplay(1);
      // Propagate: Block 1's hash becomes Block 2's previous hash
      updateChainLink();
    });
  });

  ['block-2-data', 'block-2-nonce'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      syncBlockState(2);
      computeAndDisplay(2);
    });
  });
});

// --- Sync DOM → State ---
function syncBlockState(blockNum) {
  blocks[blockNum].data = document.getElementById(`block-${blockNum}-data`).value;
  blocks[blockNum].nonce = parseInt(document.getElementById(`block-${blockNum}-nonce`).value) || 0;
  if (blockNum === 1) {
    blocks[blockNum].prevHash = document.getElementById(`block-${blockNum}-prev`).value;
  }
}

// --- Compute hash and update display ---
async function computeAndDisplay(blockNum) {
  const block = blocks[blockNum];
  const input = `${block.prevHash}${block.data}${block.nonce}`;
  const hash = await sha256(input);
  block.hash = hash;

  const hashEl = document.getElementById(`block-${blockNum}-hash`);
  const statusEl = document.getElementById(`block-${blockNum}-status`);
  const cardEl = document.getElementById(`block-${blockNum}-card`);
  const isValid = hash.startsWith(DIFFICULTY_PREFIX);

  hashEl.textContent = hash;
  hashEl.className = `hash-display ${isValid ? 'valid-hash' : 'invalid-hash'}`;

  statusEl.textContent = isValid ? 'Valid ✓' : 'Invalid ✗';
  statusEl.className = `block-status ${isValid ? 'valid' : 'invalid'}`;

  // Card border glow
  if (isValid) {
    cardEl.style.borderColor = 'rgba(63, 185, 80, 0.4)';
    cardEl.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(63, 185, 80, 0.1)';
  } else {
    cardEl.style.borderColor = 'rgba(248, 81, 73, 0.3)';
    cardEl.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(248, 81, 73, 0.1)';
  }
}

// --- Update chain link: Block 1 hash → Block 2 previous hash ---
function updateChainLink() {
  const prevHashInput = document.getElementById('block-2-prev');
  prevHashInput.value = blocks[1].hash || 'Mine Block 1 first...';
  blocks[2].prevHash = blocks[1].hash;
  computeAndDisplay(2);
}

// --- Mining: find nonce where hash starts with '00' ---
async function mineBlock(blockNum) {
  const btn = document.getElementById(`mine-btn-${blockNum}`);
  const nonceInput = document.getElementById(`block-${blockNum}-nonce`);
  const hashEl = document.getElementById(`block-${blockNum}-hash`);

  btn.disabled = true;
  btn.classList.add('mining');
  btn.innerHTML = '⛏ Mining...';

  const block = blocks[blockNum];
  let nonce = 0;
  let hash = '';
  const startTime = performance.now();

  // Mine in batches to keep UI responsive
  async function mineBatch() {
    const batchSize = 100;
    for (let i = 0; i < batchSize; i++) {
      const input = `${block.prevHash}${block.data}${nonce}`;
      hash = await sha256(input);

      // Show progress every 10 iterations
      if (nonce % 10 === 0) {
        hashEl.textContent = hash;
        hashEl.className = 'hash-display invalid-hash';
        nonceInput.value = nonce;
      }

      if (hash.startsWith(DIFFICULTY_PREFIX)) {
        // Found valid nonce!
        block.nonce = nonce;
        block.hash = hash;
        nonceInput.value = nonce;

        btn.disabled = false;
        btn.classList.remove('mining');
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
        btn.innerHTML = `⛏ Mined! (${elapsed}s)`;
        setTimeout(() => { btn.innerHTML = '⛏ Mine Block'; }, 3000);

        computeAndDisplay(blockNum);

        // If Block 1 was mined, update Block 2's previous hash
        if (blockNum === 1) {
          updateChainLink();
        }
        return;
      }
      nonce++;
    }

    // Continue mining in next frame
    requestAnimationFrame(mineBatch);
  }

  await mineBatch();
}

// --- SHA-256 using Web Crypto API ---
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
