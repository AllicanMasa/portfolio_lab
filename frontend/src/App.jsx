import { Routes, Route } from 'react-router-dom'
import Register from './register/register'
import Login from './login/login'          // ← uncomment + fix path if needed
import "./App.css"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/"          element={<Register />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/login"     element={<Login />}    />
      </Routes>
    </div>
  )
}

export default App