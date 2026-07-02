import { LEY_MAX, LEY_MIN } from '../constants/pricing.constants'
import type { FieldValidation } from '../types/validation.types'

const INTEGER_PATTERN = /^\d+$/
const DECIMAL_COMMA_PATTERN = /^\d+(,\d+)?$/

export function validateLey(raw: string): FieldValidation {
  const trimmed = raw.trim()

  if (trimmed === '') {
    return { valid: false, message: 'La ley es obligatoria.' }
  }

  if (!INTEGER_PATTERN.test(trimmed)) {
    return { valid: false, message: 'La ley debe ser un número entero entre 0 y 999.' }
  }

  const ley = parseInt(trimmed, 10)

  if (ley < LEY_MIN || ley > LEY_MAX) {
    return { valid: false, message: 'La ley debe ser un número entero entre 0 y 999.' }
  }

  return { valid: true, message: null }
}

export function validateGramos(raw: string): FieldValidation {
  const trimmed = raw.trim()

  if (trimmed === '') {
    return { valid: false, message: 'El peso es obligatorio.' }
  }

  if (!DECIMAL_COMMA_PATTERN.test(trimmed)) {
    return { valid: false, message: 'El peso debe ser un número válido, ej: 5,25.' }
  }

  const gramos = parseFloat(trimmed.replace(',', '.'))

  if (!(gramos > 0)) {
    return { valid: false, message: 'El peso debe ser mayor que cero.' }
  }

  return { valid: true, message: null }
}

export function validatePercentage(raw: string): FieldValidation {
  const trimmed = raw.trim()

  if (trimmed === '') {
    return { valid: false, message: 'El porcentaje es obligatorio.' }
  }

  if (!DECIMAL_COMMA_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Debe ser un número válido, ej: 10.' }
  }

  const percentage = parseFloat(trimmed.replace(',', '.'))

  if (percentage < 0 || percentage > 100) {
    return { valid: false, message: 'Debe estar entre 0 y 100.' }
  }

  return { valid: true, message: null }
}
