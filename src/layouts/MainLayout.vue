<template>
  <q-layout view="hHh LpR lFf">
    <q-header
      :elevated="useLightOrDark(true, false)"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div class="absolute-center">
            <q-icon name="savings" />
            Moneyballs
          </div>
        </q-toolbar-title>

        <q-btn
          v-if="$route.fullPath === '/'"
          @click="storeEntries.options.sort = !storeEntries.options.sort"
          :label="storeEntries.options.sort ? 'Done' : 'Sort'"
          flat
          no-caps
          dense
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="250"
      :breakpoint="767"
      class="bg-primary"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
          class="text-white"
        >
          Essential Links
        </q-item-label>

        <NavLink
          v-for="link in navlinks"
          :key="link.title"
          v-bind="link"
        />

        <q-item
          v-if="$q.platform.is.electron"
          @click="quitApp"
          clickable
          class="text-white absolute-bottom"
          tag="a"
        >
          <q-item-section
            avatar
          >
            <q-icon name="power_settings_new" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Quit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreEntries } from 'src/stores/EntriesStore'
import NavLink from 'src/components/nav/NavLink.vue'
import { useLightOrDark } from 'src/use/useLightOrDark'

const storeEntries = useStoreEntries(),
      $q = useQuasar()


const navlinks = [
  {
    title: 'Entries',
    icon: 'savings',
    link: '/'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const quitApp = () => {
  $q.dialog({
    title: 'Confirm',
    message:"Really quit Moneyballs?",
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: 'Quit',
      color: 'negative',
      noCaps: true
    },
    cancel: {
      color: 'primary',
      noCaps: true
    }
  }).onOk(() => {
    console.log('quit app')
    if ($q.platform.is.electron) ipcRenderer.send('quit-app')
  })
}

</script>
