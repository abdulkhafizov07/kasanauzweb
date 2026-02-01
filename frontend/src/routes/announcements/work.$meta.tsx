import { useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Loading from '@/components/web/loader'
import { AnnouncementType } from '@/types/announcements'
import TabsWidget from '@/components/web/announcements/tabs'
import { WorkAnnouncementCardWidget } from '@/components/web/announcements/work-card'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BookmarkCheckIcon,
  BookmarkIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
} from 'lucide-react'
import axios from 'axios'
import {
  createFileRoute,
  Link,
  useParams,
  useNavigate,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/auth'

export const Route = createFileRoute('/announcements/work/$meta')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { meta } = useParams({ from: '/announcements/work/$meta' })
  const navigate = useNavigate()

  const {
    data,
    isLoading: loadingDetails,
    refetch,
  } = useQuery({
    queryKey: ['announcement', 'details', meta],
    queryFn: async () => {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/announcements/api/announcement/${meta}/`,
      )
      return data as {
        announcement: AnnouncementType
        announcements: AnnouncementType[]
        saved: boolean
      }
    },
  })

  const currentAnnounce = data?.announcement
  const announcements = data?.announcements || []
  const isSaved = data?.saved ?? false

  const handleConnect = useCallback(async () => {
    if (!currentAnnounce) return
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/town/messages/chats/${currentAnnounce.user.guid}/create/`,
        { announcement: currentAnnounce.guid },
      )
    } catch (err) {
      console.error('Failed to create chat', err)
    }
  }, [currentAnnounce, navigate])

  const handleSaveAnnouncement = async () => {
    if (!currentAnnounce) return
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/announcemennts/api/save/`,
        {
          guid: currentAnnounce.guid,
        },
      )
      refetch() // re-fetch to update `saved` state
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  useEffect(() => {
    document.title = loadingDetails
      ? 'E`lon yuklanmoqda - Kasana.UZ'
      : currentAnnounce?.title
        ? `${currentAnnounce.title} - Kasana.UZ`
        : 'Kasana.UZ'
  }, [currentAnnounce, loadingDetails])

  if (loadingDetails || !currentAnnounce) {
    return (
      <div style={{ height: '100vh' }}>
        <Loading />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-[1366px] px-4">
      <TabsWidget type="announcement" />
      <div className="grid grid-cols-3 gap-4 py-6">
        {/* Left: related announcements */}
        <div className="left">
          <div className="flex flex-wrap justify-between gap-y-3">
            {announcements.map((val) => (
              <WorkAnnouncementCardWidget key={val.guid} value={val} />
            ))}
          </div>
        </div>

        {/* Right: detail view */}
        <div className="right col-span-2">
          <div className="bg-white rounded-lg p-4 pt-0 sticky top-18 min-h-[calc(100vh-221px)] overflow-y-auto">
            <div className="flex items-center gap-2 text-description">
              <img
                src={currentAnnounce.user.pfp}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span>
                {currentAnnounce.user.first_name}{' '}
                {currentAnnounce.user.last_name}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <h1 className="text-2xl font-semibold">
                {currentAnnounce.title}
              </h1>
              <div className="flex gap-2">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveAnnouncement}
                      className={isSaved ? cn('text-brand p-0') : 'p-0'}
                    >
                      {isSaved ? <BookmarkCheckIcon /> : <BookmarkIcon />}
                    </Button>
                    <Button onClick={handleConnect}>Ariza qoldirish</Button>
                  </>
                ) : (
                  <Button asChild>
                    <Link to="/auth/login">{t('sign-in.title')}</Link>
                  </Button>
                )}
              </div>
            </div>

            <ul className="flex flex-col md:flex-row md:justify-between gap-4 my-5">
              <li className="flex items-center gap-3">
                <MapPinIcon size={24} />
                <div>
                  <p className="text-text">Lokatsiya</p>
                  <p className="font-semibold text-text">
                    {currentAnnounce.address}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon size={24} />
                <div>
                  <p className="text-text">Ish vaqti</p>
                  <p className="font-semibold text-text">
                    {
                      {
                        full_time: t('Full time'),
                        part_time: t('Part time'),
                        flexable_time: t('Flexable time'),
                      }[currentAnnounce.work_time]
                    }
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon size={24} />
                <div>
                  <p className="text-text">Ish haqqi</p>
                  <p className="font-semibold text-text">
                    {currentAnnounce.dealed
                      ? 'Kelishiladi'
                      : `${currentAnnounce.price_min} SO'M`}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-5">
              <h2 className="text-gray-800 font-semibold text-lg mb-3">
                Ko'proq ma'lumot
              </h2>
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentAnnounce.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
