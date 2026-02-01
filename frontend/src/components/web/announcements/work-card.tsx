import { AnnouncementType } from '@/types/announcements'
import { normalizeDateTime } from '@/utils'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import LoadingComponent from '@/components/web/loader'
import { CalendarDaysIcon, EyeIcon } from 'lucide-react'

export const WorkAnnouncementCardWidget: React.FC<{
  value: AnnouncementType
}> = ({ value }) => {
  const { t } = useTranslation()

  return (
    <Link
      to="/announcements/work/$meta"
      params={{ meta: value.meta }}
      key={value.guid}
      className="flex w-full transition-all duration-300"
    >
      <div className="w-full p-2 border border-border rounded-md hover:shadow-lg shadow-gray-400/20 transition-all duration-100 ease-in">
        <h3 className="text-lg text-description font-semibold mb-1">
          {value.title}
        </h3>
        <p className="text-description text-md mb-3">
          {value.dealed ? (
            <>Kelishiladi</>
          ) : (
            <>
              {value.price_min}
              {value.price_max > value.price_min
                ? `-${value.price_max}`
                : ''}{' '}
              SO'M
            </>
          )}
        </p>
        <div className="flex gap-2 flex-wrap mb-3">
          <div className="bg-tbrand rounded-lg text-brand py-1 px-2.5 text-[13px]">
            {
              {
                full_time: t('Full time'),
                part_time: t('Part time'),
                flexable_time: t('Flexable time'),
              }[value.work_time]
            }
          </div>
        </div>
        <div className="flex items-center gap-2 text-description text-lg border-b border-border pb-3 mb-3">
          <img src={value.user.pfp} alt="" className="w-6 h-6 rounded-full" />
          <span>
            {value.user.first_name} {value.user.last_name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1 text-[#b3b3b3] text-[15px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0003 5.00008V10.0001L13.3337 11.6667M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001Z"
                stroke="#767676"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {value.created_at.split('T')[0]}
          </span>
          <span className="flex items-center gap-1 text-[#b3b3b3] text-[15px]">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.16602 9.99992C1.16602 9.99992 4.49935 3.33325 10.3327 3.33325C16.166 3.33325 19.4993 9.99992 19.4993 9.99992C19.4993 9.99992 16.166 16.6666 10.3327 16.6666C4.49935 16.6666 1.16602 9.99992 1.16602 9.99992Z"
                stroke="#767676"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.3327 12.4999C11.7134 12.4999 12.8327 11.3806 12.8327 9.99992C12.8327 8.61921 11.7134 7.49992 10.3327 7.49992C8.95197 7.49992 7.83268 8.61921 7.83268 9.99992C7.83268 11.3806 8.95197 12.4999 10.3327 12.4999Z"
                stroke="#767676"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {value.views || 0}
          </span>
        </div>
      </div>
    </Link>
  )
}

export const ListWorkAnnouncementCardWidget: React.FC<{
  value: AnnouncementType
}> = ({ value }) => {
  return (
    <Link
      to="/announcements/work/$meta"
      params={{ meta: value.meta }}
      key={value.guid}
      className="block w-full"
    >
      <div className="w-full p-2 border border-border rounded-lg bg-white hover:border-brand hover:shadow-lg shadow-gray-200/60 transition-all duration-200 ease-in">
        <p className="text-lg font-semibold text-text mb-2">{value.title}</p>
        <div className="flex items-center gap-2 text-description text-md border-b border-border mb-2 pb-2">
          <img src={value.user.pfp} alt="" className="w-5 h-5 rounded-full" />
          <span>
            {value.user.first_name} {value.user.last_name}
          </span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span className="flex items-center gap-1">
            <span className="icon">
              <CalendarDaysIcon size={20} />
            </span>
            <span className="text">
              {normalizeDateTime(value.created_at) || 'Aniq emas'}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="icon">
              <EyeIcon size={20} />
            </span>
            <span className="text">{value.views || 0}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export const WorksAnnouncementWidget: React.FC = () => {
  const fetchData = async (): Promise<AnnouncementType[]> => {
    const response = await api.get<AnnouncementType[]>(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/announcements/api/home-announcements/?announcement_type=work`,
    )
    return response.data
  }

  const { data, isLoading } = useQuery({
    queryKey: ['announcements', 'home', 'list-works'],
    queryFn: fetchData,
    refetchInterval: 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="container max-w-[1366px] mx-auto px-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0">
          <h3 className="text-2xl font-bold m-0">E'lonlar</h3>
          <p className="text-description">Barchasini bizda toping</p>
        </div>

        <Button
          asChild
          variant="outline"
          className="text-brand hover:text-white hover:bg-brand border-brand"
        >
          <Link to="/announcements/work">Ko'proq ko'rish</Link>
        </Button>
      </div>

      {isLoading ? (
        <LoadingComponent />
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {data.map((item) => (
            <WorkAnnouncementCardWidget key={item.guid} value={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-description font-medium py-12">
          Tizimda ish e'lonlari yuklangani yo'q
        </p>
      )}
    </div>
  )
}
