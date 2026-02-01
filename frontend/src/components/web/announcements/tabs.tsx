import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { AnnouncementType } from '@/types/announcements'
import { BriefcaseIcon, MegaphoneIcon, PlusIcon } from 'lucide-react'

interface HomeDataResponse {
  service_announcement: AnnouncementType[]
  work_announcement: AnnouncementType[]
}

const TabsWidget: React.FC<{ type: string }> = ({ type = 'announcement' }) => {
  const { data } = useQuery({
    queryKey: ['home-data'],
    queryFn: async (): Promise<HomeDataResponse> => {
      const response = await api.get<HomeDataResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/announcements/api/home-data/`,
      )
      return response.data
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
  })

  const workAnnouncements = data?.work_announcement || []
  const serviceAnnouncements = data?.service_announcement || []

  return (
    <div className="bg-white flex items-center justify-center border-b border-gray-300">
      {/* Work Announcements */}
      <Link
        to="/announcements/work/$meta"
        params={{
          meta: workAnnouncements[0]?.meta || '1',
        }}
        className={
          'flex items-center gap-1 relative px-2 py-2 transition-all duration-200 ease-in ' +
          (type === 'announcement' ? 'font-semibold text-brand' : '')
        }
      >
        <span className="icon">
          <MegaphoneIcon />
        </span>
        <span className="text">Ish e'lonlari</span>
        {type === 'announcement' && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand"></span>
        )}
      </Link>

      {/* Service Announcements */}
      <Link
        to="/announcements/service/$meta"
        params={{
          meta: serviceAnnouncements[0]?.meta || '1',
        }}
        className={
          'flex items-center gap-1 relative px-2 py-2 transition-all duration-200 ease-in ' +
          (type === 'service' ? 'font-semibold text-brand' : '')
        }
      >
        <span className="icon">
          <BriefcaseIcon />
        </span>
        <span className="text">Xizmatlar</span>
        {type === 'service' && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand"></span>
        )}
      </Link>

      {/* Create Announcement */}
      <Link
        to="/announcements/create"
        className={
          'flex items-center gap-1 relative px-2 py-2 transition-all duration-200 ease-in ' +
          (type === 'create' ? 'font-semibold text-brand' : '')
        }
      >
        <span className="icon">
          <PlusIcon />
        </span>
        <span className="text">E'lon berish</span>
        {type === 'create' && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand"></span>
        )}
      </Link>
    </div>
  )
}

export default TabsWidget
