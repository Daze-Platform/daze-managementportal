import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { OrderCardAvatar } from './OrderCardAvatar';
import { OrderCardStatusInfo } from './OrderCardStatusInfo';
import { OrderCardContent } from './OrderCardContent';
import { OrderCardActions } from './OrderCardActions';
import { DeclineOrderDialog } from './DeclineOrderDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface Order {
  id: string;
  items: string;
  type: string;
  time: string;
  deliverTime: string;
  icon: string;
  iconBg: string;
  status?: string;
  customer?: string;
  estimatedTime?: string;
  priority?: 'normal' | 'high' | 'urgent';
  platformFee?: string;
  storeId?: string;
  storeName?: string;
  courier?: string;
  scheduledFor?: string;
}

interface ModernOrderCardProps {
  order: Order;
  isSelected: boolean;
  onClick: () => void;
  activeTab: string;
  onOrderUpdate?: (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'schedule' | 'activate') => void;
  onViewDetails?: (orderId: string, cardRef: React.RefObject<HTMLDivElement>) => void;
  showStoreBadge?: boolean;
}

const statusConfig = {
  new: { color: 'bg-emerald-500', pulse: true },
  progress: { color: 'bg-blue-500', pulse: false },
  ready: { color: 'bg-amber-500', pulse: true },
  fulfillment: { color: 'bg-violet-500', pulse: false },
  fulfilled: { color: 'bg-teal-600', pulse: false },
  scheduled: { color: 'bg-indigo-500', pulse: false },
  default: { color: 'bg-muted-foreground', pulse: false },
};

export const ModernOrderCard = ({ order, isSelected, onClick, activeTab, onOrderUpdate, onViewDetails, showStoreBadge = false }: ModernOrderCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const handleViewDetails = (orderId: string) => {
    if (onViewDetails) {
      onViewDetails(orderId, cardRef);
    }
  };

  const handleOrderUpdate = (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'schedule' | 'activate') => {
    if (action === 'decline') {
      setShowDeclineDialog(true);
    } else if (onOrderUpdate) {
      onOrderUpdate(orderId, action);
    }
  };

  const handleDeclineOrder = (reason: string) => {
    console.log('Declining order with reason:', reason);
    setShowDeclineDialog(false);
    if (onOrderUpdate) {
      onOrderUpdate(order.id, 'decline');
    }
  };

  const parseOrderItems = () => {
    const itemsText = order.items;
    const itemCount = itemsText.split(' ')[0];
    const price = itemsText.split('$')[1];
    return { itemCount, price };
  };

  const { price } = parseOrderItems();
  const status = statusConfig[activeTab as keyof typeof statusConfig] || statusConfig.default;

  // Mobile compact card
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          ref={cardRef}
          className={`relative overflow-hidden bg-card border transition-all duration-200 ${
            isSelected 
              ? 'ring-2 ring-primary shadow-lg border-primary/30' 
              : 'border-border/50 hover:border-border'
          }`}
        >
          {/* Status Indicator */}
          <div className={`h-1 ${status.color} relative`}>
            {status.pulse && (
              <motion.div 
                className="absolute inset-0 bg-white/30"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          
          <CardContent className="p-3">
            {/* Compact Header - Always visible */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <OrderCardAvatar customer={order.customer} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">#{order.id}</h3>
                    {order.priority === 'urgent' && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-destructive"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.customer || 'Guest Order'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">${price}</div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${order.type === 'Delivery' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                  >
                    {order.type}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Expandable Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-border/50 space-y-3">
                    <OrderCardStatusInfo activeTab={activeTab} time={order.time} />
                    <OrderCardContent order={order} />
                    <OrderCardActions
                      order={order}
                      activeTab={activeTab}
                      onOrderUpdate={handleOrderUpdate}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        
        <DeclineOrderDialog 
          isOpen={showDeclineDialog} 
          onClose={() => setShowDeclineDialog(false)}
          onDecline={handleDeclineOrder}
          orderId={order.id}
        />
      </motion.div>
    );
  }

  // Desktop full card
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card 
        ref={cardRef}
        className={`relative overflow-hidden bg-card border transition-all duration-300 ${
          isSelected 
            ? 'ring-2 ring-primary shadow-elevated-lg border-primary/30' 
            : 'border-border/50 hover:border-border hover:shadow-elevated'
        }`}
        style={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status Indicator */}
        <div className={`h-1 ${status.color} relative flex-shrink-0`}>
          {status.pulse && (
            <motion.div 
              className="absolute inset-0 bg-white/30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        
        <CardContent className="p-4 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 flex-shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
              <OrderCardAvatar customer={order.customer} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-foreground tracking-tight truncate">
                    #{order.id}
                  </h3>
                  {showStoreBadge && order.storeName && (
                    <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30 shrink-0">
                      {order.storeName}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium truncate mb-2">
                  {order.customer || 'Guest Order'}
                </p>
                
                <OrderCardStatusInfo activeTab={activeTab} time={order.time} />
              </div>
            </div>
            
            {/* Priority indicator for urgent orders */}
            {order.priority === 'urgent' && (
              <motion.div
                className="w-2 h-2 rounded-full bg-destructive"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 mb-3">
            <OrderCardContent order={order} />
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 mt-auto pt-3 border-t border-border/50">
            <OrderCardActions
              order={order}
              activeTab={activeTab}
              onOrderUpdate={handleOrderUpdate}
              onViewDetails={handleViewDetails}
            />
          </div>
        </CardContent>
        
        <DeclineOrderDialog 
          isOpen={showDeclineDialog} 
          onClose={() => setShowDeclineDialog(false)}
          onDecline={handleDeclineOrder}
          orderId={order.id}
        />
      </Card>
    </motion.div>
  );
};
