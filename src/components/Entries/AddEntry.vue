<template>
  <q-form
    class="row q-pb-sm q-px-sm q-col-gutter-sm bg-primary"
    @submit="addEntryFormSubmit"
  >
    <div class="col">
      <q-input
        v-model="addEntryForm.name"
        outlined
        dense
        :bg-color="useLightOrDark('white', 'dark')"
        placeholder="Name"
        v-select-all
        ref="nameRef"
      />
    </div>
    <div class="col">
      <q-input
        v-model.number="addEntryForm.amount"
        input-class="text-right"
        type="number"
        outlined
        step="0.01"
        dense
        v-select-all
        :bg-color="useLightOrDark('white', 'dark')"
        placeholder="Amount"
      />
    </div>
    <div class="col col-auto">
      <q-btn round color="primary" icon="add" type="submit" />
    </div>
  </q-form>
</template>

<script setup>
// Imports

  import { ref, reactive } from "vue";
  import { useStoreEntries } from "../../stores/EntriesStore";
  import { useQuasar } from "quasar";
  import vSelectAll from "src/directives/directSelectAll"
  import { useLightOrDark } from "src/use/useLightOrDark";

  const $q = useQuasar()
  const storeEntries = useStoreEntries()

// Add entry

  const addEntryFormDefault = {
    name: "",
    amount: null,
  };

  const nameRef = ref(null);

  const addEntryForm = reactive({
    ...addEntryFormDefault
  });

  const addEntryFormReset = () => {
    Object.assign(addEntryForm, addEntryFormDefault);
    nameRef.value.focus();
  };

  const addEntryFormSubmit = () => {
    storeEntries.addEntry(addEntryForm)
    addEntryFormReset()
  }
</script>
