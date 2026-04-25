import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Globe,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link,
} from "lucide-react";
import { useStores } from "@/contexts/StoresContext";

interface ProgressStep {
  label: string;
  completed: boolean;
  active: boolean;
}

interface UploadResult {
  menuName?: string;
  itemCount?: number;
  categories?: number;
  error?: string;
}

interface StoreSelectorProps {
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
}

export const StoreSelector = ({ selectedStoreId, onStoreChange }: StoreSelectorProps) => {
  const { stores } = useStores();

  return (
    <div className="space-y-2">
      <Label htmlFor="store-select">Assign to Venue</Label>
      <Select value={selectedStoreId} onValueChange={onStoreChange}>
        <SelectTrigger id="store-select">
          <SelectValue placeholder="Select a venue (optional)" />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id.toString()}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface ProgressDisplayProps {
  title: string;
  steps: ProgressStep[];
}

export const ProgressDisplay = ({ title, steps }: ProgressDisplayProps) => (
  <Card>
    <CardContent className="text-center py-8">
      <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
      <CardTitle className="text-lg mb-4">{title}</CardTitle>
      <div className="space-y-2 text-left max-w-xs mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {step.completed ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : step.active ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-muted" />
            )}
            <span
              className={
                step.completed
                  ? "text-muted-foreground"
                  : step.active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

interface SuccessDisplayProps {
  result: UploadResult | null;
  onImportAnother: () => void;
  onDone: () => void;
}

export const SuccessDisplay = ({ result, onImportAnother, onDone }: SuccessDisplayProps) => (
  <Card>
    <CardContent className="text-center py-8">
      <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
      <CardTitle className="text-lg mb-2">
        Menu Imported Successfully!
      </CardTitle>
      <CardDescription className="space-y-2">
        <p>
          <strong>Menu:</strong> {result?.menuName}
        </p>
        <p>
          <strong>Items imported:</strong> {result?.itemCount}
        </p>
        {result?.categories && (
          <p>
            <strong>Categories:</strong> {result.categories}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-4">
          You can now view and edit the imported menu in your menu list.
        </p>
      </CardDescription>
      <div className="flex gap-2 mt-4">
        <Button onClick={onImportAnother} variant="outline" className="flex-1">
          Import Another
        </Button>
        <Button onClick={onDone} className="flex-1">
          Done
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface ErrorDisplayProps {
  result: UploadResult | null;
  onRetry: () => void;
  onCancel: () => void;
}

export const ErrorDisplay = ({ result, onRetry, onCancel }: ErrorDisplayProps) => (
  <Card>
    <CardContent className="text-center py-8">
      <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
      <CardTitle className="text-lg mb-2">Import Failed</CardTitle>
      <CardDescription className="space-y-2">
        <p className="text-red-600">{result?.error}</p>
        <p className="text-xs text-muted-foreground mt-4">
          Please try again or contact support if the issue persists.
        </p>
      </CardDescription>
      <div className="flex gap-2 mt-4">
        <Button onClick={onRetry} variant="outline" className="flex-1">
          Try Again
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface PDFUploadSectionProps {
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PDFUploadSection = ({
  selectedStoreId,
  onStoreChange,
  onFileUpload,
}: PDFUploadSectionProps) => (
  <Card>
    <CardHeader className="text-center pb-2">
      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
      <CardTitle className="text-base">Upload PDF Menu</CardTitle>
      <CardDescription className="text-xs">
        Our AI will extract menu items, prices, and descriptions
        automatically.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <StoreSelector selectedStoreId={selectedStoreId} onStoreChange={onStoreChange} />
      <input
        type="file"
        accept=".pdf"
        onChange={onFileUpload}
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer text-sm"
      />
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported format: PDF (max 10MB)</p>
        <p>• Best results with text-based PDFs</p>
      </div>
    </CardContent>
  </Card>
);

interface WebLinkImportSectionProps {
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
  webUrl: string;
  onUrlChange: (url: string) => void;
  onImport: () => void;
}

export const WebLinkImportSection = ({
  selectedStoreId,
  onStoreChange,
  webUrl,
  onUrlChange,
  onImport,
}: WebLinkImportSectionProps) => (
  <Card>
    <CardHeader className="text-center pb-2">
      <Globe className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
      <CardTitle className="text-base">
        Import from Website
      </CardTitle>
      <CardDescription className="text-xs">
        Enter a URL and our AI will scrape the menu structure,
        items, and images.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="menu-url">Menu URL</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="menu-url"
              type="url"
              placeholder="https://restaurant.com/menu"
              value={webUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      <StoreSelector selectedStoreId={selectedStoreId} onStoreChange={onStoreChange} />
      <Button onClick={onImport} className="w-full">
        <Globe className="w-4 h-4 mr-2" />
        Analyze & Import Menu
      </Button>
    </CardContent>
  </Card>
);

interface POSImportSectionProps {
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
  syncingPOS: string | null;
  onPOSSync: (posId: string) => void;
  toastPOS: { id: string; name: string; logo: string; connected: boolean; lastSync: string };
}

export const POSImportSection = ({
  selectedStoreId,
  onStoreChange,
  syncingPOS,
  onPOSSync,
  toastPOS,
}: POSImportSectionProps) => (
  <Card>
    <CardHeader className="text-center pb-2">
      <RefreshCw className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
      <CardTitle className="text-base">POS Import</CardTitle>
      <CardDescription className="text-xs">
        Sync your menu directly from connected POS systems.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <StoreSelector selectedStoreId={selectedStoreId} onStoreChange={onStoreChange} />

      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
        <div className="flex items-center gap-3">
          <img
            src={toastPOS.logo}
            alt="Toast POS"
            className="h-8 w-auto object-contain"
          />
          <div>
            <p className="font-medium text-sm">{toastPOS.name}</p>
            <p className="text-xs text-muted-foreground">
              Last synced: {toastPOS.lastSync}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 text-xs"
          >
            Connected
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPOSSync(toastPOS.id)}
            disabled={syncingPOS === toastPOS.id}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Sync
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground bg-primary/10 p-3 rounded-lg border border-blue-100">
        <p className="font-medium text-primary mb-1">💡 Note</p>
        <p className="text-primary">
          POS import requires full read/write integration with your
          POS provider. Contact support to set up new integrations.
        </p>
      </div>
    </CardContent>
  </Card>
);
