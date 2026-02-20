import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin, Edit, ArrowLeft, Info, Trash2 } from "lucide-react";
import { StoreLogo } from "./StoreLogo";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: number;
  name: string;
  address: string;
  locationDescription?: string;
  logo: string;
  customLogo?: string;
  bgColor: string;
  activeOrders: number;
}

interface StoreDetailsProps {
  store: Store;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (storeId: number) => void;
}

export const StoreDetails = ({
  store,
  onClose,
  onEdit,
  onDelete,
}: StoreDetailsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(store.id);
    setShowDeleteDialog(false);
  };

  const handleViewOrders = () => {
    // Navigate to active orders page and show only this store's orders
    navigate("/orders/active", {
      state: { selectedStoreId: store.id.toString() },
    });
    toast({
      title: "Viewing Orders",
      description: `Showing orders for ${store.name}`,
    });
  };

  const handleViewMenu = () => {
    // Navigate to menu management page
    navigate("/menus");
    toast({
      title: "Menu Management",
      description: `Opening menu management for ${store.name}`,
    });
  };

  const handleViewReports = () => {
    // Navigate to reports page
    navigate("/reports");
    toast({
      title: "Reports",
      description: `Opening reports for ${store.name}`,
    });
  };

  const handleManageStaff = () => {
    // Navigate to employees page
    navigate("/employees");
    toast({
      title: "Staff Management",
      description: `Opening staff management for ${store.name}`,
    });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
            Venue Details
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-3 sm:px-4 py-2"
            size="sm"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Edit Venue</span>
            <span className="sm:hidden">Edit</span>
          </Button>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sm:hidden">Del</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Venue</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{store.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Venue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <StoreLogo
              logo={store.logo}
              customLogo={store.customLogo}
              bgColor={store.bgColor}
              size="lg"
              variant="sleek"
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl truncate">
                {store.name}
              </CardTitle>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">
                  {store.address}
                </span>
              </div>
              {store.locationDescription && (
                <div className="flex items-start text-blue-600 mt-2 bg-blue-50 p-2 rounded-md">
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium">
                    {store.locationDescription}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                Venue Information
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Venue ID:
                  </span>
                  <p className="font-medium text-sm sm:text-base mt-1">
                    #{store.id}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Name:
                  </span>
                  <p className="font-medium text-sm sm:text-base break-words mt-1">
                    {store.name}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Address:
                  </span>
                  <p className="font-medium text-sm sm:text-base break-words mt-1">
                    {store.address}
                  </p>
                </div>
                {store.locationDescription && (
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Location Details:
                    </span>
                    <p className="font-medium text-sm sm:text-base break-words mt-1">
                      {store.locationDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                Current Status
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Active Orders:
                  </span>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant={store.activeOrders > 0 ? "default" : "secondary"}
                      className={`text-xs ${store.activeOrders > 0 ? "bg-green-500" : ""}`}
                    >
                      {store.activeOrders} orders
                    </Badge>
                    {store.activeOrders > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs sm:text-sm text-green-600 font-medium">
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Venue Status:
                  </span>
                  <div className="mt-2">
                    <Badge variant="default" className="bg-blue-500 text-xs">
                      Operational
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 sm:pt-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
                onClick={handleViewOrders}
              >
                <span className="hidden sm:inline">View Orders</span>
                <span className="sm:hidden">Orders</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
                onClick={handleViewMenu}
              >
                <span className="hidden sm:inline">View Menu</span>
                <span className="sm:hidden">Menu</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
                onClick={handleViewReports}
              >
                <span className="hidden sm:inline">View Reports</span>
                <span className="sm:hidden">Reports</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
                onClick={handleManageStaff}
              >
                <span className="hidden sm:inline">Manage Staff</span>
                <span className="sm:hidden">Staff</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
