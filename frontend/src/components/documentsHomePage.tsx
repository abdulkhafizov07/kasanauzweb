import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Container } from './ui/container'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { v2Update_BasicDisplayDocumentType } from '@/types/v2news'
import api from '@/lib/api'
import LoadingComponent from './loader'
import { useInView } from 'react-intersection-observer'
import DocumentCardComponent from './documentCard'

interface DocumentsResponseType {
  legacyDocuments: v2Update_BasicDisplayDocumentType[]
  bussiniesDocuments: v2Update_BasicDisplayDocumentType[]
}

export default function DocumentsHomePageComponent() {
  const { t } = useTranslation()
  const { inView, ref } = useInView({ threshold: 0, triggerOnce: true })

  const fetchDocuments =
    useCallback(async (): Promise<DocumentsResponseType> => {
      const request = await api.get(`/news/api/documents/?page=1&page_size=3`)
      return request.data
    }, [])

  const {
    data: documents,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['home-page', 'documents-section'],
    queryFn: fetchDocuments,
    enabled: inView,
  })

  return (
    <>
      <section id="documents-home-page">
        <Container
          className="py-12"
          variant="constrainedBreakpointPadded"
          ref={ref}
        >
          {isLoading && <LoadingComponent />}

          {isSuccess && (
            <div className="w-full flex items-start justify-start">
              <div className="w-full h-full right-side pr-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="">
                    <h2 className="text-3xl font-semibold">
                      {t('legacy-documents')}
                    </h2>
                    <p className="text-description">
                      {t('legacy-documents-description')}
                    </p>
                  </div>

                  <Button asChild variant="outline">
                    <Link to="/news">{t('see-more')}</Link>
                  </Button>
                </div>

                <div>
                  {documents.legacyDocuments.map((value, index) => (
                    <DocumentCardComponent
                      documentType="legacy_documents"
                      value={value}
                      key={index}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full h-full left-side pl-8 border-l">
                <div className="flex items-center justify-between mb-8">
                  <div className="">
                    <h2 className="text-3xl font-semibold">
                      {t('little-bussinies-documents')}
                    </h2>
                    <p className="text-description">
                      {t('little-bussinies-description')}
                    </p>
                  </div>

                  <Button asChild variant="outline">
                    <Link to="/news">{t('see-more')}</Link>
                  </Button>
                </div>

                <div>
                  {documents.bussiniesDocuments.map((value, index) => (
                    <DocumentCardComponent
                      documentType="bussinies_documents"
                      value={value}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div>
              <p>Malumotlarni yuklab olishda xatolik yuz berdi</p>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
