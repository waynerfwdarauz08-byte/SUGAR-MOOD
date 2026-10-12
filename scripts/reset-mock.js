import { copyFileSync } from 'node:fs';

copyFileSync(new URL('../mock/db.seed.json', import.meta.url), new URL('../mock/db.json', import.meta.url));
console.log('Simulación restablecida.');
