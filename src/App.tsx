import { PomodoroTimer } from './components/PomodoroTimer'

export default function App() {
  return (
    <div className='flex flex-col gap-2 items-center justify-center max-w-sm min-h-screen m-auto px-5'>
      <PomodoroTimer
        pomodoroTime={10}
        shortRestTime={2}
        longRestTime={5}
        cycles={4}
      />
    </div>
  )
}
