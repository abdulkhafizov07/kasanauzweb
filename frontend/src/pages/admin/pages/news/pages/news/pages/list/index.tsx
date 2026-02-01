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
import { newsApi } from "@/server";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductType } from "@/types/onlineshop";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductAdminColumnType } from "@/types/admin/onlineshop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

export const ListPage: React.FC = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "admin.news" });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProductAdminColumnType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(
    parseInt(window.localStorage.getItem("page_size") || "25")
  );
  const [search, setSearch] = useState("");
  const [verifySelect, setVerifySelect] = useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 300);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    try {
      let url = `${newsApi}dashboard/news/?page=${currentPage}&page_size=${pageSize}`;
      if (debouncedSearch) {
        url += "&q=" + encodeURIComponent(debouncedSearch);
      }
      if (verifySelect) {
        url += "&verify=1";
      }

      const res = await axios.get(url, { signal: controller.signal });

      if (res.data?.results) {
        setData(
          res.data.results.map((value: ProductType) => ({
            guid: value.guid,
            title: value.title,
            short_description: value.short_description,
            is_active: value.is_active,
            is_verified: value.is_verified,
            is_banned: value.is_banned,
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
  }, [currentPage, debouncedSearch, pageSize, verifySelect]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  const columns = useMemo(() => generateColumns(t, fetchData), [t, fetchData]);

  useEffect(() => {
    window.localStorage.setItem("page_size", pageSize.toString());
  }, [pageSize]);

  return (
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
            <div>
              <Label>
                <Checkbox
                  defaultChecked={verifySelect}
                  onCheckedChange={(v) => setVerifySelect(Boolean(v))}
                />

                <p>Tasdiqlash uchun</p>
              </Label>
            </div>

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
            <Button asChild>
              <Link to={`/admin/news/news/create`}>
                <span className="icon">
                  <PlusIcon />
                </span>
                <span className="text">Qo'shish</span>
              </Link>
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
  );
};
