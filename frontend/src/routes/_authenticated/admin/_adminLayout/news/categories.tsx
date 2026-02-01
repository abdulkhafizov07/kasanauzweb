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
import { RenderField } from '@/lib/render-field'
import { metaValidator, titleValidator } from '@/lib/validators'
import { NewsCategory } from '@/types/news'
import { PaginatedResponse } from '@/types/util'
import { normalizeDateTime } from '@/utils'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { useForm } from '@tanstack/react-form'
import { useQuery, QueryObserverResult } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
} from '@tanstack/react-table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EllipsisVerticalIcon, PlusIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/news/categories',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'news:read_categories')) &&
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
  info: CellContext<NewsCategory, unknown>
  refetch: () => Promise<
    QueryObserverResult<{ results: NewsCategory[] }, Error>
  >
}> = ({ info }) => {
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

function RouteComponent() {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'admin.news.categories',
  })
  const { t: createT } = useTranslation(undefined, {
    keyPrefix: 'admin.news.categories.create',
  })
  const { t: commonT } = useTranslation(undefined, {
    keyPrefix: 'admin.table.common',
  })

  const [sorting, setSorting] = useState<ColumnSort[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [debouncedSorting] = useDebounce(sorting, 300)
  const [debouncedColumnFilters] = useDebounce(columnFilters, 300)
  const [debouncedPagination] = useDebounce(pagination, 300)

  const fetchData = async (): Promise<PaginatedResponse<NewsCategory>> => {
    const response = await api.get<PaginatedResponse<NewsCategory>>(
      `/news/api/dashboard/categories/`,
    )
    return response.data
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'news',
      'admin',
      'categories',
      debouncedSorting,
      debouncedColumnFilters,
      debouncedPagination,
    ],
    queryFn: fetchData,
    refetchInterval: 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const columns: ColumnDef<NewsCategory>[] = [
    { header: commonT('id'), cell: (info) => info.row.index + 1 },
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

  const createForm = useForm({
    defaultValues: { title: '', meta: '', state: '' },
    onSubmit: async ({ value }) => {
      try {
        const res = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/news/api/dashboard/categories/`,
          value,
        )
        if (res.status !== 201) throw res
        createForm.reset()
        refetch()
      } catch (err: any) {
        if (err.response?.status === 400) {
          const errorMap: Record<string, string> = {}
          for (const field of Object.keys(err.response.data)) {
            const messages = err.response.data[field] as string[]
            errorMap[field] = messages.join(' ')
          }
          createForm.setErrorMap({ onChange: { fields: errorMap } })
          return errorMap
        }
        throw err
      }
    },
  })

  useEffect(() => {
    document.title = `${t('title')} - Kasana.UZ Admin`
  }, [t])

  return (
    <>
      <Sheet>
        <div className="mb-4">
          <SheetTrigger asChild>
            <Button>
              <PlusIcon />
              <span className="ml-2">{commonT('create')}</span>
            </Button>
          </SheetTrigger>
        </div>

        {isLoading ? (
          <LoadingComponent />
        ) : data && data.results && data.results.length > 0 ? (
          <DataTable
            data={data.results}
            columns={columns}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            pagination={pagination}
            setPagination={setPagination}
            totalCount={data.count}
          />
        ) : (
          <p className="text-center text-description font-medium py-12">
            {commonT('server-is-empty')}
          </p>
        )}

        <form>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{createT('title')}</SheetTitle>
              <SheetDescription>{createT('description')}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col space-y-4 px-4">
              <RenderField
                form={createForm}
                name="title"
                inputComponent={
                  <Input placeholder={createT('placeholder.title')} />
                }
                labelKey="title"
                translationOptions={{
                  keyPrefix: 'admin.news.categories.create.fields',
                }}
                validator={titleValidator}
              />

              <RenderField
                form={createForm}
                name="meta"
                inputComponent={
                  <Input placeholder={createT('placeholder.meta')} />
                }
                labelKey="meta"
                translationOptions={{
                  keyPrefix: 'admin.news.categories.create.fields',
                }}
                validator={metaValidator}
              />

              <RenderField
                form={createForm}
                name="state"
                inputComponent={
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={createT('placeholder.state')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderation">
                        {createT('select.moderation')}
                      </SelectItem>
                      <SelectItem value="approved">
                        {createT('select.approved')}
                      </SelectItem>
                      <SelectItem value="rejected">
                        {createT('select.rejected')}
                      </SelectItem>
                      <SelectItem value="banned">
                        {createT('select.banned')}
                      </SelectItem>
                      <SelectItem value="hidden">
                        {createT('select.hidden')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                }
                labelKey="state"
                translationOptions={{
                  keyPrefix: 'admin.news.categories.create.fields',
                }}
              />
            </div>

            <SheetFooter>
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  createForm.handleSubmit()
                }}
              >
                {createT('submit')}
              </Button>
            </SheetFooter>
          </SheetContent>
        </form>
      </Sheet>
    </>
  )
}
