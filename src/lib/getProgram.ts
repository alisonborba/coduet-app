import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "./coduet.json";
// import { Coduet } from "./coduet";

// const PROGRAM_ID = new PublicKey("G5gcEvNxXPxsUwKmGNxNheKq2j5nBghciJpCyooPCKdd");

export function getProgram(wallet: any) {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });

  setProvider(provider);

  // const program = new Program(idl, provider);

  return new Program(idl, provider);
}
