<template>
  <a-space direction="vertical">
    <a-switch v-model:checked="state.checked1" checked-children="开启" un-checked-children="关闭" />
    <a-switch v-model:checked="state.checked2" checked-children="1" un-checked-children="0" />
    <a-switch v-model:checked="state.checked3">
      <template #checkedChildren><check-outlined /></template>
      <template #unCheckedChildren><close-outlined /></template>
    </a-switch>
  </a-space>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
const state = reactive({
  checked1: true,
  checked2: false,
  checked3: true,
});
</script>
