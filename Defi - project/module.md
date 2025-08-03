# SPL Token CLI — Summary of Core Commands

This is a reference of essential commands for creating and managing SPL tokens on Solana using the \`spl-token-cli\`.

---

## ✅ Create a New Token (Mint)

\`\`\`bash
spl-token create-token --url devnet
\`\`\`

- Outputs the mint address.
- Default decimals: 9
- The creator becomes the mint authority.

---

## ✅ Create a Token Account (ATA)

\`\`\`bash
spl-token create-account <MINT_ADDRESS> --url devnet
\`\`\`

- Creates a token account for the current wallet to hold the specified token.
- One token account per wallet per mint (ATA = Associated Token Account).

---

## ✅ Mint Tokens

\`\`\`bash
spl-token mint <MINT_ADDRESS> <AMOUNT> --url devnet
\`\`\`

- Mints tokens to your wallet’s associated token account.
- You must be the \`mintAuthority\`.

---

## ✅ Transfer Tokens

\`\`\`bash
spl-token transfer <MINT_ADDRESS> <AMOUNT> <RECIPIENT_WALLET_ADDRESS> --fund-recipient --url devnet
\`\`\`

- Transfers tokens to another wallet.
- \`--fund-recipient\` automatically creates their token account (ATA) if it doesn't exist.

---

## ✅ Check Token Balance

\`\`\`bash
spl-token accounts --url devnet
spl-token balance <MINT_ADDRESS> --url devnet
\`\`\`

---

## ✅ Burn Tokens

\`\`\`bash
spl-token burn <TOKEN_ACCOUNT_ADDRESS> <AMOUNT> --mint <MINT_ADDRESS> --url devnet
\`\`\`

- Removes tokens from supply.
- You must be the owner of the token account.

---

## ✅ Disable Mint Authority (Fix Total Supply)

\`\`\`bash
spl-token authorize <MINT_ADDRESS> mint --disable --url devnet
\`\`\`

- Irreversible.
- After this, no one can mint new tokens.

---

## ✅ View Supply

\`\`\`bash
spl-token supply <MINT_ADDRESS> --url devnet
\`\`\`

---

## 🧠 Notes

- All commands rely on the keypair configured via \`solana config get\`.
- Use \`--url devnet\` for testing safely.
- You can only control accounts you own or are authorized for.