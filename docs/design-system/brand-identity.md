# projectname Brand Identity & Visual System

## 🌍 Brand Identity & World View

### Brand Concept
**projectname（積み上げ）** - 20-30代男性向けの男磨き支援アプリ

- **ターゲット**: 成長志向の若手男性（20-30代）
- **価値提案**: 継続的な自己改善による「彼女GET」
- **体験**: ゲーミフィケーション × ソーシャル × 習慣化

### Design Philosophy
- **🎯 Achievement-Oriented**: 達成感・進歩感を視覚的に強調
- **🤖 Tech-Savvy**: デジタルネイティブに響くガジェット感
- **⚡ Dynamic**: エネルギッシュで前向きな印象
- **🎮 Gamified**: RPG・レベルアップ要素の視覚表現

---

## 🎨 Color System

### Primary Palette
```css
/* ===== Primary Colors ===== */
--primary-cyber-blue: #00D9FF;     /* メインブランドカラー */
--primary-electric: #00F0FF;       /* アクセント・ハイライト */
--primary-deep: #0099CC;           /* 濃いアクセント */

/* ===== Secondary Colors ===== */
--secondary-neon-green: #39FF14;   /* 成功・達成 */
--secondary-orange: #FF6B35;       /* 警告・注意喚起 */
--secondary-purple: #8A2BE2;       /* プレミアム・特別 */
```

### Neutral Palette
```css
/* ===== Background Colors ===== */
--bg-dark: #0A0A0A;               /* メイン背景 */
--bg-card: #1A1A1A;               /* カード・パネル背景 */
--bg-section: #2A2A2A;            /* セクション背景 */
--bg-hover: #3A3A3A;              /* ホバー状態 */

/* ===== Text Colors ===== */
--text-primary: #FFFFFF;          /* メインテキスト */
--text-secondary: #CCCCCC;        /* サブテキスト */
--text-muted: #888888;            /* 補助テキスト */
--text-disabled: #555555;         /* 無効状態 */
```

### Semantic Colors
```css
/* ===== Status Colors ===== */
--success: #39FF14;               /* 成功・完了 */
--warning: #FFD700;               /* 警告・注意 */
--error: #FF4444;                 /* エラー・失敗 */
--info: #00D9FF;                  /* 情報・通知 */

/* ===== Achievement Colors ===== */
--level-bronze: #CD7F32;          /* 初心者レベル */
--level-silver: #C0C0C0;          /* 中級レベル */
--level-gold: #FFD700;            /* 上級レベル */
--level-platinum: #E5E4E2;        /* エキスパートレベル */
```

### Standard UI Colors (Fallback)
```css
/* ===== Standard Colors for General UI ===== */
--ui-primary-50:  #eff6ff;       /* 最も薄い背景 */
--ui-primary-100: #dbeafe;       /* 薄い背景 */
--ui-primary-200: #bfdbfe;       /* ホバー背景 */
--ui-primary-500: #3b82f6;       /* 標準プライマリ */
--ui-primary-600: #2563eb;       /* ホバー時 */
--ui-primary-700: #1d4ed8;       /* アクティブ時 */

/* ===== Gray Scale for Standard UI ===== */
--ui-gray-50:   #f9fafb;         /* 背景 */
--ui-gray-100:  #f3f4f6;         /* 薄い背景 */
--ui-gray-200:  #e5e7eb;         /* ボーダー */
--ui-gray-300:  #d1d5db;         /* 無効状態 */
--ui-gray-500:  #6b7280;         /* 副次テキスト */
--ui-gray-600:  #4b5563;         /* 本文 */
--ui-gray-900:  #111827;         /* 見出し */
```

### Color Usage Guidelines
```css
/* ===== MVP: Dark Mode Only ===== */
/* Light Mode: Out of Scope for this project */
```

---

## 📝 Typography System

### Font Families
```css
/* ===== Primary Fonts ===== */
--font-primary: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
--font-heading: 'Space Grotesk', 'Inter', sans-serif;
--font-code: 'JetBrains Mono', 'Consolas', monospace;
--font-ja: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;
```

### Font Scale
```css
/* ===== Font Sizes ===== */
--text-xs: 0.75rem;    /* 12px - 補助情報 */
--text-sm: 0.875rem;   /* 14px - キャプション */
--text-base: 1rem;     /* 16px - 基本テキスト */
--text-lg: 1.125rem;   /* 18px - 強調テキスト */
--text-xl: 1.25rem;    /* 20px - サブタイトル */
--text-2xl: 1.5rem;    /* 24px - セクションタイトル */
--text-3xl: 1.875rem;  /* 30px - ページタイトル */
--text-4xl: 2.25rem;   /* 36px - ヒーローライトル */
```

### Font Weights & Line Heights
```css
/* ===== Font Weights ===== */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* ===== Line Heights ===== */
--leading-tight: 1.25;    /* タイトル・見出し */
--leading-normal: 1.5;    /* 基本テキスト */
--leading-relaxed: 1.75;  /* 長文・説明文 */
```

### Typography Hierarchy Examples
```html
<!-- Typography usage examples -->
<h1 class="text-4xl font-bold text-primary leading-tight">Main Title</h1>
<h2 class="text-3xl font-semibold text-primary leading-tight">Section Title</h2>
<h3 class="text-2xl font-semibold text-primary leading-normal">Subsection</h3>
<p class="text-base text-secondary leading-normal">Body text content</p>
<small class="text-sm text-muted leading-normal">Caption or metadata</small>
<code class="font-code text-sm bg-section p-2 rounded">Code snippet</code>
```

---

## 🎪 Cyberpunk/Gadget Visual Elements

### Glow Effects
```css
/* ===== Neon Glow Variations ===== */
.glow-primary {
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

.glow-success {
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
}

.glow-warning {
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.glow-error {
  box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
}
```

### Hologram Effects
```css
/* ===== Holographic Border ===== */
.holo-border {
  position: relative;
  border: 2px solid transparent;
  background: linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
              linear-gradient(45deg, 
                var(--primary-cyber-blue), 
                var(--secondary-neon-green), 
                var(--secondary-purple)
              ) border-box;
}

/* ===== Scanline Effect ===== */
.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 217, 255, 0.1) 2px,
    rgba(0, 217, 255, 0.1) 4px
  );
  pointer-events: none;
}
```

### Achievement & Gamification Elements
```css
/* ===== Achievement Badge ===== */
.achievement-badge {
  background: radial-gradient(circle,
    rgba(0, 217, 255, 0.2),
    rgba(0, 217, 255, 0.05)
  );
  border: 2px solid var(--primary-cyber-blue);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: pulse-glow 3s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
  }
}

/* ===== Progress Ring ===== */
.progress-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    var(--primary-cyber-blue) 0deg,
    var(--primary-electric) calc(var(--progress) * 3.6deg),
    var(--bg-section) calc(var(--progress) * 3.6deg)
  );
  padding: 4px;
}

.progress-ring::before {
  content: '';
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--bg-card);
}
```

---

## 🧱 UI Components

### Button System
```css
/* ===== Primary Button ===== */
.btn-primary {
  background: var(--primary-cyber-blue);
  color: var(--text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-semibold);
  transition: all 0.3s var(--ease-out-cubic);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
}

.btn-primary:hover {
  background: var(--primary-electric);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
}

/* ===== Secondary Button ===== */
.btn-secondary {
  background: transparent;
  color: var(--primary-cyber-blue);
  border: 2px solid var(--primary-cyber-blue);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.3s var(--ease-out-cubic);
}

.btn-secondary:hover {
  background: rgba(0, 217, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
}
```

### Card System
```css
/* ===== Cyberpunk Card ===== */
.card-cyber {
  background: var(--bg-card);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: var(--space-6);
  position: relative;
  transition: all 0.3s var(--ease-out-cubic);
}

.card-cyber::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    rgba(0, 217, 255, 0.05),
    rgba(57, 255, 20, 0.05),
    rgba(138, 43, 226, 0.05)
  );
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-cyber:hover::before {
  opacity: 1;
}

.card-cyber:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 217, 255, 0.2);
}
```

### Badge System
```css
/* ===== Achievement Badge ===== */
.badge-achievement {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border-radius: 20px;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  border: 1px solid;
  position: relative;
  overflow: hidden;
}

.badge-bronze {
  background: rgba(205, 127, 50, 0.1);
  color: var(--level-bronze);
  border-color: var(--level-bronze);
}

.badge-silver {
  background: rgba(192, 192, 192, 0.1);
  color: var(--level-silver);
  border-color: var(--level-silver);
}

.badge-gold {
  background: rgba(255, 215, 0, 0.1);
  color: var(--level-gold);
  border-color: var(--level-gold);
  animation: pulse-glow 2s infinite;
}
```

### Progress System
```css
/* ===== Cyber Progress Bar ===== */
.progress-cyber {
  width: 100%;
  height: 8px;
  background: var(--bg-section);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-cyber::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg,
    var(--primary-cyber-blue),
    var(--primary-electric),
    var(--secondary-neon-green)
  );
  border-radius: 10px;
  width: var(--progress-value, 0%);
  transition: width 0.8s var(--ease-out-expo);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.6);
}

.progress-cyber::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 12px
  );
  animation: scan-line 2s linear infinite;
}

@keyframes scan-line {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## 🔄 Brand Token Integration

### CSS Variables Implementation
```css
:root {
  /* Brand Colors */
  --primary-cyber-blue: #00D9FF;
  --primary-electric: #00F0FF;
  --primary-deep: #0099CC;
  --secondary-neon-green: #39FF14;
  --secondary-orange: #FF6B35;
  --secondary-purple: #8A2BE2;

  /* Background Hierarchy */
  --bg-dark: #0A0A0A;
  --bg-card: #1A1A1A;
  --bg-section: #2A2A2A;
  --bg-hover: #3A3A3A;

  /* Text Hierarchy */
  --text-primary: #FFFFFF;
  --text-secondary: #CCCCCC;
  --text-muted: #888888;
  --text-disabled: #555555;

  /* Status Colors */
  --success: #39FF14;
  --warning: #FFD700;
  --error: #FF4444;
  --info: #00D9FF;

  /* Achievement Levels */
  --level-bronze: #CD7F32;
  --level-silver: #C0C0C0;
  --level-gold: #FFD700;
  --level-platinum: #E5E4E2;

  /* Typography */
  --font-primary: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
  --font-heading: 'Space Grotesk', 'Inter', sans-serif;
  --font-code: 'JetBrains Mono', 'Consolas', monospace;
  --font-ja: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;

  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Font Weights */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Brand Consistency Guidelines
1. **Primary Color**: `--primary-cyber-blue` を主要なブランド表現で使用
2. **Contrast**: 背景との適切なコントラスト比確保（4.5:1以上）
3. **Typography**: 見出しは `--font-heading`、本文は `--font-primary` を使用
4. **Achievement表現**: レベル色を統一的に使用してゲーミフィケーション要素強化

---

## 📚 Related Documents

- **[Design Architecture](./design-architecture.md)** - デザインシステム設計・管理手法
- **[Layout System](./layout-system.md)** - レイアウト・アニメーション・レスポンシブ

---

> **🎨 Brand Principle**: 
> projectnameのブランドアイデンティティは「デジタルな成長体験」です。
> サイバーパンク風の視覚要素とゲーミフィケーションにより、
> ユーザーの継続的な自己改善をサポートします。