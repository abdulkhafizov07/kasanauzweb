import { useEffect } from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/auth'
import regions from '@/data/regions.json'
import districts from '@/data/districts.json'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Editor } from '@/components/blocks/editor-00/editor'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import TabsWidget from '@/components/web/announcements/tabs'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAlertDialog } from '@/hooks/useAlertDialog'
import api from '@/lib/api'
import LoadingComponent from '@/components/web/loader'

export const Route = createFileRoute('/announcements/create')({
  component: () => {
    const auth = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      auth.getUserProfile()

      if (!auth.isAuthenticated) {
        navigate({ to: '/auth/login' })
      }
    }, [auth])

    if (auth.isLoading || auth.isUserLoading) {
      return <LoadingComponent />
    }

    return <RouteComponent />
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const alert = useAlertDialog()

  useEffect(() => {
    document.title = 'E`lon berish - Kasana.UZ'
  }, [])

  const form = useForm({
    defaultValues: {
      announcement_type: 'service_announcement',
      title: '',
      thumbnail: undefined as File | undefined,
      price_min: '',
      price_max: '',
      dealed: true,
      region: '',
      district: '',
      address: '',
      experience: '',
      work_time: '',
      short_description: '',
      description: '',
    },
  })

  const dealed = form.watch('dealed')

  const onSubmit = async (data: any) => {
    // Oddiy validatsiya
    if (!data.title) {
      form.setError('title', { message: 'Nomni kiriting' })
      return
    }
    if (!data.address) {
      form.setError('address', { message: 'Manzilni kiriting' })
      return
    }
    if (!data.short_description) {
      form.setError('short_description', {
        message: 'Qisqacha ma’lumot shart',
      })
      return
    }
    if (!data.description) {
      form.setError('description', { message: 'To‘liq ma’lumot shart' })
      return
    }
    if (!data.dealed) {
      if (!data.price_min || !data.price_max) {
        form.setError('price_min', { message: 'Narxni kiriting' })
        return
      }
      if (Number(data.price_min) > Number(data.price_max)) {
        form.setError('price_max', {
          message: 'Maksimal narx minimaldan katta bo‘lishi kerak',
        })
        return
      }
    }

    const formData = new FormData()
    Object.entries(data).forEach(([key, val]) => {
      if (key === 'thumbnail' && val instanceof File) {
        formData.append('thumbnail', val)
      } else {
        formData.append(key, String(val ?? ''))
      }
    })

    try {
      await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/announcements/api/create/`,
        formData,
      )

      alert('E’lon joylandi', {
        description: 'Moderatsiyani kuting',
        confirmText: 'OK',
        onConfirm: () => navigate({ to: '/profile/announcements' }),
      })
    } catch (err) {
      alert('Xatolik', {
        description: 'E’lon joylanmadi',
        confirmText: 'Tushunarli',
      })
    }
  }

  return (
    <div className="w-full h-full bg-bg-placeholder">
      <TabsWidget type="create" />
      <div className="container mx-auto max-w-[1366px] py-4">
        <div className="w-full h-auto bg-white p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">E'lon yaratish</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* E’lon turi */}
              <FormField
                control={form.control}
                name="announcement_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E’lon turi</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full lg:w-1/2">
                          <SelectValue placeholder="E’lon turi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="service_announcement">
                            Xizmat e’loni
                          </SelectItem>
                          <SelectItem value="work_announcement">
                            Ish e’loni
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nom va rasm */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xizmat nomi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masalan, Sartaroshlik" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rasm yuklang</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Narxlar */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimal narx</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={dealed} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maksimal narx</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={dealed} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dealed"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 mt-7">
                      <FormLabel>Kelishiladi</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Hudud va tuman */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Viloyat / Hudud</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                            form.setValue('district', '')
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((r) => (
                              <SelectItem key={r.id} value={String(r.id)}>
                                {r.name_uz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuman / Shahar</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts
                              .filter(
                                (d) =>
                                  String(d.region_id) === form.watch('region'),
                              )
                              .map((d) => (
                                <SelectItem key={d.id} value={String(d.id)}>
                                  {d.name_uz}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Manzil */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manzil</FormLabel>
                    <FormControl>
                      <Input placeholder="To‘liq manzil" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Tajriba va ish vaqti */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tajriba</FormLabel>
                      <FormControl>
                        <Input placeholder="2 yil, 4 yil+" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="work_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ish vaqti</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full_time">
                              To'liq ish vaqti
                            </SelectItem>
                            <SelectItem value="part_time">
                              Yarim ish vaqti
                            </SelectItem>
                            <SelectItem value="flexable_time">
                              Moslashuvchan
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Qisqacha va to‘liq ma’lumot */}
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qisqacha ma’lumot</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To‘liq ma’lumot</FormLabel>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Yaratish</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
