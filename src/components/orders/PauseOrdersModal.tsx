import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PauseOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  storeName: string;
}

export const PauseOrdersModal = ({
  isOpen,
  onClose,
  onConfirm,
  storeName,
}: PauseOrdersModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause Orders</DialogTitle>
          <DialogDescription>
            Are you sure you want to pause orders for {storeName}? New orders
            will not be accepted while the store is paused.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Pause Orders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
