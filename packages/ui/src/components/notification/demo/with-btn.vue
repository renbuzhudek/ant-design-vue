<template>
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>

<script lang="ts" setup>
import { notification, Button } from 'ant-design-vue';
import { h } from 'vue';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};
const openNotification = () => {
  const key = `open${Date.now()}`;
  notification.open({
    message: 'Notification Title',
    description:
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
    btn: () =>
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          onClick: () => notification.close(key),
        },
        { default: () => 'Confirm' },
      ),
    key,
    onClose: close,
  });
};
</script>
