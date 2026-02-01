import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '@/components/web/loader'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { announcementsApi, messagesApi, usersApi } from '@/server'
import axios from 'axios'
import { useAnnouncements } from '@/context/announcements'
import { AnnouncementType } from '@/types/announcements'
import TabsWidget from '@/components/web/announcements/tabs'
import { ServiceCardWidget } from '@/components/web/announcements/service-card'
import { useUserContext } from '@/context/user'
import { Button } from '@/components/ui/button'
import {
  BookmarkCheckIcon,
  BookmarkIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
} from 'lucide-react'
import { useChatContext } from '@/context/messenger'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const ServicePage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { loading, addToSaved, removeFromSaved, userSavedAnnouncements } =
    useAnnouncements()
  const { isAuthenticated } = useUserContext()
  const { fetchChatsData, changeChat } = useChatContext()

  const [loadingDetails, setLoadingDetails] = useState<boolean>(true)
  const [currentService, setCurrentService] = useState<AnnouncementType | null>(
    null,
  )
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([])
  const { meta } = useParams<{ meta: string }>()

  const fetchData = async () => {
    setLoadingDetails(true)
    axios.get(`${announcementsApi}announcement/${meta}/`).then((response) => {
      if (response.status === 200) {
        setCurrentService(response.data.announcement)
        setAnnouncements(response.data.announcements)
      }
    })
  }

  useEffect(() => {
    setLoadingDetails(true)
    axios.get(`${announcementsApi}announcement/${meta}/`).then((response) => {
      if (response.status === 200) {
        setCurrentService(response.data.announcement)
        setLoadingDetails(false)
      }
    })
  }, [meta])

  const isSaved = () =>
    !!userSavedAnnouncements.find((val) => val.guid === currentService?.guid)

  const handleConnect = async () => {
    if (!currentService) return
    try {
      const { data } = await axios.post(
        `${messagesApi}chats/${currentService.user.guid}/create/`,
        { announcement: currentService.guid },
      )
      fetchChatsData(() => {
        if (data.guid) {
          changeChat(data.guid)
          navigate('/profile/messages/')
        }
      })
    } catch (err) {
      console.error('Failed to create chat', err)
    }
  }

  const handleSaveAnnouncement = async () => {
    if (!currentService) return
    try {
      const res = await axios.post(`${announcementsApi}save/`, {
        guid: currentService.guid,
      })
      if (res.status === 200) {
        res.data.liked
          ? addToSaved(currentService)
          : removeFromSaved(currentService)
      }
    } catch (err) {
      console.error('Save failed', err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [meta])

  useEffect(() => {
    document.title = loadingDetails
      ? 'E`lon yuklanmoqda - Kasana.UZ'
      : currentService?.title + ' - Kasana.UZ'
  }, [currentService, loadingDetails])

  if (loading || loadingDetails) {
    return (
      <div style={{ height: '100vh' }}>
        <Loading />
      </div>
    )
  }

  if (!currentService) {
    return <div>No announcement found</div>
  }

  return (
    <div className="w-full h-full bg-bg-placeholder">
      <TabsWidget type="service" />

      <div className="container mx-auto max-w-[1366px] p-4">
        <div className="grid grid-cols-3 space-x-4">
          <div className="left">
            <div className="announcements-cards flex flex-wrap justify-between gap-y-4">
              {announcements.length > 0 ? (
                announcements.map((value, index) => (
                  <ServiceCardWidget key={index} value={value} />
                ))
              ) : (
                <>
                  <p>Aloqador e`lonlar yo'q</p>
                </>
              )}
            </div>
          </div>

          <div className="right col-span-2">
            <div className="bg-white rounded-lg p-4 sticky top-18 min-h-[calc(100vh-221px)] overflow-y-auto">
              <div className="thumbnail aspect-[16/9] mb-3 rounded-lg overflow-hidden">
                <img
                  src={`${announcementsApi?.replace('/api/', '')}${
                    currentService.thumbnail
                  }`}
                  alt={currentService.title}
                />
              </div>
              <div className="flex items-center gap-2 text-description">
                <img
                  src={`${usersApi?.replace('/api/', '')}${
                    currentService.user.pfp
                  }`}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span>
                  {currentService.user.first_name}{' '}
                  {currentService.user.last_name}
                </span>
              </div>
              `
              <div className="flex items-center justify-between mt-2">
                <h1 className="text-2xl font-semibold">
                  {currentService.title}
                </h1>
                <div className="flex gap-2">
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveAnnouncement}
                        className={isSaved() ? cn('text-brand p-0') : ''}
                      >
                        {isSaved() ? <BookmarkCheckIcon /> : <BookmarkIcon />}
                      </Button>
                      <Button onClick={handleConnect}>Ariza qoldirish</Button>
                    </>
                  ) : (
                    <>
                      <Button asChild>
                        <Link to={'/auth/sign-in'}>{t('sign-in.title')}</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <ul className="flex flex-col md:flex-row md:justify-between gap-4 my-5">
                <li className="flex items-center gap-3">
                  <MapPinIcon size={24} />
                  <div>
                    <p className="text-text">Lokatsiya</p>
                    <p className="font-semibold text-text">
                      {currentService.address}
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
                        }[currentService.work_time]
                      }
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon size={24} />
                  <div>
                    <p className="text-text">Ish haqqi</p>
                    <p className="font-semibold text-text">
                      {currentService.argued
                        ? 'Kelishiladi'
                        : `${currentService.price_min} SO'M`}
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
                    {currentService.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicePage
