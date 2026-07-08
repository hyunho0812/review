import { useState, type FormEvent } from 'react'
import { StarRating } from './StarRating'

interface ReviewFormProps {
  onSubmit: (input: { rating: number; text: string; photoFile: File | null }) => Promise<void>
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError('별점을 선택해주세요.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ rating, text, photoFile })
      setRating(0)
      setText('')
      setPhotoFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '리뷰 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <StarRating value={rating} onChange={setRating} size={28} />
      <textarea
        placeholder="이 식당은 어땠나요?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={1000}
      />
      <div className="review-form__row">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
        />
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? '등록 중...' : '리뷰 등록'}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  )
}
