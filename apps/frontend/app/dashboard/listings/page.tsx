"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Listing } from "@/lib/types/dashboard/listings/listings";
import PageHeader from "@/components/dashboard/listings/PageHeader";
import SearchAndFilters from "@/components/dashboard/listings/SearchAndFilters";
import ListingCard from "@/components/dashboard/listings/ListingCard";
import EmptyState from "@/components/dashboard/listings/EmptyState";

import { BACKEND_URL } from "@/lib/types/constants";
import { authFetch } from "@/lib/authFetch";
import { useSession } from "@/context/useSession";
import { ContentLoader } from "@/components/Loading";
import { ConfirmDialog } from "@/components/ui/dialogBoxes/Pre-configuredDialog";
import { SnackbarProvider, useSnackbar } from "@/components/ui/dialogBoxes/SnackBarManager";

const PAGE_SIZE = 12;

type ApiResponse = {
  items: Listing[];
  stats: {
    totalCount: number;
    activeCount: number;
    soldCount: number;
    draftCount: number;
    reservedCount: number;
  };
};

const MyListingsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session, isLoading } = useSession();

  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- FILTER STATE ---------------- */
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("");

  const [sortBy, setSortBy] = useState<string>("latest");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {showSuccess, showError} = useSnackbar()

  /* ---------------- DEBOUNCED SEARCH ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ---------------- AUTH REDIRECT ---------------- */
  useEffect(() => {
    if (!session && !isLoading) router.push("/auth/signin");
  }, [session, isLoading]);

  /* ---------------- FETCH ---------------- */
  const fetchListings = async ({ pageParam = 1 }): Promise<ApiResponse> => {
    const params = new URLSearchParams({
      page: String(pageParam),
      limit: String(PAGE_SIZE),
      sortBy,
    });

    if (debouncedSearch) params.append("search", debouncedSearch);
    if (minPrice !== undefined) params.append("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.append("maxPrice", String(maxPrice));
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (categoryFilter !== "all") params.append("category", categoryFilter);
    if (conditionFilter) params.append("condition", conditionFilter);

    const res = await authFetch(
      `${BACKEND_URL}/product/mylisting?${params.toString()}`
    );

    if (!res.ok) throw new Error("Failed to load listings");

    return res.json();
  };

  /* ---------------- INFINITE QUERY ---------------- */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: listingsLoading,
  } = useInfiniteQuery({
    queryKey: [
      "my-listings",
      debouncedSearch,
      statusFilter,
      categoryFilter,
      conditionFilter,
      sortBy,
      minPrice,
      maxPrice,
    ],
    queryFn: fetchListings,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.items.length < PAGE_SIZE ? undefined : pages.length + 1,
  });

  /* ---------------- FLATTEN ---------------- */
  const listings = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  /* ---------------- API STATS ---------------- */
  const stats = useMemo(() => {
    return (
      data?.pages?.[0]?.stats ?? {
        totalCount: 0,
        activeCount: 0,
        soldCount: 0,
        draftCount: 0,
        reservedCount: 0,
      }
    );
  }, [data]);

  /* ---------------- INFINITE SCROLL ---------------- */
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.4 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  /* ---------------- HANDLERS ---------------- */
  const handleDelete = (listing: Listing) => {
    setSelectedListing(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedListing) return;

    try {

      const res = await authFetch(`${BACKEND_URL}/product/${selectedListing.id}`, {
        method: "DELETE",
      });
      
      if(!res.ok) {
        return;
      }
        const result = await res.json();
        if(result.success) {
          showSuccess(`${result.message}`)
        } else {
          showError(`${result.message}`)
        }

      }
      catch (err) {
        console.log(err)
      } finally {

        setShowDeleteModal(false);
        setSelectedListing(null);
      }

    queryClient.invalidateQueries({ queryKey: ["my-listings"] });
  };

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setConditionFilter("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader stats={stats} />

        <SearchAndFilters
          searchQuery={searchInput}
          onSearchChange={setSearchInput}
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          onResetFilters={resetFilters}
        />

        {/* GRID */}
        {listingsLoading && listings.length === 0 ? (
          <div className="flex justify-center mt-14">
            <ContentLoader type="grid" columns={4} count={8} />
          </div>
        ) : listings.length === 0 ? (
          <EmptyState hasListings={false} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onDelete={handleDelete}
                  />
                ))}
            </div>

            {/* SCROLL TRIGGER */}
            <div ref={observerRef} className="flex justify-center py-12">
              {isFetchingNextPage && <ContentLoader columns={4} type="grid" count={8} />}
            </div>
          </>
        )}

        <ConfirmDialog
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Deletion"
          description="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Keep"
        />
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <SnackbarProvider>
      <MyListingsPage />
    </SnackbarProvider>
  );
};

export default App;