
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface Post {
  id: string;
  title: string;
  description: string;
  value: number;
  category: string;
  tags: string[];
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  publisher_id: string;
  created_at: string;
  updated_at: string;
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
  bid_amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
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
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_publisher_id_fkey(name, wallet_address)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_publisher_id_fkey(name, wallet_address)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Get applications separately
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_helper_id_fkey(name, email, phone, skype, wallet_address)
        `)
        .eq('post_id', id);

      if (appsError) throw appsError;

      return {
        ...data,
        applications: applications || []
      };
    },
  });
};

export const useUserPosts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('publisher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get applications for each post
      const postsWithApplications = await Promise.all(
        (data || []).map(async (post) => {
          const { data: applications, error: appsError } = await supabase
            .from('applications')
            .select(`
              *,
              profiles!applications_helper_id_fkey(name, email, phone, skype, wallet_address)
            `)
            .eq('post_id', post.id);

          if (appsError) throw appsError;

          return {
            ...post,
            applications: applications || []
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
      deadline: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('posts')
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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      toast({
        title: "Post created successfully",
        description: "Your help request has been published.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating post",
        description: error.message,
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
      bid_amount: number;
      message: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('applications')
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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      toast({
        title: "Application submitted",
        description: "Your bid has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: 'accepted' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      // If accepting, update post status to in_progress
      if (status === 'accepted') {
        const { error: postError } = await supabase
          .from('posts')
          .update({ status: 'in_progress' })
          .eq('id', data.post_id);

        if (postError) throw postError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      toast({
        title: "Application updated",
        description: "The application status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating application",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
