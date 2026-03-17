import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlertCircle, DollarSign, CheckCircle } from "lucide-react";
import { StoreLogo } from "@/components/stores/StoreLogo";

// Base URL of the ordering app's serverless functions
const ORDERING_API_BASE = "https://daze-piazza-pizza.vercel.app/api";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  store: { name: string; logo: string; bgColor: string; customLogo?: string };
  customer: string;
  type: string;
  total: string;
  date: string;
  status: string;
  items: OrderItem[];
  /** Omnivore ticket ID — present for Piazza Pizza / Micros POS orders */
  omnivore_ticket_id?: string | null;
  /** Internal Supabase UUID */
  supabase_id?: string;
}

interface RefundDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onRefund: (refundData: any) => void;
}

export const RefundDialog = ({
  order,
  isOpen,
  onClose,
  onRefund,
}: RefundDialogProps) => {
  const [refundType, setRefundType] = useState<"full" | "partial" | "items">(
    "full",
  );
  const [partialAmount, setPartialAmount] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [voidResult, setVoidResult] = useState<"success" | "error" | null>(null);
  const [voidError, setVoidError] = useState<string | null>(null);

  if (!order) return null;

  const orderTotal = parseFloat(order.total.replace("$", ""));

  const handleItemSelection = (itemId: string, checked: boolean) => {
    const newSelection = new Set(selectedItems);
    if (checked) {
      newSelection.add(itemId);
    } else {
      newSelection.delete(itemId);
    }
    setSelectedItems(newSelection);
  };

  const calculateItemsRefund = () => {
    return order.items
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getRefundAmount = () => {
    switch (refundType) {
      case "full":
        return orderTotal;
      case "partial":
        return parseFloat(partialAmount) || 0;
      case "items":
        return calculateItemsRefund();
      default:
        return 0;
    }
  };

  const handleRefund = async () => {
    setIsProcessing(true);
    setVoidResult(null);
    setVoidError(null);

    const refundData = {
      orderId: order.id,
      refundType,
      amount: getRefundAmount(),
      selectedItems:
        refundType === "items" ? Array.from(selectedItems) : undefined,
    };

    try {
      // 1. Call parent handler (Supabase status update etc.)
      await onRefund(refundData);

      // 2. Void the Omnivore ticket if one exists (Piazza/Micros orders)
      if (order.omnivore_ticket_id) {
        try {
          const voidRes = await fetch(`${ORDERING_API_BASE}/omnivore-void`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ticketId: order.omnivore_ticket_id,
              locationId: "cgX7Lndi", // sandbox; production will use tenant config
              reason: `Refund ${refundType} — $${getRefundAmount().toFixed(2)} by manager`,
            }),
          });
          if (!voidRes.ok) {
            const body = await voidRes.json().catch(() => ({}));
            throw new Error(body.error || `Omnivore void failed (${voidRes.status})`);
          }
          setVoidResult("success");
        } catch (voidErr: any) {
          // Omnivore void failed — log but don't block the refund flow
          console.error("[RefundDialog] Omnivore void error:", voidErr);
          setVoidError(voidErr?.message || "Omnivore ticket void failed");
          setVoidResult("error");
        }
      }

      // Only close if there's no void error to display
      if (!voidError) onClose();
    } catch (error) {
      console.error("Refund failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidRefund = () => {
    const amount = getRefundAmount();
    return amount > 0 && amount <= orderTotal;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Refund Order {order.id}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <StoreLogo
                    logo={order.store.logo}
                    customLogo={order.store.customLogo}
                    bgColor={order.store.bgColor}
                    size="sm"
                  />
                  <div>
                    <div className="font-semibold">{order.store.name}</div>
                    <div className="text-sm text-gray-600">
                      {order.customer} • {order.type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{order.total}</div>
                  <div className="text-sm text-gray-600">{order.date}</div>
                </div>
              </div>
              <Badge
                className={
                  order.status === "Completed"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-red-100 text-red-700 hover:bg-red-100"
                }
              >
                {order.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Refund Type Selection */}
          <div>
            <Label className="text-base font-semibold mb-4 block">
              Refund Type
            </Label>
            <ToggleGroup
              type="single"
              value={refundType}
              onValueChange={(value: "full" | "partial" | "items") =>
                value && setRefundType(value)
              }
              className="flex-col items-stretch space-y-2"
            >
              <ToggleGroupItem
                value="full"
                className="w-full justify-start h-12 px-4 rounded-full border-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                size="sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-current opacity-0 data-[state=on]:opacity-100" />
                  </div>
                  <span>Full refund ({order.total})</span>
                </div>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="partial"
                className="w-full justify-start h-12 px-4 rounded-full border-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                size="sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-current opacity-0 data-[state=on]:opacity-100" />
                  </div>
                  <span>Partial amount</span>
                </div>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="items"
                className="w-full justify-start h-12 px-4 rounded-full border-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                size="sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-current opacity-0 data-[state=on]:opacity-100" />
                  </div>
                  <span>Specific items</span>
                </div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Partial Amount Input */}
          {refundType === "partial" && (
            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Refund Amount
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="pl-8"
                  max={orderTotal}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* Items Selection */}
          {refundType === "items" && (
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Select Items to Refund
              </Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={(checked) =>
                        handleItemSelection(item.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Refund Amount:</span>
                <span className="text-xl font-bold text-green-600">
                  ${getRefundAmount().toFixed(2)}
                </span>
              </div>
              {getRefundAmount() > orderTotal && (
                <div className="flex items-center space-x-2 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    Refund amount cannot exceed order total
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Omnivore void feedback */}
        {voidResult === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>POS ticket voided successfully in Omnivore.</span>
          </div>
        )}
        {voidResult === "error" && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Refund recorded, but Omnivore ticket void failed: {voidError}. Void manually in the POS.</span>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            {voidResult ? "Close" : "Cancel"}
          </Button>
          {!voidResult && (
            <Button
              onClick={handleRefund}
              disabled={!isValidRefund() || isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing
                ? "Processing..."
                : `Refund $${getRefundAmount().toFixed(2)}`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
