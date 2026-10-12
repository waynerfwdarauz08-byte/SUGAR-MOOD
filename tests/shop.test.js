import test from 'node:test';
import assert from 'node:assert/strict';
import { stockLimit, validateOrder } from '../src/domain/shop.js';

const products = [{ id: 1, price: 700, stock: 3 }];
const config = { pedidoMinimo: 1500 };
const order = { clientName: 'Prueba', entrega: 'Retiro en Local' };
const cart = [{ ...products[0], qty: 3 }];

test('pedido válido con stock y mínimo suficientes', () => {
  assert.equal(validateOrder(cart, products, config, order), '');
});
test('rechaza sobreventa y cantidades fraccionarias', () => {
  for (const qty of [4, 0, -1, 1.5]) {
    assert.match(validateOrder([{ ...cart[0], qty }], products, config, order), /stock/);
  }
});
test('el inventario actual prevalece sobre el stock copiado al carrito', () => {
  assert.match(validateOrder(cart, [{ ...products[0], stock: 1 }], config, order), /stock/);
  assert.equal(stockLimit(cart[0], []), 0);
});
test('requiere nombre, carrito y dirección para Express', () => {
  assert.match(validateOrder(cart, products, config, { ...order, clientName: ' ' }), /nombre/);
  assert.match(validateOrder([], products, config, order), /Agrega/);
  assert.match(validateOrder(cart, products, config, { ...order, entrega: 'Express', direccion: ' ' }), /dirección/);
});
test('aplica el mínimo al subtotal y acepta el límite exacto', () => {
  assert.match(validateOrder([{ ...cart[0], qty: 2 }], products, config, order), /mínimo/);
  assert.equal(validateOrder(cart, products, { pedidoMinimo: 2100 }, order), '');
});
test('permite postres personalizados sin descontar productos del catálogo', () => {
  assert.equal(validateOrder([{ id: 50, cat: 'Personalizado', price: 1600, qty: 1 }], products, config, order), '');
});
