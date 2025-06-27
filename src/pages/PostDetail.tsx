import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  Star,
  DollarSign,
  User,
  Calendar,
  Tag,
  Send,
  Wallet,
  Mail,
  Phone,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  usePost,
  useCreateApplication,
  useCompletePost,
  useCancelPost,
  useCancelAcceptedBid,
} from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";

export const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: post, isLoading, error } = usePost(id!);
  const createApplication = useCreateApplication();
  const completePost = useCompletePost();
  const cancelPost = useCancelPost();
  const cancelAcceptedBid = useCancelAcceptedBid();

  const handleSubmitBid = async () => {
    if (!post || !bidAmount || !bidMessage) return;

    try {
      await createApplication.mutateAsync({
        post_id: post.id,
        bid_amount: parseFloat(bidAmount),
        message: bidMessage,
      });
      setBidAmount("");
      setBidMessage("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  const handleCompletePost = async () => {
    if (!post) return;
    await completePost.mutateAsync(post.id);
  };

  const handleCancelPost = async () => {
    if (!post) return;
    await cancelPost.mutateAsync(post.id);
  };

  const handleCancelAcceptedBid = async () => {
    if (!post) return;
    await cancelAcceptedBid.mutateAsync(post.id);
  };

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
        <div className="text-center text-red-500">
          Post not found or error loading post.
        </div>
      </div>
    );
  }

  const isPublisher = user?.id === post.publisher_id;
  const userApplication = post.applications?.find(
    app => app.helper_id === user?.id
  );
  const acceptedApplication = post.applications?.find(
    app => app.status === "accepted"
  );
  const userIsAcceptedHelper = acceptedApplication?.helper_id === user?.id;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/posts"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6"
        >
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
                    <Badge
                      className={getStatusColor(post.status)}
                      variant="secondary"
                    >
                      {post.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={getCategoryColor(post.category)}
                      variant="outline"
                    >
                      {post.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{post.value} SOL</div>
                    <div className="text-sm text-muted-foreground">
                      ~${(Number(post.value) * 100).toFixed(0)}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Publisher Actions */}
                {isPublisher && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Publisher Actions</h3>
                    <div className="flex gap-2">
                      {post.status === "open" && !acceptedApplication && (
                        <Button
                          variant="destructive"
                          onClick={handleCancelPost}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Post
                        </Button>
                      )}
                      {post.status === "in_progress" && acceptedApplication && (
                        <>
                          <Button onClick={handleCompletePost}>
                            <Check className="mr-2 h-4 w-4" />
                            Complete & Pay Helper
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelAcceptedBid}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Accepted Bid
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accepted Helper Information (for Publisher) */}
            {isPublisher &&
              acceptedApplication &&
              post.status === "in_progress" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">
                      Accepted Helper
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                      <h4 className="font-medium mb-3">
                        {acceptedApplication.profiles?.name}
                      </h4>
                      <p className="text-sm mb-4">
                        {acceptedApplication.message}
                      </p>
                      <div className="text-lg font-bold text-green-700 mb-4">
                        Accepted Bid: {acceptedApplication.bid_amount} SOL
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium">Contact Information:</h5>
                        {acceptedApplication.profiles?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{acceptedApplication.profiles.email}</span>
                          </div>
                        )}
                        {acceptedApplication.profiles?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{acceptedApplication.profiles.phone}</span>
                          </div>
                        )}
                        {acceptedApplication.profiles?.skype && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>
                              Skype: {acceptedApplication.profiles.skype}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Next Steps:</strong> Contact the helper using
                          the information above to discuss the project details.
                          Once the work is completed to your satisfaction, click
                          "Complete & Pay Helper" to finalize the transaction.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Helper Status (for Helper) */}
            {!isPublisher && userApplication && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Your Application Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userApplication.status === "accepted" && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-700">
                          Congratulations! Your bid was accepted
                        </h4>
                      </div>
                      <p className="text-sm mb-4">
                        Bid Amount:{" "}
                        <strong>{userApplication.bid_amount} SOL</strong>
                      </p>

                      <div className="space-y-2 mb-4">
                        <h5 className="font-medium">
                          Publisher Contact Information:
                        </h5>
                        {post.profiles?.name && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.profiles.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{user?.email}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Next Steps:</strong> Contact the publisher
                          using the information above to discuss the project
                          requirements and timeline. Make sure to deliver
                          quality work according to the agreed specifications.
                        </p>
                      </div>
                    </div>
                  )}

                  {userApplication.status === "pending" && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-700">
                          Application Pending
                        </h4>
                      </div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Your bid of {userApplication.bid_amount} SOL is under
                        review by the publisher.
                      </p>
                    </div>
                  )}

                  {userApplication.status === "rejected" && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <X className="h-5 w-5 text-red-600" />
                        <h4 className="font-medium text-red-700">
                          Application Not Selected
                        </h4>
                      </div>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Your bid was not selected for this project. You cannot
                        apply again to this post.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Apply Section */}
            {!isPublisher &&
              post.status === "open" &&
              user &&
              !userApplication && (
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Bid</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                            Tell the publisher why you're the right person for
                            this job.
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
                              onChange={e => setBidAmount(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bidMessage">Cover Letter</Label>
                            <Textarea
                              id="bidMessage"
                              placeholder="Explain your relevant experience and approach to solving this problem..."
                              value={bidMessage}
                              onChange={e => setBidMessage(e.target.value)}
                              className="min-h-24"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleSubmitBid}
                            disabled={
                              createApplication.isPending ||
                              !bidAmount ||
                              !bidMessage
                            }
                          >
                            {createApplication.isPending
                              ? "Submitting..."
                              : "Submit Application"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                    <div className="font-medium">
                      {post.profiles?.name || "Unknown"}
                    </div>
                    {post.profiles?.wallet_address && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        {post.profiles.wallet_address.slice(0, 8)}...
                        {post.profiles.wallet_address.slice(-8)}
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
