import { secondsToMinutes } from "../utils/secondsToMinutes"

interface TimerProps {
  mainTime: number
}

export function Timer(props: TimerProps) {
  return (
    <div className='my-8 text-8xl tracking-tighter text-center'>
      {secondsToMinutes(props.mainTime)}
    </div>
  )
}