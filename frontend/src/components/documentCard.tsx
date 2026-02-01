import { v2Update_BasicDisplayDocumentType } from '@/types/v2news'
import { DownloadIcon, EyeIcon } from 'lucide-react'

export default function DocumentCardComponent({
  value,
  documentType,
}: {
  value: v2Update_BasicDisplayDocumentType
  documentType: 'legacy_documents' | 'bussinies_documents'
}) {
  return (
    <>
      <div className="w-full h-auto p-3 bg-muted rounded-md">
        <h1 className="text-xl font-semibold">{value.title}</h1>
        <p className="text-description mb-4">{value.subtitle}</p>

        <div
          className={
            'w-full flex items-center ' +
            (documentType === 'legacy_documents'
              ? 'justify-end'
              : 'justify-start')
          }
        >
          {documentType === 'legacy_documents' ? (
            <>
              <a
                href={value.link}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-fit flex items-center justify-center text-sm p-2 space-x-1 text-blue-400 hover:text-white bg-white hover:bg-blue-400 rounded-lg transition-colors duration-200 ease-in"
              >
                <span className="icon">
                  <EyeIcon size={16} />
                </span>
                <span className="text">
                  {value.link?.split('/').find((v) => v.includes('.'))}
                </span>
              </a>
            </>
          ) : (
            <>
              <a
                href={value.link || value.file || '#nolink'}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-fit flex items-center justify-center text-sm p-2 space-x-1 text-brand hover:text-white bg-white hover:bg-brand rounded-lg transition-colors duration-200 ease-in"
              >
                <span className="icon">
                  <DownloadIcon size={16} />
                </span>
                <span className="text">Yuklab olish</span>
              </a>
            </>
          )}
        </div>
      </div>
    </>
  )
}
