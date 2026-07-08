import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogOut() {
    await logOut()
    navigate('/')
  }

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        맛동네
      </Link>
      {user ? (
        <div className="app-header__user">
          <span className="app-header__name">{user.displayName ?? user.email}</span>
          <button type="button" className="btn btn--ghost" onClick={handleLogOut}>
            로그아웃
          </button>
        </div>
      ) : (
        <Link to="/login" className="btn btn--ghost">
          로그인
        </Link>
      )}
    </header>
  )
}
