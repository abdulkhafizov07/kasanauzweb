import { hasOne } from '@/lib/has-perm'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

import api from '@/lib/api'
import LoadingComponent from '@/components/web/loader'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DataTable from '@/components/web/admin/table'
import { NewsCategory } from '@/types/news'
import { normalizeDateTime } from '@/utils'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import {
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
} from '@tanstack/react-table'
import { EllipsisVerticalIcon, PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { useAuth } from '@/context/auth'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/news/documents/',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'news:read_documents')) &&
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

const MoreButton: React.FC<{ info: CellContext<NewsCategory, unknown> }> = ({
  info,
}) => {
  {
    const { t: commonT } = useTranslation(undefined, {
      keyPrefix: 'admin.table.common',
    })
    const { user } = useAuth()

    const data = info?.row.original as NewsCategory

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
            disabled={
              data.state === 'approved' ||
              !hasOne(user?.permissions || {}, 'news:write_documents')
            }
          >
            {commonT('approved')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              data.state === 'approved' ||
              data.state === 'rejected' ||
              !hasOne(user?.permissions || {}, 'news:write_documents')
            }
          >
            {commonT('rejected')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              data.state === 'banned' ||
              !hasOne(user?.permissions || {}, 'news:write_documents')
            }
          >
            {commonT('banned')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              data.state === 'hidden' ||
              !hasOne(user?.permissions || {}, 'news:write_documents')
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

  const fetchData = async (): Promise<{ results: NewsCategory[] }> => {
    const response = await api.get<{ results: NewsCategory[] }>(
      '/news/api/dashboard/documents/',
    )
    return response.data
  }

  const { data, isLoading } = useQuery({
    queryKey: ['news', 'admin', 'documents'],
    queryFn: fetchData,
    refetchInterval: 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<NewsCategory>[] = [
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
      cell: (info) => <MoreButton info={info} />,
    },
  ]

  return (
    <>
      <div className="mb-4">
        <Button asChild>
          <Link to={`/admin/news/documents/create`}>
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
