import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signup from "./components/authentication/Signup"
import Login from "./components/authentication/Login"
import Profile from "./components/authentication/Profile"
import PrivateRoute from "./components/authentication/PrivateRoute"
import ForgotPassword from "./components/authentication/ForgotPassword"
import UpdateProfile from "./components/authentication/UpdateProfile"
import Dashboard from "./components/gDrive/Dashboard"

function App() {

  return (
      <Router>
        <AuthProvider>
          <Routes>
            {/* GDrive */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/folder/:folderID" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* Profile */}
            <Route path="/user" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
            
            {/* Authentication */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
