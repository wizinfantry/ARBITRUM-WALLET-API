-----

# Arbitrum Wallet API

This repository provides a straightforward JavaScript Api for interacting with the Arbitrum network, including managing wallets, checking balances, and sending both native ETH (Arbitrum) and ERC20 tokens. It's built using the `ethers.js` library, a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem.

-----

### Features

  * **Wallet Creation & Management**:
      * Generate new random wallets.
      * Load existing wallets using a private key.
      * Display wallet address, private key, and mnemonic (if available).
  * **Balance Retrieval**:
      * Get the native ETH (Arbitrum) balance of a wallet.
      * Get the balance of any ERC20 token.
  * **Transaction Handling**:
      * Send native ETH (Arbitrum) to any address.
      * Send ERC20 tokens to any address.
      * Retrieve transaction receipts by hash.

-----

### Installation

To use this Api, you need to have Node.js and npm (Node Package Manager) installed.

1.  **Clone the repository (or copy the code):**

    ```bash
    git clone https://github.com/wizinfantry/ARBITRUM-WALLET-API.git
    cd ARBITRUM-WALLET-API
    ```

2.  **Install dependencies:**

    ```bash
    npm install ethers
    ```

-----

### Usage

The core functionality is encapsulated in the `ArbitrumWallet` class.

#### 1\. Setup

First, ensure you have your Arbitrum RPC URL and a private key (for an existing wallet) or decide to generate a new one.

```javascript
import { ArbitrumWallet } from "./ArbitrumWallet.js"; // Adjust path as needed

// Your Arbitrum Sepolia RPC URL (or any other Arbitrum network)
const providerUrl = "https://sepolia-rollup.arbitrum.io/rpc";

// !!! IMPORTANT: Replace with your actual private key for an existing wallet.
// For security, never hardcode private keys in production applications.
const privateKey = 'YOUR_PRIVATE_KEY_HERE'; // e.g., '0x123...abc'

// To create a new random wallet, pass null or an empty string for privateKey:
// const wallet = new ArbitrumWallet(null, providerUrl);
// To use an existing wallet:
const wallet = new ArbitrumWallet(privateKey, providerUrl);
```

#### 2\. Examples

Here's how you can use the `ArbitrumWallet` class methods:

```javascript
const main = async () => {
    // Get wallet address
    console.log("Wallet Address:", wallet.getAddress());

    // Get native ETH (Arbitrum) balance
    const ethBalance = await wallet.getBalance();
    console.log("ETH Balance:", ethBalance, "ETH");

    // --- ERC20 Token Operations ---
    // Replace with the actual address of the ERC20 token you want to interact with
    const tokenAddress = "0xYOUR_ERC20_TOKEN_ADDRESS_HERE"; // e.g., "0x000...FFF"

    // Get ERC20 token balance
    try {
        const tokenBalance = await wallet.getTokenBalance(tokenAddress);
        console.log("Token Balance:", tokenBalance);
    } catch (error) {
        console.error("Error getting token balance. Make sure the token address is correct:", error.message);
    }

    // Send ERC20 tokens
    // Replace 'RECIPIENT_TOKEN_ADDRESS_HERE' with the recipient's address
    // Replace 'AMOUNT_TO_SEND' with the amount of tokens (e.g., "10" for 10 tokens)
    try {
        console.log("\nAttempting to send tokens...");
        const tokenRecipient = 'RECIPIENT_TOKEN_ADDRESS_HERE';
        const tokenAmount = "10";
        const tokenTx = await wallet.sendToken(tokenAddress, tokenRecipient, tokenAmount);
        console.log("Token Transaction Hash:", tokenTx.hash);
        console.log("Waiting for token transaction to be confirmed...");
        await tokenTx.wait(); // Wait for the transaction to be mined
        console.log("Token transaction confirmed!");
    } catch (error) {
        console.error("Error sending tokens:", error.message);
    }

    // --- Native ETH (Arbitrum) Operations ---
    // Send native ETH (Arbitrum)
    // Replace 'RECIPIENT_ETH_ADDRESS_HERE' with the recipient's address
    // Replace 'AMOUNT_TO_SEND_ETH' with the amount of ETH (e.g., "0.001")
    try {
        console.log("\nAttempting to send native ETH...");
        const ethRecipient = 'RECIPIENT_ETH_ADDRESS_HERE';
        const ethAmount = "0.001";
        const arbitrumTx = await wallet.sendTransaction(ethRecipient, ethAmount);
        console.log("Arbitrum ETH Transaction Hash:", arbitrumTx.hash);
        console.log("Waiting for ETH transaction to be confirmed...");
        await arbitrumTx.wait(); // Wait for the transaction to be mined
        console.log("ETH transaction confirmed!");
    } catch (error) {
        console.error("Error sending ETH:", error.message);
    }
};

main();
```

-----

### Important Security Notes

  * **Private Keys**: Never expose your private keys. In a real application, you should use environment variables or secure key management practices. The example above directly uses a private key for simplicity in demonstrating the code.
  * **Testnet Usage**: The provided `providerUrl` points to Arbitrum Sepolia, which is a testnet. For mainnet interactions, you would need to change this URL to the Arbitrum One RPC endpoint.
  * **Error Handling**: The examples include basic `try-catch` blocks. In a production environment, robust error handling and user feedback are crucial.

-----

### Contributing

Feel free to fork this repository, open issues, or submit pull requests to improve the Api.

-----
