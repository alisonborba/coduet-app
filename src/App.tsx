import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Landing } from "@/pages/Landing";
import { Posts } from "@/pages/Posts";
import { CreatePost } from "@/pages/CreatePost";
import { PostDetail } from "@/pages/PostDetail";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { Auth } from "@/pages/Auth";
import { AuthProvider } from "@/hooks/useAuth";
import NotFound from "./pages/NotFound";
import { SolanaProvider } from "./hooks/walletProvider";
import { Debug } from "./pages/Debug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SolanaProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/debug" element={<Debug />} />
                <Route path="/profile/:walletAddress" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </SolanaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
