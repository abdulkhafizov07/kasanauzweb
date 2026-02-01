import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import ChatWindow from '@/components/web/profile/messages'

export const Route = createFileRoute(
  '/_authenticated/profile/_profileLayout/messenger',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeChat, setActiveChat] = useState<string | null>(null)

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const res = await api.get('/town/messages/chats/')
      return res.data
    },
  })

  return (
    <>
      <div className="aspect-video">
        <div className="w-full h-full grid grid-cols-3 gap-4 pb-4">
          <div className="flex flex-col gap-4 bg-gray-50 rounded-lg overflow-y-auto">
            {isLoading && <div className="p-4">Suhbatlar yuklanmoqda...</div>}

            {chats?.length === 0 && !isLoading && (
              <div className="p-4 text-gray-400 text-sm">
                No chats available
              </div>
            )}

            {chats?.map((chat: any) => (
              <div
                key={chat.guid}
                className={cn(
                  'rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 border-2 border-transparent transition-colors',
                  activeChat === chat.guid && 'bg-gray-100 border-gray-200',
                )}
                onClick={() => setActiveChat(chat.guid)}
              >
                <img
                  src={chat.pfp}
                  alt="pfp"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 truncate">
                  <p
                    className={
                      'font-medium truncate ' +
                      (activeChat === chat.guid
                        ? 'text-brand'
                        : 'text-gray-900')
                    }
                  >
                    {chat.title}
                  </p>

                  <p className="max-w-full min-w-full text-sm text-gray-500 truncate overflow-hidden">
                    {chat.last_message?.type === 'product'
                      ? "Maxsulot jo'natilingan"
                      : chat.last_message?.type === 'announcement'
                        ? "E`lon jo'natilingan"
                        : chat.last_message?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-2 overflow-y-auto">
            {activeChat ? (
              <ChatWindow chatGuid={activeChat} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <b>Suhbatni tanlang</b>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
