# Sugar Mood

Frontend React + Vite con una simulación persistente en **JSON Server 0.17.4**. No contiene un backend propio.

## Ejecutar

Requiere Node.js compatible con Vite 8 (20.19+ o 22.12+).

```powershell
npm install
npm run dev
```

Este comando inicia JSON Server en `http://127.0.0.1:3001` y Vite en `http://localhost:5173`. Si el puerto del frontend está ocupado, Vite mostrará otro en la terminal. Ctrl+C detiene ambos procesos.

Para ejecutarlos por separado, usa `npm run mock` y `npm run dev:web` en dos terminales. Para revisar el build, usa `npm run build`, deja `npm run mock` activo y ejecuta `npm run preview`.

## Simulación

- `mock/db.json`: datos de trabajo que JSON Server modifica.
- `mock/db.seed.json`: datos iniciales con 22 productos.
- `GET /state`: carga la simulación.
- `PUT /state`: guarda el estado completo.
- `PATCH /state`: modifica campos del estado.

El frontend usa `/api/state`; Vite y preview lo redirigen al puerto 3001. Puedes copiar `.env.example` a `.env.local` y establecer `VITE_API_URL=http://127.0.0.1:3001` para usar una URL directa. Reinicia Vite después de cambiar variables de entorno.

Se persisten catálogo, carrito, pedidos, favoritos, calificaciones, comentarios, reportes, mensajes, donaciones, clientes, puntos, nivel, eventos, configuración y gastos. Las promociones y el directorio siguen siendo contenido estático. El selector Cliente/Admin es una función de demostración y vuelve a Cliente al recargar.

Los cambios se agrupan durante 150 ms y se envían en orden. La barra superior indica carga, guardado o error. Si falla el guardado, conserva el estado en la pestaña, bloquea la edición y permite reintentar; recargar puede perder cambios todavía no guardados.

Esta simulación representa una única sesión compartida. Dos pestañas o usuarios que escriban simultáneamente pueden sobrescribirse; no hay autenticación, pagos reales ni control de concurrencia.

## Restablecer datos

Detén los procesos y ejecuta:

```powershell
npm run mock:reset
npm run dev
```

El restablecimiento reemplaza los datos de trabajo por la semilla y elimina los pedidos y cambios de demostración. No lo ejecutes si necesitas conservarlos.

## Verificaciones

```powershell
npm test
npm run lint
npm run build
npm audit
```

Las pruebas de integración usan un archivo temporal y un puerto libre; no modifican `mock/db.json`. Consulta [REVISION.md](REVISION.md) para ver los errores encontrados, correcciones y limitaciones pendientes.

Referencia: [documentación oficial de JSON Server estable](https://github.com/typicode/json-server/tree/v0.17.4).
