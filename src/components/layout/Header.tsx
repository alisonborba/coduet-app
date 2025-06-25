
import React from 'react';
import { Link } from 'react-router-dom';
import { Code, User, LayoutDashboard } from 'lucide-react';
import { WalletButton } from '@/components/wallet/WalletButton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Coduet
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/posts" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Browse Posts
          </Link>
          <Link 
            to="/create" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Create Post
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {user && (
            <Link to={`/profile/${user.id}`}>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
