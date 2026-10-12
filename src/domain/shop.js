export function stockLimit(item, products) {
  return item.cat === 'Personalizado' ? 99 : (products.find(p => p.id === item.id)?.stock ?? 0);
}

export function validateOrder(cart, products, config, order) {
  if (!order.clientName?.trim()) return 'Escribe tu nombre.';
  if (!cart.length) return 'Agrega productos al carrito.';
  if (order.entrega === 'Express' && !order.direccion?.trim()) return 'Escribe la dirección de entrega.';
  if (cart.some(item => !Number.isInteger(item.qty) || item.qty < 1 || item.qty > stockLimit(item, products))) return 'Hay productos sin stock suficiente. Revisa el carrito.';
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (subtotal < config.pedidoMinimo) return `El pedido mínimo es ₡${config.pedidoMinimo.toLocaleString()}.`;
  return '';
}
