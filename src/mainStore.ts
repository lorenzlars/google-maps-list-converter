import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
  const tabs = ref<Window[]>([]);
  
  function openWindow(url: string) {
    console.log('test');
    
    // if (!tabs.value.find((tab) => tab.location.href === url)) {
      const tab = window.open(url )

      



      if (tab) {
        tab.addEventListener('load', function() {
          const newTabUrl = tab.location.href;
          
          console.log('URL des neuen Tabs:', newTabUrl);
        });
        
        const interval = setInterval(() => {
          console.log('href', tab.location);
          
          if(tab.location.href !== url) {
            clearInterval(interval)
            tab.close()
          }
        },1000)
      }
    // }


    
  }

  return { windows: tabs, openWindow };
})
;