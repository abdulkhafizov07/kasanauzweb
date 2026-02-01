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
import { UserType } from '@/types/user'
import { normalizeDateTime } from '@/utils'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import {
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
} from '@tanstack/react-table'
import { EllipsisVerticalIcon, PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatPhoneNumber } from 'react-phone-number-input'
import { useDebounce } from 'use-debounce'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/users/$role',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'users:read_all')) &&
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

const MoreButton: React.FC<{ info: CellContext<UserType, unknown> }> = ({
  info,
}) => {
  {
    const { t: commonT } = useTranslation(undefined, {
      keyPrefix: 'admin.table.common',
    })
    const { user } = useAuth()

    const data = info?.row.original as UserType

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
              !hasOne(user?.permissions || {}, 'news:write_categories')
            }
          >
            {commonT('approved')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              data.state === 'approved' ||
              data.state === 'rejected' ||
              !hasOne(user?.permissions || {}, 'news:write_categories')
            }
          >
            {commonT('rejected')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              data.state === 'banned' ||
              !hasOne(user?.permissions || {}, 'news:write_categories')
            }
          >
            {commonT('banned')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              data.state === 'hidden' ||
              !hasOne(user?.permissions || {}, 'news:write_categories')
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

  const { role } = useParams({
    from: '/_authenticated/admin/_adminLayout/users/$role',
  })

  const fetchData = async (): Promise<{ results: UserType[] }> => {
    const response = await api.get<{ results: UserType[] }>(
      '/users/api/dashboard/users/' + (role === 'all' ? '' : `?role=${role}`),
    )
    return response.data
  }

  const { data, isLoading } = useQuery({
    queryKey: ['users', 'admin', 'users', role],
    queryFn: fetchData,
    refetchInterval: 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<UserType>[] = [
    {
      header: commonT('id'),
      cell: (info) => info.row.index + 1,
    },
    {
      header: 'Ism',
      accessorKey: 'first_name',
      cell: (info) => info.getValue() ?? '-',
    },
    {
      header: 'Familiya',
      accessorKey: 'last_name',
      cell: (info) => info.getValue() ?? '-',
    },
    {
      header: 'Tel raqam',
      accessorKey: 'phone',
      cell: (info) =>
        info.getValue() ? formatPhoneNumber(String(info.getValue())) : '-',
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
      {isLoading ? (
        <>
          <LoadingComponent />
        </>
      ) : data && data.results && data.results.length > 0 ? (
        <>
          <div className="mb-4">
            <Button asChild>
              <Link to={`/admin/users/create`}>
                <span className="icon">
                  <PlusIcon />
                </span>
                <span className="text">{commonT('create')}</span>
              </Link>
            </Button>
          </div>

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
