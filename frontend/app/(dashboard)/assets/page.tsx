"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/assets/status-badge";
import { ConditionBadge } from "@/components/assets/condition-badge";
import { useAssets } from "@/lib/query/hooks/useAsset";
import { AssetStatus } from "@/lib/query/types/asset";

type SortField = "assetId" | "name" | "category" | "status" | "condition" | "department" | "assignedTo";
type SortOrder = "asc" | "desc";

export default function AssetsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("assetId");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const { data, isLoading, error } = useAssets({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status: statusFilter || undefined,
    sortBy: sortField,
    sortOrder,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleRowClick = (assetId: string) => {
    router.push(`/assets/${assetId}`);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(data?.totalPages || 1, prev + 1));
  };

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 mb-4">Error loading assets.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
            <p className="text-sm text-gray-500 mt-1">
              {data?.total || 0} total assets
            </p>
          </div>
          <Button
            onClick={() => router.push("/assets/new")}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Register Asset
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, asset ID, or serial number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssetStatus | "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value={AssetStatus.ACTIVE}>Active</option>
              <option value={AssetStatus.ASSIGNED}>Assigned</option>
              <option value={AssetStatus.MAINTENANCE}>Maintenance</option>
              <option value={AssetStatus.RETIRED}>Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Loading assets...</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading && data && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {data.assets.length === 0 ? (
            <div className="px-6 py-24 text-center">
              <p className="text-gray-500">
                {debouncedSearch || statusFilter
                  ? "No assets found matching your filters."
                  : "No assets registered yet."}
              </p>
              {!debouncedSearch && !statusFilter && (
                <Button
                  onClick={() => router.push("/assets/new")}
                  className="mt-4"
                >
                  Register Your First Asset
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("assetId")}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Asset ID
                          {sortField === "assetId" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Name
                          {sortField === "name" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("category")}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Category
                          {sortField === "category" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Status
                          {sortField === "status" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("condition")}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Condition
                          {sortField === "condition" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("department")}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Department
                          {sortField === "department" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort("assignedTo")}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Assigned To
                          {sortField === "assignedTo" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.assets.map((asset) => (
                      <tr
                        key={asset.id}
                        onClick={() => handleRowClick(asset.id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {asset.assetId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {asset.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {asset.category?.name || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={asset.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ConditionBadge condition={asset.condition} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {asset.department?.name || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {asset.assignedTo
                            ? `${asset.assignedTo.name}`
                            : "Unassigned"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, data.total)} of{" "}
                      {data.total} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {data.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === data.totalPages}
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
