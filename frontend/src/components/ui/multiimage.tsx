import React, {
  useState,
  DragEvent,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

interface MultiImageUploadProps {
  value?: File[]
  onChange?: (files: File[]) => void
  error?: string
  label?: string
  id?: string
}

const MultiImageUpload = forwardRef<HTMLInputElement, MultiImageUploadProps>(
  ({ value = [], onChange, error, label, id = 'multi-image-upload' }, ref) => {
    const [previews, setPreviews] = useState<string[]>([])
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const handleFiles = (selectedFiles: FileList | File[]) => {
      const incoming = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith('image/') &&
          !value.some(
            (existing) =>
              existing.name === file.name &&
              existing.lastModified === file.lastModified,
          ),
      )

      const updated = [...value, ...incoming]

      setPreviews(updated.map((value) => URL.createObjectURL(value)))

      onChange?.(updated)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files)
    }

    const handleRemove = (index: number) => {
      const updated = value.filter((_, i) => i !== index)
      onChange?.(updated)
    }

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-md p-6 w-full text-center cursor-pointer transition-all',
            dragOver
              ? 'border-primary bg-muted'
              : error
                ? 'border-destructive'
                : 'border-border',
          )}
        >
          <div className="flex flex-col items-center justify-center text-sm">
            <div className="text-primary">
              <ImageIcon />
            </div>
            <p className="mt-2">
              <span className="font-medium text-primary">Fayl tanlang</span>{' '}
              yoki sudrab tashlang
            </p>
            <p className="text-muted-foreground text-xs">PNG, JPG, max 5MB</p>
          </div>

          <input
            type="file"
            id={id}
            ref={inputRef}
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {value.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={previews[index]}
                  alt={`Preview ${index}`}
                  className="rounded-md object-cover w-full aspect-square"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 w-5 h-5 text-xs text-white bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)

MultiImageUpload.displayName = 'MultiImageUpload'

export default MultiImageUpload
