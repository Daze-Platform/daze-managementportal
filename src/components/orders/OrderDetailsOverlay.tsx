
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { OrderDetails } from './OrderDetails';

interface OrderDetailsOverlayProps {
  selectedOrder: string;
  activeTab: string;
  onOrderUpdate: (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'schedule' | 'activate') => void;
  onClose: () => void;
  cardPosition: { top: number; left: number; width: number; height: number } | null;
}

export const OrderDetailsOverlay = ({
  selectedOrder,
  activeTab,
  onOrderUpdate,
  onClose,
  cardPosition
}: OrderDetailsOverlayProps) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!cardPosition) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Overlay Panel - Always fully visible in viewport */}
      <div 
        className="fixed z-[9999] bg-white animate-slide-in-right flex flex-col"
        style={{
          top: 'calc(var(--header-height, 64px) + 10px)',
          right: '10px',
          bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          width: '480px',
          maxWidth: 'calc(100vw - 20px)',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(229, 231, 235, 0.5)'
        }}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 hover:bg-gray-100 rounded-full transition-colors bg-white/80 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>
        
        {/* Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <OrderDetails 
            selectedOrder={selectedOrder} 
            activeTab={activeTab} 
            onOrderUpdate={onOrderUpdate}
          />
        </div>
      </div>
    </>,
    document.body
  );
};
