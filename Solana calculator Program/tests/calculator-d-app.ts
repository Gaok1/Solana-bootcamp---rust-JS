// tests/calculator-d-app.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { CalculatorDApp } from "../target/types/calculator_d_app";

describe("calculator-d-app", () => {
  // provider e workspace
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .calculatorDApp as Program<CalculatorDApp>;
  const {  Keypair } = anchor.web3;

  const calculator = Keypair.generate();
  console.log("Endpoint:", provider.connection.rpcEndpoint);
  it("creates a calculator", async () => {
    
    await program.methods
      .create("welcome Solana")
      .accounts({
        "calculator": calculator.publicKey,
        "user": provider.wallet.publicKey,
      })
      .signers([calculator]) // conta nova precisa assinar a criação
      .rpc();

    const account = await program.account.calculator
      .fetch(calculator.publicKey);

    expect(account.message).to.equal("welcome Solana");

  });


  it("Adds two numbers in calculator", async () => {
    await program.methods.add(new anchor.BN(10), new anchor.BN(20))
    .accounts({
      "calculator": calculator.publicKey,
    }).rpc()

    const updatedAccount = await program.account.calculator
      .fetch(calculator.publicKey);
    expect(updatedAccount.result.toNumber()).to.equal(30);
    expect(updatedAccount.message).to.equal("Addition performed");
  });

  it("Divide 2 numbers in calculator", async () => {
    await program.methods.divide(new anchor.BN(100), new anchor.BN(5))
      .accounts({
        "calculator": calculator.publicKey,
      }).rpc();

    const updatedAccount = await program.account.calculator
      .fetch(calculator.publicKey);
    
    expect(updatedAccount.message).to.equal("Division performed");
  });
});
