import LoadingComponent from "@/components/web/loader";
import { Input } from "@/components/ui/input";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { DataTable } from "./data-table";
import { AdminPagination } from "@/components/web/admin/pagination";
import { generateColumns } from "./columns";
import axios from "axios";
import { normalizeDateTime } from "@/utils";
import { coursesApi, onlineShopApi } from "@/server";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ProductCategory } from "@/types/onlineshop";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCategoryAdminColumnType } from "@/types/admin/onlineshop";
import { toast } from "sonner";
import { EditCategory } from "../edit";
import { CreateCategory } from "../create";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const ListPage: React.FC = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "admin.courses" });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProductCategoryAdminColumnType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(
    parseInt(window.localStorage.getItem("page_size") || "25")
  );
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryAdminColumnType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    try {
      let url = `${coursesApi}dashboard/categories/?page=${currentPage}&page_size=${pageSize}`;
      if (debouncedSearch) {
        url += "&q=" + encodeURIComponent(debouncedSearch);
      }

      const res = await axios.get(url, { signal: controller.signal });

      if (res.data?.results) {
        setData(
          res.data.results.map((value: ProductCategory) => ({
            guid: value.guid,
            title: value.title,
            created_at: normalizeDateTime(String(value.created_at)),
          }))
        );
        setTotalPages(res.data.total_pages);
      }
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log("Request cancelled");
      } else {
        console.error("Failed to fetch users:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, pageSize]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  const editCategory = async (guid: string) => {
    const category = data.find((item) => item.guid === guid);
    if (category) {
      setSelectedCategory(category);
      setShowEditDrawer(true);
    }
  };

  const deleteCategory = async (guid: string) => {
    const category = data.find((item) => item.guid === guid);
    if (category) {
      setSelectedCategory(category);
      setShowDeleteDialog(true);
    }
  };

  const columns = useMemo(
    () => generateColumns(t, deleteCategory, editCategory),
    [t, editCategory, deleteCategory]
  );

  useEffect(() => {
    window.localStorage.setItem("page_size", pageSize.toString());
  }, [pageSize]);

  return (
    <>
      <div id="list-users-page" className="p-3">
        <div className="w-full h-auto bg-white rounded-md p-3">
          <div className="w-full flex items-center justify-between mb-4 space-x-3">
            <Input
              placeholder="Sarlavha, kichik tavsif, ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-96"
            />

            <div className="flex items-center space-x-3">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(parseInt(v))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Natijalar soni" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size={"icon"}
                className="cursor-pointer"
                onClick={() => setShowCreateDrawer(true)}
              >
                <span className="icon">
                  <PlusIcon />
                </span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-8">
              <LoadingComponent />
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={data} />
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_confirm", { name: selectedCategory?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await axios.delete(
                    `${onlineShopApi}dashboard/category/delete/${selectedCategory?.guid}/`
                  );
                  toast.success(
                    t("delete_success") || "Category deleted successfully 🎉"
                  );
                  fetchData();
                } catch (error: any) {
                  const msg =
                    error?.response?.data?.detail ||
                    t("delete_failed") ||
                    "Couldn't delete the category. Try again? 🤔";

                  toast.error(msg);
                  console.warn("Delete failed:", error);
                } finally {
                  setShowDeleteDialog(false);
                }
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditCategory
        open={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
        category={selectedCategory}
        refresh={fetchData}
      />
      <CreateCategory
        open={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        refresh={fetchData}
      />
    </>
  );
};
