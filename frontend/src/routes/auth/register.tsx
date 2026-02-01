import { useState, useEffect } from 'react'
import LoadingComponent from '@/components/web/loader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { PasswordInput } from '@/components/ui/password-input'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useForm } from '@tanstack/react-form'
import {
  firstNameValidator,
  phoneValidator,
  registerPasswordValidator,
  confirmPasswordValidator,
} from '@/lib/validators'
import api from '@/lib/api'
import { RenderField } from '@/lib/render-field'
import { useAlertDialog } from '@/hooks/useAlertDialog'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const alert = useAlertDialog()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      first_name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: ({ value }) => {
      setLoading(true)

      api
        .post('users/api/auth/register/', value)
        .then((response) => {
          if (response.status === 201 || response.status === 200) {
            toast.success(
              t('register.success_title', 'Ro‘yxatdan muvaffaqiyatli o‘tildi'),
              {
                description: (
                  <span className="text-black/40">
                    {t(
                      'register.success_description',
                      'Telefon raqamingizni tasdiqlash uchun kod yuborildi.',
                    )}
                  </span>
                ),
              },
            )
            navigate({
              to: '/auth/verify',
              state: { phone: value.phone },
            })
          } else {
            toast.error('Noma’lum xatolik yuz berdi', {
              description: (
                <span className="text-black/40">
                  Iltimos, qayta urinib ko‘ring.
                </span>
              ),
            })
          }
        })
        .catch((err) => {
          const status = err?.response?.status

          switch (status) {
            case 400: {
              const title = 'Telefon raqami allaqachon ishlatilgan'
              const description =
                'Iltimos, boshqa telefon raqamidan foydalaning.'

              toast.error(title, {
                description: (
                  <span className="text-black/40">{description}</span>
                ),
              })

              form.setFieldMeta('phone', (prev) => ({
                ...prev,
                error: 'Telefon raqami allaqachon ishlatilgan',
              }))

              alert(title, { description })
              break
            }

            case 500: {
              toast.error('Server xatosi', {
                description: (
                  <span className="text-black/40">
                    Serverda muammo yuz berdi. Keyinroq urinib ko‘ring.
                  </span>
                ),
              })
              break
            }

            default: {
              const message = err?.message || 'Noma’lum xatolik yuz berdi'

              toast.error('Kutilmagan xatolik', {
                description: <span className="text-black/40">{message}</span>,
              })

              alert('Kutilmagan xatolik', {
                description: message,
              })
            }
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })

  useEffect(() => {
    document.title = `${t('register.title')} - Kasana.UZ`
  }, [t])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-108px)] bg-bg-placeholder py-12">
      <Card className="shadow-lg border-none bg-white w-full max-w-lg lg:px-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {t('register.title')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('register.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12">
              <LoadingComponent />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-3"
            >
              <RenderField
                form={form}
                name="first_name"
                inputComponent={
                  <Input placeholder={t('register.insert_first_name')} />
                }
                labelKey="register.first_name"
                validator={firstNameValidator}
              />

              <RenderField
                form={form}
                name="phone"
                inputComponent={
                  <PhoneInput
                    defaultCountry="UZ"
                    countries={['UZ']}
                    placeholder={t('register.insert_phone')}
                  />
                }
                labelKey="register.phone"
                validator={phoneValidator}
              />

              <RenderField
                form={form}
                name="password"
                inputComponent={
                  <PasswordInput placeholder={t('register.insert_password')} />
                }
                labelKey="register.password"
                validator={registerPasswordValidator}
              />

              <RenderField<{
                password: string
                confirmPassword: string
              }>
                form={form}
                name="confirmPassword"
                inputComponent={
                  <PasswordInput
                    noVerify
                    placeholder={t('register.insert_confirm_password')}
                  />
                }
                labelKey="register.confirm_password"
                validator={(value, values) =>
                  confirmPasswordValidator(value, values?.password || '')
                }
              />

              <div className="py-4">
                <Button type="submit" className="w-full">
                  {t('register.submit')}
                </Button>
              </div>

              <p className="text-center text-sm">
                {t('register.have-an-account')}{' '}
                <Link to="/auth/login" className="text-primary underline">
                  {t('login.title')}
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
