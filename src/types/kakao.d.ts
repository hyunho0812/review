export {}

declare global {
  interface Window {
    kakao: typeof kakao
  }

  namespace kakao.maps {
    function load(callback: () => void): void

    class LatLng {
      constructor(lat: number, lng: number)
      getLat(): number
      getLng(): number
    }

    class Map {
      constructor(container: HTMLElement, options: { center: LatLng; level: number })
      setCenter(latlng: LatLng): void
      getCenter(): LatLng
      setLevel(level: number): void
      panTo(latlng: LatLng): void
    }

    class Marker {
      constructor(options: { position: LatLng; map?: Map; title?: string })
      setMap(map: Map | null): void
      getPosition(): LatLng
    }

    class CustomOverlay {
      constructor(options: {
        position: LatLng
        content: string | HTMLElement
        yAnchor?: number
        map?: Map
      })
      setMap(map: Map | null): void
    }

    namespace event {
      function addListener(
        target: Map | Marker,
        type: string,
        handler: (...args: unknown[]) => void
      ): void
    }

    namespace services {
      enum Status {
        OK = 'OK',
        ZERO_RESULT = 'ZERO_RESULT',
        ERROR = 'ERROR',
      }

      interface PlacesSearchResultItem {
        id: string
        place_name: string
        category_name: string
        category_group_code: string
        phone: string
        address_name: string
        road_address_name: string
        x: string
        y: string
        place_url: string
      }

      type PlacesSearchResult = PlacesSearchResultItem[]

      interface SearchOptions {
        location?: LatLng
        radius?: number
        bounds?: unknown
        size?: number
      }

      class Places {
        keywordSearch(
          keyword: string,
          callback: (result: PlacesSearchResult, status: Status) => void,
          options?: SearchOptions
        ): void
      }
    }
  }
}
