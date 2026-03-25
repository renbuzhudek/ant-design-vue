<template>
  <a-space>
    <a-qrcode value="http://www.antdv.com" :color="token.colorSuccessText" />
    <a-qrcode
      value="http://www.antdv.com"
      :color="token.colorInfoText"
      :bg-color="token.colorBgLayout"
    />
  </a-space>
</template>

<script lang="ts" setup>
import { theme } from 'ant-design-vue';

const { useToken } = theme;
const { token } = useToken();
</script>
