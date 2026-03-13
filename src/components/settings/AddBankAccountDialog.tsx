import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface AddBankAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const AddBankAccountDialog: React.FC<AddBankAccountDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountType, setAccountType] = useState("checking");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to a secure backend.
    console.log({
      accountHolderName,
      accountNumber,
      routingNumber,
      accountType,
    });
    toast({
      title: "Bank Account Added",
      description: "Your bank account has been successfully added.",
    });
    onOpenChange(false);
    // Reset form
    setAccountHolderName("");
    setAccountNumber("");
    setRoutingNumber("");
    setAccountType("checking");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>
            Enter your bank account details. This information will be kept
            secure.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id="add-bank-form"
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account-holder-name" className="text-right">
              Account Holder
            </Label>
            <Input
              id="account-holder-name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account-number" className="text-right">
              Account Number
            </Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="routing-number" className="text-right">
              Routing Number
            </Label>
            <Input
              id="routing-number"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account-type" className="text-right">
              Account Type
            </Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger id="account-type" className="col-span-3">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="add-bank-form">
            Add Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
