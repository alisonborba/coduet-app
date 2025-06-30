
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";

export const Posts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: posts = [], isLoading, error } = usePosts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "backend":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "blockchain":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "mobile":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "devops":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "value_high":
        return b.value - a.value;
      case "value_low":
        return a.value - b.value;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          Error loading posts. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Help Requests</h1>
        <p className="text-muted-foreground">
          Find technical challenges that match your skills and start earning
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="blockchain">Blockchain</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="value_high">Highest Value</SelectItem>
            <SelectItem value="value_low">Lowest Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map(post => (
          <Card
            key={post.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge
                  className={getStatusColor(post.status)}
                  variant="secondary"
                >
                  {post.status.replace("_", " ")}
                </Badge>
                <div className="text-right">
                  <div className="text-lg font-bold">{post.value} SOL</div>
                  <div className="text-sm text-muted-foreground">
                    ~${(post.value * 100).toFixed(0)}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {post.title}
              </h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge
                  className={getCategoryColor(post.category)}
                  variant="outline"
                >
                  {post.category}
                </Badge>
                {post.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {(post.tags?.length || 0) > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{(post.tags?.length || 0) - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {post.profiles?.name || "Unknown"}
                </div>
                {post.transaction_signature && (
                  <div className="text-green-600 font-medium">
                    On-chain ✓
                  </div>
                )}
              </div>

              <Link to={`/posts/${post.id}`}>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No posts found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};
