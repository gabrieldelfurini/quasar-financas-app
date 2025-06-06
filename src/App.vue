<template>
  <router-view />
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router'
  import { useStoreSettings } from './stores/SettingsStore';
  import { useStoreEntries } from './stores/EntriesStore';
  import { useQuasar } from 'quasar'

  defineOptions({
    name: 'App'
  })

  const storeSettings = useStoreSettings(),
        storeEntries = useStoreEntries(),
        router = useRouter(),
        $q = useQuasar()

  onMounted(() => {
    storeSettings.loadSettings()
    storeEntries.loadEntries()

    if ($q.platform.is.electron) {
      ipcRenderer.on('show-settings', () => {
        router.push('/settings')
      })
    }
  })


  // window.addEventListener('contextmenu', e => {
  //   e.preventDefault()
  // })
</script>
