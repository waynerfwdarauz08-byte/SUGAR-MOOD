import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import jsonServer from 'json-server';

test('JSON Server lee y persiste todos los recursos de la simulación', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'sugar-mood-test-'));
  const file = join(directory, 'db.json');
  copyFileSync(new URL('../mock/db.seed.json', import.meta.url), file);
  const server = jsonServer.create();
  server.use(jsonServer.bodyParser);
  server.use(jsonServer.router(file));
  const listener = server.listen(0, '127.0.0.1');
  await new Promise(resolve => listener.once('listening', resolve));
  const url = `http://127.0.0.1:${listener.address().port}/state`;
  try {
    const initial = await (await fetch(url)).json();
    assert.equal(initial.productos.length, 22);
    const updated = {
      ...initial,
      cart: [{ ...initial.productos[0], qty: 2 }],
      orders: [{ id: 'SM-TEST', estado: 'Pendiente', total: 2100 }],
      favs: [1], ratings: { 1: 5 }, comments: { 1: [{ text: 'Prueba' }] },
      mensajes: [{ id: 1, texto: 'Prueba' }], reportes: [{ id: 1, estado: 'Pendiente' }],
      donaciones: [{ id: 1, monto: 500 }], clientes: [{ id: 1, nombre: 'Prueba' }],
      puntos: 21, nivel: 'Bronce', configNegocio: { ...initial.configNegocio, envio: 700 },
    };
    const response = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    assert.equal(response.status, 200);
    assert.deepEqual(await (await fetch(url)).json(), updated);
    assert.deepEqual(JSON.parse(readFileSync(file, 'utf8')).state, updated);
    const patch = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ puntos: 50 }) });
    assert.equal(patch.status, 200);
    assert.equal((await (await fetch(url)).json()).puntos, 50);
  } finally {
    await new Promise(resolve => listener.close(resolve));
    rmSync(directory, { recursive: true, force: true });
  }
});
