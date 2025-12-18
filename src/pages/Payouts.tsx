
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, File, DollarSign, Filter, FileText, FileSpreadsheet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';
import { StoreLogo } from '@/components/stores/StoreLogo';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';
import { useFilters } from '@/contexts/FilterContext';
import { format } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';

const financialData = [
  {
    id: 1,
    store: 'Brother Fox',
    date: 'May 7, 2021 11:50AM',
    status: 'Succeeded',
    subtotal: '$6790.89',
    serviceFee: '$679.09',
    commissions: '$679.09',
    net: '$6111.80',
    storeIcon: '🦊',
    bgColor: 'bg-amber-600',
    customLogo: '/images/stores/brother-fox-logo.jpg'
  },
  {
    id: 2,
    store: 'Brother Fox',
    date: 'May 6, 2021 2:30PM',
    status: 'Pending',
    subtotal: '$4523.45',
    serviceFee: '$452.35',
    commissions: '$452.35',
    net: '$4071.10',
    storeIcon: '🦊',
    bgColor: 'bg-amber-600',
    customLogo: '/images/stores/brother-fox-logo.jpg'
  },
  {
    id: 3,
    store: 'Sister Hen',
    date: 'May 6, 2021 10:15AM',
    status: 'Failed',
    subtotal: '$2890.67',
    serviceFee: '$289.07',
    commissions: '$289.07',
    net: '$2601.60',
    storeIcon: '🐔',
    bgColor: 'bg-rose-600',
    customLogo: '/images/stores/sister-hen-logo.jpg'
  },
  {
    id: 4,
    store: 'Cousin Wolf',
    date: 'May 5, 2021 4:45PM',
    status: 'Succeeded',
    subtotal: '$5234.12',
    serviceFee: '$523.41',
    commissions: '$523.41',
    net: '$4710.71',
    storeIcon: '🐺',
    bgColor: 'bg-slate-700',
    customLogo: '/images/stores/cousin-wolf-logo.webp'
  },
  {
    id: 5,
    store: 'Sister Hen',
    date: 'May 5, 2021 1:20PM',
    status: 'Succeeded',
    subtotal: '$3456.78',
    serviceFee: '$345.68',
    commissions: '$345.68',
    net: '$3111.10',
    storeIcon: '🐔',
    bgColor: 'bg-rose-600',
    customLogo: '/images/stores/sister-hen-logo.jpg'
  },
  {
    id: 6,
    store: 'Cousin Wolf',
    date: 'May 4, 2021 11:00AM',
    status: 'Pending',
    subtotal: '$7890.34',
    serviceFee: '$789.03',
    commissions: '$789.03',
    net: '$7101.31',
    storeIcon: '🐺',
    bgColor: 'bg-slate-700',
    customLogo: '/images/stores/cousin-wolf-logo.webp'
  }
];

export const Payouts = () => {
  const { stores: allStores, getStoresByResort } = useStores();
  const { currentResort } = useResort();
  const { toast } = useToast();
  const { selectedStore, setSelectedStore, selectedDateRange, setSelectedDateRange } = useFilters();

  // Get all stores regardless of resort assignment and remove duplicates
  // This ensures all stores are available in dropdowns without duplicates
  const availableStores = allStores.filter((store, index, self) => 
    index === self.findIndex(s => s.id === store.id)
  );

  // Transform stores to match dropdown format
  const stores = [
    { id: 'all', name: 'All Stores' },
    ...availableStores.map(store => ({
      id: store.id.toString(),
      name: store.name
    }))
  ];

  // Log filter changes for debugging
  useEffect(() => {
    console.log('Payouts filters changed:', { selectedStore, selectedDateRange });
  }, [selectedStore, selectedDateRange]);

  // Format date range for display
  const formatDateRangeForPayouts = () => {
    if (!selectedDateRange?.from) return 'No date selected';
    if (selectedDateRange.from && selectedDateRange.to) {
      return `${format(selectedDateRange.from, 'MMM dd, yyyy')} - ${format(selectedDateRange.to, 'MMM dd, yyyy')}`;
    }
    return format(selectedDateRange.from, 'MMM dd, yyyy');
  };

  const exportToCsv = () => {
    const filteredData = selectedStore === 'all' ? financialData : 
      financialData.filter(item => item.store === selectedStore);

    const headers = ['Store', 'Date', 'Status', 'Subtotal', 'Service Fee', 'Commissions', 'NET'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(item => 
        [
          `"${item.store}"`,
          `"${item.date}"`,
          `"${item.status}"`,
          `"${item.subtotal}"`,
          `"${item.serviceFee}"`,
          `"${item.commissions}"`,
          `"${item.net}"`
        ].join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const storeFilter = selectedStore === 'all' ? 'all-stores' : selectedStore.toLowerCase().replace(/\s+/g, '-');
    const dateFilter = formatDateRangeForPayouts().toLowerCase().replace(/\s+/g, '-');
    link.setAttribute('download', `payouts-${storeFilter}-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful!',
      description: `Exported ${filteredData.length} payout records as CSV file.`,
    });
  };

  const exportToPdf = () => {
    try {
      console.log("PDF export triggered - starting download...");
      const filteredData = selectedStore === 'all' ? financialData : 
        financialData.filter(item => item.store === selectedStore);

      // Simple approach: create a text-based content for PDF
      const reportContent = [
        'PAYOUT REPORT',
        '=============',
        '',
        `Store Filter: ${selectedStore === 'all' ? 'All Stores' : selectedStore}`,
        `Date Range: ${formatDateRangeForPayouts()}`,
        `Generated: ${new Date().toLocaleDateString()}`,
        '',
        'PAYOUT DETAILS:',
        '---------------',
        ...filteredData.map((item, index) => 
          `${index + 1}. ${item.store}\n   Date: ${item.date}\n   Status: ${item.status}\n   NET: ${item.net}\n`
        )
      ].join('\n');

      // Create PDF using basic jsPDF
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(reportContent, 170);
      doc.text(lines, 20, 20);
      
      // Download the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `payouts-report-${timestamp}.pdf`;
      doc.save(filename);

      toast({
        title: 'PDF Downloaded!',
        description: `Successfully exported ${filteredData.length} payout records.`,
      });

    } catch (error) {
      console.error("PDF failed, switching to CSV:", error);
      // If PDF fails, automatically try CSV
      exportToCsv();
    }
  };

  const exportToExcel = () => {
    const filteredData = selectedStore === 'all' ? financialData : 
      financialData.filter(item => item.store === selectedStore);

    // Create Excel-like CSV with enhanced formatting
    const headers = ['Store', 'Date', 'Status', 'Subtotal', 'Service Fee', 'Commissions', 'NET', 'Store Logo'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(item => 
        [
          `"${item.store}"`,
          `"${item.date}"`,
          `"${item.status}"`,
          item.subtotal.replace('$', ''),
          item.serviceFee.replace('$', ''),
          item.commissions.replace('$', ''),
          item.net.replace('$', ''),
          `"${item.customLogo || 'No logo'}"`
        ].join(',')
      ),
      '', // Empty row
      'SUMMARY', // Summary section
      `Total Records: ${filteredData.length}`,
      `Date Range: ${formatDateRangeForPayouts()}`,
      `Export Date: ${new Date().toLocaleDateString()}`,
      `Filter Applied: ${selectedStore === 'all' ? 'All Stores' : selectedStore}`
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const storeFilter = selectedStore === 'all' ? 'all-stores' : selectedStore.toLowerCase().replace(/\s+/g, '-');
    const dateFilter = formatDateRangeForPayouts().toLowerCase().replace(/\s+/g, '-');
    link.setAttribute('download', `payouts-excel-${storeFilter}-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Excel Export Successful!',
      description: `Exported ${filteredData.length} records in Excel-compatible format.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Succeeded':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Succeeded</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⏳ Pending</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">✗ Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filter data based on selected store
  const filteredData = selectedStore === 'all' 
    ? financialData 
    : financialData.filter(item => {
        const selectedStoreName = stores.find(s => s.id === selectedStore)?.name;
        return item.store === selectedStoreName;
      });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payouts</h1>
              <p className="text-sm text-gray-600">Track payouts and financial performance</p>
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
              <strong>Commission Structure:</strong> A 10% service fee is automatically added to customer orders and deducted from your payouts. NET amount reflects your earnings after commission.
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
                    <SelectItem key={store.id} value={store.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span>{store.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64">
              <DateRangePicker value={selectedDateRange} onChange={setSelectedDateRange} />
            </div>
          </div>

          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
            Last updated on Dec 28, 2021
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="p-4 sm:p-6">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Payout Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Store</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Subtotal</TableHead>
                      <TableHead className="font-semibold">Service Fee</TableHead>
                      <TableHead className="font-semibold">Commission</TableHead>
                      <TableHead className="font-semibold">NET</TableHead>
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
                        <TableCell className="text-gray-600">{item.date}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="font-medium">{item.subtotal}</TableCell>
                        <TableCell className="text-orange-600">{item.serviceFee}</TableCell>
                        <TableCell className="text-red-600">{item.commissions}</TableCell>
                        <TableCell className="font-bold text-green-600">{item.net}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {filteredData.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <StoreLogo
                        logo={item.storeIcon}
                        customLogo={item.customLogo}
                        bgColor={item.bgColor}
                        size="md"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.store}</h3>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Subtotal</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{item.subtotal}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-orange-600 uppercase tracking-wide">Service Fee</p>
                      <p className="text-sm text-orange-600 mt-1">{item.serviceFee}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-red-600 uppercase tracking-wide">Commission</p>
                      <p className="text-sm text-red-600 mt-1">{item.commissions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-green-600 uppercase tracking-wide">Net</p>
                      <p className="text-sm font-bold text-green-600 mt-1">{item.net}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
            <span className="text-sm text-gray-600">
              Rows per page: 10
            </span>
            <span className="text-sm text-gray-600">
              1-{filteredData.length} of {filteredData.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
