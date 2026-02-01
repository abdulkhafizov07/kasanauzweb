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
import { formatPhone, normalizeDateTime } from "@/utils";
import { UserType } from "@/types/user";
import { usersApi } from "@/server";
import { useDebounce } from "@/hooks/useDebounce";
import { UserAdminColumnType } from "@/types/admin/users";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useUserContext } from "@/context/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const ListPage: React.FC = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "admin.users" });
  const { role } = useParams();
  const userContext = useUserContext();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserAdminColumnType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(
    parseInt(window.localStorage.getItem("page_size") || "25")
  );
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    try {
      let url = `${usersApi}dashboard/users/?page=${currentPage}&page_size=${pageSize}`;
      if (debouncedSearch) {
        url += "&q=" + encodeURIComponent(debouncedSearch);
      }
      if (
        role !== "all" &&
        ["admin", "moderator", "user", "housemaker"].includes(String(role))
      ) {
        url += "&role=" + role;
      }

      const res = await axios.get(url, { signal: controller.signal });

      if (res.data?.results) {
        setData(
          res.data.results.map((value: UserType) => ({
            guid: value.guid,
            full_name: `${value.first_name} ${value.last_name}`,
            phone: formatPhone(String(value.phone)),
            role: value.role,
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
  }, [currentPage, debouncedSearch, role, pageSize]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  const columns = useMemo(
    () => generateColumns(t, fetchData, userContext),
    [t, fetchData, userContext]
  );

  useEffect(() => {
    window.localStorage.setItem("page_size", pageSize.toString());
  }, [pageSize]);

  return (
    <div id="list-users-page" className="p-3">
      <div className="w-full h-auto bg-white rounded-md p-3">
        <div className="w-full flex items-center justify-between mb-4 space-x-3">
          <Input
            placeholder="Familiya, Telefon raqam, ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-96"
          />

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
              <Link to={"/admin/users/create"}>
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
