import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { AlertCircle, DollarSign, Clock } from "lucide-react";
import { useCreatePost } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { getProgram } from "@/lib/getProgram";
import { Buffer } from "buffer";
import { mainWalletPublicKey } from "@/hooks/walletProvider";

export const CreatePost = () => {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { user } = useAuth();
  const createPostMutation = useCreatePost();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
    category: "",
    tags: "",
    deadline: "",
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const platformFeePercent = 5;
  const fixedTransactionFee = 0.01;

  const calculateFees = () => {
    const value = parseFloat(formData.value) || 0;
    const platformFee = value * (platformFeePercent / 100);
    const totalDeposit = value + platformFee + fixedTransactionFee;
    return { platformFee, totalDeposit };
  };

  const { platformFee, totalDeposit } = calculateFees();

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user || !wallet?.publicKey) return;

    e.preventDefault();

    const postData = {
      title: formData.title,
      description: formData.description,
      value: parseFloat(formData.value),
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean),
      deadline: formData.deadline,
    };

    // Program data
    const postId = new anchor.BN(Date.now());
    const value = new anchor.BN(postData.value * LAMPORTS_PER_SOL);
    const program = getProgram(wallet);
    window.Buffer = Buffer;
    const [postPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("post"), postId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    try {
      // Run anchor transaction to create post
      const tx = await program.methods
      .createPost(postId, postData.title, postData.description, value)
      .accounts({
        post: postPda,
        publisher: wallet.publicKey,
        mainVault: mainWalletPublicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

      console.log('tx', tx);
    } catch (error) {
      // @todo - show error message to user
      console.error("Error creating post:", error);
      return;
    }

    try {
      await createPostMutation.mutateAsync(postData);
      navigate("/posts");
    } catch (error) {
      // @todo - show error message to user
      console.error("Error creating post:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Help Request</h1>
          <p className="text-muted-foreground">
            Post your technical challenge and get help from experienced
            developers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Describe your technical challenge in a few words"
                  value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about what you need help with, your current setup, what you've tried, and what you're looking to achieve..."
                  value={formData.description}
                  onChange={e =>
                    handleInputChange("description", e.target.value)
                  }
                  className="min-h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={e =>
                      handleInputChange("deadline", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Technologies/Tags</Label>
                <Input
                  id="tags"
                  placeholder="React, Node.js, PostgreSQL (separated by commas)"
                  value={formData.tags}
                  onChange={e => handleInputChange("tags", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Payment Value (SOL)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0.1"
                    placeholder="1.5"
                    value={formData.value}
                    onChange={e => handleInputChange("value", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Fee Breakdown */}
              {formData.value && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Payment Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Helper payment:</span>
                        <span>{formData.value} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform fee ({platformFeePercent}%):</span>
                        <span>{platformFee.toFixed(3)} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction fee:</span>
                        <span>{fixedTransactionFee} SOL</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-medium">
                        <span>Total deposit required:</span>
                        <span>{totalDeposit.toFixed(3)} SOL</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  createPostMutation.isPending ||
                  !formData.title ||
                  !formData.description ||
                  !formData.value
                }
              >
                {createPostMutation.isPending
                  ? "Creating Post..."
                  : "Create Post & Deposit Funds"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
