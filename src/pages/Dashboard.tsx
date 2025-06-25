
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle,
  Eye,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserPosts, useUpdateApplicationStatus } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: posts = [], isLoading } = useUserPosts();
  const updateApplicationStatus = useUpdateApplicationStatus();

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await updateApplicationStatus.mutateAsync({
        applicationId,
        status: 'accepted'
      });
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateApplicationStatus.mutateAsync({
        applicationId,
        status: 'rejected'
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
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

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Posts</span>
            </div>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active Posts</span>
            </div>
            <div className="text-2xl font-bold">
              {posts.filter(p => p.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Value</span>
            </div>
            <div className="text-2xl font-bold">
              {posts.reduce((sum, post) => sum + Number(post.value), 0).toFixed(1)} SOL
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Applications</span>
            </div>
            <div className="text-2xl font-bold">
              {posts.reduce((sum, post) => sum + (post.applications?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.value} SOL</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(post.status)} variant="secondary">
                      {post.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.applications?.length || 0}</TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/posts/${post.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {post.applications && post.applications.length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Users className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Applications for "{post.title}"</DialogTitle>
                              <DialogDescription>
                                Review and manage helper applications for this post.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {post.applications.map((app) => (
                                <Card key={app.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h4 className="font-medium">{app.profiles?.name || 'Unknown'}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Applied: {new Date(app.applied_at).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-lg font-bold">{app.bid_amount} SOL</div>
                                        <Badge className={getApplicationStatusColor(app.status)} variant="secondary">
                                          {app.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <p className="text-sm mb-4">{app.message}</p>
                                    
                                    {app.status === 'accepted' && app.profiles && (
                                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mb-4">
                                        <h5 className="font-medium mb-2 text-green-800 dark:text-green-200">Contact Information</h5>
                                        <div className="space-y-1 text-sm">
                                          {app.profiles.email && (
                                            <div className="flex items-center gap-2">
                                              <Mail className="h-3 w-3" />
                                              <span>{app.profiles.email}</span>
                                            </div>
                                          )}
                                          {app.profiles.phone && (
                                            <div className="flex items-center gap-2">
                                              <Phone className="h-3 w-3" />
                                              <span>{app.profiles.phone}</span>
                                            </div>
                                          )}
                                          {app.profiles.skype && (
                                            <div className="flex items-center gap-2">
                                              <User className="h-3 w-3" />
                                              <span>Skype: {app.profiles.skype}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {app.status === 'pending' && post.status === 'open' && (
                                      <div className="flex gap-2">
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleAcceptApplication(app.id)}
                                          disabled={updateApplicationStatus.isPending}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Accept
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => handleRejectApplication(app.id)}
                                          disabled={updateApplicationStatus.isPending}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {posts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              You haven't created any posts yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
