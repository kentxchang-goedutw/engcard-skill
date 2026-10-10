#!/usr/bin/env node
// build-pages.js — VOCAB JSON → 單檔練習 HTML。
// Usage: node build-pages.js <vocab.json> <outDir>
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const [vocabFile, outDir] = process.argv.slice(2);
if (!vocabFile || !outDir) { console.error('Usage: node build-pages.js <vocab.json> <outDir>'); process.exit(2); }

const skillDir = path.dirname(path.dirname(__filename)) === '.' ? __dirname : path.join(__dirname, '..');
const templateFile = path.join(__dirname, 'template.html');
const validator = path.join(__dirname, 'validate-vocab.js');

// 1. 先驗證
try {
  execSync('node "' + validator + '" "' + vocabFile + '"', { stdio: 'inherit' });
} catch (e) { console.error('build 中止：驗證未通過'); process.exit(1); }

// 2. 讀模板＋題庫
const tpl = fs.readFileSync(templateFile, 'utf8');
const vocabRaw = fs.readFileSync(vocabFile, 'utf8');
const vocab = JSON.parse(vocabRaw);

// 3. 檢查模板必要元素
const must = ['Made by 阿剛老師', 'https://kentxchang.blogspot.tw', 'target="_blank"', 'CC BY-NC-SA 4.0', '__VOCAB_JSON__'];
for (const s of must) {
  if (!tpl.includes(s)) { console.error('ERROR: 模板缺必要標記：' + s); process.exit(1); }
}

// 4. 注入（防 </script> 截斷）
const safe = vocabRaw.replace(/<\//g, '<\\/');
const html = tpl.replace('__VOCAB_JSON__', () => safe);

// 5. 輸出
const title = (vocab.meta && vocab.meta.title ? String(vocab.meta.title) : '英文練習').replace(/[\\/:*?"<>|]/g, '').trim() || '英文練習';
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, title + '-英文練習.html');
fs.writeFileSync(outFile, html, 'utf8');

// 6. 語法抽查
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (m) { try { new Function(m[1]); console.log('SYNTAX OK'); } catch (e) { console.error('ERROR: 產出 HTML script 語法錯誤：' + e.message); process.exit(1); } }

const nUnits = vocab.units.length;
const nWords = vocab.units.reduce((a, u) => a + u.words.length, 0);
console.log('BUILT: ' + outFile);
console.log('units=' + nUnits + ' words=' + nWords);
