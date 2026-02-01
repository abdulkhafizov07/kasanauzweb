import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useForm } from '@tanstack/react-form'
import { otpCodeValidator } from '@/lib/validators'
import api from '@/lib/api'
import { useAlertDialog } from '@/hooks/useAlertDialog'
import { RenderField } from '@/lib/render-field'

export const Route = createFileRoute('/auth/verify')({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    if (!location.state.phone) {
      throw redirect({ to: '/auth/register' })
    }
  },
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locationState = useRouterState({ select: (s) => s.location.state })

  const phone = locationState.phone

  const alert = useAlertDialog()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: { code: '' },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const response = await api.post('users/api/auth/verify/', {
          phone,
          code: value.code,
        })

        localStorage.setItem('access', response.data?.accessToken)
        localStorage.setItem('refresh', response.data?.refreshToken)

        toast.success(t('verify.code_verified', 'Kod tasdiqlandi'))

        navigate({ to: '/profile' })
      } catch (err) {
        toast.error(t('errors.verification_failed'), {
          description: t('form.errors.invalid_code', 'Kod noto‘g‘ri'),
        })

        alert(t('errors.verification_failed'), {
          description: t('form.errors.invalid_code'),
        })
      } finally {
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    if (!phone) {
      navigate({ to: '/auth/register' })
    }
    document.title = `${t('verify.title')} - Kasana.UZ`
  }, [phone, navigate, t])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-108px)] bg-bg-placeholder py-12">
      <Card
        className={
          'shadow-lg border-none bg-white w-full max-w-lg lg:px-12 py-16'
        }
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('verify.title')}</CardTitle>
          <CardDescription>
            {t('verify.description', { phone })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center">
              <RenderField
                form={form}
                name="code"
                inputComponent={
                  <InputOTP maxLength={5}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <InputOTPGroup key={i}>
                        <InputOTPSlot index={i} />
                      </InputOTPGroup>
                    ))}
                  </InputOTP>
                }
                labelKey="verify.enter_code"
                validator={otpCodeValidator}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {t('verify.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
