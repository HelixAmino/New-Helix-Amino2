import fs from 'node:fs';
const src = fs.readFileSync('src/data/membersProducts.ts', 'utf8');
const startIdx = src.indexOf('export const MEMBERS_PRODUCTS: Product[] = [');
const arrStart = src.indexOf('= [', startIdx) + 2;
let depth = 0;
let end = -1;
for (let i = arrStart; i < src.length; i++) {
  const c = src[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const arrBody = src.slice(arrStart + 1, end);
const clean = arrBody.replace(/\/\/[^\n]*\n/g, '\n');

const products = [];
let d = 0, s = -1;
for (let i = 0; i < clean.length; i++) {
  const c = clean[i];
  if (c === '{') { if (d === 0) s = i; d++; }
  else if (c === '}') { d--; if (d === 0) { products.push(clean.slice(s, i+1)); } }
}
console.error('count:', products.length);

const imgMap = {};
const imgRe = /import\s+(img\w+)\s+from\s+'([^']+)'/g;
let m;
while ((m = imgRe.exec(src))) imgMap[m[1]] = m[2];

const groupMapSrc = src.slice(src.indexOf('export const MEMBERS_GROUPS'));
const groups = [];
const groupRe = /buildGroup\('([^']+)',\s*\[([\s\S]*?)\]\)/g;
while ((m = groupRe.exec(groupMapSrc))) {
  const baseName = m[1];
  const ids = m[2].split(',').map(x => x.trim().replace(/^'|'$/g, '')).filter(Boolean);
  groups.push({ baseName, ids });
}
const idToGroup = {};
groups.forEach((g, gi) => g.ids.forEach((id, vi) => idToGroup[id] = { groupId: g.ids[0], groupName: g.baseName, groupOrder: gi, variantOrder: vi }));

function parseObj(str) {
  const replaced = str.replace(/image:\s*(img\w+)/g, (_, v) => {
    const p = imgMap[v] || '';
    const rel = p.replace(/^\.\.\//, '');
    const filename = rel.split('/').pop();
    return `image: ${JSON.stringify(filename)}`;
  });
  try {
    return new Function(`return (${replaced});`)();
  } catch (e) {
    console.error('parse fail', e.message);
    return null;
  }
}

const rows = [];
for (const p of products) {
  const obj = parseObj(p);
  if (!obj) continue;
  const g = idToGroup[obj.id] || { groupId: obj.id, groupName: obj.name, groupOrder: 999, variantOrder: 0 };
  // Store image as the imported asset name key so the client can re-map
  rows.push({ id: obj.id, data: obj, group_id: g.groupId, group_name: g.groupName, group_order: g.groupOrder, variant_order: g.variantOrder });
}

function sqlStr(s) { return "'" + String(s).replace(/'/g, "''") + "'"; }
let out = '';
for (const r of rows) {
  const dataJson = JSON.stringify(r.data);
  out += `INSERT INTO members_products (id, data, group_id, group_name, group_order, variant_order) VALUES (${sqlStr(r.id)}, ${sqlStr(dataJson)}::jsonb, ${sqlStr(r.group_id)}, ${sqlStr(r.group_name)}, ${r.group_order}, ${r.variant_order}) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, group_id = EXCLUDED.group_id, group_name = EXCLUDED.group_name, group_order = EXCLUDED.group_order, variant_order = EXCLUDED.variant_order, updated_at = now();\n`;
}
fs.writeFileSync('scripts/members_seed.sql', out);
console.error('wrote', rows.length, 'rows');
