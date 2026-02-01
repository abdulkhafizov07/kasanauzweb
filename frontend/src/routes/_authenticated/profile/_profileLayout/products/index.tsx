import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import api from '@/lib/api'
import { PlusIcon } from 'lucide-react'

export const Route = createFileRoute(
  '/_authenticated/profile/_profileLayout/products/',
)({
  component: RouteComponent,
})

type Category = {
  meta: string
  title: string
}

type Product = {
  guid: string
  title: string
  price: string
  image: string
  category: Category
  status: string
}

function RouteComponent() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['userProducts'],
    queryFn: async () => {
      const { data } = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/onlineshop/api/profile/products/`,
      )
      return data
    },
  })

  const form = useForm({
    defaultValues: {
      selected: [] as string[],
    },
    onSubmit: async ({ value }) => {
      console.log('Selected products:', value.selected)
    },
  })

  const columns: ColumnDef<Product>[] = [
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
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      header: 'Rasm',
      cell: ({ row }) => (
        <img
          src={row.original.image}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ),
    },
    {
      accessorKey: 'title',
      header: 'Nomi',
    },
    {
      accessorKey: 'category',
      header: 'Kategoriya',
      cell: ({ row }) => (
        <Link
          to="/shop/categories/$meta"
          params={{ meta: row.original.category.meta }}
          className="px-2 py-1 bg-tbrand text-brand rounded-full"
        >
          {row.original.category.title}
        </Link>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Narx',
      cell: ({ row }) => (
        <span>
          {new Intl.NumberFormat('en', {
            notation: 'compact',
          }).format(parseInt(row.original.price))}{' '}
          UZS
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Holat',
      cell: () => <span className="text-green-600">Aktiv</span>,
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: () => <Button size="sm">...</Button>,
    },
  ]

  const table = useReactTable({
    data: products ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  useEffect(() => {
    document.title = 'Mening mahsulotlarim - Kasana.UZ'
  }, [])

  if (isLoading) {
    return <p>Yuklanmoqda...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="title text-lg md:text-2xl font-bold">Maxsulotlarim</h2>

        <Button asChild className="h-9">
          <Link to="/profile/products/create">
            <span className="icon">
              <PlusIcon size={18} />
            </span>
            <span className="text hidden md:inline">Mahsulot yuklash</span>
          </Link>
        </Button>
      </div>

      {(!products || products.length === 0) && (
        <p className="text-center text-description font-medium">
          Foydalanuvchi mahsulotlari topilmadi
        </p>
      )}

      {products && products.length > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
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
  )
}
