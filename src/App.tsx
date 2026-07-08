import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConfigNotice } from './components/ConfigNotice'
import { Header } from './components/Header'
import { AuthProvider } from './contexts/AuthContext'
import { isFirebaseConfigured } from './firebase/config'
import { LoginPage } from './pages/LoginPage'
import { MapPage } from './pages/MapPage'
import { RestaurantPage } from './pages/RestaurantPage'
import { SignupPage } from './pages/SignupPage'

export default function App() {
  if (!isFirebaseConfigured) {
    return <ConfigNotice />
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}
