"use client";

import { useState, useMemo } from "react";
import {
  Pencil,
  AlertCircle,
  ChevronRight,
  FileText,
  Search,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLabels } from "@/app/context/Labelcontext";
import { toast } from "react-toastify";

type Props = {
  labelKey: string;
};

//  Threshold for switching to full-page view
const LARGE_CHANGE_THRESHOLD = 5;

export default function EditableLabel({ labelKey }: Props) {
  const router = useRouter();
  const { labels, updateLabel } = useLabels();
  const label = labels[labelKey];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [pageLimit, setPageLimit] = useState(10);
  const ITEMS_PER_PAGE = 10;

  const uniquePages = useMemo(
    () => (label ? new Set(label.usages.map((u) => u.page)) : new Set()),
    [label],
  );

  const topPages = useMemo(() => {
    if (!label) return [];
    const pageCount = new Map<string, number>();
    label.usages.forEach((u) => {
      pageCount.set(u.page, (pageCount.get(u.page) || 0) + 1);
    });
    return Array.from(pageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [label]);

  const { filteredUsages, filteredPages } = useMemo(() => {
    if (!label || !showDetails)
      return { filteredUsages: [], filteredPages: [] };

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
  }, [label, searchQuery, showDetails]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && label) {
      setValue(label.value);
      setSearchQuery("");
      setShowConfirm(false);
      setShowDetails(false);
      setExpandedPages(new Set());
      setPageLimit(10);
    }
  };

  if (!label) {
    return <span className="text-sm">Loading label</span>;
  }

  //  Redirect to full-page view for large changes
  const isLargeChange = label.usages.length >= LARGE_CHANGE_THRESHOLD;

  const handleClick = () => {
    if (isLargeChange) {
      // Open dedicated page instead of modal
      router.push(`/labels/edit/${labelKey}`);
    } else {
      handleOpenChange(true);
    }
  };

  const handleSave = () => {
    toast.success(`Label updated successfully`, {
      description: `${label.usages.length} locations updated`,
    });
    updateLabel(labelKey, value);
    setOpen(false);
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
  const visiblePages = filteredPages.slice(0, pageLimit);
  const hasMorePages = filteredPages.length > pageLimit;

  return (
    <>
      {/* Hover to edit */}
      <span
        className="group inline-flex items-center gap-1 cursor-pointer"
        onClick={handleClick}
      >
        {label.value}
        <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
      </span>

      {/* Edit Modal - Only for small changes */}
      {!isLargeChange && (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Edit Label</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Key:{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  {labelKey}
                </code>
              </p>
            </DialogHeader>

            <div className="space-y-6 overflow-y-auto flex-1">
              {/* Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Label Text</label>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter label text..."
                  className="font-medium"
                />
              </div>

              {/* Impact Summary */}
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-900 dark:text-orange-100">
                  Global Change
                </AlertTitle>
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  This will update{" "}
                  <strong className="text-orange-900 dark:text-orange-100">
                    {label.usages.length.toLocaleString()}
                  </strong>{" "}
                  {label.usages.length === 1 ? "location" : "locations"} across{" "}
                  <strong className="text-orange-900 dark:text-orange-100">
                    {uniquePages.size}
                  </strong>{" "}
                  {uniquePages.size === 1 ? "page" : "pages"}
                </AlertDescription>
              </Alert>

              {/* Distribution Stats */}
              {label.usages.length > 20 && !showDetails && (
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Usage Distribution
                  </div>
                  <div className="space-y-2">
                    {topPages.map(([page, count]) => (
                      <div
                        key={page}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground truncate flex-1">
                          {page}
                        </span>
                        <span className="font-medium ml-2">{count}</span>
                      </div>
                    ))}
                    {uniquePages.size > 5 && (
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        + {uniquePages.size - 5} more pages
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Toggle Details */}
              {!showDetails ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowDetails(true)}
                >
                  View All Affected Locations
                </Button>
              ) : (
                <div className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pages or components..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>

                  {/* Paginated List */}
                  <div className="border rounded-lg max-h-96 overflow-y-auto">
                    {filteredPages.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No matches found
                      </div>
                    ) : (
                      <>
                        {visiblePages.map((page) => {
                          const pageUsages = filteredUsages.filter(
                            (u) => u.page === page,
                          );
                          const isExpanded = expandedPages.has(page);

                          return (
                            <div
                              key={page}
                              className="border-b last:border-b-0"
                            >
                              <button
                                onClick={() => togglePageExpand(page)}
                                className="w-full bg-muted/50 px-3 py-2 font-medium text-sm flex items-center gap-2 hover:bg-muted transition-colors text-left"
                              >
                                <ChevronRight
                                  className={`h-3 w-3 transition-transform ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                                <FileText className="h-4 w-4" />
                                <span className="flex-1 truncate">{page}</span>
                                <span className="text-xs bg-background px-2 py-0.5 rounded border">
                                  {pageUsages.length}
                                </span>
                              </button>

                              {isExpanded && (
                                <ul className="divide-y max-h-60 overflow-y-auto bg-background">
                                  {pageUsages.slice(0, 20).map((u, i) => (
                                    <li
                                      key={i}
                                      className="px-6 py-2 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
                                    >
                                      {u.component}
                                    </li>
                                  ))}
                                  {pageUsages.length > 20 && (
                                    <li className="px-6 py-2 text-xs text-muted-foreground italic bg-muted/20">
                                      + {pageUsages.length - 20} more
                                      components...
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          );
                        })}

                        {hasMorePages && (
                          <div className="p-3 text-center border-t bg-muted/20">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setPageLimit(pageLimit + ITEMS_PER_PAGE)
                              }
                            >
                              Load More ({filteredPages.length - pageLimit}{" "}
                              remaining)
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowDetails(false)}
                  >
                    Hide Details
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!isChanged}>
                Update {label.usages.length.toLocaleString()}{" "}
                {label.usages.length === 1 ? "Location" : "Locations"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
