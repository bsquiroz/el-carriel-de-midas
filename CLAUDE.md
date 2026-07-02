# El carriel de midas

Quiero desarrollar una aplicación web moderna llamada **El carriel de midas**, cuyo objetivo es calcular en tiempo real cuánto se puede pagar por una determinada cantidad de oro según su pureza (ley) y el precio internacional del oro.

La aplicación debe tener una arquitectura limpia, escalable y preparada para producción.

---

# Stack tecnológico

- Vue 3
- TypeScript
- Vite
- TailwindCSS
- Composition API
- Pinia
- Arquitectura basada en servicios, composables y stores.
- Código completamente tipado.
- Componentes pequeños y reutilizables.
- Buenas prácticas de Vue.

---

# Objetivo

La aplicación permitirá calcular automáticamente el valor de compra del oro.

El usuario únicamente ingresará:

- Ley del oro.
- Peso en gramos.

La aplicación calculará automáticamente el valor a pagar utilizando el precio actualizado del gramo de oro puro (24K).

No debe existir un botón para calcular.

Todo debe actualizarse en tiempo real mediante propiedades computadas.

---

# Fuente de datos

El precio del oro debe obtenerse desde el siguiente endpoint:

```http
GET https://xaus.com/api/v1/spot?currency=USD&unit=gram
```

No utilizar scraping.

No utilizar backend.

Toda la lógica debe ejecutarse desde el frontend.

---

# Tratamiento de la respuesta

La API devuelve mucha información, pero únicamente deben utilizarse los siguientes campos:

```json
{
  "per_gram_usd": 130.0014,
  "fx_rates": {
    "COP": 3454.425874
  },
  "updated_at": "2026-07-01T23:06:49.543Z"
}
```

La aplicación debe obtener:

- per_gram_usd
- fx_rates.COP
- updated_at

El precio del gramo de oro puro en pesos colombianos se calcula así:

```text
precio24kCOP = per_gram_usd × fx_rates.COP
```

Ejemplo:

```text
130.0014 × 3454.425874 = 449037.82 COP
```

Una vez calculado, únicamente debe almacenarse esta estructura:

```ts
{
  price24kCop: number;
  price24kUsd: number;
  usdCopRate: number;
  updatedAt: string;
}
```

Todos los cálculos de la aplicación deberán utilizar únicamente `price24kCop`.

Nunca deberán utilizar directamente los datos provenientes de la API.

---

# Reglas de negocio

## Obtención del precio

El precio del oro debe consultarse automáticamente únicamente cuando la aplicación no tenga un precio almacenado o cuando dicho precio haya expirado.

La aplicación debe almacenar localmente:

- Precio del oro.
- Fecha y hora de la última actualización.

Puede utilizar LocalStorage para persistir esta información.

---

## Vigencia del precio

El precio tendrá una vigencia de **15 minutos**.

Esto significa:

- Al ingresar por primera vez se consulta la API.
- Si el usuario recarga la página antes de 15 minutos NO debe realizarse una nueva consulta.
- Debe reutilizarse el precio almacenado.
- Una vez hayan transcurrido 15 minutos desde la última actualización, la siguiente vez que el usuario abra o recargue la aplicación deberá realizarse una nueva consulta automáticamente.

Nunca debe realizar consultas innecesarias.

---

## Actualización manual

Por defecto el usuario **NO** puede actualizar manualmente el precio.

No debe mostrarse ningún botón para actualizar.

---

## Modo administrador

Existirá un modo administrador oculto.

Este modo únicamente se activará cuando la URL contenga el siguiente query parameter:

```text
?musniga-quimaya
```

o

```text
?musniga-quimaya=true
```

Cuando este parámetro exista deberán habilitarse funcionalidades adicionales.

Actualmente únicamente una:

Mostrar el botón:

**Actualizar precio del oro**

Al presionarlo deberá:

- Consultar nuevamente la API.
- Reemplazar el precio almacenado.
- Actualizar la fecha de actualización.
- Reiniciar el contador de vigencia de 15 minutos.

Si el parámetro no existe, este botón jamás debe renderizarse.

---

# Interfaz

La aplicación debe ser minimalista.

Debe contener:

## Tarjeta principal

Mostrar:

- Precio actual del gramo de oro 24K.
- Fecha y hora de la última actualización.

Ejemplo:

```text
$449.037 COP / gramo

Actualizado:
01/07/2026 18:06
```

---

## Inputs

### Ley del oro

Características:

- Número entero.
- Mínimo 0.
- Máximo 999.

Placeholder:

```text
Ej: 750
```

---

### Peso

Características:

- Número decimal.

Placeholder:

```text
5.25 gramos
```

---

# Cálculo

Todo el cálculo debe realizarse utilizando propiedades computadas.

Nunca mediante watchers.

La ley representa milésimas de pureza.

Ejemplos:

- 999 = Oro puro
- 750 = 75%
- 585 = 58.5%
- 333 = 33.3%

La fórmula será:

```text
pureza = ley / 999

precioPorGramo = precio24kCOP × pureza

total = precioPorGramo × gramos
```

---

# Resultado

Mostrar una tarjeta con:

Precio por gramo

Total a pagar

Ejemplo:

```text
Precio por gramo

$337.080

------------------

Total

$1.685.400
```

Todo debe actualizarse inmediatamente mientras el usuario escribe.

---

# Validaciones

## Ley

- Obligatoria.
- Entero.
- Entre 0 y 999.

---

## Gramos

- Obligatorio.
- Mayor que cero.

---

Si algún dato es inválido no debe calcular.

Mostrar mensajes amigables.

---

# Formato

Todos los valores monetarios deben utilizar formato colombiano.

Ejemplo:

```text
$449.037,82
```

Utilizar `Intl.NumberFormat`.

Las fechas también deberán formatearse utilizando la API de internacionalización.

---

# UX

Mientras el usuario escribe:

- No debe perder el foco.
- No debe haber parpadeos.
- No utilizar debounce.
- El cálculo debe sentirse instantáneo.

---

# Diseño

La aplicación debe transmitir una sensación premium inspirada en una joyería de lujo.

## Paleta

Fondo

```text
#0F2A1D
```

Verde oscuro.

Color principal

```text
#C9A227
```

Dorado.

Color secundario

```text
#E8D58B
```

Tarjetas

```text
#173B2B
```

Texto

```text
#F5F3EA
```

Los botones deben tener apariencia metálica.

Las tarjetas deben tener sombras suaves.

El diseño debe sentirse moderno, elegante y profesional.

---

# Organización del proyecto

```text
src/

components/
composables/
services/
stores/
types/
utils/
constants/
```

---

## Services

Crear un servicio encargado exclusivamente de consumir la API.

No debe existir lógica de negocio aquí.

Únicamente peticiones HTTP.

---

## Store

El store deberá almacenar:

```ts
{
  price24kCop: number;
  price24kUsd: number;
  usdCopRate: number;
  updatedAt: string;
  loading: boolean;
  error: string | null;
}
```

También deberá encargarse de:

- Consultar LocalStorage.
- Validar si el precio expiró.
- Guardar nuevamente la información.
- Exponer acciones para actualizar el precio.

---

## Composables

Toda la lógica matemática deberá vivir aquí.

Los componentes nunca deberán realizar cálculos.

---

## Utils

Crear utilidades para:

- Formatear moneda.
- Formatear fechas.
- Validar expiración de los 15 minutos.
- Persistencia en LocalStorage.

---

# Escalabilidad

La arquitectura debe facilitar agregar posteriormente:

- Historial de compras.
- Historial del precio del oro.
- Margen de ganancia configurable.
- Diferentes monedas.
- Diferentes países.
- Dashboard administrativo.
- Clientes.
- Impresión de recibos.
- Autenticación.

---

# Calidad del código

Generar código listo para producción.

- TypeScript estricto.
- Composition API.
- Componentes reutilizables.
- Sin lógica duplicada.
- Funciones pequeñas.
- Principios SOLID cuando apliquen.
- Código fácilmente testeable.
- Nombres descriptivos.
- Separación clara de responsabilidades.

La prioridad debe ser mantener un código limpio, escalable y fácil de mantener.
