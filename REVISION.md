# Revisión del proyecto — 12 de octubre de 2026

## Actualización visual

Renovados portada, catálogo, favoritos y navegación con una identidad crema y cereza, tipografía Fraunces/DM Sans, tarjetas de producto compartidas y un menú móvil desplegable. Incorporados búsqueda sin distinción de acentos, filtros por categoría y ordenamiento. Se retiró el cursor decorativo y se añadió una imagen local de respaldo para las tarjetas.

Mejorados foco de teclado, controles de calificación, nombres de botones del carrito, etiquetas de checkout y configuración, cierre del menú con Escape y gestión del foco dentro del menú móvil. El SINPE del checkout ahora usa el valor configurado. El canje incompleto se identifica como próximamente y las promociones incluyen una aclaración de demostración. Estos cambios sustituyen los hallazgos anteriores sobre estrellas clicables y favicon del template; otros campos administrativos aún admiten mejoras de accesibilidad.

Se añadió una prueba de renderizado de las 23 rutas/vistas de cliente y administración con datos iniciales y con pedidos/favoritos de demostración. Esta prueba no sustituye la inspección visual ni las interacciones en un navegador conectado.

Se revisaron el arranque, configuración de Vite y ESLint, dependencias, estilos, recursos y las vistas de cliente y administración de `src/App.jsx`. El proyecto original compilaba y pasaba ESLint; los fallos encontrados eran principalmente de comportamiento.

## Corregido

- **Pérdida de datos al recargar:** el estado modificable ahora se carga y guarda mediante JSON Server. Hay semilla y comando de restablecimiento.
- **Ausencia de comunicación HTTP:** añadido hook de acceso a la simulación, proxy de desarrollo y preview, configuración opcional de URL, guardados ordenados y reintento visible. Los datos permanecen en la pestaña tras un fallo de guardado.
- **Sobreventa:** agregar y aumentar cantidades respeta el inventario. Antes de confirmar se vuelve a validar contra el stock actual, no el copiado al carrito. Los productos agotados no se pueden agregar desde el catálogo.
- **Pedido mínimo ignorado:** el subtotal debe alcanzar el mínimo configurado; la interfaz muestra el requisito.
- **Express sin dirección y nombres vacíos:** se exige dirección para Express y se rechazan nombres compuestos solo por espacios.
- **Importes inválidos:** se rechazan donaciones y gastos no positivos, productos con precio no positivo o stock fraccionario/negativo, eventos con total negativo y configuración con importes negativos o IVA fuera de 0–100.
- **Postre incompleto:** se exige base y sabor para avanzar y agregar al carrito.
- **Inicio desactualizado:** horario, dirección, SINPE y envío se obtienen de la configuración, en lugar de valores fijos.
- **Cambio de rol en rutas incompatibles:** el selector de la barra lateral vuelve al inicio del rol elegido.
- **Presentación:** añadidos estados de conexión y guardado, estilos de impresión, foco visible y barra lateral más compacta en pantallas pequeñas. El botón de favoritos del catálogo tiene nombre accesible.
- **Dependencias:** actualizadas las dependencias transitivas vulnerables `brace-expansion` y `source-map-js` con correcciones compatibles.

## Pendiente o limitado

- **Promociones:** se anuncian ofertas, pero el checkout no aplica descuentos. Faltan reglas de combinación, vigencia y prioridad; el contenido actual es demostrativo.
- **Recompensas:** el botón “Canjear” no tiene acción. Faltan reglas de canje y registro de recompensas utilizadas.
- **Sesión compartida:** favoritos, puntos y “Mis pedidos” representan la misma persona de demostración. JSON Server no implementa autenticación ni separa usuarios. El rol Admin es un selector de demostración.
- **Concurrencia:** el recurso `/state` se guarda completo para mantener juntos los cambios de pedido, inventario y puntos en esta simulación. La última escritura prevalece entre pestañas. No hay transacciones de negocio ni garantías multiusuario.
- **Finanzas:** los paneles suman pedidos incluidos IVA y envío y los presentan como ingresos o ganancia neta. No distinguen cobro confirmado, impuestos, costo del producto ni devoluciones. No deben interpretarse como contabilidad real.
- **Validaciones de formularios administrativos:** algunos datos inválidos se rechazan sin mensaje específico por campo. La validación puede mejorarse con errores accesibles junto a cada entrada.
- **Accesibilidad y móvil:** permanecen estrellas SVG clicables sin control de teclado, campos sin etiquetas asociadas y layouts con tamaños mínimos amplios. El ajuste de la barra lateral no constituye una verificación móvil completa.
- **Mantenimiento:** `App.jsx` sigue concentrando contexto, lógica y todas las vistas. Conviene dividirlo antes de ampliar funcionalidades.
- **Recursos:** fotografías y tipografía requieren conexión externa; hay recursos iniciales de Vite sin uso y el favicon sigue siendo el del template.
- **Estados vacíos:** si el catálogo queda vacío mediante edición directa del JSON, algunas vistas no tienen una experiencia vacía completa.

## Validación realizada

- Siete pruebas automatizadas pasan: reglas de compra, cantidades, mínimo, dirección, productos personalizados y lectura/escritura persistente de JSON Server usando una base temporal.
- `npm run lint` y `npm run build` pasan.
- `npm audit fix` terminó con cero vulnerabilidades detectadas.
- Desarrollo iniciado con Vite y JSON Server; la respuesta del proxy se comprueba por HTTP.
- No fue posible realizar inspección visual o interacciones en navegador: la herramienta disponible reportó que no hay navegadores conectados. Quedan por comprobar visualmente pantallas, impresión y dispositivos móviles.
