
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data - will be replaced with real data
const mockPosts = [
  {
    id: '1',
    title: 'Help with React Performance Optimization',
    description: 'Need assistance optimizing a React app that\'s experiencing slow renders. Looking for someone with experience in profiling and optimization techniques.',
    value: 2.5,
    status: 'open' as const,
    category: 'frontend' as const,
    tags: ['React', 'Performance', 'JavaScript'],
    publisher: { displayName: 'Alice Dev', avatar: null },
    createdAt: new Date('2024-01-15'),
    applications: [],
    deadline: new Date('2024-01-22')
  },
  {
    id: '2',
    title: 'Solana Smart Contract Integration',
    description: 'Looking for help integrating my dApp with a custom Solana smart contract. Need guidance on Anchor framework and wallet connectivity.',
    value: 5.0,
    status: 'open' as const,
    category: 'blockchain' as const,
    tags: ['Solana', 'Anchor', 'Web3'],
    publisher: { displayName: 'Bob Builder', avatar: null },
    createdAt: new Date('2024-01-14'),
    applications: [],
    deadline: new Date('2024-01-25')
  },
  {
    id: '3',
    title: 'Database Schema Design Review',
    description: 'Need an experienced database architect to review my PostgreSQL schema design for a SaaS application. Looking for optimization suggestions.',
    value: 1.8,
    status: 'in_progress' as const,
    category: 'backend' as const,
    tags: ['PostgreSQL', 'Database', 'Architecture'],
    publisher: { displayName: 'Carol Tech', avatar: null },
    createdAt: new Date('2024-01-13'),
    applications: [],
    deadline: new Date('2024-01-20')
  }
];

export const Posts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'backend': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'blockchain': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'mobile': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'devops': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <SelectItem value="deadline">Deadline Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge className={getStatusColor(post.status)} variant="secondary">
                  {post.status.replace('_', ' ')}
                </Badge>
                <div className="text-right">
                  <div className="text-lg font-bold">{post.value} SOL</div>
                  <div className="text-sm text-muted-foreground">~${(post.value * 100).toFixed(0)}</div>
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
                <Badge className={getCategoryColor(post.category)} variant="outline">
                  {post.category}
                </Badge>
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.ceil((post.deadline!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {post.publisher.displayName}
                </div>
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

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Requests
        </Button>
      </div>
    </div>
  );
};
