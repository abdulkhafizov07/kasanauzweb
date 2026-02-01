import { createFileRoute } from '@tanstack/react-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2Icon } from 'lucide-react'

export const Route = createFileRoute(
  '/_authenticated/profile/_profileLayout/notifications',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="page-title flex w-full items-center justify-between mb-6">
        <h2 className="title text-lg md:text-2xl font-bold">Xabarnomalar</h2>
      </div>

      <div>
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Xush kelibsiz!</AlertTitle>
          <AlertDescription>Sahifa muvaffaqiyatli yuklandi</AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
