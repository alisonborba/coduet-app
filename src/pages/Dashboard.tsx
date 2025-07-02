import React from "react";
import { useUserPosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { PostsTable } from "@/components/dashboard/PostsTable";

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: posts = [], isLoading } = useUserPosts();

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">Please log in to view your dashboard.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading your posts...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Publisher Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your posts and review helper applications
        </p>
      </div>

      <DashboardStats posts={posts} />
      <PostsTable posts={posts} />
    </div>
  );
};
