import React, { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductType } from '@/types/onlineshop'
import api from '@/lib/api'

async function fetchUserLikedProducts(): Promise<ProductType[]> {
  const { data } = await api.get(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/onlineshop/api/profile/liked-products/`,
  )
  return data
}

export const Route = createFileRoute(
  '/_authenticated/profile/_profileLayout/liked-products',
)({
  component: RouteComponent,
})

const CategoryTag: React.FC<{ meta: string; title: string; icon?: string }> = ({
  meta,
  title,
  icon,
}) => (
  <Link
    to="/shop/categories/$meta"
    params={{ meta: meta }}
    className="flex items-center justify-center min-w-max py-1.5 px-3 bg-tbrand text-brand rounded-full"
  >
    {icon && <img src={icon} alt="" className="w-3.5 h-3.5 mr-2" />}
    <span>{title}</span>
  </Link>
)

function RouteComponent() {
  const { data: userLikedProducts = [], isLoading } = useQuery({
    queryKey: ['userLikedProducts'],
    queryFn: fetchUserLikedProducts,
  })

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en', {
        notation: 'compact',
        compactDisplay: 'short',
      }),
    [],
  )

  const columns = useMemo<ColumnDef<ProductType>[]>(
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
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => (
          <img
            src={row.original.image}
            className="max-w-12 min-w-12 h-12 rounded-lg"
            alt=""
          />
        ),
      },
      {
        accessorKey: 'title',
        header: 'Name',
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <CategoryTag
            meta={row.original.category?.meta || ''}
            title={row.original.category?.title || ''}
          />
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
          <span>{formatter.format(row.original.price)} UZS</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Active status',
        cell: () => <span className="text-green-500">Active</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => <button className="px-2 py-1 border rounded">...</button>,
      },
    ],
    [formatter],
  )

  const table = useReactTable({
    data: userLikedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  return (
    <>
      <div className="page-title flex w-full items-center justify-between mb-6">
        <h2 className="title text-lg md:text-2xl font-bold">
          Yoqtirgan maxsulotlarim
        </h2>
      </div>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : userLikedProducts.length === 0 ? (
        <p className="text-center text-description font-medium">
          Foydalanuvchi yoqtirgan maxsulotlari topilmadi
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const selectedGuids = table
              .getSelectedRowModel()
              .rows.map((r) => r.original.guid)
            console.log('Selected liked products:', selectedGuids)
          }}
        >
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2 text-left">
                      {flexRender(
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

          <div className="mt-4 flex justify-end">
            {table.getSelectedRowModel().rows.length > 0 && (
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Tanlanganlarni o‘chirish
              </button>
            )}
          </div>
        </form>
      )}
    </>
  )
}
