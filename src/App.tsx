import { PomodoroTimer } from './components/PomodoroTimer'

export default function App() {
  return (
    <div className='flex flex-col gap-2 items-center justify-center w-full max-w-sm m-auto py-10 px-5'>
      <PomodoroTimer
        pomodoroTime={1800}
        shortRestTime={300}
        longRestTime={5}
        cycles={4}
      />
    </div>
  )
}
