import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  File,
  DollarSign,
  Filter,
  FileText,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import { StoreLogo } from "@/components/stores/StoreLogo";
import { useStores } from "@/contexts/StoresContext";
import { useResort } from "@/contexts/DestinationContext";
import { useFilters } from "@/contexts/FilterContext";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PayoutRow {
  id: string;
  store: string;
  date: string;
  status: "Succeeded" | "Pending" | "Failed";
  subtotal: string;
  serviceFee: string;
  commissions: string;
  net: string;
  storeIcon: string;
  bgColor: string;
  customLogo: string;
}

function formatMoney(cents: number): string {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mapStatus(status: string): "Succeeded" | "Pending" | "Failed" {
  const s = (status ?? "").toLowerCase();
  if (s === "completed" || s === "delivered") return "Succeeded";
  if (s === "cancelled" || s === "canceled" || s === "failed") return "Failed";
  return "Pending";
}

function usePayoutsData(): { data: PayoutRow[]; loading: boolean; error: Error | null } {
  const { userProfile } = useAuth();
  const { selectedDateRange } = useFilters();
  const [data, setData] = useState<PayoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const tenantId = userProfile?.tenantId;
    if (!tenantId) {
      setData([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        let query = supabase
          .from("orders")
          .select("id, created_at, status, subtotal_cents, total_cents, restaurant_id, stores!orders_restaurant_id_fkey(name)")
          .eq("tenant_id", tenantId)
          .order("created_at", { ascending: false });

        if (selectedDateRange?.from) {
          query = query.gte("created_at", selectedDateRange.from.toISOString());
        }
        if (selectedDateRange?.to) {
          const toEnd = new Date(selectedDateRange.to);
          toEnd.setHours(23, 59, 59, 999);
          query = query.lte("created_at", toEnd.toISOString());
        }

        const { data: rows, error: qErr } = await query;
        if (cancelled) return;
        if (qErr) throw qErr;

        const mapped: PayoutRow[] = (rows ?? []).map((row: any) => {
          const subtotalCents: number = row.subtotal_cents ?? 0;
          const totalCents: number = row.total_cents ?? subtotalCents;
          const serviceFeeCents = Math.round(subtotalCents * 0.1);
          const storeName: string = row.stores?.name ?? "Unknown Store";

          return {
            id: row.id,
            store: storeName,
            date: format(new Date(row.created_at), "MMM d, yyyy h:mmaaa"),
            status: mapStatus(row.status ?? ""),
            subtotal: formatMoney(subtotalCents),
            serviceFee: formatMoney(serviceFeeCents),
            commissions: formatMoney(serviceFeeCents),
            net: formatMoney(totalCents),
            storeIcon: "",
            bgColor: "",
            customLogo: "",
          };
        });

        setData(mapped);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [userProfile?.tenantId, selectedDateRange]);

  return { data, loading, error };
}

export const Payouts = () => {
  const { stores: allStores, getStoresByResort } = useStores();
  const { currentResort } = useResort();
  const { toast } = useToast();
  const {
    selectedStore,
    setSelectedStore,
    selectedDateRange,
    setSelectedDateRange,
  } = useFilters();
  const { data: realPayoutsData, loading: payoutsLoading } = usePayoutsData();
  const financialData = realPayoutsData;
  const lastUpdatedLabel = format(new Date(), "MMM dd, yyyy");

  // Get all stores regardless of resort assignment and remove duplicates
  // This ensures all stores are available in dropdowns without duplicates
  const availableStores = allStores.filter(
    (store, index, self) => index === self.findIndex((s) => s.id === store.id),
  );

  // Transform stores to match dropdown format
  const stores = [
    { id: "all", name: "All Venues" },
    ...availableStores.map((store) => ({
      id: store.id.toString(),
      name: store.name,
    })),
  ];

  // Log filter changes for debugging
  useEffect(() => {
    console.log("Payouts filters changed:", {
      selectedStore,
      selectedDateRange,
    });
  }, [selectedStore, selectedDateRange]);

  // Format date range for display
  const formatDateRangeForPayouts = () => {
    if (!selectedDateRange?.from) return "No date selected";
    if (selectedDateRange.from && selectedDateRange.to) {
      return `${format(selectedDateRange.from, "MMM dd, yyyy")} - ${format(selectedDateRange.to, "MMM dd, yyyy")}`;
    }
    return format(selectedDateRange.from, "MMM dd, yyyy");
  };

  const exportToCsv = () => {
    const filteredData =
      selectedStore === "all"
        ? financialData
        : financialData.filter((item) => item.store === selectedStore);

    const headers = [
      "Store",
      "Date",
      "Status",
      "Subtotal",
      "Service Fee",
      "Commissions",
      "NET",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          `"${item.store}"`,
          `"${item.date}"`,
          `"${item.status}"`,
          `"${item.subtotal}"`,
          `"${item.serviceFee}"`,
          `"${item.commissions}"`,
          `"${item.net}"`,
        ].join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const storeFilter =
      selectedStore === "all"
        ? "all-stores"
        : selectedStore.toLowerCase().replace(/\s+/g, "-");
    const dateFilter = formatDateRangeForPayouts()
      .toLowerCase()
      .replace(/\s+/g, "-");
    link.setAttribute(
      "download",
      `payouts-${storeFilter}-${dateFilter}-${new Date().toISOString().split("T")[0]}.csv`,
    );

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful!",
      description: `Exported ${filteredData.length} payout records as CSV file.`,
    });
  };

  const exportToPdf = () => {
    try {
      console.log("PDF export triggered - starting download...");
      const filteredData =
        selectedStore === "all"
          ? financialData
          : financialData.filter((item) => item.store === selectedStore);

      // Simple approach: create a text-based content for PDF
      const reportContent = [
        "PAYOUT REPORT",
        "=============",
        "",
        `Store Filter: ${selectedStore === "all" ? "All Stores" : selectedStore}`,
        `Date Range: ${formatDateRangeForPayouts()}`,
        `Generated: ${new Date().toLocaleDateString()}`,
        "",
        "PAYOUT DETAILS:",
        "---------------",
        ...filteredData.map(
          (item, index) =>
            `${index + 1}. ${item.store}\n   Date: ${item.date}\n   Status: ${item.status}\n   NET: ${item.net}\n`,
        ),
      ].join("\n");

      // Create PDF using basic jsPDF
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(reportContent, 170);
      doc.text(lines, 20, 20);

      // Download the PDF
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `payouts-report-${timestamp}.pdf`;
      doc.save(filename);

      toast({
        title: "PDF Downloaded!",
        description: `Successfully exported ${filteredData.length} payout records.`,
      });
    } catch (error) {
      console.error("PDF failed, switching to CSV:", error);
      // If PDF fails, automatically try CSV
      exportToCsv();
    }
  };

  const exportToExcel = () => {
    const filteredData =
      selectedStore === "all"
        ? financialData
        : financialData.filter((item) => item.store === selectedStore);

    // Create Excel-like CSV with enhanced formatting
    const headers = [
      "Store",
      "Date",
      "Status",
      "Subtotal",
      "Service Fee",
      "Commissions",
      "NET",
      "Store Logo",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          `"${item.store}"`,
          `"${item.date}"`,
          `"${item.status}"`,
          item.subtotal.replace("$", ""),
          item.serviceFee.replace("$", ""),
          item.commissions.replace("$", ""),
          item.net.replace("$", ""),
          `"${item.customLogo || "No logo"}"`,
        ].join(","),
      ),
      "", // Empty row
      "SUMMARY", // Summary section
      `Total Records: ${filteredData.length}`,
      `Date Range: ${formatDateRangeForPayouts()}`,
      `Export Date: ${new Date().toLocaleDateString()}`,
      `Filter Applied: ${selectedStore === "all" ? "All Stores" : selectedStore}`,
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const storeFilter =
      selectedStore === "all"
        ? "all-stores"
        : selectedStore.toLowerCase().replace(/\s+/g, "-");
    const dateFilter = formatDateRangeForPayouts()
      .toLowerCase()
      .replace(/\s+/g, "-");
    link.setAttribute(
      "download",
      `payouts-excel-${storeFilter}-${dateFilter}-${new Date().toISOString().split("T")[0]}.csv`,
    );

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Excel Export Successful!",
      description: `Exported ${filteredData.length} records in Excel-compatible format.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();

    if (
      normalized === "succeeded" ||
      normalized === "active" ||
      normalized === "completed"
    ) {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          ✓ {status}
        </Badge>
      );
    }

    if (normalized === "pending") {
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          ⏳ Pending
        </Badge>
      );
    }

    if (
      normalized === "failed" ||
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          ✗ {status}
        </Badge>
      );
    }

    if (normalized === "inactive") {
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          Inactive
        </Badge>
      );
    }

    return (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
        {status}
      </Badge>
    );
  };

  // Filter data based on selected store
  const filteredData =
    selectedStore === "all"
      ? financialData
      : financialData.filter((item) => {
          const selectedStoreName = stores.find(
            (s) => s.id === selectedStore,
          )?.name;
          return item.store === selectedStoreName;
        });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 page-fade-in">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Payouts
              </h1>
              <p className="text-sm text-gray-600">
                Track payouts and financial performance
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={exportToPdf}>
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={exportToCsv}>
                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={exportToExcel}>
                <File className="mr-2 h-4 w-4 text-blue-600" />
                <span>Excel Compatible</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Commission Information Banner */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">i</span>
            </div>
            <p className="text-sm text-blue-800">
              <strong>Commission Structure:</strong> A 10% service fee is
              automatically added to customer orders and deducted from your
              payouts. NET amount reflects your earnings after commission.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 hidden sm:block" />
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-full sm:w-48 transition-all duration-300 hover:border-blue-400 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="animate-in fade-in-0 zoom-in-95 duration-200 bg-white border-gray-300 shadow-lg z-50">
                  {stores.map((store) => (
                    <SelectItem
                      key={store.id}
                      value={store.id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>{store.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64">
              <DateRangePicker
                value={selectedDateRange}
                onChange={setSelectedDateRange}
              />
            </div>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
            Last updated {lastUpdatedLabel}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="p-4 sm:p-6">
          {/* Loading state */}
          {payoutsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading payouts...</span>
            </div>
          )}

          {/* Empty state */}
          {!payoutsLoading && filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <DollarSign className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-500">No payouts found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting the date range or store filter.
              </p>
            </div>
          )}

          {/* Desktop Table */}
          {!payoutsLoading && filteredData.length > 0 && (
          <div className="hidden lg:block">
            <Card className="rounded-xl border border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Payout Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Store</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">
                        Subtotal
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Service Fee
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Commission
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        NET
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <StoreLogo
                              logo={item.storeIcon}
                              customLogo={item.customLogo}
                              bgColor={item.bgColor}
                              size="sm"
                            />
                            <span className="font-medium">{item.store}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.date}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="font-medium text-right">
                          {item.subtotal}
                        </TableCell>
                        <TableCell className="text-orange-600 text-right">
                          {item.serviceFee}
                        </TableCell>
                        <TableCell className="text-red-600 text-right">
                          {item.commissions}
                        </TableCell>
                        <TableCell className="font-bold text-green-600 text-right">
                          {item.net}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Mobile/Tablet Cards */}
          {!payoutsLoading && filteredData.length > 0 && (
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {filteredData.map((item) => (
              <Card
                key={item.id}
                className="rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50/50">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <StoreLogo
                        logo={item.storeIcon}
                        customLogo={item.customLogo}
                        bgColor={item.bgColor}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {item.store}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  {/* Financial Details Grid */}
                  <div className="grid grid-cols-2 gap-px bg-gray-100">
                    <div className="bg-white p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Subtotal
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {item.subtotal}
                      </p>
                    </div>
                    <div className="bg-white p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-orange-600 uppercase tracking-wide mb-1">
                        Service Fee
                      </p>
                      <p className="text-sm sm:text-base font-medium text-orange-600">
                        {item.serviceFee}
                      </p>
                    </div>
                    <div className="bg-white p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-red-600 uppercase tracking-wide mb-1">
                        Commission
                      </p>
                      <p className="text-sm sm:text-base font-medium text-red-600">
                        {item.commissions}
                      </p>
                    </div>
                    <div className="bg-white p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-green-600 uppercase tracking-wide mb-1">
                        Net Earnings
                      </p>
                      <p className="text-sm sm:text-base font-bold text-green-600">
                        {item.net}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
            <span className="text-sm text-gray-600">Rows per page: 10</span>
            <span className="text-sm text-gray-600">
              1-{filteredData.length} of {filteredData.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
