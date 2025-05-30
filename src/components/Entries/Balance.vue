<template>
  <div
    class="row q-mb-sm q-px-md q-py-sm items-center"
    :class="useLightOrDark('shadow-up-3', 'bg-black')"
  >
    <div class="col text-grey-7 text-h6">Balance:</div>
    <div class="col text-right text-h6" :class="useAmountColorClass(storeEntries.balance)">

      <div class="row">
        <div class="col">
            {{ useCurrencify(storeEntries.balance) }}
        </div>
      </div>

      <div
        v-if="storeEntries.balancePaid"
        class="row"
      >
        <div class="col text-caption text-grey-6">
            Paid:
            <span
              class="text-weight-bold"
              :class="useAmountColorClass(storeEntries.balancePaid)"
            >
              {{ useCurrencify(storeEntries.balancePaid) }}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // Imports

    import { useStoreEntries } from "src/stores/EntriesStore";
    import { useCurrencify } from "src/use/useCurrencify";
    import { useAmountColorClass } from "src/use/useAmountColorClass";
    import { useLightOrDark } from "src/use/useLightOrDark";

    const storeEntries = useStoreEntries()

</script>
