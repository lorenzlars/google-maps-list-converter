<script setup lang="ts">
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';
import { onMounted } from "vue";
import { useMainStore } from "@/mainStore.ts";

const store = useMainStore()



function onStartConverting() {
  store.openWindow('https://www.google.com/maps/place/Immerath/data=!4m2!3m1!1s0x47bf51041d73726f:0xa2760fee0f7e7d0')

}

</script>

<template>
  <FileUpload />
  <Button @click="onStartConverting"/>
  <ProgressBar :value="50" />
</template>
