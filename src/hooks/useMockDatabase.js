import { useEffect, useRef, useState } from 'react';

const endpoint = `${import.meta.env.VITE_API_URL || '/api'}/state`;

async function request(options = {}) {
  const response = await fetch(endpoint, { ...options, signal: options.signal || AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`JSON Server respondió ${response.status}.`);
  return response.json();
}

export function useMockDatabase() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const current = useRef(null);
  const saved = useRef(null);
  const queue = useRef(Promise.resolve());

  const load = async (signal) => {
    try {
      const result = await request({ signal });
      if (!Array.isArray(result.productos) || !Array.isArray(result.cart) || !Array.isArray(result.orders) || !result.configNegocio) throw new Error('Datos de simulación inválidos.');
      current.current = result;
      saved.current = result;
      setData(result);
      setError('');
    } catch (reason) {
      if (reason.name !== 'AbortError') setError('No se pudo cargar la simulación. Ejecuta npm run mock y reintenta.');
    }
  };

  const save = (snapshot) => {
    setSaving(true);
    queue.current = queue.current.catch(() => {}).then(async () => {
      try {
        await request({ method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snapshot) });
        saved.current = snapshot;
        if (snapshot === current.current) { setSaving(false); setError(''); }
      } catch {
        setSaving(false);
        setError('No se pudieron guardar los cambios. Conservamos los datos en esta pestaña; reintenta antes de recargar.');
      }
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => { if (!controller.signal.aborted) load(controller.signal); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!data || data === saved.current) return;
    const timer = setTimeout(() => save(data), 150);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    const guard = event => {
      if (current.current !== saved.current) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, []);

  return {
    data, error, saving,
    retry: () => current.current ? save(current.current) : load(),
    field: key => [data?.[key], update => {
      const previous = current.current;
      const value = typeof update === 'function' ? update(previous[key]) : update;
      if (value === previous[key]) return;
      setSaving(true);
      current.current = { ...previous, [key]: value };
      setData(current.current);
    }],
  };
}
