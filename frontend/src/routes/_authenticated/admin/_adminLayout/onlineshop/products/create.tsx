import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RenderField } from '@/lib/render-field'
import { useForm, useStore } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import MultiImageUpload from '@/components/ui/multiimage'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ProductCategory } from '@/types/onlineshop'
import { useAuth } from '@/context/auth'
import { hasOne } from '@/lib/has-perm'
import LoadingComponent from '@/components/web/loader'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/onlineshop/products/create',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'onlineshop:create_product')) &&
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
    keyPrefix: 'admin.onlineshop.products.create',
  })
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      title: '',
      meta: '',
      short_description: '',
      description: '',
      price: '',
      price_discount: '',
      state: '',
      user: '',
      category: '',
      images: [],
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      formData.append('title', value.title)
      formData.append('meta', value.meta)
      formData.append('short_description', value.short_description)
      formData.append('description', value.description)
      formData.append('price', value.price)
      formData.append('price_discount', value.price_discount)
      formData.append('state', value.state)
      formData.append('user_phone', value.user)
      formData.append('category_uuid', value.category)

      value.images.forEach((file: File) => {
        formData.append('images_upload', file)
      })

      try {
        const res = await api.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/onlineshop/api/dashboard/products/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        if (res.status === 201) {
          form.reset()
          navigate({ to: '/admin/onlineshop/products' })
        } else {
          throw res
        }
      } catch (err: any) {
        if (err.response?.status === 400) {
          const errorMap: Record<string, string> = {}

          for (const field of Object.keys(err.response.data)) {
            const messages = err.response.data[field] as string[]
            errorMap[field] = messages.join(' ')
          }

          form.setErrorMap({ onChange: { fields: errorMap } })

          return errorMap
        }

        throw err
      }
    },
  })

  const formImages = useStore(form.store, (state) => state.values.images)

  const { data: categories } = useQuery<ProductCategory[]>({
    queryKey: ['admin', 'all-categories'],
    queryFn: async () => {
      const response = await api.get<ProductCategory[]>(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/onlineshop/api/dashboard/categories/all/`,
      )
      return response.data
    },
  })

  useEffect(() => {
    document.title = `${t('title')} - Kasana.UZ Admin`
  }, [t])

  return (
    <>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Maxsulot joylash</h3>
      </div>

      <div>
        <form
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <RenderField
            form={form}
            name="title"
            labelKey="title"
            inputComponent={<Input placeholder={t('placeholder.title')} />}
            translationOptions={{
              keyPrefix: 'admin.onlineshop.products.create.fields',
            }}
          />

          <RenderField
            form={form}
            name="meta"
            labelKey="meta"
            inputComponent={<Input placeholder={t('placeholder.meta')} />}
            translationOptions={{
              keyPrefix: 'admin.onlineshop.products.create.fields',
            }}
          />

          <div className="lg:col-span-3">
            <RenderField
              form={form}
              name="short_description"
              labelKey="short_description"
              inputComponent={
                <Textarea
                  rows={4}
                  placeholder={t('placeholder.short_description')}
                />
              }
              translationOptions={{
                keyPrefix: 'admin.onlineshop.products.create.fields',
              }}
            />
          </div>

          <div className="lg:col-span-3">
            <RenderField
              form={form}
              name="description"
              labelKey="description"
              inputComponent={
                <Textarea rows={4} placeholder={t('placeholder.description')} />
              }
              translationOptions={{
                keyPrefix: 'admin.onlineshop.products.create.fields',
              }}
            />
          </div>

          <RenderField
            form={form}
            name="price"
            labelKey="price"
            inputComponent={
              <Input type="number" placeholder={t('placeholder.price')} />
            }
            translationOptions={{
              keyPrefix: 'admin.onlineshop.products.create.fields',
            }}
          />

          <RenderField
            form={form}
            name="price_discount"
            labelKey="price_discount"
            inputComponent={
              <Input
                type="number"
                placeholder={t('placeholder.price_discount')}
              />
            }
            translationOptions={{
              keyPrefix: 'admin.onlineshop.products.create.fields',
            }}
          />

          <RenderField
            form={form}
            name="state"
            labelKey="state"
            inputComponent={
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('placeholder.state')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderation">
                    {t('select.moderation')}
                  </SelectItem>
                  <SelectItem value="approved">
                    {t('select.approved')}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {t('select.rejected')}
                  </SelectItem>
                  <SelectItem value="banned">{t('select.banned')}</SelectItem>
                  <SelectItem value="hidden">{t('select.hidden')}</SelectItem>
                </SelectContent>
              </Select>
            }
            translationOptions={{
              keyPrefix: 'admin.onlineshop.products.create.fields',
            }}
          />

          <RenderField
            form={form}
            name="user"
            labelKey="user"
            inputComponent={
              <PhoneInput
                countries={['UZ']}
                defaultCountry="UZ"
                placeholder="99 999 99 99"
              />
            }
            translationOptions={{
              keyPrefix: 'admin.onlineshop.products.create.fields',
            }}
          />

          <RenderField
            form={form}
            name="category"
            labelKey="category"
            inputComponent={
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('placeholder.category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: ProductCategory) => (
                    <SelectItem key={cat.guid} value={cat.guid}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            translationOptions={{
              keyPrefix: 'admin.onlineshop.products.create.fields',
            }}
          />

          <div className="lg:col-span-3">
            <RenderField
              form={form}
              name="images"
              inputComponent={<MultiImageUpload value={formImages} />}
              labelKey="images"
              translationOptions={{
                keyPrefix: 'admin.onlineshop.products.create.fields',
              }}
            />
          </div>

          <div className="lg:col-span-3">
            <Button type="submit">{t('submit')}</Button>
          </div>
        </form>
      </div>
    </>
  )
}
