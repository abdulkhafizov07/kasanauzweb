import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendIcon } from 'lucide-react'

export default function ChatWindow({ chatGuid }: { chatGuid: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ws = new WebSocket(
      `${import.meta.env.VITE_BACKEND_URL.replace(
        'http',
        'ws',
      )}/town/ws/chat/${chatGuid}/`,
    )
    wsRef.current = ws

    ws.onopen = () => {
      console.log('✅ WebSocket connected')

      const token = window.localStorage.getItem('accessToken')
      if (token) {
        ws.send(
          JSON.stringify({
            event: 'auth',
            token,
          }),
        )
      }
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.event === 'message') {
        setMessages((prev) => [...prev, msg])
      } else if (msg.event === 'auth') {
        ws.send(JSON.stringify({ event: 'fetch' }))
      } else if (msg.event === 'fetch') {
        const imessages = Array.from(msg.messages)
        imessages.reverse()
        setMessages(imessages)
      }
    }

    ws.onclose = () => console.log('❌ WebSocket disconnected')

    return () => ws.close()
  }, [chatGuid])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTo({
        top: bottomRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  const sendMessage = () => {
    if (input.trim() && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          event: 'message',
          content: input,
          type: 'text',
        }),
      )
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2" ref={bottomRef}>
        {messages.map((m) => (
          <div
            key={m.guid || Math.random()}
            className={cn(
              'p-2 rounded-md max-w-fit min-w-fit',
              m.is_self
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-200 self-start',
            )}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-t flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Xabar matni..."
        />
        <Button onClick={sendMessage} className="flex gap-1">
          <SendIcon size={16} /> Yuborish
        </Button>
      </div>
    </div>
  )
}
