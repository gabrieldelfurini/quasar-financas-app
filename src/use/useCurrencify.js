import { useStoreSettings } from 'src/stores/SettingsStore'

const storeSettings = useStoreSettings();

//currencify
export function useCurrencify (amount) {

  let posNegSymbol = ''
  if (amount > 0) posNegSymbol = "+"
  else if (amount < 0) posNegSymbol = "-"

  const currencySymbol = storeSettings.settings.currencySymbol,
    amountPositive = Math.abs(amount).toFixed(2),
    amoutFormatted = amountPositive.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

  return `${posNegSymbol} ${currencySymbol} ${amoutFormatted}`
}
