# VOCAB 題庫規格

`build-pages.js` 只接受符合本規格且通過 `validate-vocab.js` 的 JSON。

## 頂層結構

```json
{
  "meta": { "title": "Unit 3 旅遊英文", "subtitle": "七年級適用" },
  "units": [ { "id": "u1", "name": "...", "goal": "...", "words": [...] } ]
}
```

- `meta.title`（必填）：網頁主標題，建議含單元名。檔名取自此欄。
- `meta.subtitle`（選填）：副標，如學段、版本。
- `units`（必填）：1–6 組，每組 15–25 字為原則（驗證器允許 10–30，超出報 ERROR）。

## unit 欄位

| 欄位 | 必填 | 說明 |
|------|------|------|
| `id` | 是 | `u1、u2…`，全域唯一 |
| `name` | 是 | 組名，如「機場報到」，10 字內 |
| `goal` | 是 | 學習目標一句話，如「能說出報到與登機相關片語」 |
| `words` | 是 | 字表陣列 |

## word 欄位

| 欄位 | 必填 | 說明與範例 |
|------|------|-----------|
| `en` | 是 | 英文單字或片語，原形。如 `check in`、`boarding pass`。不可空、不可重複（含大小寫歸一後） |
| `zh` | 是 | 中文解釋，2–12 字。如 `報到`、`登機證` |
| `pos` | 是 | 詞性，限 `n./v./a./ad./prep./conj./phr./sent.`。單字用對應詞性，片語一律 `phr.`，整句 `sent.` |
| `example_en` | 是 | 例句英文，須包含該字核心詞（大小寫不計）。片語取主要單字命中即可，如 `check in` 命中 `check` 或 `checked` 視為通過但記 WARN，完整含 `check in` 最佳 |
| `example_zh` | 是 | 例句中文翻譯 |

範例：

```json
{"en": "check in", "zh": "報到", "pos": "phr.",
 "example_en": "We checked in two hours early.",
 "example_zh": "我們提早兩小時報到。"}
```

## 驗證規則（validate-vocab.js）

ERROR（必修）：
- 缺 `meta.title`、`units` 空、`unit` 缺欄、`word` 缺欄。
- `units` 超過 6 組；任一組少於 10 字或多於 30 字。
- `en` 空值或歸一化（trim＋小寫）後重複。
- `pos` 不在允許集合。
- `example_en` 空值、`example_zh` 空值。

WARN（人工確認）：
- `example_en` 未含核心詞（取 `en` 第一個長度 ≥3 的字母 token 比對）。
- 疑似中英顛倒（`en` 含中文字符或 `zh` 全為英文）。
- 同一組內 `zh` 重複（可能同義，需確認是否刻意）。

## 注入方式

模板 `assets/template.html` 含佔位：

```html
<script id="vocab-data" type="application/json">__VOCAB_JSON__</script>
```

`build-pages.js` 將 JSON（單行化前先驗證）替換 `__VOCAB_JSON__`，並檢查模板含 `Made by 阿剛老師`、`https://kentxchang.blogspot.tw`、`target="_blank"`、`CC BY-NC-SA 4.0`，缺一即失敗。
