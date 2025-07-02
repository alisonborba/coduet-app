import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as anchor from "@coral-xyz/anchor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  usePost,
  useCreateApplication,
  useUpdateApplicationStatus,
  useCompletePost,
  useCancelPost,
  useCancelAcceptedBid,
} from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getProgram } from "@/lib/getProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPostPda, mainVault, mainWalletPublicKey, plataformFeeVault } from "@/hooks/useProgram";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import bs58 from 'bs58';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [applicationMessage, setApplicationMessage] = useState("");
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  const { data: post, isLoading, error } = usePost(id!);
  const createApplicationMutation = useCreateApplication();
  const updateApplicationStatusMutation = useUpdateApplicationStatus();
  const completePostMutation = useCompletePost();
  const cancelPostMutation = useCancelPost();
  const cancelAcceptedBidMutation = useCancelAcceptedBid();

  const wallet = useWallet();
  const program = getProgram(wallet);
  const postId = new anchor.BN(post?.post_id);
  const postPDA = getPostPda(postId, wallet);


  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading post details...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          Error loading post. Please try again.
        </div>
      </div>
    );
  }

  const handleSubmitApplication = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!applicationMessage.trim()) {
      toast({
        title: "Application Error",
        description: "Please provide a message with your application.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createApplicationMutation.mutateAsync({
        post_id: post.id,
        message: applicationMessage,
      });
      setApplicationMessage("");
      setIsApplicationDialogOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await updateApplicationStatusMutation.mutateAsync({
        applicationId,
        status,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleCompletePost = async () => {
    try {
      if (!wallet || !wallet.publicKey || wallet.publicKey === null) {
        toast({
          title: "Wallet Error",
          description: "Please connect your wallet to cancel the post.",
          variant: "destructive",
        });
        return;
      }

      const helperWalletAddress = post.applications?.find(app => app.status === 'accepted')?.profiles.wallet_address;
      const helperWalletPublicKey = new PublicKey(helperWalletAddress);
      
      // Complete Contract and pay helper
      const tx = await program.methods
      .completeContract(postId)
      .accounts({
        publisher: wallet.publicKey,
        mainVault: mainVault.publicKey,
        post: postPDA,
        helper: helperWalletPublicKey,
        platformFeeRecipient: plataformFeeVault,
      })
      .signers([mainVault])
      .rpc();

      console.log('handleCompletePost tx', tx);
            
      await completePostMutation.mutateAsync(post.id);
    } catch (error) {
      console.error("Error completing post:", error);
      toast({
        title: "Wallet Error",
        description: error.toString(),
        variant: "destructive",
      });
    }
  };

  const handleCancelPost = async () => {
    try {
      // First, try to cancel the blockchain transaction
      if (!wallet || !wallet.publicKey || wallet.publicKey === null) {
        toast({
          title: "Wallet Error",
          description: "Please connect your wallet to cancel the post.",
          variant: "destructive",
        });
        return;
      }

      const tx = await program.methods
        .cancelPost(postId)
        .accounts({
          publisher: wallet.publicKey.toString(),
          mainVault: mainVault,
          post: postPDA,
          platformFeeRecipient: plataformFeeVault,
        })
        .rpc();

      console.log("handleCancelPost tx", tx);

      toast({
        title: "Blockchain Transaction Successful",
        description: "Your post has been cancelled on the blockchain.",
      });

      await cancelPostMutation.mutateAsync(post.id);
      
      setTimeout(() => navigate("/posts"), 5000);
    } catch (error) {
      console.log('error', error);
      toast({
        title: "Transaction Failed",
        description: error.toString(),
        variant: "destructive",
      });
    }
  };

  const handleCancelAcceptedBid = async () => {
    try {
      await cancelAcceptedBidMutation.mutateAsync(post.id);
    } catch (error) {
      console.error("Error cancelling accepted bid:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
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

  const isPublisher = user?.id === post.publisher_id;
  const userApplication = post.applications?.find(
    app => app.helper_id === user?.id
  );
  const acceptedApplication = post.applications?.find(
    app => app.status === "accepted"
  );
  const hasAcceptedBid = !!acceptedApplication;
  const isAcceptedHelper = acceptedApplication?.helper_id === user?.id;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Post Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
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
                  {post.transaction_signature && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      On-chain ✓
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold">{post.title}</h1>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {post.value} SOL
                </div>
                <div className="text-sm text-muted-foreground">
                  ~${(post.value * 100).toFixed(0)}
                </div>
                {post.total_value && (
                  <div className="text-xs text-muted-foreground">
                    Total: {post.total_value} SOL
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Publisher: {post.profiles?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Posted: {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                {post.post_id && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Post ID: {post.post_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-xs">Wallet: {post.publisher_pubkey || "Unknown"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {post.transaction_signature && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4 text-green-600" />
                  <a
                    href={`https://explorer.solana.com/tx/${post.transaction_signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    View on Solana Explorer
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {!isPublisher && post.status === "open" && !userApplication && (
                <Dialog
                  open={isApplicationDialogOpen}
                  onOpenChange={setIsApplicationDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>Apply for this Project</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Application</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Explain your experience and how you can help solve this problem..."
                          value={applicationMessage}
                          onChange={e => setApplicationMessage(e.target.value)}
                          className="min-h-32"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsApplicationDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitApplication}
                          disabled={createApplicationMutation.isPending}
                        >
                          {createApplicationMutation.isPending
                            ? "Submitting..."
                            : "Submit Application"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {isPublisher && post.status === "open" && !hasAcceptedBid && (
                <Button
                  variant="outline"
                  onClick={handleCancelPost}
                  disabled={cancelPostMutation.isPending}
                >
                  {cancelPostMutation.isPending
                    ? "Cancelling..."
                    : "Cancel Post"}
                </Button>
              )}

              {isPublisher && post.status === "in_progress" && (
                <>
                  <Button
                    onClick={handleCompletePost}
                    disabled={completePostMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {completePostMutation.isPending
                      ? "Completing..."
                      : "Complete & Pay Helper"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelAcceptedBid}
                    disabled={cancelAcceptedBidMutation.isPending}
                  >
                    {cancelAcceptedBidMutation.isPending
                      ? "Cancelling..."
                      : "Cancel Accepted Bid"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Acceptance Status Cards */}
        {isAcceptedHelper && post.status === "in_progress" && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Your Application Was Accepted!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Congratulations! Your application has been accepted. Please
                contact the publisher to discuss the project details.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  Publisher Contact:
                </h4>
                <div className="text-sm text-green-700">
                  <div>Name: {post.profiles?.name}</div>
                  {post.profiles?.wallet_address && (
                    <div>Wallet: {post.profiles.wallet_address}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isPublisher && hasAcceptedBid && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Bid Accepted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                You have accepted a bid for this project. Please contact the
                helper to discuss project details. Once the work is completed,
                use the "Complete & Pay Helper" button above.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">Helper Contact:</h4>
                <div className="text-sm text-blue-700">
                  <div>Name: {acceptedApplication?.profiles?.name}</div>
                  {acceptedApplication?.profiles?.email && (
                    <div>Email: {acceptedApplication.profiles.email}</div>
                  )}
                  {acceptedApplication?.profiles?.phone && (
                    <div>Phone: {acceptedApplication.profiles.phone}</div>
                  )}
                  {acceptedApplication?.profiles?.skype && (
                    <div>Skype: {acceptedApplication.profiles.skype}</div>
                  )}
                  {acceptedApplication?.profiles?.wallet_address && (
                    <div>
                      Wallet: {acceptedApplication.profiles.wallet_address}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications */}
        {post.applications && post.applications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Applications ({post.applications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {post.applications.map(application => (
                  <div
                    key={application.id}
                    className={`p-4 border rounded-lg ${
                      application.status === "accepted"
                        ? "border-green-200 bg-green-50"
                        : application.status === "rejected"
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {application.profiles?.name?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {application.profiles?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Applied{" "}
                            {new Date(
                              application.applied_at
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            application.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : application.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                          variant="secondary"
                        >
                          {application.status}
                        </Badge>

                        {isPublisher &&
                          application.status === "pending" &&
                          post.status === "open" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUpdateApplicationStatus(
                                    application.id,
                                    "accepted"
                                  )
                                }
                                disabled={
                                  updateApplicationStatusMutation.isPending
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateApplicationStatus(
                                    application.id,
                                    "rejected"
                                  )
                                }
                                disabled={
                                  updateApplicationStatusMutation.isPending
                                }
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {application.message}
                    </p>

                    {application.profiles && (
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {application.profiles.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {application.profiles.email}
                          </div>
                        )}
                        {application.profiles.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {application.profiles.phone}
                          </div>
                        )}
                        {application.profiles.skype && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {application.profiles.skype}
                          </div>
                        )}
                      </div>
                    )}

                    {application.status === "rejected" &&
                      application.helper_id === user?.id && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Your application was not accepted for this project.
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
