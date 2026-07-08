import { useEffect, useRef, useState } from 'react'
import { loadKakaoMaps } from '../lib/loadKakaoMaps'
import type { RestaurantSeed } from '../types/models'

interface KakaoMapProps {
  places: RestaurantSeed[]
  selectedId?: string | null
  onSelectPlace: (place: RestaurantSeed) => void
  onMapReady?: (map: kakao.maps.Map) => void
  center?: { lat: number; lng: number }
}

export const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 }

export function KakaoMap({ places, selectedId, onSelectPlace, onMapReady, center = SEOUL_CITY_HALL }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const markersRef = useRef<kakao.maps.Marker[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    loadKakaoMaps()
      .then(() => {
        if (cancelled || !containerRef.current) return
        const map = new window.kakao.maps.Map(containerRef.current, {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: 4,
        })
        mapRef.current = map
        setStatus('ready')
        onMapReady?.(map)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setErrorMessage(err.message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = places.map((place) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(place.lat, place.lng),
        map,
        title: place.name,
      })
      window.kakao.maps.event.addListener(marker, 'click', () => onSelectPlace(place))
      return marker
    })
  }, [places, onSelectPlace])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedId) return
    const place = places.find((p) => p.id === selectedId)
    if (place) map.panTo(new window.kakao.maps.LatLng(place.lat, place.lng))
  }, [selectedId, places])

  return (
    <div className="kakao-map">
      <div ref={containerRef} className="kakao-map__canvas" />
      {status === 'loading' && <div className="kakao-map__overlay">지도를 불러오는 중...</div>}
      {status === 'error' && (
        <div className="kakao-map__overlay kakao-map__overlay--error">{errorMessage}</div>
      )}
    </div>
  )
}
