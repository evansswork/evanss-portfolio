// Pemeriksa isi website. Jalankan:  npm run check
// Mengecek: gambar & file yang dirujuk tapi tidak ada, tautan bukti (proof) yang rusak, ID/slug dobel,
// format tanggal timeline, dan menghitung TODO yang tersisa. Keluar dengan kode 1 kalau ada ERROR.
// (Dijalankan otomatis sebelum "npm run build" dalam mode --soft: hanya melapor, tidak menggagalkan build.)
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const soft = process.argv.includes('--soft');
const c = { red: (s) => `\x1b[31m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m` };
const load = (f) => import(`../content/${f}`);
const [{ profile }, { experienceGroups }, { projects, itProjects }, { skills }, { education }, { certificates }, { settings }, { achievements }, { playbook }] =
  await Promise.all(['profile.js', 'experience.js', 'projects.js', 'skills.js', 'education.js', 'certificates.js', 'settings.js', 'achievements.js', 'playbook.js'].map(load));

const errors = [], warnings = [], todos = [];
const exists = (p) => existsSync(resolve(root, 'public' + p));
const asset = (p, where, { required = false } = {}) => {
  if (!p) return;
  if (!exists(p)) (required ? errors : warnings).push(`${where}: file tidak ada → public${p}`);
};

// ---------- gambar & file
asset(profile.photo, 'profile.photo');
asset(profile.avatar, 'profile.avatar');
asset(profile.cv, 'profile.cv (CV PDF — tanpa file ini tombol hero menjadi "View CV")');
const roles = experienceGroups.flatMap((g) => g.items.map((x) => ({ ...x, group: g.id })));
const missingLogos = roles.filter((x) => x.logo && !exists(x.logo)).map((x) => x.company);
roles.forEach((x) => asset(x.photo, `experience "${x.company}" photo`));
const allProjects = [...projects, ...itProjects];
allProjects.forEach((p) => {
  asset(p.cover, `project "${p.slug}" cover`);
  (p.caseStudy?.gallery || []).filter((g) => !exists(g.src)).forEach((g) => todos.push(`${p.slug}: screenshot belum ada → public${g.src}`));
});
education.forEach((e) => { asset(e.logo, `education "${e.school}" logo`); [e.noteFile, e.file].filter((f) => f && !exists(f)).forEach((f) => todos.push(`PDF belum ada → public${f}`)); });
certificates.filter((x) => x.file && !exists(x.file)).forEach((x) => todos.push(`PDF sertifikat belum ada → public${x.file}`));

// ---------- ID & slug unik
const dup = (list, label) => {
  const seen = new Set();
  list.forEach((v) => { if (!v) return; if (seen.has(v)) errors.push(`${label} dobel: "${v}"`); seen.add(v); });
};
dup(roles.map((x) => x.id), 'experience id');
dup(allProjects.map((p) => p.slug), 'project slug');
roles.filter((x) => !x.id).forEach((x) => warnings.push(`experience "${x.company}" belum punya id (tidak bisa ditautkan sebagai bukti)`));

// ---------- tanggal timeline
const ym = /^\d{4}-(0[1-9]|1[0-2])$/;
roles.forEach((x) => {
  if (!x.start) return warnings.push(`experience "${x.company}" tanpa start → tidak tampil di timeline`);
  if (!ym.test(x.start)) errors.push(`experience "${x.company}" start "${x.start}" harus 'YYYY-MM'`);
  if (x.end && !ym.test(x.end)) errors.push(`experience "${x.company}" end "${x.end}" harus 'YYYY-MM' atau null`);
  if (x.end && x.start > x.end) errors.push(`experience "${x.company}" start setelah end`);
});

// ---------- tautan bukti (proof)
const caseSlugs = new Set(allProjects.filter((p) => p.caseStudy).map((p) => p.slug));
const roleIds = new Set(roles.map((x) => x.id).filter(Boolean));
const checkProof = (ref, where) => {
  const [kind, key] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':') + 1)];
  if (kind === 'case' && !caseSlugs.has(key)) errors.push(`${where}: proof "${ref}" — tidak ada case study dengan slug "${key}"`);
  else if (kind === 'xp' && !roleIds.has(key)) errors.push(`${where}: proof "${ref}" — tidak ada experience dengan id "${key}"`);
  else if (kind === 'file' && !exists(key)) todos.push(`${where}: PDF bukti belum ada → public${key}`);
  else if (!['case', 'xp', 'go', 'file', 'url'].includes(kind)) errors.push(`${where}: proof "${ref}" — awali dengan case:, xp:, file:, url:, atau go:`);
};
(profile.stats || []).forEach((s) => s.proof && checkProof(s.proof, `stats "${s.label}"`));
(skills.stickers || []).forEach((s) => typeof s === 'object' && (s.proof || []).forEach((r) => checkProof(r, `skill "${s.label}"`)));
(achievements || []).forEach((a) => { if (a.proof) checkProof(a.proof, `achievement "${a.badge}"`); if (a.todo) todos.push(`achievement "${a.title}" masih todo: true (hapus setelah resmi)`); });
(playbook?.steps || []).forEach((st) => st.proof && checkProof(st.proof, `playbook "${st.title}"`));

// ---------- TODO yang tersisa
allProjects.forEach((p) => {
  const cs = p.caseStudy || {};
  if (cs.todo) todos.push(`${p.slug}: ${cs.todo}`);
  (cs.contributions || []).filter((t) => /^TODO:/i.test(t)).forEach((t) => todos.push(`${p.slug}: ${t}`));
  (cs.results || []).filter((r) => r.todo).forEach((r) => todos.push(`${p.slug}: hasil "${r.label}"`));
  (cs.links || []).filter((l) => !l.href).forEach((l) => todos.push(`${p.slug}: link "${l.label}" masih kosong`));
  if (p.placeholder) todos.push(`${p.slug}: hapus placeholder: true setelah detailnya lengkap`);
});
if (settings.openingPicker) warnings.push('settings.openingPicker = true → set false sebelum link dibagikan ke recruiter');
if (settings.showTodos) warnings.push('settings.showTodos = true → pengunjung akan melihat penanda TODO');

// ---------- laporan
console.log(c.bold('\nPemeriksaan konten portofolio'));
if (errors.length) { console.log(c.red(`\n✖ ${errors.length} error (harus diperbaiki):`)); errors.forEach((e) => console.log(c.red(`  • ${e}`))); }
if (warnings.length) { console.log(c.yellow(`\n! ${warnings.length} peringatan:`)); warnings.forEach((w) => console.log(c.yellow(`  • ${w}`))); }
if (todos.length) { console.log(c.dim(`\n○ ${todos.length} TODO tersisa (tersembunyi untuk pengunjung):`)); todos.forEach((t) => console.log(c.dim(`  • ${t}`))); }
if (missingLogos.length) console.log(c.dim(`\ni ${missingLogos.length} logo belum ada (tampil sebagai inisial): ${missingLogos.join(', ')}`));
if (!errors.length) console.log(c.green(`\n✔ Tidak ada error. ${roles.length} role, ${allProjects.length} proyek, ${caseSlugs.size} case study.`));
console.log('');
process.exit(errors.length && !soft ? 1 : 0);
