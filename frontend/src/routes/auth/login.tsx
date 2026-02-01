import { useState } from 'react'
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
import { useTranslation } from 'react-i18next'
import {
  Link,
  createFileRoute,
  useSearch,
  useNavigate,
} from '@tanstack/react-router'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAlertDialog } from '@/hooks/useAlertDialog'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '@/context/auth'
import { loginPasswordValidator, phoneValidator } from '@/lib/validators'
import { RenderField } from '@/lib/render-field'

function sanitizeRedirectUrl(redirectUrl?: string): string {
  if (!redirectUrl) return '/profile'
  if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
    return '/profile'
  }
  if (redirectUrl.startsWith('/')) {
    return redirectUrl
  }
  return '/profile'
}

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const alert = useAlertDialog()
  const navigate = useNavigate()
  const { redirect: redirectParam } = useSearch({ from: '/auth/login' }) as {
    redirect: string
  }
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: { phone: '', password: '' },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const result = await login(value.phone, value.password)

        if (result.success) {
          const title =
            result.title || t('login.success_title', 'Amaliyot muvaffaqiyatli')
          const description =
            result.description ||
            t(
              'login.success_description',
              'Endi barcha funksiyalardan foydalanishingiz mumkin.',
            )

          toast.success(title, {
            description: <span className="text-black/40">{description}</span>,
          })

          const redirectTo = sanitizeRedirectUrl(redirectParam)
          navigate({ to: redirectTo, reloadDocument: true })
        } else {
          const title =
            result.title || t('login.error_title', 'Xatolik yuz berdi')
          const description =
            result.description ||
            t('login.error_description', 'Iltimos, qayta urinib ko‘ring.')

          toast.error(title, {
            description: <span className="text-black/40">{description}</span>,
          })

          alert(title, { description })
        }
      } catch (err: any) {
        const message =
          err?.message ||
          t(
            'login.unexpected_error',
            'Server bilan aloqa mavjud emas yoki noto‘g‘ri so‘rov.',
          )

        toast.error(t('login.unexpected_error_title', 'Kutilmagan xatolik'), {
          description: <span className="text-black/40">{message}</span>,
        })
        alert(t('login.unexpected_error_title', 'Kutilmagan xatolik'), {
          description: message,
        })
      } finally {
        setLoading(false)
        form.reset()
      }
    },
  })

  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-108px)] bg-bg-placeholder">
        <Card className="shadow-lg border-none bg-white w-full max-w-lg px-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t('login-page-title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('login-page-description')}
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
                className="space-y-4"
              >
                <RenderField
                  form={form}
                  name="phone"
                  inputComponent={
                    <PhoneInput
                      defaultCountry="UZ"
                      countries={['UZ']}
                      placeholder={t('login-form-phone')}
                    />
                  }
                  labelKey="login-form-phone"
                  validator={phoneValidator}
                />

                <RenderField
                  form={form}
                  name="password"
                  inputComponent={
                    <PasswordInput
                      noVerify
                      placeholder={t('login-form-password')}
                    />
                  }
                  labelKey="login-form-password"
                  validator={loginPasswordValidator}
                />

                <div className="space-y-2 py-4">
                  <Button type="submit" className="w-full">
                    {t('login-action-submit')}
                  </Button>
                  <Button
                    asChild
                    className={cn(
                      'w-full text-indigo-400 hover:text-white hover:bg-indigo-400 border-2 border-indigo-400 bg-transparent',
                    )}
                  >
                    <a href="https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=kasana_mehnat_uz&redirect_uri=https://kasana.mehnat.uz/auth/oneid&scope=myportal&state=testState">
                      OneId bilan davom etish
                    </a>
                  </Button>
                </div>

                <p className="text-center text-sm">
                  {t('login-action-register')}{' '}
                  <Link to="/auth/register" className="text-primary underline">
                    {t('register.title')}
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
