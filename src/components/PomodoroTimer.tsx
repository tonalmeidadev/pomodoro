import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { useInterval } from '../hooks/useInterval'
import { Button } from './Button'
import { Timer } from './Timer'

import soundStart from '../sounds/start.mp3'
import soundFinish from '../sounds/finish.mp3'
import { secondsToTime } from '../utils/secondsToTime'

const soundStartWorking = new Audio(soundStart)
const soundFinishWorking = new Audio(soundFinish)

interface Props {
  pomodoroTime: number
  shortRestTime: number
  longRestTime: number
  cycles: number
}

export function PomodoroTimer(props: Props) {
  const [mainTime, setMainTime] = useState(props.pomodoroTime)
  const [timeConting, setTimeConting] = useState(false)
  const [working, setWorking] = useState(false)
  const [resting, setResting] = useState(false)
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles).fill(true)
  )
  const [completedCycles, setCompletedCycles] = useState(0)
  const [fullWorkingTime, setFullWorkingTime] = useState(0)
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0)
  const [title, setTitle] = useState('')

  const configureWork = useCallback(() => {
    setTimeConting(true)
    setWorking(true)
    setResting(false)
    setMainTime(props.pomodoroTime)
    soundStartWorking.play()
  }, [
      setWorking,
      setResting,
      setMainTime,
      setTimeConting,
      props.pomodoroTime
    ]
  )

  const configureRest = useCallback((long: boolean) => {
    setTimeConting(true)
    setWorking(false)
    setResting(true)
    soundFinishWorking.play()

    if (long) {
      setMainTime(props.longRestTime)
    } else {
      setMainTime(props.shortRestTime)
    }
  }, [
      setWorking,
      setResting,
      setMainTime,
      setTimeConting,
      props.longRestTime,
      props.shortRestTime
    ]
  )

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const enteredTitle = event.target.value
    setTitle(enteredTitle)
  }

  useInterval(() => {
    setMainTime(mainTime - 1)

    if (working) setFullWorkingTime(fullWorkingTime + 1)
  }, timeConting ? 1000 : null)

  useEffect(() => {
    if (mainTime > 0) return

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false)
      cyclesQtdManager.pop()
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true)
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true))
      setCompletedCycles(completedCycles + 1)
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1)
    if (resting) configureWork()
  }, [
    working,
    resting,
    mainTime,
    configureWork,
    configureRest,
    completedCycles,
    cyclesQtdManager,
    setCyclesQtdManager,
    numberOfPomodoros,
    props.cycles
  ])

  return (
    <Fragment>
      <div className='flex flex-col w-full gap-2 p-4 text-center rounded-lg bg-zinc-900'>
        {title === '' && <span>Digite sua atividade:</span>}
        <input
          type="text" 
          onChange={handleTitleChange}
          placeholder="Escreva"
          className={`
            ${title === '' ? 'text-zinc-600' : 'text-white'}
            bg-transparent outline-none text-2xl text-center placeholder:text-zinc-600
          `}
        />
      </div>

      <div className='flex flex-col w-full gap-2 p-4 pt-10 rounded-lg bg-zinc-900'>
        <Timer mainTime={mainTime} />
        <Button text='Iniciar' onClick={configureWork} className="bg-blue-700" />
        <Button text='Descansar' onClick={() => configureRest(false)} className="bg-green-600" />
        {!working && !resting
          ? ''
          : <Button text='Pausar' onClick={() => setTimeConting(false)} className="bg-red-600" />
        }
      </div>

      <div className='flex flex-col w-full p-2 gap-2 rounded-lg bg-zinc-900'>
        <table className='table-auto text-start'>
          <thead>
            <tr>
              <th className='text-end py-2 px-3'>Descrição</th>
              <th className='text-start py-2 px-3'>Valores</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='w-1/2 text-end py-2 px-3'>Ciclos</td>
              <td className='w-1/2 text-start py-2 px-3'>{completedCycles}</td>
            </tr>
            <tr>
              <td className='w-1/2 text-end py-2 px-3'>Pomodoros</td>
              <td className='w-1/2 text-start py-2 px-3'>{numberOfPomodoros}</td>
            </tr>
            <tr>
              <td className='w-1/2 text-end py-2 px-3'>Horas</td>
              <td className='w-1/2 text-start py-2 px-3'>{secondsToTime(fullWorkingTime)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}