import React from "react";
import { Link } from "react-router-dom";
import { Code } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Coduet
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Decentralized marketplace for developer technical assistance with
              escrow-protected payments.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/posts"
                  className="hover:text-primary transition-colors"
                >
                  Browse Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="hover:text-primary transition-colors"
                >
                  Create Post
                </Link>
              </li>
              <li>
                {user && (
                  <Link
                    to="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-medium mb-4">Status</h3>
            <div className="text-sm text-muted-foreground">
              <p className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-md">
                ⚠️ This is a beta version - not production ready.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2024 Coduet Protocol. Built on Solana. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
