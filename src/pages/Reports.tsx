import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RevenueSection } from "@/components/reports/RevenueSection";
import { PaymentTypesSection } from "@/components/reports/PaymentTypesSection";
import { CancellationSection } from "@/components/reports/CancellationSection";
import { DowntimeSection } from "@/components/reports/DowntimeSection";
import { MarketingSection } from "@/components/reports/MarketingSection";
import { TeamSection } from "@/components/reports/TeamSection";
import { CustomerAnalyticsSection } from "@/components/reports/CustomerAnalyticsSection";
import { ProductMixSection } from "@/components/reports/ProductMixSection";
import { useStores } from "@/contexts/StoresContext";
import { useResort } from "@/contexts/DestinationContext";
import { useFilters } from "@/contexts/FilterContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { format, subDays, formatDistanceToNow } from "date-fns";
import { reportsData } from "@/data/reportsData";
import {
  BarChart3,
  TrendingUp,
  Calendar as CalendarIcon,
  Filter,
  Download,
} from "lucide-react";
import { exportReportsToPdf } from "@/utils/reportsPdfExport";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

// Report section definitions
const REPORT_SECTIONS = [
  { id: "customerAnalytics", label: "Customer Analytics" },
  { id: "productMix", label: "Product Mix" },
  { id: "revenue", label: "Revenue" },
  { id: "paymentTypes", label: "Payment Types" },
  { id: "cancellations", label: "Cancellations" },
  { id: "downtime", label: "Downtime" },
  { id: "marketing", label: "Marketing" },
  { id: "team", label: "Team Performance" },
] as const;

type SectionId = (typeof REPORT_SECTIONS)[number]["id"];

export const Reports = () => {
  const { stores: allStores, getStoresByResort } = useStores();
  const { currentResort } = useResort();
  const {
    selectedStore,
    setSelectedStore,
    selectedDateRange,
    setSelectedDateRange,
  } = useFilters();
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [customOpen, setCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(
    selectedDateRange,
  );
  const [visibleSections, setVisibleSections] = useState<Set<SectionId>>(
    new Set(REPORT_SECTIONS.map((s) => s.id)),
  );

  // Get store-specific data
  const currentStoreData =
    reportsData[selectedStore as keyof typeof reportsData] ||
    reportsData["all"];

  // Get all stores regardless of resort assignment and remove duplicates
  const availableStores = allStores.filter(
    (store, index, self) => index === self.findIndex((s) => s.id === store.id),
  );

  // Transform stores to match dropdown format
  const stores = [
    { id: "all", name: "All venues" },
    ...availableStores.map((store) => ({
      id: store.id.toString(),
      name: store.name,
    })),
  ];

  // Log filter changes for debugging
  useEffect(() => {
    console.log("Reports filters changed:", {
      selectedStore,
      selectedDateRange,
    });
  }, [selectedStore, selectedDateRange]);

  // Format date range for display
  const formatDateRangeForReports = () => {
    if (!selectedDateRange?.from) return "No date selected";
    if (selectedDateRange.from && selectedDateRange.to) {
      return `${format(selectedDateRange.from, "MMM dd, yyyy")} - ${format(selectedDateRange.to, "MMM dd, yyyy")}`;
    }
    return format(selectedDateRange.from, "MMM dd, yyyy");
  };

  function handlePeriodChange(value: string) {
    if (value === "custom") {
      setSelectedPeriod("custom");
      setTempRange(selectedDateRange);
      setCustomOpen(true);
      return;
    }
    setSelectedPeriod(value);
    const today = new Date();
    const daysBack = value === "7days" ? 6 : value === "30days" ? 29 : 89;
    setSelectedDateRange({ from: subDays(today, daysBack), to: today });
  }

  const toggleSection = (sectionId: SectionId) => {
    setVisibleSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleAllSections = (show: boolean) => {
    if (show) {
      setVisibleSections(new Set(REPORT_SECTIONS.map((s) => s.id)));
    } else {
      setVisibleSections(new Set());
    }
  };

  const isSectionVisible = (sectionId: SectionId) =>
    visibleSections.has(sectionId);
  const visibleCount = visibleSections.size;
  const totalCount = REPORT_SECTIONS.length;
  const lastUpdatedLabel = formatDistanceToNow(new Date(), { addSuffix: true });
  const sectionVisibilityLabel =
    visibleCount === 0
      ? "No sections selected"
      : `${visibleCount} of ${totalCount} sections visible`;

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-3 sm:px-4 lg:px-6 py-4 lg:py-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Reports
                </h1>
                <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stores.find((s) => s.id === selectedStore)?.name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {formatDateRangeForReports()}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters - Improved desktop layout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full sm:w-48 lg:w-52 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl z-50">
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center gap-2">
                      <span>{store.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full sm:w-48 lg:w-52 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl z-50">
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range…</SelectItem>
              </SelectContent>
            </Select>

            {/* Report Section Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white/70 backdrop-blur-sm border-gray-200 hover:border-primary/50 transition-colors gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Sections</span>
                  <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {visibleCount}/{totalCount}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-3 bg-white/95 backdrop-blur-md border-gray-200 shadow-xl"
                align="start"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">
                      Filter Sections
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => toggleAllSections(true)}
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => toggleAllSections(false)}
                      >
                        None
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {REPORT_SECTIONS.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-md transition-colors"
                        onClick={() => toggleSection(section.id)}
                      >
                        <Checkbox
                          id={section.id}
                          checked={isSectionVisible(section.id)}
                          onCheckedChange={() => toggleSection(section.id)}
                          className="pointer-events-none"
                        />
                        <label
                          htmlFor={section.id}
                          className="text-sm text-gray-700 cursor-pointer flex-1"
                        >
                          {section.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* PDF Export Button */}
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-white/70 backdrop-blur-sm border-gray-200 hover:border-primary/50 transition-colors gap-2"
              onClick={() => {
                const storeName =
                  stores.find((s) => s.id === selectedStore)?.name ||
                  "All Stores";
                exportReportsToPdf({
                  storeName,
                  dateRange: selectedDateRange,
                  visibleSections,
                  data: currentStoreData,
                });
              }}
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs sm:text-sm text-gray-500 text-center sm:text-right lg:text-right flex-shrink-0 bg-gray-100/50 px-3 py-1.5 rounded-full"
          >
            Last updated {lastUpdatedLabel}
          </motion.div>
        </motion.div>

        <div className="mt-5 rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-md p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Jump to section
              </p>
              <p className="text-xs text-gray-500">{sectionVisibilityLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {REPORT_SECTIONS.filter((section) =>
                isSectionVisible(section.id),
              ).map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-200 bg-white/80 text-xs font-medium text-gray-700 hover:border-primary/40 hover:text-primary"
                  onClick={() => {
                    const target = document.getElementById(section.id);
                    target?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={customOpen} onOpenChange={setCustomOpen}>
          <DialogContent className="sm:max-w-[560px] bg-white/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Select custom date range</DialogTitle>
            </DialogHeader>
            <div className="p-1">
              <Calendar
                mode="range"
                selected={tempRange}
                onSelect={setTempRange}
                initialFocus
                className="p-3 pointer-events-auto"
                numberOfMonths={2}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (tempRange?.from) {
                    setSelectedDateRange(tempRange);
                  }
                  setCustomOpen(false);
                }}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Content */}
      <div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-6 lg:p-8 xl:p-10"
        >
          <Accordion
            type="multiple"
            defaultValue={REPORT_SECTIONS.map((section) => section.id)}
            className="space-y-6"
          >
            {/* Customer Analytics Section - Full width on desktop */}
            {isSectionVisible("customerAnalytics") && (
              <AccordionItem
                id="customerAnalytics"
                value="customerAnalytics"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                    Customer Analytics
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <CustomerAnalyticsSection
                      data={currentStoreData.customerAnalytics}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Product Mix - Full width */}
            {isSectionVisible("productMix") && (
              <AccordionItem
                id="productMix"
                value="productMix"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                    Product Mix
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <ProductMixSection
                      selectedStore={selectedStore}
                      selectedDateRange={selectedDateRange}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {isSectionVisible("revenue") && (
              <AccordionItem
                id="revenue"
                value="revenue"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full" />
                    Revenue
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <RevenueSection data={currentStoreData.revenue} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {isSectionVisible("paymentTypes") && (
              <AccordionItem
                id="paymentTypes"
                value="paymentTypes"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                    Payment Types
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <PaymentTypesSection data={currentStoreData.paymentTypes} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {isSectionVisible("cancellations") && (
              <AccordionItem
                id="cancellations"
                value="cancellations"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full" />
                    Cancellations
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <CancellationSection data={currentStoreData.cancellations} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {isSectionVisible("downtime") && (
              <AccordionItem
                id="downtime"
                value="downtime"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full" />
                    Downtime
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <DowntimeSection />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {isSectionVisible("marketing") && (
              <AccordionItem
                id="marketing"
                value="marketing"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                    Marketing
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <MarketingSection />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {isSectionVisible("team") && (
              <AccordionItem
                id="team"
                value="team"
                className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-sm"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full" />
                    Team Performance
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-6">
                  <div className="overflow-x-auto">
                    <TeamSection />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* Empty state when no sections visible */}
          {visibleCount === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 flex flex-col items-center justify-center py-20 text-center"
            >
              <Filter className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sections selected
              </h3>
              <p className="text-gray-500 mb-4">
                Use the Sections filter to show report data
              </p>
              <Button onClick={() => toggleAllSections(true)}>
                Show All Sections
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
