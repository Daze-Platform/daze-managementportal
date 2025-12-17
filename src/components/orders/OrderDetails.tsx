import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, MessageSquare, MapPin, Clock, User, CreditCard, CheckCircle2, AlertCircle, Truck, Minus, Plus, Copy, Star, Navigation } from 'lucide-react';
import { DeclineOrderDialog } from '@/components/orders/DeclineOrderDialog';
import { TimeSelectionButtons } from '@/components/orders/TimeSelectionButtons';
import { useToast } from '@/hooks/use-toast';

interface OrderDetailsProps {
  selectedOrder: string;
  activeTab: string;
  onOrderUpdate?: (orderId: string, action: 'accept' | 'decline' | 'ready' | 'complete' | 'fulfill' | 'activate', data?: any) => void;
}

export const OrderDetails = ({ selectedOrder, activeTab, onOrderUpdate }: OrderDetailsProps) => {
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [completedItems, setCompletedItems] = useState<{ [key: number]: boolean }>({ 0: true });
  const { toast } = useToast();

  // Enhanced order data with realistic menu items
  const getOrderItems = () => {
    const orderValue = parseFloat(selectedOrder) || 32.50;
    
    if (orderValue > 40) {
      return [
        {
          name: '1x Ribeye Steak (Medium)',
          note: 'With garlic mashed potatoes, seasonal vegetables',
          price: '$32.99',
          modifiers: ['Extra sauce on the side', 'No onions']
        },
        {
          name: '1x Caesar Salad',
          note: 'Add grilled chicken (+$4.00)',
          price: '$15.99',
          modifiers: ['Extra parmesan', 'Dressing on the side']
        },
        {
          name: '2x Soft Drinks',
          note: 'Coca-Cola (Large)',
          price: '$7.98',
          modifiers: ['Extra ice', 'No lemon']
        }
      ];
    } else if (orderValue > 25) {
      return [
        {
          name: '1x Classic Cheeseburger',
          note: 'With lettuce, tomato, onion, pickles on brioche bun',
          price: '$15.99',
          modifiers: ['Add bacon (+$2.00)', 'Medium cook', 'Extra pickles']
        },
        {
          name: '1x Loaded Nachos',
          note: 'With jalapeños, sour cream, guacamole',
          price: '$10.99',
          modifiers: ['Extra cheese', 'Spicy level: Medium']
        },
        {
          name: '1x Fresh Squeezed Orange Juice',
          note: 'Large size',
          price: '$4.99',
          modifiers: ['No pulp']
        }
      ];
    } else {
      return [
        {
          name: '2x Buffalo Wings',
          note: 'With celery sticks and ranch dressing',
          price: '$12.99',
          modifiers: ['Sauce: Medium Buffalo', 'Extra ranch']
        },
        {
          name: '1x Garden Salad',
          note: 'Mixed greens, cherry tomatoes, cucumbers',
          price: '$9.99',
          modifiers: ['Dressing: Italian', 'No onions']
        },
        {
          name: '1x Premium Coffee',
          note: 'Cappuccino - Large',
          price: '$4.99',
          modifiers: ['Extra shot', 'Oat milk']
        }
      ];
    }
  };

  const selectedOrderDetails = {
    customer: {
      name: 'Johny Godwin',
      email: 'hanawharton@daze.com',
      tel: '+1(555)6547890',
      paymentMethod: 'Credit Card',
      rating: 4.8,
      totalOrders: 23
    },
    delivery: {
      address: 'Room N°12345, 123 Main Street, Downtown',
      courier: 'Antonio T.',
      pickupTime: 'July 21, 2022 11:36AM',
      deliveryInstructions: 'Ring doorbell twice, leave at door if no answer'
    },
    order: getOrderItems(),
    subtotal: '$35.00',
    processingFee: '+$6.00',
    deliveryTips: '+$4.50',
    platformFee: '+$2.50',
    total: '$48.00',
    orderTime: '11:26 AM',
    specialInstructions: 'Please make sure food is hot and include extra napkins. Customer has food allergies - no nuts.'
  };

  const adjustTime = (increment: number) => {
    const newTime = Math.max(5, estimatedMinutes + increment);
    setEstimatedMinutes(newTime);
  };

  const getExpectedTime = () => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + estimatedMinutes * 60000);
    return futureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAcceptOrder = () => {
    console.log('Order accepted:', selectedOrder);
    onOrderUpdate?.(selectedOrder, 'accept');
    toast({
      title: "Order Accepted",
      description: `Order #${selectedOrder} has been accepted and moved to preparation.`,
    });
  };

  const handleDeclineOrder = (reason: string) => {
    console.log('Order declined:', selectedOrder, 'Reason:', reason);
    onOrderUpdate?.(selectedOrder, 'decline', { reason });
    setShowDeclineDialog(false);
    toast({
      title: "Order Declined",
      description: `Order #${selectedOrder} has been declined.`,
      variant: "destructive",
    });
  };

  const handleMarkAsReady = () => {
    console.log('Order marked as ready:', selectedOrder);
    onOrderUpdate?.(selectedOrder, 'ready');
    toast({
      title: "Order Ready",
      description: `Order #${selectedOrder} is now ready for ${selectedOrderDetails.delivery.address ? 'delivery' : 'pickup'}.`,
    });
  };

  const handleCompleteOrder = () => {
    console.log('Order completed:', selectedOrder);
    onOrderUpdate?.(selectedOrder, 'complete');
    toast({
      title: "Order Completed",
      description: `Order #${selectedOrder} has been completed successfully.`,
    });
  };

  const toggleItemCompletion = (index: number) => {
    setCompletedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    toast({
      title: completedItems[index] ? "Item marked as pending" : "Item completed",
      description: `${selectedOrderDetails.order[index].name} status updated.`,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const openNavigation = () => {
    const address = encodeURIComponent(selectedOrderDetails.delivery.address);
    window.open(`https://maps.google.com/?q=${address}`, '_blank');
  };

  const getActionButtons = () => {
    // NEW ORDERS: Accept or Decline
    if (activeTab === 'new') {
      return (
        <TimeSelectionButtons
          selectedTime={estimatedMinutes}
          onTimeSelect={setEstimatedMinutes}
          onAccept={handleAcceptOrder}
          onReject={() => setShowDeclineDialog(true)}
          showActions={true}
        />
      );
    }

    // IN PROGRESS: Mark as Ready for delivery/pickup
    if (activeTab === 'progress') {
      return (
        <Button 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 text-sm touch-manipulation transition-all duration-200 hover:shadow-lg"
          onClick={handleMarkAsReady}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark as Ready
        </Button>
      );
    }

    // READY: Hand to courier (delivery) or complete (pickup)
    if (activeTab === 'ready') {
      const isDelivery = selectedOrderDetails.delivery.address;
      
      if (isDelivery) {
        return (
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-sm touch-manipulation transition-all duration-200 hover:shadow-lg"
            onClick={() => onOrderUpdate?.(selectedOrder, 'fulfill')}
          >
            <Truck className="w-4 h-4 mr-2" />
            Hand to Courier
          </Button>
        );
      } else {
        return (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-sm touch-manipulation transition-all duration-200 hover:shadow-lg"
            onClick={handleCompleteOrder}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete Order
          </Button>
        );
      }
    }

    // FULFILLMENT: Complete delivery
    if (activeTab === 'fulfillment' || activeTab === 'fulfilled') {
      return (
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-sm touch-manipulation transition-all duration-200 hover:shadow-lg"
          onClick={handleCompleteOrder}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Complete Delivery
        </Button>
      );
    }

    // SCHEDULED: Activate scheduled order
    if (activeTab === 'scheduled') {
      return (
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-sm touch-manipulation transition-all duration-200 hover:shadow-lg"
          onClick={() => onOrderUpdate?.(selectedOrder, 'activate')}
        >
          <Clock className="w-4 h-4 mr-2" />
          Activate Order
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="animate-fade-in min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 truncate">Order #{selectedOrder}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 animate-scale-in text-xs">
                🚚 Delivery
              </Badge>
              <span className="text-xs text-gray-500 truncate">Ordered at {selectedOrderDetails.orderTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge variant="outline" className="flex items-center space-x-1 text-xs">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{selectedOrderDetails.customer.rating}</span>
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-center space-x-1 text-gray-700 border-gray-300 text-xs touch-manipulation hover:bg-gray-50 transition-all duration-200"
            onClick={() => window.open(`tel:${selectedOrderDetails.customer.tel}`)}
          >
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">Call</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-center space-x-1 text-gray-700 border-gray-300 text-xs touch-manipulation hover:bg-gray-50 transition-all duration-200"
          >
            <MessageSquare className="w-3 h-3" />
            <span className="hidden sm:inline">Message</span>
          </Button>
        </div>

        {getActionButtons()}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain touch-pan-y p-4 space-y-4 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Ready Time Adjustment */}
        {(activeTab === 'new' || activeTab === 'progress') && (
          <Card className="animate-fade-in">
            <CardContent className="p-3">
              <h3 className="font-semibold mb-2 flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                Ready Time
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustTime(-5)}
                  disabled={estimatedMinutes <= 5}
                  className="w-8 h-8 p-0 touch-manipulation transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="text-center min-w-0">
                  <div className="text-xl font-bold text-blue-600 transition-all duration-300">{estimatedMinutes} min</div>
                  <div className="text-xs text-gray-500 truncate">({getExpectedTime()})</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustTime(5)}
                  className="w-8 h-8 p-0 touch-manipulation transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Information */}
        <Card className="animate-fade-in">
          <CardContent className="p-3">
            <h3 className="font-semibold mb-2 flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-green-600" />
              Customer Information
            </h3>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">JG</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{selectedOrderDetails.customer.name}</div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    ⭐ {selectedOrderDetails.customer.rating}
                  </Badge>
                  <span className="text-xs text-gray-500 truncate">
                    {selectedOrderDetails.customer.totalOrders} orders
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 min-w-0 flex-1">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="truncate text-gray-900">{selectedOrderDetails.customer.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(selectedOrderDetails.customer.email, 'Email')}
                  className="h-6 w-6 p-0 hover:bg-gray-100 flex-shrink-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 min-w-0 flex-1">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span className="text-gray-900">{selectedOrderDetails.customer.tel}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(selectedOrderDetails.customer.tel, 'Phone number')}
                  className="h-6 w-6 p-0 hover:bg-gray-100 flex-shrink-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <CreditCard className="w-3 h-3 text-gray-400" />
                <span className="font-medium text-gray-600">Payment:</span>
                <span className="text-gray-900">{selectedOrderDetails.customer.paymentMethod}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Details */}
        <Card className="animate-fade-in">
          <CardContent className="p-3">
            <h3 className="font-semibold mb-2 flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-purple-600" />
              Delivery Details
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-600">Address:</span>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(selectedOrderDetails.delivery.address, 'Address')}
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={openNavigation}
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                    >
                      <Navigation className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-gray-900 break-words text-sm">{selectedOrderDetails.delivery.address}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Instructions:</span>
                <div className="text-gray-900 mt-1 break-words">{selectedOrderDetails.delivery.deliveryInstructions}</div>
              </div>
              {(activeTab === 'ready' || activeTab === 'fulfillment') && (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900 text-xs">Courier:</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                    {selectedOrderDetails.delivery.courier}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="animate-fade-in">
          <CardContent className="p-3">
            <h3 className="font-semibold mb-2 text-sm">Order Items ({selectedOrderDetails.order.length} items)</h3>
            <div className="space-y-3">
              {selectedOrderDetails.order.map((item, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100 border border-gray-200">
                  <div className="flex items-start space-x-2 flex-1 min-w-0">
                    <button 
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center touch-manipulation transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                        completedItems[index] ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                      }`}
                      onClick={() => toggleItemCompletion(index)}
                    >
                      {completedItems[index] && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-xs break-words transition-all duration-200 ${completedItems[index] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 break-words">{item.note}</div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.modifiers.map((modifier, modIndex) => (
                            <Badge key={modIndex} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-1 py-0">
                              {modifier}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-xs flex-shrink-0 ml-2">{item.price}</span>
                </div>
              ))}
            </div>

            {/* Special Instructions */}
            {selectedOrderDetails.specialInstructions && (
              <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg animate-fade-in">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-orange-800 text-xs">Special Instructions</div>
                    <div className="text-xs text-orange-700 mt-1 break-words">{selectedOrderDetails.specialInstructions}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <Separator className="my-3" />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between transition-colors duration-200 hover:bg-gray-50 p-1 rounded">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{selectedOrderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between transition-colors duration-200 hover:bg-gray-50 p-1 rounded">
                <span className="text-gray-600">Processing Fee</span>
                <span className="text-gray-900">{selectedOrderDetails.processingFee}</span>
              </div>
              <div className="flex justify-between transition-colors duration-200 hover:bg-gray-50 p-1 rounded">
                <span className="text-gray-600">Platform Fee</span>
                <span className="text-gray-900">{selectedOrderDetails.platformFee}</span>
              </div>
              <div className="flex justify-between transition-colors duration-200 hover:bg-gray-50 p-1 rounded">
                <span className="text-gray-600">Delivery Tips</span>
                <span className="text-gray-900">{selectedOrderDetails.deliveryTips}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-sm p-2 bg-gray-50 rounded-lg">
                <span>Total</span>
                <span className="text-green-600">{selectedOrderDetails.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeclineOrderDialog 
        isOpen={showDeclineDialog} 
        onClose={() => setShowDeclineDialog(false)}
        onDecline={handleDeclineOrder}
        orderId={selectedOrder}
      />
    </div>
  );
};