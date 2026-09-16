import { cp, mkdir } from 'node:fs/promises';
await mkdir('public', { recursive: true });
await cp('documents', 'public/documents', { recursive: true });
console.log('Documents copiés dans public/documents ; originaux conservés.');
