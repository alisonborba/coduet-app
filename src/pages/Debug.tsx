import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, AccountInfo } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { getProgram } from "../lib/getProgram";


export const Debug = () => {
  const [account, setAccount] = useState<AccountInfo<Buffer> | null>(null);
  const { connection } = useConnection();
  const wallet = useWallet();
  console.info('wallet', wallet);

  useEffect(() => {
    const run = async () => {
      try {
        const accountInfo = await connection.getAccountInfo(wallet.publicKey);
        setAccount(accountInfo);

        const program = getProgram(wallet);
        console.info("program", program);
        
      } catch (err) {
        console.error("Erro ao criar o programa Anchor:", err);
      }
    };
    if (wallet.connected && wallet.publicKey && wallet.signTransaction) {
      run();
    }
  }, [wallet]);

  return (
    <div>
      <p>Wallet: {wallet.connected ? `${wallet.publicKey}` : "Wallet não conectada"}</p>
      <p>Balance: {account?.lamports / LAMPORTS_PER_SOL}</p>
      <pre>{JSON.stringify(account, null, 2)}</pre>
    </div>
  );
};
