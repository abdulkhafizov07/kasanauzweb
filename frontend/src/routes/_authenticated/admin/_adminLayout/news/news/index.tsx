import api from '@/lib/api'
import LoadingComponent from '@/components/web/loader'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import DataTable from '@/components/web/admin/table'
import { useAuth } from '@/context/auth'
import { hasOne } from '@/lib/has-perm'
import { buildQueryParams } from '@/lib/utils'
import { NewsItem } from '@/types/news'
import { normalizeDateTime } from '@/utils'
import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
} from '@tanstack/react-table'
import { EllipsisVerticalIcon, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/news/news/',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'news:read_news')) &&
          auth.user?.role !== 'admin'
        ) {
          navigate({ to: '/auth/login' })
        }
      }
    }, [auth])

    return auth.isLoading || auth.isUserLoading ? (
      <LoadingComponent />
    ) : (
      <RouteComponent />
    )
  },
})

const MoreButton: React.FC<{
  info: CellContext<NewsItem, unknown>
  refetch: () => Promise<
    QueryObserverResult<
      {
        results: NewsItem[]
      },
      Error
    >
  >
}> = ({ info, refetch }) => {
  {
    const { t: commonT } = useTranslation(undefined, {
      keyPrefix: 'admin.table.common',
    })
    const { user } = useAuth()

    const data = info?.row.original as NewsItem

    const updateState = async (state: string) => {
      api
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/news/api/dashboard/news/${
            data.guid
          }/change-state/`,
          { state },
        )
        .then((res) => {
          console.log(res)
          refetch()
        })
        .catch(() => {})
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-9 h-9">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>{commonT('actions')}</DropdownMenuLabel>
          <DropdownMenuItem disabled>{commonT('moderation')}</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateState('approved')}
            disabled={
              data.state === 'approved' ||
              !hasOne(user?.permissions || {}, 'news:write_news')
            }
          >
            {commonT('approved')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateState('rejected')}
            disabled={
              data.state === 'approved' ||
              data.state === 'rejected' ||
              !hasOne(user?.permissions || {}, 'news:write_news')
            }
          >
            {commonT('rejected')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateState('banned')}
            disabled={
              data.state === 'banned' ||
              !hasOne(user?.permissions || {}, 'news:write_news')
            }
          >
            {commonT('banned')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateState('hidden')}
            disabled={
              data.state === 'hidden' ||
              !hasOne(user?.permissions || {}, 'news:write_news')
            }
          >
            {commonT('hidden')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}

function RouteComponent() {
  const { t: commonT } = useTranslation(undefined, {
    keyPrefix: 'admin.table.common',
  })

  const [sorting, setSorting] = useState<ColumnSort[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const [debouncedSorting] = useDebounce(sorting, 300)
  const [debouncedColumnFilters] = useDebounce(columnFilters, 300)
  const [debouncedPagination] = useDebounce(pagination, 300)

  const fetchData = async (): Promise<{ results: NewsItem[] }> => {
    const params = buildQueryParams(
      debouncedSorting,
      debouncedColumnFilters,
      debouncedPagination,
    )
    const response = await api.get<{ results: NewsItem[] }>(
      `/news/api/dashboard/news/?${params}`,
    )
    return response.data
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'news',
      'admin',
      'news',
      debouncedSorting,
      debouncedColumnFilters,
      debouncedPagination,
    ],
    queryFn: fetchData,
    refetchInterval: 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<NewsItem>[] = [
    {
      header: commonT('id'),
      cell: (info) => info.row.index + 1,
    },
    {
      header: commonT('title'),
      accessorKey: 'title',
      cell: (info) => info.getValue() ?? '-',
    },
    {
      header: commonT('meta'),
      accessorKey: 'meta',
      cell: (info) => info.getValue() ?? '-',
    },
    {
      header: commonT('state'),
      accessorKey: 'state',
      cell: (info) => commonT(`status-${info.getValue()}`) ?? '-',
    },
    {
      header: commonT('created_at'),
      accessorKey: 'created_at',
      cell: (info) =>
        info.getValue() ? normalizeDateTime(String(info.getValue())) : '-',
    },
    {
      header: commonT('more'),
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => <MoreButton info={info} refetch={refetch} />,
    },
  ]

  return (
    <>
      <div className="mb-4">
        <Button asChild>
          <Link to={`/admin/news/news/create`}>
            <span className="icon">
              <PlusIcon />
            </span>
            <span className="text">{commonT('create')}</span>
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <>
          <LoadingComponent />
        </>
      ) : data && data.results && data.results.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={data?.results}
            sorting={debouncedSorting}
            setSorting={setSorting}
            columnFilters={debouncedColumnFilters}
            setColumnFilters={setColumnFilters}
            pagination={debouncedPagination}
            setPagination={setPagination}
          />
        </>
      ) : (
        <>
          <p className="text-center text-description font-medium py-12">
            {commonT('server-is-empty')}
          </p>
        </>
      )}
    </>
  )
}
