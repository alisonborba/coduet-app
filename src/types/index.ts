
export interface User {
  id: string;
  walletAddress: string;
  displayName?: string;
  avatar?: string;
  email?: string;
  createdAt: Date;
  stats: {
    postsCreated: number;
    postsCompleted: number;
    helpersHired: number;
    totalEarned: number;
    totalSpent: number;
    reputation: number;
  };
}

export interface Post {
  id: string;
  title: string;
  description: string;
  value: number; // SOL amount
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  publisherId: string;
  publisher: User;
  helperId?: string;
  helper?: User;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  tags: string[];
  category: 'frontend' | 'backend' | 'blockchain' | 'mobile' | 'devops' | 'other';
  applications: Application[];
}

export interface Application {
  id: string;
  postId: string;
  helperId: string;
  helper: User;
  message: string;
  proposedValue?: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  postId: string;
  type: 'escrow_deposit' | 'payment_release' | 'refund' | 'platform_fee';
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  createdAt: Date;
}

export interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}
