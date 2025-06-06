<template>
  <q-slide-item
    @right="onEntrySlideRight"
    @left="onEntrySlideLeft"
    right-color="negative"
    :id="`id-${ props.entry.id }`"
    :class="
      !entry.paid
        ? useLightOrDark('bg-white', 'bg-black')
        : useLightOrDark('bg-grey-2', 'bg-grey-10')
    "
  >
    <template v-slot:left>
      <q-icon name="done" />
    </template>
    <template v-slot:right>
      <q-icon name="delete" />
    </template>

    <q-item
      class="row"
    >
      <q-item-section
        class="text-weight-bold col"
        :class="[
          useAmountColorClass(props.entry.amount),
          { 'text-strike' :  entry.paid }
        ]"
      >
        {{ props.entry.name }}
        <q-popup-edit
          @save="onNameUpdate"
          :model-value="props.entry.name"
          :cover="false"
          :offset="[16,13]"
          anchor="top left"
          auto-save
          v-slot="scope"
          buttons
          label-set="Ok"
        >
          <q-input
            input-class="text-weight-bold"
            v-model="scope.value"
            v-select-all
            dense
            autofocus
            counter
            @keyup.enter="scope.set"
          />
        </q-popup-edit>
      </q-item-section>

      <q-item-section
        class="text-weight-bold relative-position col"
        side
        top
        :class="[
          useAmountColorClass(props.entry.amount)
        ]"
      >
        <span
          :class="{ 'text-strike' :  entry.paid }"
        >
          {{ useCurrencify(props.entry.amount) }}
        </span>
        <q-popup-edit
          @save="onAmountUpdate"
          :model-value="props.entry.amount"
          :cover="false"
          :offset="[16,13]"
          anchor="top right"
          self="top right"
          auto-save
          v-slot="scope"
          buttons
          label-set="Ok"
        >
          <q-input
            input-class="text-weight-bold text-right"
            v-model.number="scope.value"
            type="number"
            step="0.01"
            v-select-all
            dense
            autofocus
            counter
            @keyup.enter="scope.set"
          />
        </q-popup-edit>
        <q-chip
          v-if="storeSettings.settings.showRunningBalance"
          class="running-balance absolute-bottom-right"
          :class="useAmountColorClass(storeEntries.runningBalances[index])"
          size="9px"
          dense
          outline
        >
          {{ useCurrencify(storeEntries.runningBalances[index]) }}
        </q-chip>
      </q-item-section>

      <q-item-section
        v-if="storeEntries.options.sort"
        side
      >
        <q-icon
          class="handle"
          name="reorder"
          color="primary"
        />
      </q-item-section>

    </q-item>
  </q-slide-item>
</template>

<script setup>
  const $q = useQuasar()

// Imports

  import { useStoreEntries } from "src/stores/EntriesStore";
  import { useStoreSettings } from "src/stores/SettingsStore";
  import { useCurrencify } from "src/use/useCurrencify";
  import { useAmountColorClass } from "src/use/useAmountColorClass";
  import { useLightOrDark } from "src/use/useLightOrDark";
  import { useQuasar } from "quasar";
  import vSelectAll from "src/directives/directSelectAll"


// Store

  const storeEntries = useStoreEntries(),
        storeSettings = useStoreSettings()


// Props

  const props = defineProps({
    entry: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  })


// Slide items

  const onEntrySlideLeft = ({ reset }) => {
    storeEntries.updateEntry(props.entry.id, { paid:  !props.entry.paid})
    reset()
  }


  const onEntrySlideRight = ({ reset }) => {
    if (storeSettings.settings.promptToDelete) promptToDelete(reset)
    else storeEntries.deleteEntry(props.entry.id)
  }

  const promptToDelete = reset => {
    $q.dialog({
      title: 'Delete Entry',
      message: `
        Delete this entry?
        <div class="q-mt-md text-weight-bold ${ useAmountColorClass(props.entry.amount) }">
          ${ props.entry.name } : ${ useCurrencify(props.entry.amount) }
        </div>
      `,
      cancel: true,
      persistent: true,
      html: true,
      ok: {
        label: 'Delete',
        color: 'negative',
        noCaps: true
      },
      cancel: {
        color: 'primary',
        noCaps: true
      }
    }).onOk(() => {
      storeEntries.deleteEntry(props.entry.id)
    }).onCancel(() => {
      reset()
    })
  }

  //Name & Amount Udapte
  const onNameUpdate = value => {
    storeEntries.updateEntry(props.entry.id, { name: value });
  }
  const onAmountUpdate = value => {
    storeEntries.updateEntry(props.entry.id, { amount: value });
  }

</script>
