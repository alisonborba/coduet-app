
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

export interface Post {
  id: string;
  title: string;
  description: string;
  value: number;
  category: string;
  tags: string[];
  status: "open" | "in_progress" | "completed" | "cancelled";
  publisher_id: string;
  created_at: string;
  updated_at: string;
  // Blockchain related fields
  post_id?: number;
  publisher_pubkey?: string;
  total_value?: number;
  transaction_signature?: string;
  profiles?: {
    name: string;
    wallet_address: string;
  };
  applications?: Application[];
}

export interface Application {
  id: string;
  post_id: string;
  helper_id: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  applied_at: string;
  profiles?: {
    name: string;
    email: string;
    phone: string;
    skype: string;
    wallet_address: string;
  };
}

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Get profiles for each post
      const postsWithProfiles = await Promise.all(
        (postsData || []).map(async post => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, wallet_address")
            .eq("user_id", post.publisher_id)
            .single();

          return {
            ...post,
            profiles: profile || { name: "Unknown", wallet_address: "" },
          };
        })
      );

      return postsWithProfiles;
    },
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (postError) throw postError;

      // Get publisher profile
      const { data: publisherProfile } = await supabase
        .from("profiles")
        .select("name, wallet_address")
        .eq("user_id", postData.publisher_id)
        .single();

      // Get applications with helper profiles
      const { data: applications, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .eq("post_id", id);

      if (appsError) throw appsError;

      const applicationsWithProfiles = await Promise.all(
        (applications || []).map(async app => {
          const { data: helperProfile } = await supabase
            .from("profiles")
            .select("name, email, phone, skype, wallet_address")
            .eq("user_id", app.helper_id)
            .single();

          return {
            ...app,
            profiles: helperProfile || {
              name: "Unknown",
              email: "",
              phone: "",
              skype: "",
              wallet_address: "",
            },
          };
        })
      );

      return {
        ...postData,
        profiles: publisherProfile || { name: "Unknown", wallet_address: "" },
        applications: applicationsWithProfiles,
      };
    },
  });
};

export const useUserPosts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-posts", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("publisher_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get applications for each post
      const postsWithApplications = await Promise.all(
        (data || []).map(async post => {
          const { data: applications, error: appsError } = await supabase
            .from("applications")
            .select("*")
            .eq("post_id", post.id);

          if (appsError) throw appsError;

          const applicationsWithProfiles = await Promise.all(
            (applications || []).map(async app => {
              const { data: helperProfile } = await supabase
                .from("profiles")
                .select("name, email, phone, skype, wallet_address")
                .eq("user_id", app.helper_id)
                .single();

              return {
                ...app,
                profiles: helperProfile || {
                  name: "Unknown",
                  email: "",
                  phone: "",
                  skype: "",
                  wallet_address: "",
                },
              };
            })
          );

          return {
            ...post,
            applications: applicationsWithProfiles,
          };
        })
      );

      return postsWithApplications;
    },
    enabled: !!user,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postData: {
      title: string;
      description: string;
      value: number;
      category: string;
      tags: string[];
      // Blockchain related fields
      post_id?: number;
      publisher_pubkey?: string;
      total_value?: number;
      transaction_signature?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .insert({
          ...postData,
          publisher_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      toast({
        title: "Post created successfully",
        description: "Your help request has been published.",
      });
    },
    onError: (error: any) => {
      console.error("Database error creating post:", error);
      toast({
        title: "Database Error",
        description: "Failed to save post to database. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (applicationData: {
      post_id: string;
      message: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("applications")
        .insert({
          ...applicationData,
          helper_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Database error submitting application:", error);
      toast({
        title: "Application Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: "accepted" | "rejected";
    }) => {
      const { data, error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId)
        .select()
        .single();

      if (error) throw error;

      // If accepting, update post status to in_progress and send email
      if (status === "accepted") {
        const { error: postError } = await supabase
          .from("posts")
          .update({ status: "in_progress" })
          .eq("id", data.post_id);

        if (postError) throw postError;

        // Send email notification
        try {
          await supabase.functions.invoke("send-bid-acceptance-email", {
            body: { applicationId },
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the whole operation if email fails
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      toast({
        title: "Application updated",
        description: "The application status has been updated.",
      });
    },
    onError: (error: any) => {
      console.error("Database error updating application:", error);
      toast({
        title: "Update Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useCompletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase
        .from("posts")
        .update({ status: "completed" })
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      toast({
        title: "Post completed",
        description:
          "The post has been marked as completed. You can now proceed with payment.",
      });
    },
    onError: (error: any) => {
      console.error("Database error completing post:", error);
      toast({
        title: "Completion Error",
        description: "Failed to complete post. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useCancelPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase
        .from("posts")
        .update({ status: "cancelled" })
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      toast({
        title: "Post cancelled",
        description: "The post has been cancelled.",
      });
    },
    onError: (error: any) => {
      console.error("Database error cancelling post:", error);
      toast({
        title: "Cancellation Error",
        description: "Failed to cancel post. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useCancelAcceptedBid = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      // First, reject all accepted applications for this post
      const { error: appsError } = await supabase
        .from("applications")
        .update({ status: "rejected" })
        .eq("post_id", postId)
        .eq("status", "accepted");

      if (appsError) throw appsError;

      // Then, set post status back to open
      const { data, error } = await supabase
        .from("posts")
        .update({ status: "open" })
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      toast({
        title: "Accepted bid cancelled",
        description:
          "The accepted bid has been cancelled and the post is now open for new applications.",
      });
    },
    onError: (error: any) => {
      console.error("Database error cancelling bid:", error);
      toast({
        title: "Cancellation Error",
        description: "Failed to cancel accepted bid. Please try again.",
        variant: "destructive",
      });
    },
  });
};
