import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ReviewForm } from '../components/ReviewForm'
import { ReviewList } from '../components/ReviewList'
import { StarRating } from '../components/StarRating'
import { useAuth } from '../contexts/AuthContext'
import { addReview, ensureRestaurant, subscribeRestaurant, subscribeReviews } from '../lib/reviews'
import type { Restaurant, RestaurantSeed, Review } from '../types/models'

export function RestaurantPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const seed = (location.state as { seed?: RestaurantSeed } | null)?.seed
  const { user } = useAuth()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let unsubscribeRestaurant: (() => void) | undefined
    let unsubscribeReviews: (() => void) | undefined

    async function setup() {
      if (seed) await ensureRestaurant(seed)
      unsubscribeRestaurant = subscribeRestaurant(id!, (data) => {
        setRestaurant(data)
        setLoading(false)
      })
      unsubscribeReviews = subscribeReviews(id!, setReviews)
    }
    setup()

    return () => {
      unsubscribeRestaurant?.()
      unsubscribeReviews?.()
    }
  }, [id, seed])

  async function handleAddReview(input: { rating: number; text: string; photoFile: File | null }) {
    if (!user || !id) return
    await addReview(id, {
      userId: user.uid,
      userName: user.displayName ?? '익명',
      rating: input.rating,
      text: input.text,
      photoFile: input.photoFile,
    })
  }

  if (loading) return <div className="page-status">불러오는 중...</div>

  if (!restaurant) {
    return (
      <div className="page-status">
        <p>식당 정보를 찾을 수 없습니다.</p>
        <Link to="/" className="btn btn--primary">
          지도로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="restaurant-page">
      <Link to="/" className="back-link">
        ← 지도로
      </Link>
      <h1>{restaurant.name}</h1>
      <p className="restaurant-page__category">{restaurant.category}</p>
      <p className="restaurant-page__address">{restaurant.address}</p>
      <div className="restaurant-page__rating">
        <StarRating value={restaurant.ratingAvg} size={22} />
        <span>
          {restaurant.reviewCount > 0
            ? `${restaurant.ratingAvg.toFixed(1)} · 리뷰 ${restaurant.reviewCount}개`
            : '아직 리뷰가 없어요'}
        </span>
      </div>

      <section className="restaurant-page__section">
        <h2>리뷰 작성</h2>
        {user ? (
          <ReviewForm onSubmit={handleAddReview} />
        ) : (
          <p className="review-login-prompt">
            리뷰를 남기려면 <Link to="/login">로그인</Link>이 필요합니다.
          </p>
        )}
      </section>

      <section className="restaurant-page__section">
        <h2>리뷰 {reviews.length > 0 ? `(${reviews.length})` : ''}</h2>
        <ReviewList reviews={reviews} />
      </section>
    </div>
  )
}
