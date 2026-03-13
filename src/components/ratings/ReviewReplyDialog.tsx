import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ReviewReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  reviewText: string;
  onReplySubmit: (reply: string) => void;
}

export const ReviewReplyDialog = ({
  isOpen,
  onClose,
  customerName,
  reviewText,
  onReplySubmit,
}: ReviewReplyDialogProps) => {
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onReplySubmit(reply);

      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the customer.",
      });

      setReply("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply to {customerName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Original Review:
            </Label>
            <div className="mt-1 p-3 bg-muted rounded-md text-sm">
              "{reviewText}"
            </div>
          </div>

          <div>
            <Label htmlFor="reply" className="text-sm font-medium">
              Your Reply
            </Label>
            <Textarea
              id="reply"
              placeholder="Write your response to this review..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="mt-1 min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {reply.length}/500 characters
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
