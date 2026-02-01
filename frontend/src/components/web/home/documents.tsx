import api from '@/lib/api'
import type { HomePageDocumentsSectionData } from '@/types/news'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router' // ✅ correct router Link
import React from 'react'
import { useInView } from 'react-intersection-observer'

const DocumentsSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const fetchData = async (): Promise<HomePageDocumentsSectionData> => {
    const res = await api.get(
      `${import.meta.env.VITE_BACKEND_URL}/news/api/documents/`,
    )
    if (res.status !== 200) throw new Error('Failed to load documents')
    return res.data
  }

  const { data, isLoading, error } = useQuery<HomePageDocumentsSectionData>({
    queryKey: ['news', 'documents', 'home-page'],
    queryFn: fetchData,
    enabled: inView,
  })

  const legacyDocuments = data?.legacyDocuments || []
  const bussiniesDocuments = data?.bussiniesDocuments || []

  return (
    <section id="documents">
      <div
        className="container mx-auto max-w-[1366px] py-6 px-4 flex items-start justify-center flex-col md:flex-row"
        ref={ref}
      >
        {/* Left column: Legacy docs */}
        <div className="w-full md:w-1/2 md:border-r border-border md:pr-6">
          <div className="flex justify-between items-center">
            <div className="text">
              <h1 className="text-2xl font-semibold mb-1">
                Qonunchilik hujjatlari
              </h1>
              <p className="text-description">
                Kasanachilik sohasidagi qonunchilik hujjatlari
              </p>
            </div>

            <Link
              to="/news"
              className="py-1.5 px-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
            >
              Ko‘proq ko‘rish
            </Link>
          </div>

          {/* <div className="flex flex-col items-start justify-start space-y-3 mt-4">
            {isLoading && <p>Yuklanmoqda...</p>}
            {error && <p>Xatolik yuz berdi</p>}
            {legacyDocuments.length === 0 && !isLoading ? (
              <p className="text-description">Hujjatlar topilmadi</p>
            ) : (
              legacyDocuments.map((value, index) => (
                // <DocumentItemWidget
                //   value={{
                //     ...value,
                //     doc_type: 'legacy_documents',
                //   }}
                //   key={index}
                // />
              ))
            )}
          </div> */}
        </div>

        {/* Right column: Business docs */}
        <div className="w-full md:w-1/2 md:pl-6">
          <div className="flex justify-between items-center">
            <div className="text">
              <h1 className="text-2xl font-semibold mb-1">
                Kichik biznes loyihalar
              </h1>
              <p className="text-description">
                Turli darajadagi kichik biznes loyihalar
              </p>
            </div>

            <Link
              to="/news"
              className="py-1.5 px-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all duration-200 ease-in"
            >
              Ko‘proq ko‘rish
            </Link>
          </div>

          {/* <div className="flex flex-col items-start justify-start space-y-3 mt-4">
            {isLoading && <p>Yuklanmoqda...</p>}
            {error && <p>Xatolik yuz berdi</p>}
            {bussiniesDocuments.length === 0 && !isLoading ? (
              <p className="text-description">Hujjatlar topilmadi</p>
            ) : (
              bussiniesDocuments.map((value, index) => (
                <DocumentItemWidget
                  value={{
                    ...value,
                    doc_type: 'business_documents',
                  }}
                  key={index}
                />
              ))
            )}
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default DocumentsSection
