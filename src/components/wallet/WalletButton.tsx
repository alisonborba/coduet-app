
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, LogOut, User } from 'lucide-react';

export const WalletButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = async () => {
    // Mock wallet connection - will be replaced with real Solana wallet adapter
    setIsConnected(true);
    setPublicKey('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkV');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPublicKey(null);
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
    }
  };

  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnect}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="hidden sm:inline">
            {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">Connected Wallet</p>
          <p className="text-xs text-muted-foreground font-mono">
            {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
          </p>
        </div>
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
