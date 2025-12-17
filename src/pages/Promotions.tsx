import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Calendar, Percent, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import { PromotionForm } from '@/components/promotions/PromotionForm';
import { usePromotions, Promotion } from '@/contexts/PromotionsContext';
import { useStores } from '@/contexts/StoresContext';
import promotionsEmptyImage from '@/assets/promotions-empty-state.png';

export const Promotions = () => {
  const { 
    promotions, 
    loading, 
    addPromotion, 
    updatePromotion, 
    deletePromotion,
    getActivePromotions 
  } = usePromotions();
  
  const { stores } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (promotion.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'active') {
      return matchesSearch && promotion.is_active;
    } else if (filterStatus === 'inactive') {
      return matchesSearch && !promotion.is_active;
    }
    
    return matchesSearch;
  });

  const handleCreatePromotion = async (formData: any) => {
    const promotionData: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'usage_count'> = {
      title: formData.name,
      description: formData.description,
      discount_type: 'percentage',
      discount_value: parseFloat(formData.discount) || 0,
      start_date: formData.startDate?.toISOString() || new Date().toISOString(),
      end_date: formData.endDate?.toISOString() || new Date().toISOString(),
      is_active: true,
      store_id: null,
      resort_id: null,
      usage_limit: null,
      conditions: {
        ...(formData.image && { image: formData.image })
      }
    };
    
    await addPromotion(promotionData);
    setIsFormOpen(false);
    setEditingPromotion(null);
  };

  const handleEditPromotion = async (formData: any) => {
    if (editingPromotion) {
      const promotionData: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'usage_count'> = {
        title: formData.name,
        description: formData.description,
        discount_type: 'percentage',
        discount_value: parseFloat(formData.discount) || 0,
        start_date: formData.startDate?.toISOString() || editingPromotion.start_date,
        end_date: formData.endDate?.toISOString() || editingPromotion.end_date,
        is_active: editingPromotion.is_active,
        store_id: editingPromotion.store_id,
        resort_id: editingPromotion.resort_id,
        usage_limit: editingPromotion.usage_limit,
        conditions: {
          ...(editingPromotion.conditions || {}),
          ...(formData.image && { image: formData.image })
        }
      };
      
      await updatePromotion({
        ...editingPromotion,
        ...promotionData
      });
      setEditingPromotion(null);
      setIsFormOpen(false);
    }
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      await deletePromotion(promotionId);
    }
  };

  const getPromotionBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);
    
    if (!promotion.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    } else if (now < startDate) {
      return <Badge variant="outline">Scheduled</Badge>;
    } else if (now > endDate) {
      return <Badge variant="destructive">Expired</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const formatDiscountValue = (promotion: Promotion) => {
    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}%`;
    } else {
      return `$${promotion.discount_value.toFixed(2)}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading promotions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b px-6 py-4 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
            <p className="text-gray-600 mt-1">Create and manage promotional campaigns</p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white min-h-[44px] px-6 py-3 flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promotion</span>
          </Button>
        </div>
      </div>

      {/* Optimized Scrollable Content */}
      <div 
        className="h-[calc(100vh-140px)] overflow-y-auto"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          willChange: 'scroll-position'
        }}
      >
        <div className="p-6 space-y-6">
          {/* Stats Section - Only show if promotions exist */}
          {promotions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 will-change-auto">
              <Card className="transform-gpu">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Promotions</p>
                      <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transform-gpu">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                      <p className="text-2xl font-bold text-green-600">{getActivePromotions().length}</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Eye className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transform-gpu">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Discount</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {promotions.length > 0 
                          ? `${(promotions.reduce((acc, p) => acc + p.discount_value, 0) / promotions.length).toFixed(1)}%`
                          : '0%'
                        }
                      </p>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Percent className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transform-gpu">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Savings</p>
                      <p className="text-2xl font-bold text-purple-600">$2,435</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <Card className="transform-gpu">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search promotions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('active')}
                    size="sm"
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('inactive')}
                    size="sm"
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotions Grid */}
          {filteredPromotions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 will-change-auto">
              {filteredPromotions.map((promotion) => (
                <Card 
                  key={promotion.id} 
                  className="group hover:shadow-lg transition-shadow duration-200 transform-gpu"
                >
                  {promotion.conditions?.image && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={promotion.conditions.image}
                        alt={promotion.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{promotion.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {promotion.description}
                        </CardDescription>
                      </div>
                      {getPromotionBadge(promotion)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Discount</span>
                        <span className="font-semibold text-lg text-green-600">
                          {formatDiscountValue(promotion)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Period</span>
                        <span className="text-sm">
                          {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {promotion.usage_limit && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Usage</span>
                          <span className="text-sm">
                            {promotion.usage_count} / {promotion.usage_limit}
                          </span>
                        </div>
                      )}
                      
                      {promotion.store_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Store</span>
                          <span className="text-sm">
                            {stores.find(s => s.id === promotion.store_id)?.name || 'Unknown'}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPromotion(promotion);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePromotion(promotion.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {filteredPromotions.length === 0 && (
            <Card className="transform-gpu">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <img 
                    src={promotionsEmptyImage} 
                    alt="No promotions illustration" 
                    className="w-48 h-36 mx-auto mb-6 object-contain"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? 'No promotions match your search criteria.' : 'Get started by creating your first promotion to boost your sales!'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsFormOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Promotion
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Bottom spacing for comfortable scrolling */}
          <div className="h-16" />
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) {
          setEditingPromotion(null);
        }
      }}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <PromotionForm
              onSave={editingPromotion ? handleEditPromotion : handleCreatePromotion}
              initialData={editingPromotion ? {
                ...editingPromotion,
                name: editingPromotion.title,
                startDate: new Date(editingPromotion.start_date),
                endDate: new Date(editingPromotion.end_date),
                discount: editingPromotion.discount_value.toString(),
                image: editingPromotion.conditions?.image
              } : undefined}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};