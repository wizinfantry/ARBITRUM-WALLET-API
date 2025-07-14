import { ethers } from "ethers";

// ABI for ERC20 token functions
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function decimals() view returns (uint8)",
];

export class ArbitrumWallet {
    constructor(privateKey, providerUrl) {
        // Initialize the JSON RPC provider
        this.provider = new ethers.JsonRpcProvider(providerUrl);

        // Check if a private key is provided
        if (privateKey) {
            // If private key is provided, create a wallet from it
            this.wallet = new ethers.Wallet(privateKey, this.provider);
            console.log("Address:", this.wallet.address);
            console.log("Private Key:", this.wallet.privateKey);
            console.log("Mnemonic:", this.wallet.mnemonic?.phrase || "Not available");
        } else {
            // If no private key is provided, create a new random wallet
            this.wallet = ethers.Wallet.createRandom().connect(this.provider);
            console.log("📌 New wallet created:");
            console.log("Address:", this.wallet.address);
            console.log("Private Key:", this.wallet.privateKey);
            console.log("Mnemonic:", this.wallet.mnemonic?.phrase || "Not available");
        }
    }

    /**
     * @returns The wallet's public address.
     */
    getAddress() {
        return this.wallet.address;
    }

    /**
     * @returns The wallet's private key.
     */
    getPrivateKey() {
        return this.wallet.privateKey;
    }

    /**
     * Retrieves the native (ETH/Arbitrum) balance of the wallet.
     * @returns The balance in Ether (string format).
     */
    async getBalance() {
        const balance = await this.provider.getBalance(this.wallet.address);
        return ethers.formatEther(balance);
    }

    /**
     * Sends a native (ETH/Arbitrum) transaction to a specified address.
     * @param {string} to - The recipient's address.
     * @param {string} amountInEther - The amount to send in Ether.
     * @returns The transaction response.
     */
    async sendTransaction(to, amountInEther) {
        const tx = {
            to,
            value: ethers.parseEther(amountInEther),
        };
        const transaction = await this.wallet.sendTransaction(tx);
        return transaction;
    }

    /**
     * Retrieves the transaction receipt for a given transaction hash.
     * @param {string} txHash - The hash of the transaction.
     * @returns The transaction receipt.
     */
    async getTransactionReceipt(txHash) {
        return await this.provider.getTransactionReceipt(txHash);
    }

    /**
     * Retrieves the balance of a specific ERC20 token for the wallet.
     * @param {string} tokenAddress - The address of the ERC20 token.
     * @returns The token balance (string format).
     */
    async getTokenBalance(tokenAddress) {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
        const balance = await contract.balanceOf(this.wallet.address);
        const decimals = await contract.decimals();
        return ethers.formatUnits(balance, decimals);
    }

    /**
     * Sends ERC20 tokens to a specified address.
     * @param {string} tokenAddress - The address of the ERC20 token.
     * @param {string} to - The recipient's address.
     * @param {string} amount - The amount of tokens to send (in token units, e.g., "10.5").
     * @returns The transaction response.
     */
    async sendToken(tokenAddress, to, amount) {
        // Create a contract instance connected to the wallet for signing transactions
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);
        const decimals = await contract.decimals();
        // Parse the amount to the correct token units
        const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
        return tx;
    }
}

// --- Example Usage ---

// Define the Arbitrum Sepolia RPC URL
const providerUrl = "https://sepolia-rollup.arbitrum.io/rpc";
// Define your private key (for testing, replace with your actual private key)
const privateKey = '??????????????????????????????????????????????????????????????????'; // TEST

// Create an instance of ArbitrumWallet with the private key and provider URL
const wallet = new ArbitrumWallet(privateKey, providerUrl);

// Main function to demonstrate wallet operations
const main = async () => {
    console.log("Address:", wallet.getAddress());
    console.log("ETH Balance:", await wallet.getBalance());

    // Replace with your test token address
    const tokenAddress = "0x????????????????????????????????????????????????????"; // Test token address
    const tokenBalance = await wallet.getTokenBalance(tokenAddress);
    console.log("Token Balance:", tokenBalance);

    // Example of sending tokens
    // Replace "0x???????????????????????????????????????????" with a recipient address
    const token_tx = await wallet.sendToken(tokenAddress, "0x?????????????????????????????????????????", "10");
    console.log("Token TX Hash:", token_tx.hash);

    // Example of sending Arbitrum (ETH)
    // Replace "0x???????????????????????????????????????????" with a recipient address
    const arbitrum_tx = await wallet.sendTransaction('0x???????????????????????????????????????????', '0.001');
    console.log("Arbitrum TX Hash:", arbitrum_tx.hash);
};

// Execute the main function
main();
