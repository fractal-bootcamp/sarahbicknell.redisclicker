import { useState, useEffect } from 'react'
import './App.css'


const getCount = async () => {
  const response = await fetch('http://192.168.1.71:3000/api/count');
  if (!response.ok) { // {{ edit_1 }}
    throw new Error('Network response was not ok'); // {{ edit_2 }}
  }
  const {count} = await response.json();
  return count;
}

const getBufferCount = async (userId: string) => {
  const response = await fetch(`http://192.168.1.71:3000/api/buffer/${userId}`);
  if (!response.ok) { // {{ edit_1 }}
    throw new Error('Network response was not ok'); // {{ edit_2 }}
  }
  const {bufferCount} = await response.json();
  return bufferCount;
}

function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
}

function App() {
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState('')
  const [bufferCount, setBufferCount] = useState(0)


const onClick = async () => {
  fetch(`http://192.168.1.71:3000/api/click/${userId}`, {
    method: 'POST'
  })
}

  useEffect(() => {
    setUserId(getUserId())
  }
  , [])

  useEffect(() => {
    const periodicFetch = async () => {
      const newCount = await getCount();
      setCount(newCount);
      const newBufferCount = await getBufferCount(userId);
      setBufferCount(newBufferCount);
    }
    const interval = setInterval(periodicFetch, 1000);
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <h1> Clicker </h1>
      <button onClick={onClick}> Don't click me! </button>
      <div> We have clicked {count} times </div>
      <div style={ bufferCount >= 10 ? { color: 'red' } : { color: 'black' } }> We have buffered {bufferCount} times </div>
    </>
  )
}

export default App
