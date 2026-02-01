import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface CounterWidgetProps {
  num: number
  duration?: number
}

export default function CounterWidget({
  num,
  duration = 1000,
}: CounterWidgetProps) {
  const [count, setCount] = useState(0)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  useEffect(() => {
    if (!inView) return

    const start = 0
    const end = num
    const startTime = performance.now()

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const value = start + (end - start) * progress
      setCount(value)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [inView, num, duration])

  return <span ref={ref}>{count.toFixed(0)}</span>
}
