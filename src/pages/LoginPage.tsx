import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const { logIn, logInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await logIn(email, password)
      navigate('/')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await logInWithGoogle()
      navigate('/')
    } catch {
      setError('구글 로그인에 실패했습니다.')
    }
  }

  return (
    <div className="auth-page">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <button type="button" className="btn btn--google" onClick={handleGoogle}>
        구글로 로그인
      </button>
      <p className="auth-switch">
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  )
}
