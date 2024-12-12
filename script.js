const checkTransactionsButton = document.getElementById('checkTransactionsButton');
const walletAddressInput = document.getElementById('walletAddressInput');
const transactionBody = document.getElementById('transactionBody');

checkTransactionsButton.addEventListener('click', async () => {
    const walletAddress = walletAddressInput.value.trim();
    if (!isValidAddress(walletAddress)) return showAlert('Please enter a valid wallet address.');
    
    displayLoadingMessage();
    
    try {
        const transactions = await fetchTransactionData(walletAddress);
        transactions.length ? displayTransactionData(transactions) : displayNoTransactionsMessage();
    } catch (error) {
        displayErrorMessage('Error fetching transactions. Please try again later.');
    }
});

function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function displayLoadingMessage() {
    transactionBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
}

async function fetchTransactionData(walletAddress) {
    const response = await fetch(`/api/transactions/${walletAddress}`);
    if (!response.ok) throw new Error('Fetch error');
    return await response.json();
}

function displayTransactionData(transactions) {
    transactionBody.innerHTML = transactions.map(tx => `
        <tr>
            <td><a href="https://basescan.org/tx/${tx.hash}" target="_blank">${shortenHash(tx.hash)}</a></td>
            <td>${shortenAddress(tx.from)}</td>
            <td>${shortenAddress(tx.to)}</td>
            <td>${convertWeiToEth(tx.value)} ETH</td>
            <td>${formatTimestamp(tx.timeStamp)}</td>
        </tr>
    `).join('');
}

function displayNoTransactionsMessage() {
    transactionBody.innerHTML = '<tr><td colspan="5">No transactions found.</td></tr>';
}

function displayErrorMessage(message) {
    transactionBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
}

function showAlert(message) {
    alert(message);
}

function shortenHash(hash) {
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
}

function shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function convertWeiToEth(value) {
    return (parseFloat(value) / 1e18).toFixed(4);
}

function formatTimestamp(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
}
