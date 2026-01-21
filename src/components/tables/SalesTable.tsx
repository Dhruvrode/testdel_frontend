"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Search,
} from "lucide-react";
import EditableLabel from "../../app/labels/EditableLabel";
import { format } from "date-fns";
import { getSales } from "@/lib/api/dashboard";

type Status = 0 | 1 | 2; // 0=Pending, 1=Completed, 2=Cancelled

type Sale = {
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  status: Status;
  region: string;
};

const STATUS_META: Record<Status, { label: string; className: string }> = {
  0: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  1: {
    label: "Completed",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  2: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const ALL_COLUMNS = [
  { key: "orderId", label: "Order ID", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "amount", label: "Amount", sortable: true },
  { key: "region", label: "Region", sortable: false },
  { key: "status", label: "Status", sortable: false },
] as const;

function formatDate(date: string) {
  return format(new Date(date), "dd-MMM-yyyy");
}

function getPageNumbers(current: number, total: number, max = 5) {
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + max - 1);

  if (end - start < max - 1) {
    start = Math.max(1, end - max + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function SalesTable() {
  const [data, setData] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Sale>("amount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [visibleColumns, setVisibleColumns] = useState(
    Object.fromEntries(ALL_COLUMNS.map((c) => [c.key, true])),
  );

  const [monthFilter, setMonthFilter] = useState<number | "">("");

  const REGIONS = ["North America", "Europe", "Asia", "Middle East"];
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  useEffect(() => {
    getSales({
      page,
      pageSize,
      search,
      sortKey,
      sortDir,
      status: statusFilter,
      region: regionFilter,
      month: monthFilter,
    }).then((res) => {
      setData(res.data);
      setTotal(res.total);
    });
  }, [
    page,
    pageSize,
    search,
    sortKey,
    sortDir,
    statusFilter,
    regionFilter,
    monthFilter,
  ]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, regionFilter, monthFilter]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setMonthFilter("");
    setRegionFilter("");
    setPage(1);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-medium">
          <EditableLabel labelKey="table" />
        </CardTitle>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search order or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Column Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={statusFilter === ""}
                onCheckedChange={() => setStatusFilter("")}
              >
                All
              </DropdownMenuCheckboxItem>

              {Object.entries(STATUS_META).map(([key, meta]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={statusFilter === Number(key)}
                  onCheckedChange={() => setStatusFilter(Number(key) as Status)}
                >
                  {meta.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Region
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={regionFilter === ""}
                onCheckedChange={() => setRegionFilter("")}
              >
                All
              </DropdownMenuCheckboxItem>

              {REGIONS.map((r) => (
                <DropdownMenuCheckboxItem
                  key={r}
                  checked={regionFilter === r}
                  onCheckedChange={() => setRegionFilter(r)}
                >
                  {r}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Month
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={monthFilter === ""}
                onCheckedChange={() => setMonthFilter("")}
              >
                All
              </DropdownMenuCheckboxItem>

              {MONTHS.map((m, i) => (
                <DropdownMenuCheckboxItem
                  key={m}
                  checked={monthFilter === i}
                  onCheckedChange={() => setMonthFilter(i)}
                >
                  {m}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {ALL_COLUMNS.map((col) =>
                visibleColumns[col.key] ? (
                  <TableHead key={col.key}>
                    {col.sortable ? (
                      <div
                        onClick={() => {
                          setSortKey(col.key);
                          setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                        }}
                        className="flex items-center gap-1 cursor-pointer select-none text-sm font-medium"
                      >
                        {col.label}
                        <ArrowUpDown className="h-4 w-4 " />
                      </div>
                    ) : (
                      <span>{col.label}</span>
                    )}
                  </TableHead>
                ) : null,
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.orderId}>
                  {visibleColumns.orderId && (
                    <TableCell>{row.orderId}</TableCell>
                  )}
                  {visibleColumns.customer && (
                    <TableCell>{row.customer}</TableCell>
                  )}
                  {visibleColumns.date && (
                    <TableCell>{formatDate(row.date)}</TableCell>
                  )}

                  {visibleColumns.amount && (
                    <TableCell className="font-medium">${row.amount}</TableCell>
                  )}
                  {visibleColumns.region && (
                    <TableCell className="font-medium">{row.region}</TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>
                      <Badge className={STATUS_META[row.status].className}>
                        {STATUS_META[row.status].label}
                      </Badge>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={ALL_COLUMNS.length}
                  className="h-24 text-center"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <div className="flex items-center gap-1">
          {/* Prev */}
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {getPageNumbers(page, totalPages).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "default" : "outline"}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}

          {/* Next */}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
