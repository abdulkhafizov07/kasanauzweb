import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Loading from '@/components/web/loader'
import { announcementsApi, usersApi, messagesApi } from '@/server'
import { useAnnouncements } from '@/context/announcements'
import { useChatContext } from '@/context/messenger'
import { AnnouncementType } from '@/types/announcements'
import TabsWidget from '@/components/web/announcements/tabs'
import { AnnouncementCardWidget } from '@/components/web/announcements/work-card'
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
import { useUserContext } from '@/context/user'

const AnnouncementPage: React.FC = () => {
  const { t } = useTranslation()
  const { loading, userSavedAnnouncements, addToSaved, removeFromSaved } =
    useAnnouncements()
  const { fetchChatsData, changeChat } = useChatContext()
  const { isAuthenticated } = useUserContext()
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([])
  const [currentAnnounce, setCurrentAnnounce] =
    useState<AnnouncementType | null>(null)
  const { meta } = useParams<{ meta: string }>()
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoadingDetails(true)
    try {
      const { data } = await axios.get(
        `${announcementsApi}announcement/${meta}/`,
      )
      setCurrentAnnounce(data.announcement)
      setAnnouncements(data.announcements)
    } catch (err) {
      console.error('Failed to fetch announcement', err)
    } finally {
      setLoadingDetails(false)
    }
  }, [meta])

  const isSaved = () =>
    !!userSavedAnnouncements.find((val) => val.guid === currentAnnounce?.guid)

  const handleConnect = async () => {
    if (!currentAnnounce) return
    try {
      const { data } = await axios.post(
        `${messagesApi}chats/${currentAnnounce.user.guid}/create/`,
        { announcement: currentAnnounce.guid },
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
    if (!currentAnnounce) return
    try {
      const res = await axios.post(`${announcementsApi}save/`, {
        guid: currentAnnounce.guid,
      })
      if (res.status === 200) {
        res.data.liked
          ? addToSaved(currentAnnounce)
          : removeFromSaved(currentAnnounce)
      }
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    document.title = loadingDetails
      ? 'E`lon yuklanmoqda - Kasana.UZ'
      : currentAnnounce?.title + ' - Kasana.UZ'
  }, [currentAnnounce, loadingDetails])

  if (loading || loadingDetails || !currentAnnounce) {
    return (
      <div style={{ height: '100vh' }}>
        <Loading />
      </div>
    )
  }

  return (
    <div className="bg-gray-100">
      <TabsWidget type="announcement" />
      <div className="container mx-auto max-w-[1366px] py-6">
        <div className="grid grid-cols-3 space-x-4">
          <div className="left">
            <div className="flex flex-wrap justify-between gap-y-3">
              {announcements.map((val, i) => (
                <AnnouncementCardWidget key={i} value={val} />
              ))}
            </div>
          </div>

          <div className="right col-span-2">
            <div className="bg-white rounded-lg p-4 sticky top-18 min-h-[calc(100vh-221px)] overflow-y-auto">
              <div className="flex items-center gap-2 text-description">
                <img
                  src={`${usersApi?.replace('/api/', '')}${
                    currentAnnounce.user.pfp
                  }`}
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
                      {currentAnnounce.argued
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
    </div>
  )
}

export default AnnouncementPage
