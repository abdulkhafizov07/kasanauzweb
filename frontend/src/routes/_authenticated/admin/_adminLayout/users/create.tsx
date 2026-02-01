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
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import regions from '@/data/regions.json'
import districts from '@/data/districts.json'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  middleNameValidator,
  phoneValidator,
} from '@/lib/validators'
import { PhoneInput } from '@/components/ui/phone-input'
import { useAuth } from '@/context/auth'
import { hasOne } from '@/lib/has-perm'
import LoadingComponent from '@/components/web/loader'

export const Route = createFileRoute(
  '/_authenticated/admin/_adminLayout/users/create',
)({
  component: () => {
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
      auth.getUserProfile()

      if (!(auth.isLoading || auth.isUserLoading)) {
        const permissions = auth.user?.permissions || {}

        if (
          !(permissions || hasOne(permissions, 'users:create_user')) &&
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
    keyPrefix: 'admin.users.create',
  })

  const form = useForm({
    defaultValues: {
      pfp: null as File | null,
      first_name: '',
      last_name: '',
      middle_name: '',
      phone: '',
      email: '',
      birthday: '',
      region: '',
      district: '',
      gender: '',
      purposes: '',
      about: '',
      biography: '',
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()

      Object.entries(value).forEach(([key, val]) => {
        if (val !== null && val !== '') {
          formData.append(key, val as any)
        }
      })

      try {
        const res = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/api/dashboard/users/`,
          formData,
        )

        if (res.status !== 201) {
          throw res
        }

        form.reset()
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

  const formRegion = useStore(form.store, (state) => state.values.region)
  const selectedDistricts = useMemo(() => {
    form.setFieldValue('district', '')

    return districts.filter((value) => value.region_id === Number(formRegion))
  }, [formRegion])

  useEffect(() => {
    document.title = `${t('title')} - Kasana.UZ Admin`
  }, [t])

  return (
    <>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">Foydalanuvchi yaratish</h3>
      </div>

      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <RenderField
                form={form}
                name="pfp"
                labelKey="image"
                inputComponent={
                  <Input type="file" placeholder={t('placeholder.image')} />
                }
                translationOptions={{
                  keyPrefix: 'admin.users.create.fields',
                }}
                validator={(file) => {
                  if (!file) return ''
                  if (
                    !['image/jpeg', 'image/jpg', 'image/png'].includes(
                      file.type,
                    )
                  ) {
                    return 'Faqat jpeg yoki png yuklang'
                  }
                  return ''
                }}
              />
            </div>
            <RenderField
              form={form}
              name="first_name"
              labelKey="first_name"
              inputComponent={
                <Input placeholder={t('placeholder.first_name')} />
              }
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
              validator={firstNameValidator}
            />
            <RenderField
              form={form}
              name="last_name"
              labelKey="last_name"
              inputComponent={
                <Input placeholder={t('placeholder.last_name')} />
              }
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
              validator={lastNameValidator}
            />
            <RenderField
              form={form}
              name="middle_name"
              labelKey="middle_name"
              inputComponent={
                <Input placeholder={t('placeholder.middle_name')} />
              }
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
              validator={middleNameValidator}
            />
            <RenderField
              form={form}
              name="phone"
              labelKey="phone"
              inputComponent={
                <PhoneInput
                  countries={['UZ']}
                  defaultCountry="UZ"
                  placeholder={t('placeholder.phone')}
                />
              }
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
              validator={phoneValidator}
            />
            <RenderField
              form={form}
              name="email"
              labelKey="email"
              inputComponent={<Input placeholder={t('placeholder.email')} />}
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
              validator={emailValidator}
            />
            <RenderField
              form={form}
              name="birthday"
              labelKey="birthday"
              inputComponent={<Input type="date" />}
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
            />
            <RenderField
              form={form}
              name="region"
              labelKey="region"
              inputComponent={
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('placeholder.region')} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((value) => (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.name_uz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
            />
            <RenderField
              form={form}
              name="district"
              labelKey="district"
              inputComponent={
                <Select>
                  <SelectTrigger disabled={selectedDistricts.length === 0}>
                    <SelectValue placeholder={t('placeholder.district')} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDistricts.map((value) => (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.name_uz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
            />
            <RenderField
              form={form}
              name="gender"
              labelKey="gender"
              inputComponent={
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('placeholder.gender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('select.male')}</SelectItem>
                    <SelectItem value="1">{t('select.female')}</SelectItem>
                  </SelectContent>
                </Select>
              }
              translationOptions={{
                keyPrefix: 'admin.users.create.fields',
              }}
            />
            <div className="lg:col-span-3">
              <RenderField
                form={form}
                name="purposes"
                labelKey="purposes"
                inputComponent={
                  <Input placeholder={t('placeholder.purposes')} />
                }
                translationOptions={{
                  keyPrefix: 'admin.users.create.fields',
                }}
              />
            </div>
            <div className="lg:col-span-3 flex items-start justify-start gap-4">
              <div className="w-full">
                <RenderField
                  form={form}
                  name="about"
                  labelKey="about"
                  inputComponent={
                    <Textarea rows={5} placeholder={t('placeholder.about')} />
                  }
                  translationOptions={{
                    keyPrefix: 'admin.users.create.fields',
                  }}
                />
              </div>

              <div className="w-full">
                <RenderField
                  form={form}
                  name="biography"
                  labelKey="biography"
                  inputComponent={
                    <Textarea
                      rows={5}
                      placeholder={t('placeholder.biography')}
                    />
                  }
                  translationOptions={{
                    keyPrefix: 'admin.users.create.fields',
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <Button>Submit</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
