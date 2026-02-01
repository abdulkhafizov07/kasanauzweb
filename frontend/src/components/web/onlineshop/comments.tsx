import React, { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { normalizeDateTime } from '@/utils'
import api from '@/lib/api'
import { ProductType } from '@/types/onlineshop'
import { UserType } from '@/types/user'
import { ReplyIcon } from 'lucide-react'

interface CommentType {
  guid: string
  user: UserType
  comment: string
  created_at: string
  replies?: CommentType[]
}

interface CommentsWidgetProps {
  product: ProductType
}

const CommentWidget: React.FC<{
  comment: CommentType
  replyingTo: string | null
  setReplyingTo: (id: string | null) => void
  onReply: (commentId: string, text: string) => void
}> = ({ comment, replyingTo, setReplyingTo, onReply }) => {
  const [replyText, setReplyText] = useState('')
  const isReplying = replyingTo === comment.guid

  const handleReplySubmit = () => {
    if (!replyText.trim()) return
    onReply(comment.guid, replyText)
    setReplyText('')
    setReplyingTo(null)
  }

  return (
    <div
      className={`py-2 ${
        comment.replies ? '' : 'border-l-2 border-brand px-4 ml-4'
      }`}
    >
      <div className="flex items-center gap-2">
        <img
          src={comment.user.pfp || '/placeholder.png'}
          alt={comment.user.first_name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex justify-between items-center w-full">
          <div>
            <h3>{`${comment.user.first_name} ${comment.user.last_name}`}</h3>
            <p className="text-sm text-muted-foreground">
              {normalizeDateTime(comment.created_at)}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(isReplying ? null : comment.guid)}
            className="flex gap-2 items-center px-3 py-1 text-sm border rounded-lg"
          >
            <span>Javob berish</span>
            <ReplyIcon size={16} />
          </button>
        </div>
      </div>

      <div className="mt-2">{comment.comment}</div>

      {isReplying && (
        <div className="mt-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Javob yozing..."
          />
          <div className="mt-2 text-right">
            <Button onClick={handleReplySubmit} disabled={!replyText.trim()}>
              Yuborish
            </Button>
          </div>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentWidget
          key={reply.guid}
          comment={reply}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          onReply={onReply}
        />
      ))}
    </div>
  )
}

const CommentsWidget: React.FC<CommentsWidgetProps> = ({ product }) => {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [comments, setComments] = useState<CommentType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/onlineshop/api/comments/${
          product.guid
        }/`,
      )
      setComments(res.data.results)
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [product.meta])

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    try {
      setLoading(true)
      await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/onlineshop/api/comments/`,
        {
          product: product.guid,
          text: newComment,
        },
      )
      setNewComment('')
      await fetchComments()
    } catch (err) {
      console.error('Error posting comment:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (commentId: string, replyText: string) => {
    if (!replyText.trim()) return
    try {
      setLoading(true)
      await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/onlineshop/api/comments/reply/`,
        {
          comment: commentId,
          text: replyText,
        },
      )
      await fetchComments()
    } catch (err) {
      console.error('Error posting reply:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comments-section my-6">
      <div className="mb-4">
        <Textarea
          placeholder="Fikringizni yozing..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="mt-2 text-right">
          <Button
            onClick={handleCommentSubmit}
            disabled={!newComment.trim() || loading}
          >
            {loading ? 'Yuborilmoqda...' : 'Yuborish'}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground">Fikrlar mavjud emas</p>
      ) : (
        comments.map((comment) => (
          <CommentWidget
            key={comment.guid}
            comment={comment}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            onReply={handleReply}
          />
        ))
      )}
    </div>
  )
}

export default CommentsWidget
