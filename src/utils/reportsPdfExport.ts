import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface ReportData {
  name: string;
  revenue: {
    total: number;
    growth: number;
    breakdown: Array<{ label: string; amount: number; percentage: number }>;
  };
  customerAnalytics: {
    totalCustomers: number;
    customerGrowth: number;
    lifetimeValue: number;
    lifetimeValueGrowth: number;
    retentionRate: number;
    retentionGrowth: number;
    satisfaction: number;
    totalReviews: number;
  };
  paymentTypes: Array<{ name: string; value: number }>;
  cancellations: {
    rate: number;
    totalCancelled: number;
    reasons: Array<{ reason: string; count: number; percentage: number }>;
  };
}

interface ExportOptions {
  storeName: string;
  dateRange: DateRange | undefined;
  visibleSections: Set<string>;
  data: ReportData;
}

export const exportReportsToPdf = ({
  storeName,
  dateRange,
  visibleSections,
  data,
}: ExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Format date range
  const formatDateRange = () => {
    if (!dateRange?.from) return 'All time';
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
    }
    return format(dateRange.from, 'MMM dd, yyyy');
  };

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Lily Hall Reports', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`${storeName} • ${formatDateRange()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, pageWidth / 2, yPosition, { align: 'center' });
  doc.setTextColor(0);
  yPosition += 15;

  // Helper to add section header
  const addSectionHeader = (title: string) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50);
    doc.text(title, 14, yPosition);
    doc.setTextColor(0);
    yPosition += 8;
  };

  // Customer Analytics Section
  if (visibleSections.has('customerAnalytics')) {
    addSectionHeader('Customer Analytics');
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value', 'Change']],
      body: [
        ['Total Customers', data.customerAnalytics.totalCustomers.toLocaleString(), `+${data.customerAnalytics.customerGrowth}%`],
        ['Customer Lifetime Value', `$${data.customerAnalytics.lifetimeValue}`, `+${data.customerAnalytics.lifetimeValueGrowth}%`],
        ['Retention Rate', `${data.customerAnalytics.retentionRate}%`, `+${data.customerAnalytics.retentionGrowth}%`],
        ['Satisfaction Score', `${data.customerAnalytics.satisfaction}/5`, `${data.customerAnalytics.totalReviews} reviews`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Revenue Section
  if (visibleSections.has('revenue')) {
    addSectionHeader('Revenue');
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Category', 'Amount', 'Percentage']],
      body: [
        ['Total Revenue', `$${data.revenue.total.toLocaleString()}`, `+${data.revenue.growth}% growth`],
        ...data.revenue.breakdown.map(item => [
          item.label,
          `$${item.amount.toLocaleString()}`,
          `${item.percentage}%`,
        ]),
      ],
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Payment Types Section
  if (visibleSections.has('paymentTypes')) {
    addSectionHeader('Payment Types');
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Payment Method', 'Percentage']],
      body: data.paymentTypes.map(item => [
        item.name,
        `${item.value}%`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Cancellations Section
  if (visibleSections.has('cancellations')) {
    addSectionHeader('Cancellations');
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: [
        ['Cancellation Rate', `${data.cancellations.rate}%`],
        ['Total Cancelled', data.cancellations.totalCancelled.toString()],
      ],
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;

    if (data.cancellations.reasons.length > 0) {
      autoTable(doc, {
        startY: yPosition,
        head: [['Reason', 'Count', 'Percentage']],
        body: data.cancellations.reasons.map(item => [
          item.reason,
          item.count.toString(),
          `${item.percentage}%`,
        ]),
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68], textColor: 255 },
        margin: { left: 14, right: 14 },
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
  }

  // Add footer on each page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Lily Hall Pensacola',
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Generate filename
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-');
  const filename = `lily-hall-report-${storeSlug}-${dateStr}.pdf`;

  doc.save(filename);
};
