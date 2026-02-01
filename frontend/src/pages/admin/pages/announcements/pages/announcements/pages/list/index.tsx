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
import { announcementsApi } from "@/server";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { AnnouncementType } from "@/types/announcements";
import { AnnouncementAdminColumnType } from "@/types/admin/announcement";

export const ListPage: React.FC = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "admin.onlineshop" });
  const { type } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnnouncementAdminColumnType[]>([]);
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
      let url = `${announcementsApi}dashboard/announcements/?page=${currentPage}&page_size=${pageSize}`;
      if (debouncedSearch) {
        url += "&q=" + encodeURIComponent(debouncedSearch);
      }
      if (verifySelect) {
        url += "&verify=1";
      }
      if (type && ["work", "service"].includes(type)) {
        url +=
          "&type=" +
          { work: "work_announcement", service: "service_announcement" }[type];
      }

      const res = await axios.get(url, { signal: controller.signal });

      if (res.data?.results) {
        setData(
          res.data.results.map((value: AnnouncementType) => ({
            guid: value.guid,
            announcement_type: value.announcement_type,
            title: value.title,
            short_description: value.short_description,
            dealed: value.dealed,
            price: value.argued
              ? "Kelishilgan"
              : `${Number(value.price_min).toLocaleString("uz")}-${Number(
                  value.price_max
                ).toLocaleString("uz")}`,
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
  }, [currentPage, debouncedSearch, pageSize, verifySelect, type]);

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

  useEffect(() => {
    if (!["all", "work", "service"].includes(String(type))) {
      navigate("/admin/announcements/all");
    }
  }, [type]);

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

            <div className="flex items-center justify-center space-x-4">
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
                <Link to={`/admin/announcements/${type}/create`}>
                  <span className="icon">
                    <PlusIcon />
                  </span>
                  <span className="text">Qo'shish</span>
                </Link>
              </Button>
            </div>
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
