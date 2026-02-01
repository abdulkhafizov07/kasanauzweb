import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { hasOne } from '@/lib/has-perm'
import { RenderField } from '@/lib/render-field'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  titleValidator,
  metaValidator,
  shortDescriptionValidator,
  requiredSelect,
} from '@/lib/validators'
import { useAuth } from '@/context/auth'
import LoadingComponent from '@/components/web/loader'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/news/documents/create',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'news:create_document')) &&
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
    keyPrefix: 'admin.news.documents.create',
  })
  const navigate = useNavigate()

  const translationOptions = {
    keyPrefix: 'admin.news.documents.create.fields',
  }

  const form = useForm({
    defaultValues: {
      doc_type: 'legacy_documents',
      title: '',
      meta: '',
      subtitle: '',
      link: '',
      file: null as File | null,
      state: '',
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      for (const [key, val] of Object.entries(value)) {
        if (key === 'file' && val) {
          formData.append(key, val as File)
        } else {
          formData.append(key, String(val ?? ''))
        }
      }

      try {
        const res = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/news/api/dashboard/documents/`,
          formData,
        )
        if (res.status === 201) {
          form.reset()
          navigate({ to: '/admin/news/documents' })
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

  useEffect(() => {
    document.title = `${t('title')} - Kasana.UZ Admin`
  }, [t])

  return (
    <>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">{t('title')}</h3>
      </div>

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <RenderField
          form={form}
          name="doc_type"
          labelKey="doc_type"
          inputComponent={
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholder.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legacy_documents">
                  Qonunchilik hujjatlari
                </SelectItem>
                <SelectItem value="business_documents">
                  Kichik biznes loyihalari
                </SelectItem>
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

        <div className="lg:col-span-3">
          <RenderField
            form={form}
            name="subtitle"
            labelKey="subtitle"
            validator={shortDescriptionValidator}
            inputComponent={
              <Textarea rows={3} placeholder={t('placeholder.subtitle')} />
            }
            translationOptions={translationOptions}
          />
        </div>

        <form.Subscribe selector={(state) => state.values.doc_type}>
          {(value) =>
            value === 'legacy_documents' ? (
              <>
                <RenderField
                  form={form}
                  name="link"
                  labelKey="link"
                  inputComponent={<Input placeholder={t('placeholder.link')} />}
                  translationOptions={translationOptions}
                />
              </>
            ) : (
              <>
                <RenderField
                  form={form}
                  name="file"
                  labelKey="file"
                  inputComponent={<Input type="file" />}
                  translationOptions={translationOptions}
                />
              </>
            )
          }
        </form.Subscribe>

        <RenderField
          form={form}
          name="state"
          labelKey="state"
          validator={requiredSelect}
          inputComponent={
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholder.state')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moderation">
                  {t('select.moderation')}
                </SelectItem>
                <SelectItem value="approved">{t('select.approved')}</SelectItem>
                <SelectItem value="rejected">{t('select.rejected')}</SelectItem>
                <SelectItem value="banned">{t('select.banned')}</SelectItem>
                <SelectItem value="hidden">{t('select.hidden')}</SelectItem>
              </SelectContent>
            </Select>
          }
          translationOptions={translationOptions}
        />

        <div className="lg:col-span-3">
          <Button type="submit">{t('submit')}</Button>
        </div>
      </form>
    </>
  )
}
