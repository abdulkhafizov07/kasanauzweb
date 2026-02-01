import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import regions from '@/data/regions.json'
import districts from '@/data/districts.json'

import LoadingComponent from '@/components/web/loader'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { RenderField } from '@/lib/render-field'
import {
  firstNameValidator,
  lastNameValidator,
  middleNameValidator,
  requiredSelect,
  phoneValidator,
} from '@/lib/validators'
import { useAuth } from '@/context/auth'
import { CheckIcon } from 'lucide-react'
import { PhoneInput } from '@/components/ui/phone-input'
import api from '@/lib/api'

const purposesList = [
  'Ish topish maqsadida',
  'Xizmatingizni tanitish uchun',
  'Ishchi yollash uchun',
  'Yangiliklarni kuzatish',
  'Boshqa maqsadda',
]

export const Route = createFileRoute(
  '/_authenticated/profile/_profileLayout/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isUserLoading: isLoading, getUserProfile } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      middle_name: '',
      phone: '',
      email: '',
      birthday: '',
      region: '',
      district: '',
      about: '',
      biography: '',
      purposes: [] as string[],
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()

      for (const key in value) {
        const v = (value as any)[key]

        if (Array.isArray(v)) {
          formData.append(key, v.join(', ').trim())
        } else if (v) {
          formData.append(key, v)
        }
      }

      try {
        await api.patch(
          `${import.meta.env.VITE_BACKEND_URL}/users/api/profile/`,
          formData,
        )
        await queryClient.invalidateQueries({
          queryKey: ['auth', 'profile'],
        })
        navigate({ to: '/profile/overview' })
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    },
  })

  // 🔹 Prefill form with user data
  useEffect(() => {
    if (!user) return

    // normalize null → "" for form
    form.setFieldValue('first_name', user.first_name || '')
    form.setFieldValue('last_name', user.last_name || '')
    form.setFieldValue('middle_name', user.middle_name || '')
    form.setFieldValue('phone', user.phone || '')
    form.setFieldValue('email', user.email || '')
    form.setFieldValue('birthday', user.birthday || '')
    form.setFieldValue('region', user.region)
    form.setFieldValue('district', user.district)
    form.setFieldValue('about', user.about || '')
    form.setFieldValue('biography', user.biography || '')
    form.setFieldValue(
      'purposes',
      user.purposes ? user.purposes.split(',').map((p) => p.trim()) : [],
    )
  }, [user])

  // 🔹 Toggle purposes
  const togglePurpose = (value: string) => {
    const current = form.state.values.purposes || []
    if (current.includes(value)) {
      form.setFieldValue(
        'purposes',
        current.filter((v) => v !== value),
      )
    } else {
      form.setFieldValue('purposes', [...current, value])
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [getUserProfile])

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-36 flex items-center">
        <LoadingComponent />
      </div>
    )
  }

  return (
    <div>
      <div className="page-title mb-6 flex justify-between items-center">
        <h2 className="text-4xl font-bold">Profilni tahrirlash</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="grid grid-cols-2 gap-4"
      >
        <RenderField
          form={form}
          name="first_name"
          labelKey="Ism"
          inputComponent={<Input placeholder="Ism" />}
          validator={firstNameValidator}
        />

        <RenderField
          form={form}
          name="last_name"
          labelKey="Familiya"
          inputComponent={<Input placeholder="Familiya" />}
          validator={lastNameValidator}
        />

        <RenderField
          form={form}
          name="middle_name"
          labelKey="Sharif"
          inputComponent={<Input placeholder="Sharif" />}
          validator={middleNameValidator}
        />

        <RenderField
          form={form}
          name="phone"
          inputComponent={
            <PhoneInput
              disabled
              defaultCountry="UZ"
              countries={['UZ']}
              placeholder={'99 999 99 99'}
            />
          }
          labelKey="register.phone"
          validator={phoneValidator}
        />

        <RenderField
          form={form}
          name="birthday"
          labelKey="Tug'ilgan sana"
          inputComponent={<Input type="date" />}
          validator={(v) => (!v ? "Tug'ilgan sana majburiy" : undefined)}
        />

        <RenderField
          form={form}
          name="email"
          labelKey="Email"
          inputComponent={<Input placeholder="example@gmail.com" />}
        />

        <RenderField
          form={form}
          name="region"
          labelKey="Viloyat"
          inputComponent={
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Viloyatni tanlang" />
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
          validator={requiredSelect}
        />

        <form.Subscribe selector={(state) => state.values.region}>
          {(value) => (
            <RenderField
              form={form}
              name="district"
              labelKey="Tuman (shahar)"
              inputComponent={
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tumanni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts
                      .filter((d) => d.region_id === parseInt(value))
                      .map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.name_uz}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              }
              validator={requiredSelect}
            />
          )}
        </form.Subscribe>

        <RenderField
          form={form}
          name="about"
          labelKey="Haqingizda"
          inputComponent={<Textarea placeholder="Text" />}
        />

        <RenderField
          form={form}
          name="biography"
          labelKey="Biografiya"
          inputComponent={<Textarea placeholder="Text" />}
        />

        {/* Purposes */}
        <div className="col-span-2">
          <label className="block mb-2">Maqsadlar</label>
          <div className="grid grid-cols-2 gap-2">
            {purposesList.map((value, i) => {
              const selected = form.state.values.purposes?.includes(value)
              return (
                <Button
                  key={value}
                  type="button"
                  variant={selected ? 'default' : 'outline'}
                  onClick={() => togglePurpose(value)}
                  className={i === purposesList.length - 1 ? 'col-span-2' : ''}
                >
                  <CheckIcon
                    size={18}
                    className={`mr-2 ${
                      selected ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                  {value}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="col-span-2 flex justify-end">
          <Button type="submit" className="px-8">
            Saqlash
          </Button>
        </div>
      </form>
    </div>
  )
}
