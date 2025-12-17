import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface StoreHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface Store {
  id: number;
  name: string;
  address: string;
  locationDescription?: string;
  logo: string;
  customLogo?: string;
  bgColor: string;
  activeOrders: number;
  hours: StoreHours[];
}

interface StoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (store: any) => void;
  store?: Store;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultHours = days.map(day => ({ day, open: '09:00', close: '17:00', isOpen: false }));

export const StoreFormWithLocationDescription = ({ isOpen, onClose, onSubmit, store }: StoreFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    locationDescription: '',
    logo: '🏪',
    bgColor: 'bg-blue-500',
    hours: defaultHours,
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        address: store.address,
        locationDescription: store.locationDescription || '',
        logo: store.logo,
        bgColor: store.bgColor,
        hours: store.hours && store.hours.length > 0 ? store.hours : defaultHours,
      });
    } else {
      setFormData({
        name: '',
        address: '',
        locationDescription: '',
        logo: '🏪',
        bgColor: 'bg-blue-500',
        hours: defaultHours,
      });
    }
  }, [store]);

  const handleHourChange = (index: number, field: 'isOpen' | 'open' | 'close', value: any) => {
    const newHours = [...formData.hours];
    (newHours[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, hours: newHours }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storeData = {
      id: store?.id || 0,
      name: formData.name,
      address: formData.address,
      locationDescription: formData.locationDescription || undefined,
      logo: formData.logo,
      bgColor: formData.bgColor,
      activeOrders: store?.activeOrders || 0,
      hours: formData.hours,
      customLogo: store?.customLogo,
    };

    onSubmit(storeData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{store ? 'Edit Store' : 'Add New Store'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Store Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter store name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Address
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter store address"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Location Description
                <span className="text-xs text-gray-500 ml-1">(Optional)</span>
              </label>
              <Textarea
                value={formData.locationDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, locationDescription: e.target.value }))}
                placeholder="e.g., Pool bar is across the street, south of the building"
                className="min-h-[80px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Help customers find your store more easily with specific location details
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Store Hours
              </label>
              <div className="space-y-3 rounded-md border p-4">
                {formData.hours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`is-open-alt-${index}`}
                        checked={hour.isOpen}
                        onCheckedChange={(checked) => handleHourChange(index, 'isOpen', checked)}
                      />
                      <label htmlFor={`is-open-alt-${index}`} className="text-sm font-normal w-20">{hour.day}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hour.open}
                        onChange={(e) => handleHourChange(index, 'open', e.target.value)}
                        disabled={!hour.isOpen}
                        className="w-28"
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        value={hour.close}
                        onChange={(e) => handleHourChange(index, 'close', e.target.value)}
                        disabled={!hour.isOpen}
                        className="w-28"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Store Icon
              </label>
              <Input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                placeholder="Enter emoji or text"
                maxLength={2}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Save className="h-4 w-4 mr-2" />
                {store ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
