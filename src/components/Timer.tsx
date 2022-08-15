import { secondsToTime } from "../utils/secondsToTime"

interface TimerProps {
  mainTime: number
}

export function Timer(props: TimerProps) {
  return (
    <div className="mb-8 text-7xl text-center">
      {secondsToTime(props.mainTime)}
    </div>
  )
}