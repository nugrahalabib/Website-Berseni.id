// Warna teks per-section yang diatur admin.
//
// Caranya: menimpa CSS VARIABLE di elemen section, bukan menempel warna satu
// per satu ke tiap <h2>/<p>. Seluruh CSS situs sudah memakai token ini
// (var(--color-text-dark) dsb), jadi satu override langsung mengubah judul dan
// paragraf di dalam section tersebut — termasuk elemen yang belum terpikirkan.
//
// Field kosong = tidak menimpa apa pun, warna tema bawaan tetap dipakai.
export function textVars(source, key) {
  if (!source || !key) return {};
  const title = source[`${key}_title`];
  const body = source[`${key}_body`];

  const vars = {};
  if (typeof title === 'string' && title.trim()) {
    vars['--color-text-dark'] = title.trim();
  }
  if (typeof body === 'string' && body.trim()) {
    const value = body.trim();
    vars['--color-text-muted'] = value;
    vars['--color-text-muted-on-cream'] = value;
    vars['--color-text-muted-on-dark'] = value;
  }
  return vars;
}
