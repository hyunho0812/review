import type { RestaurantSeed } from '../types/models'

export function searchPlaces(keyword: string, center: { lat: number; lng: number }): Promise<RestaurantSeed[]> {
  return new Promise((resolve, reject) => {
    const places = new window.kakao.maps.services.Places()
    places.keywordSearch(
      keyword,
      (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(
            result.map((item) => ({
              id: item.id,
              name: item.place_name,
              address: item.road_address_name || item.address_name,
              category: item.category_name,
              lat: Number(item.y),
              lng: Number(item.x),
            }))
          )
          return
        }
        if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          resolve([])
          return
        }
        reject(new Error('장소 검색 중 오류가 발생했습니다.'))
      },
      { location: new window.kakao.maps.LatLng(center.lat, center.lng), radius: 5000 }
    )
  })
}
