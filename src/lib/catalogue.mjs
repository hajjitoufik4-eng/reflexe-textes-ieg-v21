export const topics = [
  ['temps', 'Temps de travail', 'Astreinte, repos, horaires et congés'],
  ['argent', 'Rémunération et frais', 'Primes, repas et déplacements'],
  ['carriere', 'Carrière et formation', 'Classification, mobilité et parcours'],
  ['sante', 'Santé et sécurité', 'Maladie, accidents et handicap'],
  ['famille', 'Famille et aidants', 'Enfants, parentalité et absences'],
  ['retraite', 'Retraite', 'Pensions et départ en inactivité'],
  ['mandats', 'Mandats et représentation', 'CSE, CSP et droit syndical'],
  ['avantages', 'Avantages sociaux', 'Tarif agent et activités sociales'],
  ['regles', 'Règles et discipline', 'Statut et règles internes'],
  ['autres', 'Autres références', 'Documents restant à classer'],
];
export const levels = [
  ['all', 'Tous les textes GRDF'],
  ['national', 'National confirmé'],
  ['local', 'Régional / local'],
  ['unverified', 'Périmètre à vérifier'],
];
export const scopeOf = (d) => (d.scope === 'ieg' ? 'ieg' : 'grdf');
export const scopeName = (scope) => (scope === 'ieg' ? 'Branche IEG' : 'GRDF');
export const tag = (d) =>
  d.scope === 'ieg'
    ? 'Branche IEG'
    : d.level === 'local'
      ? 'GRDF · régional / local'
      : d.level === 'national'
        ? 'GRDF · national'
        : 'GRDF · périmètre à vérifier';
export const normalize = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export function filterDocuments(
  data,
  { scope, theme = '', query = '', level = 'all' },
) {
  const terms = normalize(query).match(/[a-z0-9]+/g) || [];
  return data
    .filter(
      (d) =>
        scopeOf(d) === scope &&
        (!theme || d.folder === theme) &&
        (scope === 'ieg' || level === 'all' || d.level === level) &&
        terms.every((t) =>
          normalize(
            [
              d.title,
              d.ref,
              d.theme,
              topics.find((x) => x[0] === d.folder)?.[1],
            ].join(' '),
          ).includes(t),
        ),
    )
    .sort(
      (a, b) => Number(Boolean(b.explanation)) - Number(Boolean(a.explanation)),
    );
}
export function catalogueUrl(
  scope,
  { theme = '', query = '', level = 'all', limit = 12 } = {},
) {
  const p = new URLSearchParams();
  if (theme) p.set('theme', theme);
  if (query) p.set('q', query);
  if (level !== 'all') p.set('level', level);
  if (limit > 12) p.set('limit', String(limit));
  return '/corpus/' + scope + (p.size ? '?' + p.toString() : '');
}
export function safeUrl(value) {
  if (typeof value !== 'string') return '';
  if (value.startsWith('/documents/') && !/[\\\r\n]/.test(value)) return value;
  try {
    const u = new URL(value);
    return ['https:', 'http:'].includes(u.protocol) ? u.href : '';
  } catch {
    return '';
  }
}
export const isLocalPdf = (url) =>
  url.startsWith('/documents/') && /\.pdf$/i.test(url);
