import { ADMIN_QUERY_PARAM } from '../constants/admin.constants'

export function isAdminModeEnabled(search: string = window.location.search): boolean {
  const params = new URLSearchParams(search)
  if (!params.has(ADMIN_QUERY_PARAM)) return false

  const value = params.get(ADMIN_QUERY_PARAM)
  return value === '' || value === 'true'
}
