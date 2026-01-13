// ===============================
// ELEMENTS
// ===============================
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const dot = document.getElementById("dot");

// ===============================
// CONSTANTS
// ===============================
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

// ===============================
// HELPERS
// ===============================
function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

function setLoading(isLoading) {
  if (isLoading) {
    connectBtn.textContent = "CONNECTING...";
    connectBtn.disabled = true;
  } else {
    connectBtn.textContent = "CONNECTION WALLET";
    connectBtn.disabled = false;
  }
}

function resetDot() {
  dot.style.background = "#64748b";
  dot.style.boxShadow = "none";
  dot.classList.remove("pulse");
}

// ===============================
// DISCONNECT
// ===============================
function disconnectWallet() {
  statusEl.textContent = "DISCONNECTED";
  resetDot();

  addressEl.textContent = "0x000...000";
  networkEl.textContent = "-";
  balanceEl.textContent = "0.00";

  connectBtn.classList.remove("hidden");
  disconnectBtn.classList.add("hidden");
}

// ===============================
// CONNECT
// ===============================
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet / MetaMask not found!");
    return;
  }

  try {
    setLoading(true);
    statusEl.textContent = "AUTHORIZING...";
    resetDot();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    addressEl.textContent = address;

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    // ===============================
    // NETWORK CHECK
    // ===============================
    if (chainId !== AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "WRONG NETWORK";
      statusEl.textContent = "SWITCH TO FUJI";
      dot.style.background = "#f59e0b";
      dot.style.boxShadow = "0 0 15px #f59e0b";
      setLoading(false);
      return;
    }

    // ===============================
    // SUCCESS CONNECT
    // ===============================
    networkEl.textContent = "FUJI TESTNET";
    statusEl.textContent = "CONNECTED";
    dot.style.background = "#10b981";
    dot.style.boxShadow = "0 0 15px #10b981";
    dot.classList.add("pulse");

    const balanceWei = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });

    balanceEl.textContent = formatAvaxBalance(balanceWei);

    connectBtn.classList.add("hidden");
    disconnectBtn.classList.remove("hidden");
    setLoading(false);
  } catch (error) {
    console.error(error);
    statusEl.textContent = "FAILED";
    dot.style.background = "#ef4444";
    dot.style.boxShadow = "0 0 15px #ef4444";
    dot.classList.remove("pulse");
    setLoading(false);
  }
}

// ===============================
// EVENTS
// ===============================
connectBtn.addEventListener("click", connectWallet);
disconnectBtn.addEventListener("click", disconnectWallet);

// ===============================
// WALLET LISTENERS (AUTO RESET)
// ===============================
if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    disconnectWallet();
  });

  window.ethereum.on("chainChanged", () => {
    disconnectWallet();
  });
}
