import type { Review } from '../types/models'
import { StarRating } from './StarRating'

function formatDate(review: Review) {
  const date = review.createdAt?.toDate()
  if (!date) return '방금 전'
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="review-list__empty">첫 리뷰를 남겨보세요.</p>
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-card">
          <div className="review-card__head">
            <span className="review-card__author">{review.userName}</span>
            <span className="review-card__date">{formatDate(review)}</span>
          </div>
          <StarRating value={review.rating} size={16} />
          {review.text && <p className="review-card__text">{review.text}</p>}
          {review.photoUrl && (
            <img className="review-card__photo" src={review.photoUrl} alt="리뷰 사진" loading="lazy" />
          )}
        </li>
      ))}
    </ul>
  )
}
