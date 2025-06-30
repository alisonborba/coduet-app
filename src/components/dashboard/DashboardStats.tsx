
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Users } from "lucide-react";
import { Post } from "@/hooks/usePosts";

interface DashboardStatsProps {
  posts: Post[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ posts }) => {
  const totalPosts = posts.length;
  const activePosts = posts.filter(p => p.status === "open").length;
  const totalValue = posts.reduce((sum, post) => sum + Number(post.value), 0);
  const totalApplications = posts.reduce(
    (sum, post) => sum + (post.applications?.length || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Posts</span>
          </div>
          <div className="text-2xl font-bold">{totalPosts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active Posts</span>
          </div>
          <div className="text-2xl font-bold">{activePosts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Value</span>
          </div>
          <div className="text-2xl font-bold">{totalValue.toFixed(1)} SOL</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Applications</span>
          </div>
          <div className="text-2xl font-bold">{totalApplications}</div>
        </CardContent>
      </Card>
    </div>
  );
};
