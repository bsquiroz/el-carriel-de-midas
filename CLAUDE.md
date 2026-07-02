# El carriel de midas

Aplicación web que calcula en tiempo real cuánto se puede pagar por una determinada cantidad de oro según su pureza (ley) y el precio internacional del oro. **Ya está implementada** — este documento describe tanto las reglas de negocio como el estado real del código, para que cualquier cambio futuro parta del contexto correcto sin necesidad de re-explorar el repo.

---

# Stack tecnológico (ya instalado)

- Vue 3 + Composition API + `<script setup>`
- TypeScript estricto (`noUnusedLocals`, `noUnusedParameters` activados en `tsconfig.app.json`)
- Vite 8
- TailwindCSS v4 vía `@tailwindcss/vite` — configuración **CSS-first** en `src/style.css` (no existe `tailwind.config.*`, los tokens de marca están en un bloque `@theme`)
- Pinia (store único: `goldPriceStore`)
- Google Font "Playfair Display" cargada por `<link>` en `index.html` (requiere red la primera vez; se usa solo para títulos y precios grandes vía la utilidad `font-display`)

Arquitectura por capas: `services/` (solo HTTP) → `stores/` (estado + persistencia) → `composables/` (toda la lógica matemática/negocio) → `components/` (solo presentación, nunca calculan).

---

# Objetivo

El usuario ingresa únicamente:

- Ley del oro (entero, 0–999, milésimas de pureza).
- Peso en gramos (decimal, **con coma** como separador — no punto).

Todo se recalcula en tiempo real vía `computed`. No hay botón de calcular ni watchers ni debounce.

---

# Fuente de datos

```http
GET https://xaus.com/api/v1/spot?currency=USD&unit=gram
```

Sin backend, sin scraping. Toda la lógica vive en el frontend.

De la respuesta solo se usan `per_gram_usd`, `fx_rates.COP` y `updated_at`. El resto del payload se ignora. Ver `src/services/goldPriceService.ts` (solo hace el `fetch`, sin lógica) y `src/composables/useGoldPriceMapper.ts` (único lugar que toca el shape crudo de la API y produce el tipo interno `GoldPrice`):

```ts
// src/types/gold-price.types.ts
interface GoldPrice {
  price24kCop: number   // per_gram_usd × fx_rates.COP — precio internacional del oro 24K en COP
  price24kUsd: number   // = per_gram_usd
  usdCopRate: number    // = fx_rates.COP
  updatedAt: string
}
```

Ningún cálculo de la app usa los datos crudos de la API directamente; todo pasa por `GoldPrice`. El store (`src/stores/goldPriceStore.ts`) persiste **exactamente** esta estructura en LocalStorage (clave en `src/constants/storage.constants.ts`), sin wrapper de versión.

---

# Reglas de negocio

## Ajuste de precio de compra (mercado local + margen de ganancia)

`price24kCop` (el derivado de la API) es el **precio internacional de referencia**. El precio que la app realmente ofrece pagar ("precio de compra") se calcula aplicando dos descuentos **secuenciales/compuestos** (no una resta simple del 20%):

```text
precioCompra24kCop = price24kCop × (1 − MARKET_DISCOUNT_RATE) × (1 − PROFIT_MARGIN_RATE)
```

- `MARKET_DISCOUNT_RATE`: % que se paga por debajo del precio internacional en el mercado colombiano.
- `PROFIT_MARGIN_RATE`: % de margen de ganancia del negocio, aplicado sobre el precio ya ajustado al mercado.

Ambas son **constantes** en `src/constants/pricing.constants.ts`, actualmente **10% y 10%** respectivamente. Cambiar el margen de ganancia (ej. a 5%, 7%, 15%) implica editar únicamente ese archivo — ninguna otra pieza del código necesita tocarse, y no dispara un refetch (el precio internacional cacheado se reutiliza, solo cambia el cálculo derivado).

La función pura vive en `src/composables/useBuyPrice.ts` (`calculateBuyPrice24kCop`). `src/composables/useGoldPrice.ts` expone tanto `price24kCop` (internacional) como `buyPrice24kCop` (ajustado), con sus versiones formateadas (`formattedInternationalPricePerGram`, `formattedBuyPricePerGram`).

**Todos los cálculos de "Precio por gramo" y "Total" (sección Cálculo/Resultado) usan `buyPrice24kCop`, nunca `price24kCop` directamente.**

La UI **no revela los porcentajes** aplicados en ningún texto — solo muestra los dos precios resultantes (ver sección Interfaz).

## Obtención del precio

Se consulta la API únicamente cuando no hay precio almacenado o cuando expiró. Se persiste localmente el precio y la fecha de última actualización (LocalStorage).

## Vigencia del precio

15 minutos (`PRICE_TTL_MS` en `src/constants/pricing.constants.ts`). Recargar antes de ese tiempo reutiliza el precio cacheado; después de 15 min, la siguiente carga dispara una nueva consulta automática. Lógica de expiración pura en `src/utils/priceExpiry.ts` (`isExpired`).

## Actualización manual

Los usuarios normales no tienen forma de refrescar el precio manualmente. No hay botón visible por defecto.

## Modo administrador

Se activa con el query param `?musniga-quimaya` (bare) o `?musniga-quimaya=true` (cualquier otro valor, ej. `=false` o `=1`, **no** activa el modo — lectura estricta). Parseo en `src/utils/adminMode.ts` (`isAdminModeEnabled`), expuesto reactivamente vía `src/composables/useAdminMode.ts`. Se evalúa una sola vez al montar (la query no cambia sin recarga).

Con admin activo se muestra el botón **"Actualizar precio del oro"** (`src/components/AdminRefreshButton.vue`), inyectado en el slot `action` de `PriceCard.vue`. Al presionarlo: refetch forzado (ignora expiración), reemplaza el precio y la fecha, reinicia el TTL. Acción `refreshPrice()` en el store.

---

# Interfaz (estado actual, ya implementado)

## Header

Logo `public/logo.png` (emblema dorado con el nombre y "Joyería Premium" ya dibujados en la imagen — **no** hay texto duplicado tipo eyebrow/título aparte). Se usa también como favicon (`index.html`). Debajo del logo, un subtítulo: "Calcula el valor de compra del oro en tiempo real".

## Tarjeta principal (`PriceCard.vue`)

Muestra **dos precios** (sin mencionar los porcentajes de ajuste):

```text
PRECIO DE COMPRA · ORO 24K
$363.998,12 COP / gramo

Referencia internacional: $449.380,39 COP / gramo
Actualizado: 01/07/2026 19:34
```

El precio grande (`font-display`, serif) es `buyPrice24kCop`. La línea de referencia internacional es `price24kCop`, sin ajustar.

En escritorio (`lg:` ≥1024px) esta tarjeta pone el precio a la izquierda y el botón admin (si aplica) en línea a la derecha; en móvil se apila.

## Inputs (`GoldCalculatorForm.vue` + `BaseInput.vue`)

- **Ley del oro**: entero 0–999, placeholder `Ej: 750`, hint "Milésimas (0-999)".
- **Peso**: decimal **con coma**, placeholder `Ej: 5,25`, hint "Gramos".

En escritorio los dos inputs van en 2 columnas (`lg:grid-cols-2`); en móvil apilados.

## Resultado / Liquidación (`ResultCard.vue`)

```text
LIQUIDACIÓN

Precio por gramo          |  Total
$337.280,86                |  $1.770.724,50
```

En móvil: filas apiladas con divisor punteado dorado. En escritorio: 2 columnas con divisor vertical. Cuando el cálculo no es válido (inputs vacíos/inválidos o precio no cargado), en vez de los valores se muestran barritas placeholder (no el texto `--`) y un mensaje de ayuda: "Ingresa la ley y el peso para calcular el valor de compra."

---

# Cálculo

Todo vía `computed` (`src/composables/useGoldCalculator.ts`), nunca watchers.

```text
precioCompra24kCop = price24kCop × (1 − MARKET_DISCOUNT_RATE) × (1 − PROFIT_MARGIN_RATE)

pureza = ley / 999

precioPorGramo = precioCompra24kCop × pureza

total = precioPorGramo × gramos
```

- 999 = oro puro, 750 = 75%, 585 = 58,5%, 333 = 33,3%.

---

# Validaciones (`src/utils/validators.ts`)

- **Ley**: obligatoria, entero (acepta ceros a la izquierda, ej. `"007"` → 7), 0 ≤ ley ≤ 999.
- **Gramos**: obligatorio, acepta coma decimal, debe ser > 0.

Si algún dato es inválido no se calcula (placeholders en `ResultCard`, mensajes amigables en español bajo cada input). El formulario completo se deshabilita mientras no haya un `buyPrice24kCop` cargado (loading o error).

Si falla la consulta a la API y no hay precio en caché: se muestra un error amigable en `PriceCard`, **sin reintento automático** (el usuario debe recargar).

---

# Formato

**Decisión final: 2 decimales en todos los valores monetarios**, siempre vía `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2, maximumFractionDigits: 2 })` (`src/utils/currency.ts`, función `formatCop`). Nota: `es-CO` inserta un espacio entre el símbolo `$` y el número (`$ 449.037,82`) — es el comportamiento estándar de `Intl` para ese locale, no un bug.

Fechas: `Intl.DateTimeFormat('es-CO', {...}).formatToParts()` armado manualmente a `dd/mm/yyyy hh:mm` (`src/utils/date.ts`, función `formatUpdatedAt`) para evitar el orden/separadores inconsistentes del formato combinado por defecto del locale.

---

# UX

Los refs de los inputs (`leyRaw`, `gramosRaw`) solo se mutan por el propio `v-model` del usuario — nunca se reformatean en el handler — por lo que no hay pérdida de foco ni parpadeos. Cálculo 100% síncrono vía `computed`, sensación instantánea.

---

# Diseño (implementado)

## Paleta

| Token Tailwind (`@theme` en `src/style.css`) | Valor | Uso |
|---|---|---|
| `--color-midas-bg` | `#0F2A1D` | Fondo (con viñeta radial sutil, no plano) |
| `--color-midas-gold` | `#C9A227` | Color principal |
| `--color-midas-gold-light` | `#E8D58B` | Color secundario |
| `--color-midas-card` | `#173B2B` | Tarjetas |
| `--color-midas-text` | `#F5F3EA` | Texto |
| `--font-display` | `'Playfair Display', ui-serif, Georgia, serif` | Título/precios grandes |

## Componentes reutilizables de CSS (`@layer components` en `src/style.css`)

- `.card-midas`: fondo de tarjeta + borde dorado translúcido fino + sombra suave.
- `.btn-metallic`: gradiente dorado, mayúsculas, sombra — apariencia metálica.
- `.label-caps`: labels en mayúsculas con tracking amplio, color dorado (usado en "LEY DEL ORO", "PESO", "LIQUIDACIÓN", "PRECIO DE COMPRA · ORO 24K").

## Responsive

Layout apilado de una columna en móvil; en escritorio (`lg:` ≥1024px) se amplía a `max-w-3xl` con precio+botón admin en línea, inputs en 2 columnas y Liquidación en 2 columnas con divisor vertical (en vez de horizontal punteado).

## Assets

- `public/logo.png`: emblema/logo oficial (fondo no transparente, degradado gris/dorado — decisión tomada: se usa completo tal cual, se ve bien a los tamaños en que se muestra). Usado como favicon y como header de `App.vue`.
- `inspiration/`: capturas de referencia de diseño usadas para el rediseño premium (tipografía serif, tarjetas con borde dorado, labels en mayúsculas, layout responsive). Conservar como referencia si se vuelve a tocar el diseño.

---

# Organización del proyecto (árbol real)

```text
src/
  App.vue                          # shell: logo + subtítulo + <GoldCalculator/>
  main.ts                          # createApp + createPinia
  style.css                        # Tailwind v4 CSS-first, @theme, componentes CSS

  types/
    gold-price.types.ts            # GoldSpotApiResponse, GoldPrice
    calculation.types.ts           # GoldCalculationResult
    validation.types.ts            # FieldValidation

  constants/
    api.constants.ts               # GOLD_SPOT_ENDPOINT, GOLD_SPOT_QUERY
    pricing.constants.ts           # PRICE_TTL_MS, LEY_MIN/MAX, PURE_GOLD_LEY, MARKET_DISCOUNT_RATE, PROFIT_MARGIN_RATE
    storage.constants.ts           # GOLD_PRICE_STORAGE_KEY
    admin.constants.ts             # ADMIN_QUERY_PARAM

  utils/
    currency.ts                    # formatCop()
    date.ts                        # formatUpdatedAt()
    storage.ts                     # readFromStorage/writeToStorage/removeFromStorage (try/catch)
    priceExpiry.ts                 # isExpired()
    adminMode.ts                   # isAdminModeEnabled()
    validators.ts                  # validateLey(), validateGramos() — acepta coma decimal

  services/
    goldPriceService.ts            # fetchGoldSpotPrice() — SOLO HTTP, sin lógica de negocio

  stores/
    goldPriceStore.ts              # Pinia: state (precio internacional crudo) + initialize()/refreshPrice() + cache-check + persistencia

  composables/
    useGoldPriceMapper.ts          # mapSpotResponseToGoldPrice() — único lugar que toca el shape crudo de la API
    useBuyPrice.ts                 # calculateBuyPrice24kCop() — aplica MARKET_DISCOUNT_RATE + PROFIT_MARGIN_RATE
    useGoldCalculator.ts           # ley/gramos + buyPrice24kCop -> validaciones + pureza/precioPorGramo/total (todo computed)
    useGoldPrice.ts                # wrapper del store: price24kCop, buyPrice24kCop, formateados, initialize/refresh
    useAdminMode.ts                # isAdmin (evaluado una vez desde la URL)

  components/
    BaseInput.vue                  # input reutilizable: label + hint + error
    PriceCard.vue                  # precio de compra + referencia internacional + updatedAt + slot "action"
    GoldCalculatorForm.vue         # inputs de ley y gramos
    ResultCard.vue                 # Liquidación: precio por gramo + total, con placeholders y glow decorativo
    AdminRefreshButton.vue         # botón admin, presentacional
    GoldCalculator.vue             # contenedor: orquesta store + composables + sub-componentes
```

Cada capa mantiene su responsabilidad única: `services/` solo HTTP, `composables/` toda la matemática/negocio, `stores/` solo orquestación de estado/caché, `components/` solo presentación (nunca calculan).

---

# Escalabilidad

Ya resuelto de forma extensible (agregar sin romper lo existente):

- **Margen de ganancia configurable** ✅ implementado como constantes (`MARKET_DISCOUNT_RATE`, `PROFIT_MARGIN_RATE`); si se pide que sea configurable desde UI (no solo código), agregar un store/composable nuevo sin tocar el cálculo existente.
- Pendientes (mencionados en el brief original, no implementados): historial de compras, historial del precio del oro, diferentes monedas, diferentes países, dashboard administrativo, clientes, impresión de recibos, autenticación.

---

# Calidad del código

TypeScript estricto, Composition API, componentes pequeños, sin lógica duplicada, funciones pequeñas, nombres descriptivos, separación clara de responsabilidades. Mantener esta misma arquitectura por capas al agregar features nuevas.
