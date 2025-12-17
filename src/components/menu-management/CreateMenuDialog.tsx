
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface CreateMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (option: string) => void;
}

export const CreateMenuDialog: React.FC<CreateMenuDialogProps> = ({ open, onOpenChange, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const isMobile = useIsMobile();

  const handleContinue = () => {
    if (selectedOption) {
      onContinue(selectedOption);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedOption('');
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`${
        isMobile 
          ? 'w-[100vw] max-w-none h-[100vh] max-h-none m-0 rounded-none p-0 overflow-hidden' 
          : 'sm:max-w-2xl w-[90vw] max-h-[85vh]'
      } bg-white border border-gray-200 shadow-xl`}>
        
        {/* Clean Header */}
        <div className={`flex-shrink-0 bg-white ${
          isMobile ? 'p-4 pb-3' : 'p-5 pb-4'
        } border-b border-gray-100`}>
          <DialogHeader>
            <DialogTitle className={`${
              isMobile ? 'text-xl text-center' : 'text-2xl'
            } font-bold text-gray-900 flex items-center ${
              isMobile ? 'justify-center' : ''
            } gap-3`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📋</span>
              </div>
              Setup Menu
            </DialogTitle>
          </DialogHeader>
          
          <p className={`text-gray-600 mt-2 ${
            isMobile ? 'text-base text-center' : 'text-base'
          }`}>
            Choose how you'd like to create your menu
          </p>
        </div>

        {/* Clean Content */}
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-5'}`}>
          <div className="space-y-4">
            {/* Create from Scratch Option */}
            <div 
              className={`relative ${isMobile ? 'p-4' : 'p-5'} border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedOption === 'scratch' 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
              }`}
              onClick={() => setSelectedOption('scratch')}
            >
              {/* Selection Indicator */}
              <div className={`absolute ${isMobile ? 'top-3 right-3' : 'top-4 right-4'} w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'scratch' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 bg-white'
              }`}>
                {selectedOption === 'scratch' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M0 3l3 3 5-5-1-1-4 4-2-2z"/>
                  </svg>
                )}
              </div>

              <div className="flex items-start space-x-4">
                <div className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className={`${isMobile ? 'text-xl' : 'text-2xl'}`}>✨</span>
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    Create from scratch
                  </h3>
                  <p className={`text-gray-600 mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    Start with a blank menu and add your own categories and items
                  </p>
                  <div className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-500 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Full customization control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Build exactly what you need</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Template Option */}
            <div 
              className={`relative ${isMobile ? 'p-4' : 'p-5'} border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedOption === 'sample' 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
              }`}
              onClick={() => setSelectedOption('sample')}
            >
              {/* Selection Indicator */}
              <div className={`absolute ${isMobile ? 'top-3 right-3' : 'top-4 right-4'} w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'sample' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 bg-white'
              }`}>
                {selectedOption === 'sample' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M0 3l3 3 5-5-1-1-4 4-2-2z"/>
                  </svg>
                )}
              </div>

              <div className="flex items-start space-x-4">
                <div className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className={`${isMobile ? 'text-xl' : 'text-2xl'}`}>🍽️</span>
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    Use sample template
                  </h3>
                  <p className={`text-gray-600 mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    Start with our professionally crafted menu template
                  </p>
                  <div className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-500 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>6 categories with 25+ items included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>Professional descriptions and pricing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation for Sample Template */}
            {selectedOption === 'sample' && (
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-emerald-50 border border-emerald-200 rounded-lg`}>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 text-emerald-600 flex-shrink-0">
                    💡
                  </div>
                  <div className={`${isMobile ? 'text-sm' : 'text-sm'} text-emerald-800`}>
                    <p className="font-semibold mb-1">Perfect for restaurants!</p>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                      This template includes industry-standard categories, realistic pricing, and professional item descriptions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clean Footer */}
        <div className={`flex-shrink-0 bg-gray-50 border-t border-gray-100 ${
          isMobile ? 'p-4' : 'p-5'
        }`}>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} justify-end space-y-3 sm:space-y-0 sm:space-x-3`}>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className={`border-gray-300 hover:bg-gray-50 ${
                isMobile ? 'h-11 text-base font-medium' : 'text-sm h-10'
              }`}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleContinue}
              className={`bg-blue-600 hover:bg-blue-700 text-white ${
                isMobile ? 'h-11 text-base font-semibold' : 'text-sm h-10'
              }`}
              disabled={!selectedOption}
            >
              {selectedOption === 'sample' 
                ? (isMobile ? 'Use Template' : 'Create with Template')
                : (isMobile ? 'Start Building' : 'Continue')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
