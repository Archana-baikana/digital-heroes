
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SubscriptionRoute from './components/SubscriptionRoute/SubscriptionRoute'
import AdminRoute from './components/AdminRoute/AdminRoute'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Subscription from './pages/Subscription/Subscription'
import Dashboard from './pages/Dashboard/Dashboard'
import Scores from './pages/Scores/Scores'
import Charities from './pages/Charities/Charities'
import Draws from './pages/Draws/Draws'
import Winners from './pages/Winners/Winners'
import Admin from './pages/Admin/Admin'

const App = () => (
  <BrowserRouter>
    <Navbar />

    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* Login Required */}
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Subscription Required */}
      <Route
        path="/scores"
        element={
          <SubscriptionRoute>
            <Scores />
          </SubscriptionRoute>
        }
      />

      <Route
        path="/charities"
        element={
          <SubscriptionRoute>
            <Charities />
          </SubscriptionRoute>
        }
      />

      <Route
        path="/draws"
        element={
          <SubscriptionRoute>
            <Draws />
          </SubscriptionRoute>
        }
      />

      <Route
        path="/winners"
        element={
          <SubscriptionRoute>
            <Winners />
          </SubscriptionRoute>
        }
      />

      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
    </Routes>

    <Footer />
  </BrowserRouter>
)

export default App