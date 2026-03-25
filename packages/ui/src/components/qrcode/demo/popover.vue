<template>
  <a-popover :overlay-inner-style="{ padding: 0 }">
    <template #content>
      <a-qrcode value="http://www.antdv.com" :bordered="false" />
    </template>
    <img width="100" height="100" src="https://aliyuncdn.antdv.com/logo.png" />
  </a-popover>
</template>
