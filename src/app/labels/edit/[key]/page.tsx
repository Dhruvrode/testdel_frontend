// app/labels/edit/[key]/page.tsx
"use client";

import { useState, useMemo, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronRight,
  FileText,
  Search,
  TrendingUp,
  ArrowLeft,
  Save,
  ChevronLeft,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLabels } from "@/app/context/Labelcontext";
import { toast } from "react-toastify";

export default function EditLabelPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key: labelKey } = use(params);
  const router = useRouter();
  const { labels, updateLabel } = useLabels();
  const label = labels[labelKey];

  const [value, setValue] = useState(label?.value || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  const uniquePages = useMemo(
    () => (label ? new Set(label.usages.map((u) => u.page)) : new Set()),
    [label],
  );

  useEffect(() => {
    if (label) {
      setValue(label.value);
    }
  }, [label]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const topPages = useMemo(() => {
    if (!label) return [];
    const pageCount = new Map<string, number>();
    label.usages.forEach((u) => {
      pageCount.set(u.page, (pageCount.get(u.page) || 0) + 1);
    });
    return Array.from(pageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [label]);

  const { filteredUsages, filteredPages } = useMemo(() => {
    if (!label) return { filteredUsages: [], filteredPages: [] };

    const query = searchQuery.trim().toLowerCase();
    const usages = query
      ? label.usages.filter(
          (u) =>
            u.page.toLowerCase().includes(query) ||
            u.component.toLowerCase().includes(query),
        )
      : label.usages;

    const pages = Array.from(new Set(usages.map((u) => u.page))).sort();
    return { filteredUsages: usages, filteredPages: pages };
  }, [label, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPages = filteredPages.slice(startIndex, endIndex);

  if (!label) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Label not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (label.usages.length > 500 && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    toast.success(
      `Label updated successfully • ${label.usages.length} locations updated`,
    );
    updateLabel(labelKey, value);
    router.back();
  };

  const togglePageExpand = (page: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(page)) {
      newExpanded.delete(page);
    } else {
      newExpanded.add(page);
    }
    setExpandedPages(newExpanded);
  };

  const isChanged = value.trim() && value !== label.value;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Global Label</h1>
                <p className="text-sm text-muted-foreground">
                  Key:{" "}
                  <code className="bg-muted px-2 py-0.5 rounded text-xs">
                    {labelKey}
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!isChanged}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Edit & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Edit Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Label Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter label text..."
                  className="font-medium text-lg"
                />
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-900 dark:text-orange-100">
                Global Change Impact
              </AlertTitle>
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                This will update{" "}
                <strong className="text-orange-900 dark:text-orange-100">
                  {label.usages.length.toLocaleString()}
                </strong>{" "}
                locations across{" "}
                <strong className="text-orange-900 dark:text-orange-100">
                  {uniquePages.size}
                </strong>{" "}
                pages
              </AlertDescription>
            </Alert>

            {/* Confirmation for very large changes */}
            {showConfirm && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-900 dark:text-red-100">
                  Confirm Massive Change
                </AlertTitle>
                <AlertDescription className="text-red-800 dark:text-red-200 space-y-3">
                  <p>
                    You're about to modify{" "}
                    <strong>{label.usages.length.toLocaleString()}</strong>{" "}
                    locations. This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        updateLabel(labelKey, value);
                        router.back();
                      }}
                    >
                      Yes, Update All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Distribution Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Top Affected Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPages.map(([page, count]) => (
                    <div
                      key={page}
                      className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/50"
                    >
                      <span className="text-muted-foreground truncate flex-1">
                        {page}
                      </span>
                      <span className="font-medium ml-2 bg-primary/10 px-2 py-0.5 rounded text-xs">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Full List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      All Affected Locations (
                      {label.usages.length.toLocaleString()})
                    </CardTitle>

                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pages or components..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg">
                  {filteredPages.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground">
                      No matches found
                    </div>
                  ) : (
                    <>
                      {paginatedPages.map((page) => {
                        const pageUsages = filteredUsages.filter(
                          (u) => u.page === page,
                        );
                        const isExpanded = expandedPages.has(page);

                        return (
                          <div key={page} className="border-b last:border-b-0">
                            <button
                              onClick={() => togglePageExpand(page)}
                              className="w-full bg-muted/30 px-4 py-3 font-medium text-sm flex items-center gap-3 hover:bg-muted transition-colors text-left"
                            >
                              <ChevronRight
                                className={`h-4 w-4 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                              <FileText className="h-4 w-4" />
                              <span className="flex-1 truncate">{page}</span>
                              <span className="text-xs bg-background px-2 py-1 rounded border font-medium">
                                {pageUsages.length} components
                              </span>
                            </button>

                            {isExpanded && (
                              <ul className="divide-y bg-background">
                                {pageUsages.map((u, i) => (
                                  <li
                                    key={i}
                                    className="px-8 py-2.5 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
                                  >
                                    {u.component}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}