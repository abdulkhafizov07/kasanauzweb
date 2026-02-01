import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { ArrowLeftIcon, SearchIcon } from 'lucide-react'
import { useForm } from '@tanstack/react-form'

interface SearchComponentProps {
  onOpenChange: (open: boolean) => void
}

interface SearchFormValues {
  q: string
}

export default function SearchComponent({
  onOpenChange,
}: SearchComponentProps) {
  const [open, setOpen] = useState<boolean>(false)
  const location = useLocation()
  const navigate = useNavigate()

  if (location.pathname.includes('auth')) return null

  const form = useForm({
    defaultValues: { q: '' },
    onSubmit: () => {
      setOpen(false)
      onOpenChange(false)
      navigate({ to: '/shop' })
    },
  })

  return (
    <div
      className={`${
        open
          ? 'absolute top-0 left-0 flex items-center justify-center w-full h-full'
          : 'bg-transparent'
      }`}
    >
      {open ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setOpen(false)
              onOpenChange(false)
            }}
            className="absolute left-4 text-brand hover:text-white hover:bg-brand rounded-full"
          >
            <ArrowLeftIcon />
          </Button>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="flex space-x-2">
              <form.Field
                name="q"
                children={(field) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Qidiruv..."
                    className="w-lg"
                  />
                )}
              />

              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-white bg-brand rounded-full"
              >
                <SearchIcon />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="text-brand hover:text-white rounded-full hover:bg-brand"
          onClick={() => {
            setOpen(true)
            onOpenChange(true)
          }}
        >
          <SearchIcon />
        </Button>
      )}
    </div>
  )
}
