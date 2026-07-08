interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

export function StarRating({ value, onChange, size = 20 }: StarRatingProps) {
  const interactive = Boolean(onChange)
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={`star-rating${interactive ? ' star-rating--interactive' : ''}`} role={interactive ? 'radiogroup' : undefined} aria-label="별점">
      {stars.map((star) => {
        const filled = star <= Math.round(value)
        return interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star}점`}
            className="star-btn"
            style={{ fontSize: size }}
            onClick={() => onChange?.(star)}
          >
            {filled ? '★' : '☆'}
          </button>
        ) : (
          <span key={star} style={{ fontSize: size }} aria-hidden="true">
            {filled ? '★' : '☆'}
          </span>
        )
      })}
    </div>
  )
}
