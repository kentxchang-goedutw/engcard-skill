# 英文單字片語練功坊（engcard-skill）

上傳 PDF / 圖片，或直接貼上一堆英文單字、片語，AI 會先分析內容、按主題切出多組題庫（每組 15–25 字），經你確認後，輸出一份**題庫 txt 全覽**給你逐字檢查，沒問題再生成一個**單檔 HTML 練習頁**——含 📇單字卡、⌨️拼字練習、🧩字母重組、🎧聽音選單字四種模式，外加詞性與例句顯示。

Made by [阿剛老師](https://kentxchang.blogspot.tw) ｜ 授權：CC BY-NC-SA 4.0（僅供非商業教學使用）

## 目錄結構

```
engcard-skill/
├── README.md                          ← 本說明
└── 英文單字片語練功坊/
    ├── SKILL.md                       ← skill 主檔（AI 的工作流程）
    ├── assets/
    │   ├── template.html              ← 練習網頁模板
    │   ├── build-pages.js             ← 打包腳本：題庫 JSON → HTML
    │   ├── validate-vocab.js          ← 題庫驗證器
    │   └── export-txt.js              ← 題庫 txt 匯出腳本
    └── references/
        └── vocab-spec.md              ← 題庫 JSON 欄位規格
```

## 安裝：從 GitHub 下載

```bash
git clone https://github.com/kentxchang-goedutw/engcard-skill.git
```

或到 [repo 頁面](https://github.com/kentxchang-goedutw/engcard-skill) 按 `Code` → `Download ZIP`，解壓縮即可。

## 安裝：放到 opencode 讀得到的位置

任選一種（兩種可並存）。資料夾名稱必須和裡面的 `SKILL.md` 同層，保持 `英文單字片語練功坊/SKILL.md` 結構不要拆散。

### 方法 A｜全域使用（所有專案都可用，推薦）

把 `英文單字片語練功坊` 資料夾整個複製到：

```
Windows:  C:\Users\<你的帳號>\.agents\skills\英文單字片語練功坊\
macOS/Linux: ~/.agents/skills/英文單字片語練功坊/
```

等效位置（擇一即可）：`~/.config/opencode/skills/英文單字片語練功坊/`、`~/.claude/skills/英文單字片語練功坊/`。

放好後開新對話，AI 的可用 skill 清單就會出現它。

### 方法 B｜只給某個工作資料夾使用（教學、單次專案用）

把 `英文單字片語練功坊` 資料夾整個複製到該專案底下：

```
<工作資料夾>\.agents\skills\英文單字片語練功坊\
```

（等效：`<工作資料夾>\.opencode\skills\英文單字片語練功坊\`）

這樣只有在該資料夾開 opencode 才會載入，不污染全域。也可以不照規格放，直接把資料夾丟在工作資料夾內，用提示詞指給 AI 看（見下方範例）。

> 檢查：`SKILL.md` 檔名必須全大寫，且開頭要有 `name`、`description` frontmatter（本 skill 已內附，勿改檔名）。

## 使用方法：範例提示詞

基本形（分析上傳內容，AI 自動按主題分組）：

```
使用工作資料夾中的英文單字片語練功坊的skill，分析我上傳的內容
```

指定分組方式（**此段可省略，也可自行加條件**）：

```
使用工作資料夾中的英文單字片語練功坊的skill，分析我上傳的內容，按unit1-4分成四個題庫
```

其他條件範例：

```
…按「機場、餐廳、飯店」三個情境分成三個題庫
…每組20字，依課本出現順序切組
…這是國小六年級程度，例句要簡單一點
```

輸入方式三選一：① 直接貼單字（每行 `英文,中文`，如 `check in,報到`，缺中文 AI 會補）② 上傳 PDF ③ 上傳圖片／掃描檔（讀不到字時 AI 會先問你）。

## 完整流程（AI 會帶你走）

1. **分組提案**：AI 列出分組表（組名、字數、主題、例字），你確認或要求調整（改名、合併、拆分、增刪）。
2. **題庫 txt**：AI 輸出一份 `<標題>-題庫.txt`，列出**所有組、所有單字片語**（英文＋詞性＋中文＋中英例句），你逐字檢查，有錯直接說（如「第2組第5字中文改為…」），確認無誤回 `OK，做HTML`。
3. **生成 HTML**：AI 產出 `<標題>-英文練習.html`（單檔，雙擊即開，免網路後端，發音用瀏覽器語音，建議 Chrome / Edge 開啟）。
4. 練法：開啟即主畫面 → 點題庫 → 選模式 → 看上方 `WORD x OF y` 練習 → 答對看例句 → 練習次數自動保存。

## 需求與疑難排解

- 產生過程需要 **Node.js**（跑驗證與打包腳本）；學生開啟 HTML 練習則不需要任何安裝。
- skill 沒出現在清單：確認路徑是 `…/skills/英文單字片語練功坊/SKILL.md`、檔名全大寫、已開新對話。
- 想改單字內容：不用改 HTML，直接在對話中說要改哪裡，AI 會重出 txt → 重建 HTML。
