import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import autoTable from "jspdf-autotable";
import { ReportsData } from "@/hooks/useReportsData";

interface ExportOptions {
  storeName: string;
  dateRange: DateRange | undefined;
  visibleSections: Set<string>;
  data: ReportsData;
}

export const exportReportsToPdf = async ({
  storeName,
  dateRange,
  visibleSections,
  data,
}: ExportOptions) => {
  // Dynamically import jsPDF to reduce main bundle size
  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule.default;

  const doc = new jsPDF();
  // jspdf-autotable augments the doc instance with `lastAutoTable` at runtime,
  // and getNumberOfPages exists at runtime but isn't in jsPDF's bundled types;
  // narrow explicitly (not `any`).
  type DocWithAutoTable = typeof doc & {
    lastAutoTable: { finalY: number };
    getNumberOfPages: () => number;
  };
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Format date range
  const formatDateRange = () => {
    if (!dateRange?.from) return "All time";
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    return format(dateRange.from, "MMM dd, yyyy");
  };

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Pensacola Beach Resort Reports", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`${storeName} • ${formatDateRange()}`, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 5;
  doc.text(
    `Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );
  doc.setTextColor(0);
  yPosition += 15;

  // Helper to add section header
  const addSectionHeader = (title: string) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text(title, 14, yPosition);
    doc.setTextColor(0);
    yPosition += 10;
  };

  // Check if section is visible
  const isSectionVisible = (sectionId: string) => {
    return visibleSections.has(sectionId);
  };

  // Customer Analytics Section
  if (isSectionVisible("customerAnalytics") && data.customerAnalytics.length > 0) {
    addSectionHeader("Customer Analytics");

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: data.customerAnalytics.map((item) => [item.metric, item.value.toLocaleString()]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as DocWithAutoTable).lastAutoTable.finalY + 15;
  }

  // Revenue Section
  if (isSectionVisible("revenue") && data.revenue.length > 0) {
    addSectionHeader("Revenue");

    autoTable(doc, {
      startY: yPosition,
      head: [["Period", "Total Revenue", "Orders", "Avg Order Value"]],
      body: data.revenue.map((item) => [
        item.period,
        `$${item.total_revenue.toLocaleString()}`,
        item.total_orders.toLocaleString(),
        `$${item.average_order_value.toFixed(2)}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as DocWithAutoTable).lastAutoTable.finalY + 15;
  }

  // Payment Types Section
  if (isSectionVisible("paymentTypes") && data.paymentTypes.length > 0) {
    addSectionHeader("Payment Types");

    autoTable(doc, {
      startY: yPosition,
      head: [["Payment Method", "Order Count"]],
      body: data.paymentTypes.map((item) => [item.payment_method, item.order_count.toString()]),
      theme: "striped",
      headStyles: { fillColor: [245, 158, 11], textColor: 255 },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as DocWithAutoTable).lastAutoTable.finalY + 15;
  }

  // Product Mix Section
  if (isSectionVisible("productMix") && data.productMix.length > 0) {
    addSectionHeader("Product Mix");

    autoTable(doc, {
      startY: yPosition,
      head: [["Item", "Qty Sold", "Total Sales"]],
      body: data.productMix.map((item) => [
        item.item_name,
        item.quantity_sold.toLocaleString(),
        `$${item.total_sales.toFixed(2)}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [239, 68, 68], textColor: 255 },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as DocWithAutoTable).lastAutoTable.finalY + 15;
  }

  // Add footer on each page
  const pageCount = (doc as DocWithAutoTable).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
    doc.text(
      "Pensacola Beach Resort",
      14,
      doc.internal.pageSize.getHeight() - 10,
    );
  }

  // Generate filename
  const dateStr = format(new Date(), "yyyy-MM-dd");
  const storeSlug = storeName.toLowerCase().replace(/\s+/g, "-");
  const filename = `lily-hall-report-${storeSlug}-${dateStr}.pdf`;

  doc.save(filename);
};
