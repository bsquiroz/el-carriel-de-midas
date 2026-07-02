import { ref, type Ref } from 'vue'
import { isAdminModeEnabled } from '../utils/adminMode'

export function useAdminMode(): { isAdmin: Readonly<Ref<boolean>> } {
  const isAdmin = ref(isAdminModeEnabled())
  return { isAdmin }
}
