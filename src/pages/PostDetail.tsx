
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  DollarSign, 
  User,
  Calendar,
  Tag,
  Send,
  Wallet
} from 'lucide-react';
import { usePost, useCreateApplication } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';

export const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: post, isLoading, error } = usePost(id!);
  const createApplication = useCreateApplication();

  const handleSubmitBid = async () => {
    if (!post || !bidAmount || !bidMessage) return;

    try {
      await createApplication.mutateAsync({
        post_id: post.id,
        bid_amount: parseFloat(bidAmount),
        message: bidMessage,
      });
      setBidAmount('');
      setBidMessage('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">Post not found or error loading post.</div>
      </div>
    );
  }

  const isPublisher = user?.id === post.publisher_id;
  const userHasBid = post.applications?.some(app => app.helper_id === user?.id);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/posts" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to posts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <Badge className={getStatusColor(post.status)} variant="secondary">
                      {post.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getCategoryColor(post.category)} variant="outline">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{post.value} SOL</div>
                    <div className="text-sm text-muted-foreground">~${(post.value * 100).toFixed(0)}</div>
                  </div>
                </div>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{post.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Apply Section */}
            {!isPublisher && post.status === 'open' && user && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  {userHasBid ? (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <Badge variant="outline" className="text-lg px-4 py-2">
                          Your bid is pending review
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        The publisher will review your application and get back to you.
                      </p>
                    </div>
                  ) : (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <Send className="mr-2 h-4 w-4" />
                          Apply as Helper
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Your Application</DialogTitle>
                          <DialogDescription>
                            Tell the publisher why you're the right person for this job.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bidAmount">Your Rate (SOL)</Label>
                            <Input
                              id="bidAmount"
                              type="number"
                              step="0.01"
                              min="0"
                              max={post.value}
                              placeholder={`Max: ${post.value} SOL`}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bidMessage">Cover Letter</Label>
                            <Textarea
                              id="bidMessage"
                              placeholder="Explain your relevant experience and approach to solving this problem..."
                              value={bidMessage}
                              onChange={(e) => setBidMessage(e.target.value)}
                              className="min-h-24"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={handleSubmitBid} 
                            disabled={createApplication.isPending || !bidAmount || !bidMessage}
                          >
                            {createApplication.isPending ? 'Submitting...' : 'Submit Application'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Deadline:</span>
                  <span>{new Date(post.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Posted:</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Applications:</span>
                  <span>{post.applications?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Publisher Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publisher</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{post.profiles?.name || 'Unknown'}</div>
                    {post.profiles?.wallet_address && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        {post.profiles.wallet_address.slice(0, 8)}...{post.profiles.wallet_address.slice(-8)}
                      </div>
                    )}
                  </div>
                </div>
                {post.profiles?.wallet_address && (
                  <Link to={`/profile/${post.profiles.wallet_address}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
