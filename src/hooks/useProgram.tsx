import * as anchor from "@coral-xyz/anchor";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { getProgram } from "@/lib/getProgram";
import { Buffer } from "buffer";

// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
export const network = WalletAdapterNetwork.Devnet;

export const mainWalletPublicKey = new PublicKey("4waxnAptoSYbKEeFtx8Qo7tauC9yhfCL6z2eT7MK4Vr2");

export const programId = "G5gcEvNxXPxsUwKmGNxNheKq2j5nBghciJpCyooPCKdd";

export function getPostPda(postId: anchor.BN, wallet: WalletContextState) {
  window.Buffer = Buffer;
  const program = getProgram(wallet);

  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), postId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  return postPda
}


export function helpRequestPda(postId: anchor.BN, wallet: WalletContextState) {
  window.Buffer = Buffer;
  const program = getProgram(wallet);

  const postPda = getPostPda(postId, wallet)
  
  const [helpRequestPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("help_request"), postPda.toBuffer(), wallet.publicKey.toBuffer()],
    program.programId
);

  return helpRequestPda
}



