import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, useStore } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { RenderField } from '@/lib/render-field'
import {
  titleValidator,
  shortDescriptionValidator,
  descriptionValidator,
  requiredSelect,
  metaValidator,
} from '@/lib/validators'
import { Editor } from '@/components/blocks/editor-00/editor'
import { useAuth } from '@/context/auth'
import LoadingComponent from '@/components/web/loader'
import { hasOne } from '@/lib/has-perm'
import { cn } from '@/lib/utils'
import { CourseCategory } from '@/types/courses'
import { useState } from 'react'
import { YouTubeInput } from '@/components/ui/youtube-input'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/courses/courses/create',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}
        if (
          !(permissions || hasOne(permissions, 'courses:create_course')) &&
          auth.user?.role !== 'admin'
        ) {
          navigate({ to: '/auth/login' })
        }
      }
    }, [auth])

    return auth.isLoading || auth.isUserLoading ? (
      <LoadingComponent />
    ) : (
      <RouteComponent />
    )
  },
})

function RouteComponent() {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'admin.courses.create',
  })
  const navigate = useNavigate()

  const translationOptions = { keyPrefix: 'admin.courses.create.fields' }

  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [tab, setTab] = useState('main')

  const form = useForm({
    defaultValues: {
      category: '',
      title: '',
      meta: '',
      short_description: '',
      description: '',
      thumbnail: null as File | null,
      lessons: [{ order: 1, video: '' }],
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()

      const coursePayload = {
        category: value.category,
        title: value.title,
        meta: value.meta,
        state: 'approved',
        short_description: value.short_description,
        description: value.description,
      }

      formData.append('course', JSON.stringify(coursePayload))
      formData.append('lessons', JSON.stringify(value.lessons))
      if (value.thumbnail) {
        formData.append('thumbnail', value.thumbnail)
      }

      try {
        const res = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/courses/api/dashboard/courses/`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        if (res.status === 201) {
          form.reset()
          navigate({ to: `/admin/courses/courses` })
        }
      } catch (err: any) {
        if (err.response?.status === 400) {
          const errorMap: Record<string, string> = {}
          for (const field of Object.keys(err.response.data)) {
            errorMap[field] = (err.response.data[field] as string[]).join(' ')
          }
          form.setErrorMap({ onChange: { fields: errorMap } })
          return errorMap
        }
        throw err
      }
    },
  })

  const lessons = useStore(form.store, (s) => s.values.lessons)

  useEffect(() => {
    document.title = `${t('title')} - Kasana.UZ Admin`
  }, [t])

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_BACKEND_URL}/courses/api/categories/`)
      .then((res) => {
        setCategories(res.data)
      })
  }, [])

  return (
    <div className="px-3">
      <div className="page-title mb-3">
        <h3 className="text-2xl font-semibold">{t('title')}</h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="bg-white rounded-lg p-4 space-y-5"
      >
        <div className="flex items-center justify-start">
          <Button
            type="button"
            onClick={() => setTab('main')}
            className={cn(
              'bg-transparent border-0 border-b-2 rounded-none',
              tab === 'main'
                ? 'border-brand text-brand hover:bg-brand/15'
                : 'border-black/40 text-black/40 hover:bg-muted',
            )}
          >
            {t('tabs.main')}
          </Button>
          <Button
            type="button"
            onClick={() => setTab('lessons')}
            className={cn(
              'bg-transparent border-0 border-b-2 rounded-none',
              tab === 'lessons'
                ? 'border-brand text-brand hover:bg-brand/15'
                : 'border-black/40 text-black/40 hover:bg-muted',
            )}
          >
            {t('tabs.lessons')}
          </Button>
          <div className="w-full h-11 border-b-2 border-black/20"></div>
        </div>

        {tab === 'main' && (
          <div className="space-y-4">
            <RenderField
              form={form}
              name="category"
              labelKey="category"
              validator={requiredSelect}
              inputComponent={
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('placeholder.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.guid} value={String(cat.guid)}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              translationOptions={translationOptions}
            />

            <RenderField
              form={form}
              name="title"
              labelKey="title"
              validator={titleValidator}
              inputComponent={<Input placeholder={t('placeholder.title')} />}
              translationOptions={translationOptions}
            />

            <RenderField
              form={form}
              name="meta"
              labelKey="meta"
              validator={metaValidator}
              inputComponent={<Input placeholder={t('placeholder.meta')} />}
              translationOptions={translationOptions}
            />

            <RenderField
              form={form}
              name="thumbnail"
              labelKey="thumbnail"
              inputComponent={<Input type="file" />}
              translationOptions={translationOptions}
            />

            <RenderField
              form={form}
              name="short_description"
              labelKey="short_description"
              validator={shortDescriptionValidator}
              inputComponent={
                <Textarea
                  rows={3}
                  placeholder={t('placeholder.short_description')}
                />
              }
              translationOptions={translationOptions}
            />

            <RenderField
              form={form}
              name="description"
              labelKey="description"
              validator={descriptionValidator}
              inputComponent={<Editor value="" />}
              translationOptions={translationOptions}
            />
          </div>
        )}

        {tab === 'lessons' && (
          <div className="space-y-4">
            {lessons.map((_, index) => (
              <div key={index} className="space-y-2">
                <RenderField
                  form={form}
                  name={`lessons.${index}.order`}
                  labelKey="order"
                  inputComponent={<Input type="number" disabled />}
                  translationOptions={translationOptions}
                />

                <RenderField
                  form={form}
                  name={`lessons.${index}.video`}
                  labelKey="video"
                  inputComponent={<YouTubeInput value="" onChange={() => {}} />}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    form.setFieldValue(
                      'lessons',
                      lessons
                        .filter((_, i) => i !== index)
                        .map((lesson, i) => ({ ...lesson, order: i + 1 })),
                    )
                  }}
                >
                  Darsni o‘chirish
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setFieldValue(
                  'lessons',
                  [...lessons, { order: lessons.length + 1, video: '' }].map(
                    (lesson, i) => ({ ...lesson, order: i + 1 }),
                  ),
                )
              }}
            >
              Yangi dars qo‘shish
            </Button>
          </div>
        )}

        <Button type="submit" className="mt-4">
          {t('submit')}
        </Button>
      </form>
    </div>
  )
}
