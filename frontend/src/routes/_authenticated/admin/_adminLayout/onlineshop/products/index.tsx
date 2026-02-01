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
import { useAuth } from '@/context/auth'
import { hasOne } from '@/lib/has-perm'
import { ProductType } from '@/types/onlineshop'
import { normalizeDateTime } from '@/utils'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
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

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/onlineshop/products/',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'onlineshop:read_products')) &&
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
  info: CellContext<ProductType, unknown>
  refetch: () => Promise<
    QueryObserverResult<
      {
        results: ProductType[]
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

    const data = info?.row.original as ProductType

    const updateState = async (state: string) => {
      api
        .put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/onlineshop/api/dashboard/products/${data.guid}/change-state/`,
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
              !hasOne(user?.permissions || {}, 'onlineshop:write_products')
            }
          >
            {commonT('approved')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateState('rejected')}
            disabled={
              data.state === 'approved' ||
              data.state === 'rejected' ||
              !hasOne(user?.permissions || {}, 'onlineshop:write_products')
            }
          >
            {commonT('rejected')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateState('banned')}
            disabled={
              data.state === 'banned' ||
              !hasOne(user?.permissions || {}, 'onlineshop:write_products')
            }
          >
            {commonT('banned')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateState('hidden')}
            disabled={
              data.state === 'hidden' ||
              !hasOne(user?.permissions || {}, 'onlineshop:write_products')
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
  const { t } = useTranslation(undefined, {
    keyPrefix: 'admin.onlineshop.products',
  })
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

  const fetchData = async (): Promise<{ results: ProductType[] }> => {
    const response = await api.get<{ results: ProductType[] }>(
      '/onlineshop/api/dashboard/products/',
    )
    return response.data
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'onlineshop',
      'admin',
      'products',
      debouncedSorting,
      debouncedColumnFilters,
      debouncedPagination,
    ],
    queryFn: fetchData,
    refetchInterval: 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<ProductType>[] = [
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
      cell: (info) => <MoreButton refetch={refetch} info={info} />,
    },
  ]

  useEffect(() => {
    document.title = `${t('title')} - Kasana.UZ Admin`
  }, [t])

  return (
    <>
      <div className="mb-4">
        <Button asChild>
          <Link to={`/admin/onlineshop/products/create`}>
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
