import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Users, User, Mail, Phone } from "lucide-react";
import { Post, useUpdateApplicationStatus } from "@/hooks/usePosts";

interface ApplicationDialogProps {
  post: Post;
}

export const ApplicationDialog: React.FC<ApplicationDialogProps> = ({
  post,
}) => {
  const updateApplicationStatus = useUpdateApplicationStatus();

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await updateApplicationStatus.mutateAsync({
        applicationId,
        status: "accepted",
      });
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateApplicationStatus.mutateAsync({
        applicationId,
        status: "rejected",
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (!post.applications || post.applications.length === 0) {
    return null;
  }

  return (
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
          {post.applications.map(app => (
            <Card key={app.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">
                      {app.profiles?.name || "Unknown"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={getApplicationStatusColor(app.status)}
                      variant="secondary"
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm mb-4">{app.message}</p>

                {app.status === "accepted" && app.profiles && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mb-4">
                    <h5 className="font-medium mb-2 text-green-800 dark:text-green-200">
                      Contact Information
                    </h5>
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

                {app.status === "pending" && post.status === "open" && (
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
  );
};
