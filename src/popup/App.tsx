// import { useState } from 'react'
import './App.css'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { NavBar } from './NavBar'

function App() {


  return (
    <>
      <NavBar/>
      <div className="flex justify-start items-center flex-col min-h-svh bg-gray-200 gap-2 pt-12">
        <Card className="">
          <p>Test</p>
        </Card>

        <Card>
          <Calendar />
        </Card>
      </div>
    </>
  )
}

export default App
