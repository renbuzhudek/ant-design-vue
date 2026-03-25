<template>
  <a-space>
    <a-qrcode value="http://www.antdv.com" status="loading" />
    <a-qrcode
      value="http://www.antdv.com"
      status="expired"
      @refresh="() => console.log('refresh')"
    />
    <a-qrcode value="http://www.antdv.com" status="scanned" />
  </a-space>
</template>
