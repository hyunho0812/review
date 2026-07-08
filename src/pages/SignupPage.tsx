import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await signUp(email, password, displayName)
      navigate('/')
    } catch {
      setError('회원가입에 실패했습니다. 이미 가입된 이메일일 수 있어요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="닉네임"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? '가입 중...' : '회원가입'}
        </button>
      </form>
      <p className="auth-switch">
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </p>
    </div>
  )
}
