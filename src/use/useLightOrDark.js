import { Dark } from 'quasar'

//Amout Color Class
export function useLightOrDark (lightString, darkString) {
  return !Dark.isActive ? lightString : darkString
}
