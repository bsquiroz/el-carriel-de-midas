import { computed, type ComputedRef, type Ref } from 'vue'
import { PURE_GOLD_LEY } from '../constants/pricing.constants'
import { validateGramos, validateLey } from '../utils/validators'
import type { GoldCalculationResult } from '../types/calculation.types'
import type { FieldValidation } from '../types/validation.types'

const EMPTY_RESULT: GoldCalculationResult = { pureza: 0, precioPorGramo: 0, total: 0 }

export function useGoldCalculator(
  leyRaw: Ref<string>,
  gramosRaw: Ref<string>,
  buyPrice24kCop: Ref<number | null> | ComputedRef<number | null>,
) {
  const leyValidation = computed<FieldValidation>(() => validateLey(leyRaw.value))
  const gramosValidation = computed<FieldValidation>(() => validateGramos(gramosRaw.value))

  const isValid = computed<boolean>(
    () =>
      leyValidation.value.valid && gramosValidation.value.valid && buyPrice24kCop.value !== null,
  )

  const result = computed<GoldCalculationResult>(() => {
    if (!isValid.value || buyPrice24kCop.value === null) return EMPTY_RESULT

    const ley = parseInt(leyRaw.value.trim(), 10)
    const gramos = parseFloat(gramosRaw.value.trim().replace(',', '.'))

    const pureza = ley / PURE_GOLD_LEY
    const precioPorGramo = buyPrice24kCop.value * pureza
    const total = precioPorGramo * gramos

    return { pureza, precioPorGramo, total }
  })

  return { leyValidation, gramosValidation, isValid, result }
}
