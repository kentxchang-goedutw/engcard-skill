#!/usr/bin/env node
// validate-vocab.js — VOCAB 題庫驗證器，零 ERROR 才能打包。
const fs = require('fs');
const path = require('path');

const POS_ALLOW = new Set(['n.', 'v.', 'a.', 'ad.', 'prep.', 'conj.', 'phr.', 'sent.']);
const file = process.argv[2];
if (!file) { console.error('Usage: node validate-vocab.js <vocab.json>'); process.exit(2); }

let errors = [], warns = [];
function E(msg) { errors.push(msg); }
function W(msg) { warns.push(msg); }

let raw;
try { raw = fs.readFileSync(file, 'utf8'); } catch (e) { console.error('ERROR: 讀檔失敗 ' + e.message); process.exit(2); }
let v;
try { v = JSON.parse(raw); } catch (e) { console.error('ERROR: JSON 解析失敗 ' + e.message); process.exit(2); }

if (!v.meta || !v.meta.title) E('meta.title 缺失');
if (!Array.isArray(v.units) || v.units.length === 0) E('units 為空，至少 1 組');
else {
  if (v.units.length > 6) E('units 共 ' + v.units.length + ' 組，超過上限 6 組');
  const seenIds = new Set();
  const seenEn = new Map(); // norm en -> unit name
  v.units.forEach((u, i) => {
    const tag = 'units[' + i + ']';
    if (!u.id) E(tag + '.id 缺失');
    else if (seenIds.has(u.id)) E(tag + '.id 重複：' + u.id);
    else seenIds.add(u.id);
    if (!u.name) E(tag + '.name 缺失');
    if (!u.goal) W(tag + '.goal 缺失（建議補學習目標）');
    if (!Array.isArray(u.words) || u.words.length === 0) { E(tag + '.words 為空'); return; }
    if (u.words.length < 10) E(tag + '「' + (u.name || u.id) + '」僅 ' + u.words.length + ' 字，少於下限 10');
    if (u.words.length > 30) E(tag + '「' + (u.name || u.id) + '」共 ' + u.words.length + ' 字，超過上限 30（原則 15–25）');
    u.words.forEach((w, j) => {
      const wtag = tag + '.words[' + j + ']';
      if (!w.en || !String(w.en).trim()) { E(wtag + '.en 缺失'); return; }
      if (!w.zh || !String(w.zh).trim()) { E(wtag + '.zh 缺失（' + w.en + '）'); return; }
      const en = String(w.en).trim();
      const normEn = en.toLowerCase();
      if (seenEn.has(normEn)) E(wtag + '.en 重複：' + en + '（已在「' + seenEn.get(normEn) + '」出現）');
      else seenEn.set(normEn, u.name || u.id);
      if (!POS_ALLOW.has(w.pos)) E(wtag + '.pos 非法：' + w.pos + '（允許 ' + [...POS_ALLOW].join(' ') + '）');
      if (!w.example_en || !String(w.example_en).trim()) E(wtag + '.example_en 缺失');
      if (!w.example_zh || !String(w.example_zh).trim()) E(wtag + '.example_zh 缺失');
      // WARN: 例句是否含核心詞
      if (w.example_en) {
        const tokens = en.toLowerCase().split(/[^a-z]+/).filter(t => t.length >= 3);
        const core = tokens[0];
        if (core && !String(w.example_en).toLowerCase().includes(core)) {
          W(wtag + ' 例句未含核心詞「' + core + '」：' + w.example_en);
        }
      }
      // WARN: 中英顛倒
      if (/[\u4e00-\u9fff]/.test(en)) W(wtag + '.en 含中文字符，疑似中英顛倒：' + en);
      if (/^[A-Za-z\s'’.,!?-]+$/.test(String(w.zh).trim()) && String(w.zh).trim().length > 0) {
        W(wtag + '.zh 全為英文，疑似顛倒：' + w.zh);
      }
    });
    // WARN: 同組 zh 重複
    const zhCount = {};
    u.words.forEach(w => { const z = String(w.zh || '').trim(); if (z) zhCount[z] = (zhCount[z] || 0) + 1; });
    Object.entries(zhCount).filter(([, c]) => c > 1).forEach(([z, c]) => W(tag + ' 中文「' + z + '」重複 ' + c + ' 次，請確認是否刻意'));
  });
}

warns.forEach(m => console.log('WARN: ' + m));
errors.forEach(m => console.log('ERROR: ' + m));
console.log('—');
console.log('units=' + (v.units ? v.units.length : 0) +
  ' words=' + (v.units ? v.units.reduce((a, u) => a + (u.words ? u.words.length : 0), 0) : 0) +
  ' ERROR=' + errors.length + ' WARN=' + warns.length);
if (errors.length) { console.log('VALIDATE FAILED'); process.exit(1); }
else { console.log('VALIDATE OK'); }
