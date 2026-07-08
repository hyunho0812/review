let loadPromise: Promise<void> | null = null

export function loadKakaoMaps(): Promise<void> {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve()
      return
    }

    const appKey = import.meta.env.VITE_KAKAO_JS_KEY
    if (!appKey) {
      reject(new Error('VITE_KAKAO_JS_KEY가 설정되지 않았습니다. .env.local을 확인하세요.'))
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`
    script.async = true
    script.onload = () => window.kakao.maps.load(() => resolve())
    script.onerror = () => reject(new Error('카카오맵 SDK 로드에 실패했습니다.'))
    document.head.appendChild(script)
  })

  return loadPromise
}
