// import { useState } from 'react'
import './App.css'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { NavBar } from './NavBar'
import { ProgressBar } from './ProgressBar';

function App() {
  const inputToday = 23;
  const goal = 60

  return (
    <>
      <NavBar/>
      <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12">
        <Card className="">
          <div className='flex justify-between'>
            <p className='font-bold'>Daily Goal</p>
            <p>{inputToday}/{goal} min</p>
          </div>
          <ProgressBar progress={inputToday / goal} />
        </Card>
        <Card>

        </Card>
        <Card>
          <Calendar />
        </Card>
      </div>
    </>
  )
}

export default App
