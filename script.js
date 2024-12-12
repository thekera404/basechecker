// Get elements from the DOM
const checkTransactionsButton = document.getElementById('checkTransactionsButton');
const walletAddressInput = document.getElementById('walletAddressInput');
const transactionBody = document.getElementById('transactionBody');

// Handle Check Transactions Button Click
checkTransactionsButton.addEventListener('click', async () => {
    const walletAddress = walletAddressInput.value.trim();

    // Validate wallet address
    if (!isValidAddress(walletAddress)) {
        showAlert('Please enter a valid wallet address.');
        return;
    }

    // Display loading message
    displayLoadingMessage();

    try {
        const transactions = await fetchTransactionData(walletAddress);
        
        if (Array.isArray(transactions) && transactions.length > 0) {
            displayTransactionData(transactions);
        } else {
            displayNoTransactionsMessage();
        }
    } catch (error) {
        displayErrorMessage('Error fetching transactions. Please try again later.');
        console.error('Error fetching transactions:', error);
    }
});

/**
 * Validates if the provided address is a valid Ethereum-like wallet address.
 * @param {string} address - The wallet address to validate.
 * @return {boolean} - Returns true if the address is valid, otherwise false.
 */
function isValidAddress(address) {
    const addressPattern = /^0x[a-fA-F0-9]{40}$/;
    return addressPattern.test(address);
}

/**
 * Displays a loading message in the transaction table.
 */
function displayLoadingMessage() {
    transactionBody.innerHTML = '<tr><td colspan="5">Loading transactions...</td></tr>';
}

/**
 * Fetches transaction data for the given wallet address.
 * @param {string} walletAddress - The address to fetch transaction history for.
 * @return {Promise<Object[]>} - Returns a promise that resolves to the transaction data.
 */
async function fetchTransactionData(walletAddress) {
    const response = await fetch(`/api/transactions/${walletAddress}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

/**
 * Displays transaction data in the transaction table.
 * @param {Object[]} transactions - Array of transaction objects to display.
 */
function displayTransactionData(transactions) {
    transactionBody.innerHTML = ''; // Clear previous results
    
    transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="https://basescan.org/tx/${tx.hash}" target="_blank">${shortenHash(tx.hash)}</a></td>
            <td>${shortenAddress(tx.from)}</td>
            <td>${shortenAddress(tx.to)}</td>
            <td>${convertWeiToEth(tx.value)} ETH</td>
            <td>${formatTimestamp(tx.timeStamp)}</td>
        `;
        transactionBody.appendChild(row);
    });
}

/**
 * Displays a message indicating no transactions were found.
 */
function displayNoTransactionsMessage() {
    transactionBody.innerHTML = '<tr><td colspan="5">No transactions found for this wallet address.</td></tr>';
}

/**
 * Displays an error message in the transaction table.
 * @param {string} message - The error message to display.
 */
function displayErrorMessage(message) {
    transactionBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
}

/**
 * Displays a browser alert with the provided message.
 * @param {string} message - The message to show in the alert.
 */
function showAlert(message) {
    alert(message);
}

/**
 * Shortens a transaction hash or wallet address for display purposes.
 * @param {string} hash - The hash or address to shorten.
 * @return {string} - The shortened hash or address.
 */
function shortenHash(hash) {
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
}

function shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Converts a value from Wei to Ether.
 * @param {string | number} value - The value in Wei.
 * @return {string} - The value converted to Ether (up to 4 decimal places).
 */
function convertWeiToEth(value) {
    return (parseFloat(value) / 1e18).toFixed(4);
}

/**
 * Formats a UNIX timestamp to a human-readable date and time.
 * @param {string | number} timestamp - The UNIX timestamp to format.
 * @return {string} - The formatted date and time.
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}
