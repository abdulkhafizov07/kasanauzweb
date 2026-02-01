import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from 'react-i18next'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

interface Announcement {
  guid: string
  title: string
  thumbnail: string
  price_min: number
  price_max: number
  dealed: boolean
}

async function fetchUserAnnouncements(): Promise<Announcement[]> {
  const { data } = await api.get(
    `${import.meta.env.VITE_BACKEND_URL}/announcements/api/user-announcements/`,
  )
  return data
}

export const Route = createFileRoute(
  '/_authenticated/profile/_profileLayout/announcements',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { data: userAnnouncements = [], isLoading } = useQuery({
    queryKey: ['userAnnouncements'],
    queryFn: fetchUserAnnouncements,
  })

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en', {
        notation: 'compact',
        compactDisplay: 'short',
      }),
    [],
  )

  const columns = useMemo<ColumnDef<Announcement>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: 'thumbnail',
        header: t('Image[of]'),
        cell: ({ row }) => (
          <div className="aspect-[13/9] w-26">
            <img
              src={row.original.thumbnail}
              className="h-full object-cover rounded-lg"
              alt=""
            />
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: t('Name[of]'),
      },
      {
        accessorKey: 'price',
        header: t('Price'),
        cell: ({ row }) =>
          row.original.dealed ? (
            <span>Kelishilgan</span>
          ) : (
            <span>
              {formatter.format(row.original.price_min)} –{' '}
              {formatter.format(row.original.price_max)} UZS
            </span>
          ),
      },
      {
        accessorKey: 'status',
        header: t('Active[status]'),
        cell: () => <span className="text-green-500">Active</span>,
      },
      {
        id: 'actions',
        header: 'Amallar',
        cell: () => <Button size="sm">...</Button>,
      },
    ],
    [t, formatter],
  )

  const table = useReactTable({
    data: userAnnouncements,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="title text-lg md:text-2xl font-bold">
          Mening e`lonlarim
        </h2>

        <Button asChild className="h-9">
          <Link
            to="/announcements/create"
            className="block w-fit bg-brand p-2.5 text-tbrand rounded-lg"
          >
            <span className="icon">
              <PlusIcon size={18} />
            </span>
            <span className="text hidden md:inline">E`lonlar yuklash</span>
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : userAnnouncements.length === 0 ? (
          <p className="text-center text-description font-medium">
            Foydalanuvchi e`lonlari topilmadi
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const selectedGuids = table
                .getSelectedRowModel()
                .rows.map((r) => r.original.guid)
              console.log('Delete selected:', selectedGuids)
            }}
          >
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-2 text-left">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.getIsSelected() ? 'bg-gray-100' : ''}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer delete button */}
            <div className="mt-4 flex justify-end">
              {table.getSelectedRowModel().rows.length > 0 && (
                <Button type="submit" variant="destructive">
                  Tanlanganlarni o‘chirish
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  )
}
