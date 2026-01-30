# DYB 변경 이력

이 파일은 Element Plus DYB 포크의 배포 버전을 관리합니다.

## 버전 히스토리

### v0.0.3 (2025-01-30)

- **[Build]** `catalog:` 버전 치환 기능 추가
  - pnpm의 `catalog:` 구문이 빌드된 package.json에 그대로 복사되던 문제 수정
  - yarn 사용 프로젝트에서 `catalog:` 구문을 인식하지 못하는 문제 해결
  - 빌드 시 `pnpm-workspace.yaml`에서 실제 버전을 읽어 자동 치환

### v0.0.2 (2025-01-30)

- **[Date Picker]** `dyb-footer-extra` 슬롯 추가
  - 패널 하단에 커스텀 UI를 삽입할 수 있는 슬롯
  - 모든 date-picker 타입 지원 (date, datetime, daterange, monthrange, yearrange 등)
  - 자세한 사용법: [docs/DYB/date-picker.md](./DYB/date-picker.md)

### v0.0.1 (2025-01-30)

- 최초 릴리스
- Element Plus 소스 기반
- `dist` 브랜치에 빌드 및 배포

---

**최신 버전: v0.0.3**

## 사용 방법

```bash
# 최신 버전 설치 (권장)
pnpm add github:LiveChoisun/element-plus#latest

# 특정 버전 설치
pnpm add github:LiveChoisun/element-plus#v0.0.1
```
