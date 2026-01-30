# Date Picker DYB 확장

이 문서는 Element Plus Date Picker의 DYB 전용 확장 기능을 설명합니다.

## dyb-footer-extra 슬롯

Date Picker 패널 하단(footer 아래)에 커스텀 UI를 자유롭게 넣을 수 있는 슬롯입니다.

### 지원 타입

모든 date-picker 타입에서 사용 가능합니다:
- `date`, `datetime`, `week`, `month`, `year`
- `dates`, `months`, `years`
- `daterange`, `datetimerange`
- `monthrange`, `yearrange`

### 사용 예시

```vue
<template>
  <el-date-picker v-model="date" type="datetime">
    <template #dyb-footer-extra>
      <div class="my-custom-footer">
        <span>선택된 날짜: {{ date }}</span>
        <button @click="handleAction">커스텀 버튼</button>
      </div>
    </template>
  </el-date-picker>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('')

const handleAction = () => {
  console.log('Custom action triggered')
}
</script>

<style scoped>
.my-custom-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
```

### 동작 방식

- **표시 조건**: `#dyb-footer-extra` 슬롯이 제공되면 **항상 표시**
  - `type`과 무관 (date, datetime, daterange 등 모든 타입)
  - 기본 footer 표시 여부와 무관 (footer가 숨겨져 있어도 표시)
  - `showTime`, `showConfirm` 등 props와 무관

### 스타일

기본 스타일이 적용되어 있습니다:
- 상단 border (datepicker inner border color)
- padding: 8px 12px
- background: datepicker background color

커스텀 스타일이 필요한 경우 슬롯 내부에서 직접 스타일링하세요.

---

**추가된 버전**: v0.0.2
