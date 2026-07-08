export function ConfigNotice() {
  return (
    <div className="page-status">
      <h1 style={{ fontSize: '1.3rem' }}>설정이 필요합니다</h1>
      <p>
        .env.local 파일에 카카오맵 키와 Firebase 설정값을 채워 넣어야 앱이 동작합니다.
        <br />
        프로젝트 루트의 .env.example을 복사해서 .env.local로 저장한 뒤 값을 채워주세요.
      </p>
      <p style={{ fontSize: '0.82rem' }}>자세한 절차는 README.md를 참고하세요.</p>
    </div>
  )
}
