"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";
import EditableLabel from "../../app/labels/EditableLabel";
import { getCustomers, Customer } from "@/lib/api/customers";
import { format } from "date-fns";

/* ================= CONSTANTS ================= */

const ALL_COLUMNS = [
  { key: "customerId", label: "Customer ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "orders", label: "Orders", sortable: true },
  { key: "spend", label: "Total Spend", sortable: true },
  { key: "region", label: "Region", sortable: false },
  { key: "joinedAt", label: "Joined", sortable: true },
] as const;

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

function getPageNumbers(current: number, total: number, max = 5) {
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + max - 1);

  if (end - start < max - 1) {
    start = Math.max(1, end - max + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const DEFAULT_COLUMNS = Object.fromEntries(
  ALL_COLUMNS.map((c) => [c.key, true]),
);

/* ================= COMPONENT ================= */

export default function CustomersTable() {
  const [data, setData] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Customer>("spend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [regionFilter, setRegionFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<number | "">("");

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);

  /* ================= FETCH ================= */

  useEffect(() => {
    getCustomers({
      page,
      pageSize,
      search,
      sortKey,
      sortDir,
      region: regionFilter,
      month: monthFilter, // 👈 backend should filter joinedAt month
    }).then((res) => {
      setData(res.data);
      setTotal(res.total);
    });
  }, [page, pageSize, search, sortKey, sortDir, regionFilter, monthFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, regionFilter, monthFilter]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function resetFilters() {
    setSearch("");
    setRegionFilter("");
    setMonthFilter("");
    setVisibleColumns({ ...DEFAULT_COLUMNS });

    setPage(1);
  }

  /* ================= UI ================= */

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-medium">
          <EditableLabel labelKey="table" />
        </CardTitle>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Column Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ALL_COLUMNS.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns[col.key]}
                  onCheckedChange={(v) =>
                    setVisibleColumns((p) => ({ ...p, [col.key]: v }))
                  }
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Region */}
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

          {/* Month */}
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
              {ALL_COLUMNS.map(
                (col) =>
                  visibleColumns[col.key] && (
                    <TableHead key={col.key}>
                      {col.sortable ? (
                        <div
                          onClick={() => {
                            setSortKey(col.key);
                            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                          }}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          {col.label}
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      ) : (
                        col.label
                      )}
                    </TableHead>
                  ),
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length ? (
              data.map((row) => (
                <TableRow key={row.customerId}>
                  {visibleColumns.customerId && (
                    <TableCell>{row.customerId}</TableCell>
                  )}
                  {visibleColumns.name && <TableCell>{row.name}</TableCell>}
                  {visibleColumns.orders && <TableCell>{row.orders}</TableCell>}
                  {visibleColumns.spend && <TableCell>${row.spend}</TableCell>}
                  {visibleColumns.region && <TableCell>{row.region}</TableCell>}
                  {visibleColumns.joinedAt && (
                    <TableCell>
                      {format(new Date(row.joinedAt), "dd-MMM-yyyy")}
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
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

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
