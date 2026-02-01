import { ImageIcon } from 'lucide-react'
import React, { useState, useEffect, DragEvent } from 'react'

interface MultiImageUploadProps {
  label: string
  htmlFor: string
  onChange?: (files: File[]) => void
  error?: string
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  label,
  htmlFor,
  onChange,
  error,
}) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (selectedFiles: FileList) => {
    const newFiles: File[] = []
    const newPreviews: string[] = []

    Array.from(selectedFiles).forEach((file) => {
      if (
        !file.type.startsWith('image/') ||
        files.some(
          (existing) =>
            existing.name === file.name &&
            existing.lastModified === file.lastModified,
        )
      ) {
        return
      }

      const previewUrl = URL.createObjectURL(file)
      newFiles.push(file)
      newPreviews.push(previewUrl)
    })

    setFiles((prev) => {
      const updated = [...prev, ...newFiles]
      if (onChange) onChange(updated)
      return updated
    })

    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(previews[index])
    const newPreviews = previews.filter((_, i) => i !== index)
    const newFiles = files.filter((_, i) => i !== index)

    setPreviews(newPreviews)
    setFiles(newFiles)
    if (onChange) onChange(newFiles)
  }

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  return (
    <div className="form-group w-full">
      <label
        htmlFor={htmlFor}
        className="block text-md font-normal text-text mb-1"
      >
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex items-center justify-center flex-col border-2 ${
          dragOver
            ? 'border-brand bg-gray-100 '
            : error
              ? 'border-red-400'
              : 'border-border'
        } rounded-md py-8 w-full text-center cursor-pointer transition-all`}
        onClick={() => document.getElementById(htmlFor)?.click()}
      >
        <span className="icon text-brand">
          <ImageIcon />
        </span>

        <p className="text-sm text-text mt-3">
          <span className="text-brand">Upload a file</span> or drag and drop
        </p>

        <p className="text-sm text-description">PNG, JPG upto 5MB</p>
        <input
          type="file"
          id={htmlFor}
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-2">
          {previews.map((src, index) => (
            <div key={index} className="relative group">
              <div className="aspect-[1/1]">
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-5 h-5 absolute top-1 right-1 bg-black/60 hover:bg-brand text-white flex items-center justify-center text-xs rounded-full cursor-pointer transition-all duration-100 ease-in invisible group-hover:visible opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default MultiImageUpload
