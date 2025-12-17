import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useStores } from '@/contexts/StoresContext';
import { useMenus } from '@/contexts/MenusContext';

export const PDFMenuUpload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<{ menuName?: string; itemCount?: number; error?: string } | null>(null);
  
  const { toast } = useToast();
  const { stores } = useStores();
  const { refreshMenus } = useMenus();
  
  const selectedStore = stores[0]; // Use first store for now

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedStore?.id) {
        formData.append('storeId', selectedStore.id.toString());
      }
      // Note: Store resortId would need to be added to store interface if needed

      const { data, error } = await supabase.functions.invoke('parse-pdf-menu', {
        body: formData,
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.details || data.error);
      }

      setUploadStatus('success');
      setUploadResult({
        menuName: data.menu?.name || 'Unknown Menu',
        itemCount: data.itemCount || 0
      });

      toast({
        title: "Menu imported successfully!",
        description: `Imported "${data.menu?.name}" with ${data.itemCount} items.`,
      });

      // Refresh the menus list
      await refreshMenus();

    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadStatus('error');
      setUploadResult({
        error: error.message || 'Failed to process PDF menu'
      });

      toast({
        title: "Upload failed",
        description: error.message || "Failed to process PDF menu. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadResult(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetUpload, 300); // Reset after dialog animation
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full relative">
          <FileText className="w-4 h-4 mr-2" />
          Import PDF Menu
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            BETA
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Menu from PDF</DialogTitle>
          <DialogDescription>
            Upload a PDF menu and we'll automatically extract the menu items for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {uploadStatus === 'idle' && (
            <Card>
              <CardHeader className="text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <CardTitle className="text-lg">Upload PDF Menu</CardTitle>
                <CardDescription>
                  Select a PDF file containing your menu. Our AI will extract menu items, prices, and descriptions automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
                    disabled={isUploading}
                  />
                  <div className="text-xs text-muted-foreground">
                    <p>• Supported format: PDF</p>
                    <p>• Max file size: 10MB</p>
                    <p>• Best results with text-based PDFs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadStatus === 'uploading' && (
            <Card>
              <CardContent className="text-center py-8">
                <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
                <CardTitle className="text-lg mb-2">Processing PDF...</CardTitle>
                <CardDescription>
                  Please wait while we extract and parse your menu items. This may take a few moments.
                </CardDescription>
              </CardContent>
            </Card>
          )}

          {uploadStatus === 'success' && uploadResult && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <CardTitle className="text-lg mb-2">Menu Imported Successfully!</CardTitle>
                <CardDescription className="space-y-2">
                  <p><strong>Menu:</strong> {uploadResult.menuName}</p>
                  <p><strong>Items imported:</strong> {uploadResult.itemCount}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    You can now view and edit the imported menu in your menu list.
                  </p>
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Button onClick={resetUpload} variant="outline" className="flex-1">
                    Import Another
                  </Button>
                  <Button onClick={handleClose} className="flex-1">
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadStatus === 'error' && uploadResult && (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <CardTitle className="text-lg mb-2">Import Failed</CardTitle>
                <CardDescription className="space-y-2">
                  <p className="text-red-600">{uploadResult.error}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Please ensure your PDF contains readable text and menu items with prices.
                  </p>
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Button onClick={resetUpload} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={handleClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};