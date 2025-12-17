import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { getProductMixData, groupByCategory, ProductMixItem, SalesChannel, Daypart } from "@/data/productMixData";
import { Download, Filter, ListFilter } from "lucide-react";

interface ProductMixSectionProps {
  selectedStore: string;
  selectedDateRange?: DateRange;
}

type GroupBy = "item" | "category";

type SortKey = "name" | "category" | "quantity" | "grossSales" | "netSales" | "%" | "avgPrice";

export const ProductMixSection: React.FC<ProductMixSectionProps> = ({ selectedStore, selectedDateRange }) => {
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("item");
  const [topN, setTopN] = useState<string>("25");
  const [channels, setChannels] = useState<Record<SalesChannel, boolean>>({ "Dine-in": true, Takeout: true, Delivery: true });
  const [dayparts, setDayparts] = useState<Record<Daypart, boolean>>({ Breakfast: true, Lunch: true, Dinner: true, "Late Night": true });
  const [includeModifiers, setIncludeModifiers] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("quantity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const data = useMemo(() => getProductMixData(selectedStore || "all", selectedDateRange, includeModifiers), [selectedStore, selectedDateRange, includeModifiers]);

  const filtered = useMemo(() => {
    const activeChannels = (Object.keys(channels) as SalesChannel[]).filter((c) => channels[c]);
    const activeDayparts = (Object.keys(dayparts) as Daypart[]).filter((d) => dayparts[d]);
    return data
      .filter((i) => activeChannels.includes(i.salesChannel))
      .filter((i) => activeDayparts.includes(i.daypart))
      .filter((i) => (search ? i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()) : true));
  }, [data, channels, dayparts, search]);

  const totalNet = useMemo(() => filtered.reduce((sum, it) => sum + it.netSales, 0), [filtered]);

  const rows = useMemo(() => {
    if (groupBy === "category") {
      const grouped = groupByCategory(filtered).map((g) => ({
        key: g.category,
        name: g.category,
        category: g.category,
        quantity: g.quantity,
        grossSales: g.grossSales,
        netSales: g.netSales,
        avgPrice: g.grossSales / Math.max(1, g.quantity),
        percent: totalNet ? (g.netSales / totalNet) * 100 : 0,
        imageUrl: undefined,
      }));
      return grouped;
    }

    const items = filtered.map((i) => ({
      key: i.id,
      name: i.name,
      category: i.category,
      quantity: i.quantity,
      grossSales: i.grossSales,
      netSales: i.netSales,
      avgPrice: i.avgPrice,
      percent: totalNet ? (i.netSales / totalNet) * 100 : 0,
      imageUrl: i.imageUrl,
    }));
    return items;
  }, [filtered, groupBy, totalNet]);

  const sorted = useMemo(() => {
    const r = [...rows].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "%") return (a.percent - b.percent) * dir;
      if (typeof a[sortKey] === "number" && typeof b[sortKey] === "number") return ((a[sortKey] as number) - (b[sortKey] as number)) * dir;
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * dir;
    });
    const n = topN === "All" ? r.length : parseInt(topN, 10);
    return r.slice(0, n);
  }, [rows, sortKey, sortDir, topN]);

  function toggleChannel(ch: SalesChannel) {
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }));
  }
  function toggleDaypart(dp: Daypart) {
    setDayparts((prev) => ({ ...prev, [dp]: !prev[dp] }));
  }

  function onHeaderClick(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function exportCSV() {
    const headers = ["Name","Category","Quantity","Gross Sales","Net Sales","Avg Price","% of Net Sales"];
    const lines = sorted.map((r) => [
      r.name,
      r.category,
      r.quantity,
      r.grossSales.toFixed(2),
      r.netSales.toFixed(2),
      r.avgPrice.toFixed(2),
      r.percent.toFixed(2) + "%",
    ].join(","));
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `product-mix-${selectedStore || "all"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <CardTitle>Product Mix</CardTitle>
            <Button onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <Input placeholder="Search items or categories" value={search} onChange={(e) => setSearch(e.target.value)} className="w-40 sm:w-64" />
              <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Group by" /></SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="item">Group: Item</SelectItem>
                  <SelectItem value="category">Group: Category</SelectItem>
                </SelectContent>
              </Select>
              <Select value={topN} onValueChange={setTopN}>
                <SelectTrigger className="w-28"><SelectValue placeholder="Top" /></SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="25">Top 25</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                  <SelectItem value="All">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2"><ListFilter className="h-4 w-4" /> Channels</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
                  <DropdownMenuLabel>Sales Channels</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(Object.keys(channels) as SalesChannel[]).map((c) => (
                    <DropdownMenuCheckboxItem key={c} checked={channels[c]} onCheckedChange={() => toggleChannel(c)}>
                      {c}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Dayparts</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
                  <DropdownMenuLabel>Dayparts</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(Object.keys(dayparts) as Daypart[]).map((d) => (
                    <DropdownMenuCheckboxItem key={d} checked={dayparts[d]} onCheckedChange={() => toggleDaypart(d)}>
                      {d}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2 px-2">
                <Checkbox id="modifiers" checked={includeModifiers} onCheckedChange={(v) => setIncludeModifiers(v === true)} className="h-4 w-4" />
                <label htmlFor="modifiers" className="text-sm text-muted-foreground">Include modifiers</label>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => onHeaderClick("name")} className="cursor-pointer select-none">{groupBy === "item" ? "Item" : "Category"}</TableHead>
                {groupBy === "item" && <TableHead onClick={() => onHeaderClick("category")} className="cursor-pointer select-none">Category</TableHead>}
                <TableHead onClick={() => onHeaderClick("quantity")} className="cursor-pointer select-none">Qty Sold</TableHead>
                <TableHead onClick={() => onHeaderClick("grossSales")} className="cursor-pointer select-none">Gross Sales</TableHead>
                <TableHead onClick={() => onHeaderClick("netSales")} className="cursor-pointer select-none">Net Sales</TableHead>
                <TableHead onClick={() => onHeaderClick("avgPrice")} className="cursor-pointer select-none">Avg Price</TableHead>
                <TableHead onClick={() => onHeaderClick("%") } className="cursor-pointer select-none">% of Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((r) => (
                <TableRow key={r.key}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {groupBy === "item" ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={r.imageUrl} alt={`${r.name} photo`} />
                          <AvatarFallback>{String(r.name).slice(0,1)}</AvatarFallback>
                        </Avatar>
                      ) : null}
                      <span>{r.name}</span>
                    </div>
                  </TableCell>
                  {groupBy === "item" && <TableCell>{r.category}</TableCell>}
                  <TableCell>{r.quantity.toLocaleString()}</TableCell>
                  <TableCell>${r.grossSales.toFixed(2)}</TableCell>
                  <TableCell>${r.netSales.toFixed(2)}</TableCell>
                  <TableCell>${r.avgPrice.toFixed(2)}</TableCell>
                  <TableCell>{r.percent.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Showing {sorted.length} of {rows.length} {groupBy === "item" ? "items" : "categories"}. Total Net Sales: ${totalNet.toFixed(2)}
            </TableCaption>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
