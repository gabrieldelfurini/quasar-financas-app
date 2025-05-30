import { defineStore } from 'pinia';
import { ref, computed, reactive, watch, nextTick } from 'vue';
import { uid, Notify, LocalStorage } from "quasar";

export const useStoreEntries = defineStore('entries', () => {
  // state
    const entries = ref([
      {
        id: "id0",
        amount: 4999.9,
        name: "Salary",
        paid: false
      },
      {
        id: "id1",
        amount: -999,
        name: "Rentasa",
        paid: false
      },
      {
        id: "id2",
        amount: -14.99,
        name: "Phone",
        paid: false
      },
      {
        id: "id3",
        amount: 0,
        name: "Unknown",
        paid: false
      },
    ]);

    watch(entries.value, () => {
      saveEntries()
    })

    const options = reactive({
      sort: false
    });



  // getters
    const balance = computed(() => {
      return entries.value.reduce((acc, { amount }) => {
        return acc + amount;
      }, 0);
    });

    const balancePaid = computed(() => {
      return entries.value.reduce((acc, { amount, paid }) => {
        return paid ? acc + amount : acc;
      }, 0);
    });

    const runningBalances = computed(() => {
      let runningBalances = [],
          currentRunningBalace = 0

      if (entries.value.length) {
        entries.value.forEach(entry => {
          let entryAmount = entry.amount ? entry.amount : 0
          currentRunningBalace = currentRunningBalace + entryAmount
          runningBalances.push(currentRunningBalace)
        })
      }

      return runningBalances
    })


  // actions
    const addEntry = addEntryForm => {
      const newEntry = Object.assign({}, addEntryForm, {id: uid(), paid: false});
      entries.value.push(newEntry)
    }

    const deleteEntry = entryId => {
      const index = getEntryIndexById(entryId)
      entries.value.splice(index, 1)
      removeSlideItemIfExiste(entryId)
      Notify.create({
        message: 'Entry Deleted',
        position: 'top'
      })
    };

    const updateEntry = (entryId, updates) => {
      const index = getEntryIndexById(entryId)
      Object.assign(entries.value[index], updates)
    }

    const sortEnd = ({oldIndex, newIndex}) => {
      const movedEntry = entries.value[oldIndex]
      entries.value.splice(oldIndex, 1)
      entries.value.splice(newIndex, 0, movedEntry)
    }

    const saveEntries = () => {
      LocalStorage.set('entries', entries.value)
    }

    const loadEntries = () => {
      const savedEntries = LocalStorage.getItem('entries')
      if (savedEntries) Object.assign(entries.value, savedEntries)
    }


  //Helpers
    const getEntryIndexById = entryId => {
      return entries.value.findIndex(entry => entry.id === entryId)
    }

    const removeSlideItemIfExiste = entryId => {
      // hacky fix: when deleting (after sorting),
      // sometimes the slide item is not removed
      // from the dom. this will remove the slide
      // item from the dom if it still exists
      // (after entry removed from entries array)
      nextTick(() => {
        const slideItem = document.querySelector(`#id-${entryId}`)
        if (slideItem) slideItem.remove()
      })
    }


  // result
    return {
      // store
        entries,
        options,

      // getters
        balance,
        balancePaid,
        runningBalances,

      // actions
        addEntry,
        deleteEntry,
        updateEntry,
        sortEnd,
        loadEntries
    }
})
