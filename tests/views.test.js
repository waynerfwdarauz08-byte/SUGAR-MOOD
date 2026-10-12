import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

test('las vistas de cliente y administración renderizan con datos de demostración', async () => {
  // Expose internal components only in this isolated verification build.
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    plugins: [{
      name: 'view-verification',
      enforce: 'pre',
      transform(code, id) {
        if (id.replaceAll('\\', '/').endsWith('/src/App.jsx')) {
          return code + '\nexport { MainContent, SugarContext };';
        }
      },
    }],
  });
  try {
    const { MainContent, SugarContext } = await vite.ssrLoadModule('/src/App.jsx');
    const seed = JSON.parse(readFileSync(new URL('../mock/db.seed.json', import.meta.url), 'utf8')).state;
    const roles = {
      cliente: ['/', '/catalogo', '/catalogo?categoria=Frescas', '/promos', '/arma-postre', '/pedido', '/mis-pedidos', '/favoritos', '/puntos', '/resenas', '/donar', '/contacto'],
      admin: ['/', '/reportes-admin', '/inventario', '/finanzas', '/pedidos-admin', '/clientes', '/donaciones-admin', '/eventos', '/directorio', '/buzon', '/config'],
    };
    for (const populated of [false, true]) {
      const data = structuredClone(seed);
      if (populated) {
        data.cart = [{ ...data.productos[0], qty: 3 }];
        data.favs = [data.productos[0].id];
        data.orders = [{ id: 'SM-PREVIEW', items: data.cart, total: 2373, clientName: 'Prueba', estado: 'Pendiente', tracking: ['Pedido recibido'] }];
        data.comments = { [data.productos[0].id]: [{ user: 'Prueba', text: 'Un comentario', date: '12/10/2026' }] };
        data.puntos = 500;
      }
      for (const [role, routes] of Object.entries(roles)) {
        for (const route of routes) {
          const html = renderToString(React.createElement(SugarContext.Provider, { value: { ...data, role } },
            React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(MainContent, { menuOpen: false, onMenuToggle() {} }))));
          assert.match(html, /id="main-content"/, `${role} ${route}`);
          if (route.startsWith('/catalogo')) assert.match(html, /Buscar sabores/);
          if (route === '/' && role === 'cliente') assert.match(html, /La felicidad/);
        }
      }
    }
  } finally {
    await vite.close();
  }
});
