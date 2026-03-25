<template>
  <context-holder />
  <a-button type="primary" @click="info">Display normal message</a-button>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
const [messageApi, contextHolder] = message.useMessage();

const info = () => {
  messageApi.info('Hello, Ant Design Vue!');
};
</script>
