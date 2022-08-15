import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { secondsToTime } from '../utils/secondsToTime'
import { useInterval } from '../hooks/useInterval'
import { Button } from './Button'
import { Timer } from './Timer'

import soundStart from '../sounds/start.mp3'
import soundFinish from '../sounds/finish.mp3'

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
      mainTime,
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
    const selectIdRoot: HTMLElement | any = document.getElementById('root')

    if (!working) {
      selectIdRoot.classList.add('border-green-600')
    }

    if (working) {
      selectIdRoot.classList.remove('border-green-600')
      selectIdRoot.classList.add('border-red-700')
    }

    if (resting) {
      selectIdRoot.classList.remove('border-green-600')
      selectIdRoot.classList.remove('border-red-700')
      selectIdRoot.classList.add('border-blue-400')
    } else {
      selectIdRoot.classList.remove('border-blue-400')
    }

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
      <div className='flex flex-col w-full gap-2 p-4 text-center rounded-lg bg-neutral-900'>
        {!working && !resting && <span>Digite a atividade:</span>}
        <input
          type="text" 
          onChange={handleTitleChange}
          placeholder="Ex: treinando"
          className={`
            ${title === '' ? 'text-neutral-600' : 'text-white'}
            ${resting && 'hidden'}
            ${working && 'text-red-600'}
            bg-transparent outline-none text-2xl font-bold text-center placeholder:text-neutral-600
          `}
        />
        {resting && <span className='text-2xl font-bold text-center text-blue-400'>Descansando</span>}
      </div>

      <div className='flex flex-col w-full gap-2 p-4 rounded-lg bg-neutral-900'>
        <Timer mainTime={mainTime} />
        {!working && !resting && <Button text='Iniciar' onClick={configureWork} className="bg-green-600 hover:bg-green-700" />}
        {!working && !resting ? ''
          : (
            <>
              <Button text='Pausar' onClick={() => setTimeConting(false)} className="bg-red-600 hover:bg-red-700" />
              <Button text='Descansar' onClick={() => configureRest(false)} className="bg-blue-700 hover:bg-blue-800" />
            </>
          )
        }
      </div>

      <div className='flex flex-col w-full p-2 gap-2 rounded-lg bg-neutral-900'>
        <table className='table-auto text-start'>
          <thead>
            <tr>
              <th className='text-end py-2 px-3 text-neutral-600'>Descrição</th>
              <th className='text-start py-2 px-3 text-neutral-600'>Valores</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='w-1/2 text-end py-2 px-3'>Ciclos</td>
              <td className='w-1/2 text-start py-2 px-3'>{completedCycles}</td>
            </tr>
            <tr>
              <td className='w-1/2 text-end py-2 px-3'>Tempo total</td>
              <td className='w-1/2 text-start py-2 px-3'>{secondsToTime(fullWorkingTime)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}