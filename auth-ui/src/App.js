import React from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext'
import Navbar from './components/helpers/Navbar'
import Home from './components/home/Home'
import Login from './components/home/Login'
import Signup from './components/home/Signup'
import PrivateRoute from "./components/helpers/PrivateRoute";
import UserSetting from "./components/helpers/UserSetting";

function App() {
  return (
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />}/>
                <Route path="/settings" element={<PrivateRoute><UserSetting/></PrivateRoute>}/>
            </Routes>
          </Router>
        </AuthProvider>
  )
}

export default App;
