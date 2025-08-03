const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
} = require('@solana/web3.js');

// -------- uttilites --------
const getWalletBalance = async (pubKey, conn) => {
    try {
        //connect with solana devnet ledger, and confirmed commitment
        const walletBalance = await conn.getBalance(pubKey);
        console.log(`wallet ${pubKey.toString()} balance: ${walletBalance / LAMPORTS_PER_SOL} SOL`);
        return walletBalance;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
    }
}

const airDropSol = async (pubKey, conn) => {
    try {
        const dropTransaction = await conn.requestAirdrop(
            pubKey,
            LAMPORTS_PER_SOL * 5 //5 SOL
        );
        console.log("Airdrop transaction signature:", dropTransaction);
        await conn.confirmTransaction(dropTransaction);
    }
    catch (error) {
        console.error("Error airdropping SOL:", error);
    }
}

// send solana lamports to another wallet
const sendTransaction = async (fromWallet, toPubkey, amount, fromWalletBalance, conn) => {

    if (amount > fromWalletBalance) {
        throw new Error("Insufficient balance to send transaction");
    }
    console.log(`Sending ${amount / LAMPORTS_PER_SOL} SOL from ${fromWallet.publicKey.toString()} to ${toPubkey.toString()}`);
    try {
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: toPubkey,
                lamports: amount,
            })
        );

        const signature = await conn.sendTransaction(transaction, [fromWallet]);
        console.log("Transaction signature:", signature);

        await conn.confirmTransaction(signature);
        console.log("Transaction confirmed.");

        return signature;

    } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
    }
}



// -------- main function --------
async function main() {
    const fs = require('fs');
    const secretKeyArray = JSON.parse(fs.readFileSync('wallet-keypair.json'));
    const secretKey = Uint8Array.from(secretKeyArray);

    const wallet = Keypair.fromSecretKey(secretKey);
    const pubKey = new PublicKey(wallet.publicKey);
    const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const walletBalance = await getWalletBalance(pubKey, conn);

    await sendTransaction(wallet, wallet.publicKey, LAMPORTS_PER_SOL * 0.1, walletBalance, conn)
}

main();


