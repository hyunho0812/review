import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KakaoMap, SEOUL_CITY_HALL } from '../components/KakaoMap'
import { StarRating } from '../components/StarRating'
import { searchPlaces } from '../lib/kakaoPlaces'
import { subscribeRestaurant } from '../lib/reviews'
import type { Restaurant, RestaurantSeed } from '../types/models'

export function MapPage() {
  const navigate = useNavigate()
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const [keyword, setKeyword] = useState('')
  const [places, setPlaces] = useState<RestaurantSeed[]>([])
  const [selected, setSelected] = useState<RestaurantSeed | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) return
    setSearching(true)
    setSearchError('')
    try {
      const center = mapRef.current
        ? { lat: mapRef.current.getCenter().getLat(), lng: mapRef.current.getCenter().getLng() }
        : SEOUL_CITY_HALL
      const results = await searchPlaces(term, center)
      setPlaces(results)
      if (results.length === 0) setSearchError('검색 결과가 없습니다.')
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.')
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    runSearch('서울 맛집')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selected) {
      setSelectedRestaurant(null)
      return
    }
    return subscribeRestaurant(selected.id, setSelectedRestaurant)
  }, [selected])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runSearch(keyword)
  }

  const handleSelectPlace = useCallback((place: RestaurantSeed) => {
    setSelected(place)
  }, [])

  return (
    <div className="map-page">
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="식당 이름이나 지역으로 검색 (예: 강남 파스타)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="btn btn--primary" disabled={searching}>
          {searching ? '검색 중' : '검색'}
        </button>
      </form>
      {searchError && <p className="search-error">{searchError}</p>}

      <div className="map-page__map">
        <KakaoMap
          places={places}
          selectedId={selected?.id ?? null}
          onSelectPlace={handleSelectPlace}
          onMapReady={(map) => {
            mapRef.current = map
          }}
        />
      </div>

      {selected && (
        <div className="place-sheet">
          <div className="place-sheet__info">
            <h2>{selected.name}</h2>
            <p className="place-sheet__category">{selected.category}</p>
            <p className="place-sheet__address">{selected.address}</p>
            <div className="place-sheet__rating">
              <StarRating value={selectedRestaurant?.ratingAvg ?? 0} />
              <span>
                {selectedRestaurant && selectedRestaurant.reviewCount > 0
                  ? `${selectedRestaurant.ratingAvg.toFixed(1)} · 리뷰 ${selectedRestaurant.reviewCount}개`
                  : '아직 리뷰가 없어요'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate(`/restaurant/${selected.id}`, { state: { seed: selected } })}
          >
            상세보기 · 리뷰쓰기
          </button>
        </div>
      )}
    </div>
  )
}
