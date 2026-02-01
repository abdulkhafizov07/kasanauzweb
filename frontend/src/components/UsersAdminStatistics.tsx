import { Bar as BarChart } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'

interface DataCardProps {
  title: string
  number: number
  isMain: boolean
  change: number
  isPositive: boolean
}

function DataCard(props: DataCardProps) {
  return (
    <>
      <Card className="shadow-none p-0 border-0">
        <CardContent className="p-4">
          <CardTitle className="text-md font-normal">{props.title}</CardTitle>
          <h2
            className={
              'text-2xl font-semibold mb-4' +
              String(props.isMain ? ' text-brand' : '')
            }
          >
            {props.number.toLocaleString('uz')}
          </h2>
          <CardDescription>
            <span className="mr-2">{props.isPositive}</span>
            <span
              className={props.isPositive ? 'text-emerald-600' : 'text-red-400'}
            >
              {props.isPositive ? '+' : '-'}
              {Math.abs(props.change).toLocaleString('uz')}
            </span>
            <span className="ms-2">So'ngi 30 kunda</span>
          </CardDescription>
        </CardContent>
      </Card>
    </>
  )
}

function AgesChart() {
  const AgeLabels = ['18 dan kichik', '18-25', '25-35', '35-50', '50 dan katta']

  return (
    <>
      <Card className="shadow-none p-0 border-0">
        <CardContent className="p-4">
          <CardTitle className="text-md font-semibold">
            Foydalanuvchilarning yosh chegaralari
          </CardTitle>
          <BarChart
            data={{
              labels: AgeLabels,
              datasets: [
                {
                  label: 'Erkaklar',
                  data: AgeLabels.map(() => Math.round(Math.random() * 3000)),
                  backgroundColor: '#41A58D',
                },
                {
                  label: 'Ayollar',
                  data: AgeLabels.map(() => Math.round(Math.random() * 3000)),
                  backgroundColor: '#E8B931',
                },
              ],
            }}
          ></BarChart>
        </CardContent>
      </Card>
    </>
  )
}

export default function UsersAdminStatistics() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <DataCard
          title="Barcha foydalanuvchilar"
          number={20000}
          isMain={true}
          change={500}
          isPositive={true}
        />
        <DataCard
          title="Kunlik saytga kirishlar soni"
          number={16895}
          isMain={false}
          change={3256}
          isPositive={true}
        />
        <DataCard
          title="Barcha mahsulotlar soni"
          number={11450}
          isMain={false}
          change={2354}
          isPositive={true}
        />
        <DataCard
          title="Bir oyda berilayotgan e’lonlar"
          number={1892}
          isMain={false}
          change={154}
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-3 aspect-video">
          <AgesChart />
        </div>
      </div>
    </>
  )
}
