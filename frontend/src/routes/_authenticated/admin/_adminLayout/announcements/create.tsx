import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { hasOne } from '@/lib/has-perm'
import { RenderField } from '@/lib/render-field'
import { useForm, useStore } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import regions from '@/data/regions.json'
import districts from '@/data/districts.json'

// Validatorlar
import {
  phoneValidator,
  titleValidator,
  metaValidator,
  priceValidator,
  shortDescriptionValidator,
  descriptionValidator,
  addressValidator,
  experienceValidator,
  requiredSelect,
  announcementTypeValidator,
  workTimeValidator,
} from '@/lib/validators'
import LoadingComponent from '@/components/web/loader'
import { useAuth } from '@/context/auth'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/announcements/create',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(
            permissions ||
            hasOne(permissions, 'announcements:create_announcement')
          ) &&
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
    keyPrefix: 'admin.announcements.create',
  })
  const navigate = useNavigate()

  const translationOptions = {
    keyPrefix: 'admin.announcements.create.fields',
  }

  const form = useForm({
    defaultValues: {
      user_phone: '',
      announcement_type: '',
      title: '',
      meta: '',
      state: '',
      thumbnail: null as File | null,
      price_min: '',
      price_max: '',
      dealed: false,
      region: '',
      district: '',
      address: '',
      experience: '',
      work_time: '',
      short_description: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      // If dealed = true, prices should be null
      if (value.dealed) {
        value.price_min = null as any
        value.price_max = null as any
      } else if (
        Number(value.price_min) > 0 &&
        Number(value.price_max) > 0 &&
        Number(value.price_min) > Number(value.price_max)
      ) {
        form.setErrorMap({
          onChange: {
            price_max: 'Maksimal narx minimal narxdan katta bo‘lishi kerak',
          },
        })
        return
      }

      const formData = new FormData()
      for (const [key, val] of Object.entries(value)) {
        if (key === 'thumbnail' && val) {
          formData.append(key, val as File)
        } else if (val !== null && val !== '') {
          formData.append(key, String(val))
        }
      }

      try {
        const res = await api.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/announcements/api/dashboard/announcements/`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        if (res.status === 201) {
          form.reset()
          navigate({
            to: '/admin/announcements/$type',
            params: { type: 'all' },
          })
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

  const formRegion = useStore(form.store, (s) => s.values.region)
  const formDealed = useStore(form.store, (s) => s.values.dealed)

  const selectedDistricts = useMemo(
    () => districts.filter((d) => d.region_id === Number(formRegion)),
    [formRegion],
  )

  useEffect(() => {
    form.setFieldValue('district', '')
  }, [formRegion])

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
          name="user_phone"
          labelKey="user"
          validator={phoneValidator}
          inputComponent={<PhoneInput countries={['UZ']} defaultCountry="UZ" />}
          translationOptions={translationOptions}
        />

        <RenderField
          form={form}
          name="announcement_type"
          labelKey="announcement_type"
          validator={announcementTypeValidator}
          inputComponent={
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholder.announcement_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service_announcement">
                  {t('select.service_announcement')}
                </SelectItem>
                <SelectItem value="work_announcement">
                  {t('select.work_announcement')}
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
        </div>

        <div className="lg:col-span-3">
          <RenderField
            form={form}
            name="description"
            labelKey="description"
            validator={descriptionValidator}
            inputComponent={
              <Textarea rows={6} placeholder={t('placeholder.description')} />
            }
            translationOptions={translationOptions}
          />
        </div>

        <div className="lg:col-span-3 flex items-center gap-4">
          <RenderField
            form={form}
            name="dealed"
            labelKey="dealed"
            inputComponent={<Checkbox />}
            translationOptions={translationOptions}
          />

          <RenderField
            form={form}
            name="price_min"
            labelKey="price_min"
            validator={!formDealed ? priceValidator : undefined}
            inputComponent={
              <Input
                type="number"
                disabled={formDealed}
                placeholder={t('placeholder.price_min')}
              />
            }
            translationOptions={translationOptions}
          />
          <RenderField
            form={form}
            name="price_max"
            labelKey="price_max"
            validator={!formDealed ? priceValidator : undefined}
            inputComponent={
              <Input
                type="number"
                disabled={formDealed}
                placeholder={t('placeholder.price_max')}
              />
            }
            translationOptions={translationOptions}
          />
        </div>

        <div className="lg:col-span-3">
          <RenderField
            form={form}
            name="thumbnail"
            labelKey="thumbnail"
            inputComponent={<Input type="file" />}
            translationOptions={translationOptions}
          />
        </div>

        <RenderField
          form={form}
          name="region"
          labelKey="region"
          validator={requiredSelect}
          inputComponent={
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholder.region')} />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.name_uz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          translationOptions={translationOptions}
        />

        <RenderField
          form={form}
          name="district"
          labelKey="district"
          validator={requiredSelect}
          inputComponent={
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholder.district')} />
              </SelectTrigger>
              <SelectContent>
                {selectedDistricts.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name_uz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          translationOptions={translationOptions}
        />

        <RenderField
          form={form}
          name="address"
          labelKey="address"
          validator={addressValidator}
          inputComponent={<Input placeholder={t('placeholder.address')} />}
          translationOptions={translationOptions}
        />

        <RenderField
          form={form}
          name="experience"
          labelKey="experience"
          validator={experienceValidator}
          inputComponent={<Input placeholder={t('placeholder.experience')} />}
          translationOptions={translationOptions}
        />

        <RenderField
          form={form}
          name="work_time"
          labelKey="work_time"
          validator={workTimeValidator}
          inputComponent={
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('placeholder.work_time')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">
                  {t('select.full_time')}
                </SelectItem>
                <SelectItem value="part_time">
                  {t('select.part_time')}
                </SelectItem>
                <SelectItem value="flexable_time">
                  {t('select.flexable_time')}
                </SelectItem>
              </SelectContent>
            </Select>
          }
          translationOptions={translationOptions}
        />

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
