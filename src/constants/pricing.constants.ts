export const PRICE_TTL_MS = 15 * 60 * 1000

export const LEY_MIN = 0
export const LEY_MAX = 999
export const PURE_GOLD_LEY = 999

// Defaults iniciales de pricingConfigStore (% que se paga por debajo del precio
// internacional en el mercado colombiano). En modo admin se pueden sobreescribir
// en vivo desde AdminPricingControls.vue — ese cambio no persiste, vuelve a este
// valor al recargar la página.
export const MARKET_DISCOUNT_RATE = 0.10
// Default inicial de pricingConfigStore (% de margen de ganancia del negocio,
// aplicado sobre el precio ya ajustado al mercado). Mismo comportamiento que
// MARKET_DISCOUNT_RATE: editable en vivo en modo admin, sin persistencia.
export const PROFIT_MARGIN_RATE = 0.10
