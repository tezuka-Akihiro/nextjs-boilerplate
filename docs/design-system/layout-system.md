# tsumiage Layout System & Animation

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

---

## 📐 Layout & Grid System

### レイアウト基本方針
**全デバイス統一縦長レイアウト**
- 全てのデバイス（スマートフォン・タブレット・PC）で同じ縦長レイアウトを適用
- PC・タブレットでは画面中央にコンテンツを配置し、左右に余白を設ける
- 左右余白はシンプルな背景色で、コンテンツに集中できるデザイン

### Breakpoints & Container Strategy
```css
/* ===== Responsive Breakpoints ===== */
--bp-xs: 0px;        /* ~374px: 小型スマホ */
--bp-sm: 375px;      /* 375px~767px: スマホ */
--bp-md: 768px;      /* 768px~1199px: タブレット */
--bp-lg: 1200px;     /* 1200px~: PC・大画面 */

/* ===== 統一縦長レイアウト用コンテナ ===== */
--content-width-mobile: 100%;     /* モバイル: フル幅 */
--content-width-tablet: 480px;    /* タブレット: 中央固定幅 */
--content-width-desktop: 480px;   /* PC: 中央固定幅（モバイル同等） */
--content-max-width: 480px;       /* 最大コンテンツ幅 */
```

### Spacing Scale
```css
/* ===== Spacing System ===== */
--space-0: 0;          /* 0px */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### Grid System
```css
/* ===== Flexible Grid ===== */
.grid-container {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* ===== Dashboard Layout Grid ===== */
.dashboard-grid {
  display: grid;
  grid-template-areas: 
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 240px 1fr 300px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: var(--space-4);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-areas: 
      "header"
      "nav"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

---

## ⚡ Animation & Transitions

### Transition Durations
```css
/* ===== Animation Speeds ===== */
--duration-instant: 0s;          /* 即座 */
--duration-fast: 0.15s;          /* 瞬間的な反応 */
--duration-normal: 0.3s;         /* 標準的な動作 */
--duration-slow: 0.5s;           /* ゆったりした動作 */
--duration-slower: 0.75s;        /* 強調したい動作 */
--duration-slowest: 1s;          /* 特別な演出 */
```

### Easing Functions
```css
/* ===== Easing Curves ===== */
--ease-linear: linear;
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-out-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
```

### Core Animations
```css
/* ===== Glow Effect ===== */
@keyframes cyber-glow {
  0%, 100% { 
    box-shadow: 0 0 5px var(--primary-cyber-blue);
  }
  50% { 
    box-shadow: 0 0 20px var(--primary-cyber-blue), 
                0 0 30px var(--primary-electric);
  }
}

/* ===== Pulse Animation ===== */
@keyframes pulse-success {
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% { 
    transform: scale(1);
    opacity: 1;
  }
}

/* ===== Slide Animations ===== */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ===== Fade Animations ===== */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* ===== Scale Animations ===== */
@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scale-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}

/* ===== Loading Animations ===== */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
```

### Section Transition Animations
```css
/* ===== SPA Section Switching ===== */
.section-enter {
  animation: slide-in-right var(--duration-normal) var(--ease-out-cubic);
}

.section-exit {
  animation: slide-in-left var(--duration-normal) var(--ease-out-cubic) reverse;
}

.modal-enter {
  animation: scale-in var(--duration-normal) var(--ease-out-back);
}

.modal-exit {
  animation: scale-out var(--duration-fast) var(--ease-out-cubic);
}

.notification-enter {
  animation: slide-in-down var(--duration-normal) var(--ease-out-bounce);
}

.notification-exit {
  animation: slide-in-up var(--duration-fast) var(--ease-out-cubic);
}
```

---

## 📱 Responsive Design System

### Mobile-First Approach
```css
/* ===== Base (Mobile) Styles ===== */
.component {
  padding: var(--space-4);
  font-size: var(--text-base);
}

/* ===== Tablet Enhancement ===== */
@media (min-width: 768px) {
  .component {
    padding: var(--space-6);
    font-size: var(--text-lg);
  }
}

/* ===== Desktop Enhancement ===== */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
    font-size: var(--text-xl);
  }
}
```

### Responsive Navigation
```css
/* ===== Mobile Navigation ===== */
.nav-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border-top: 1px solid rgba(0, 217, 255, 0.2);
  padding: var(--space-2);
  display: flex;
  justify-content: space-around;
}

@media (min-width: 768px) {
  .nav-mobile {
    display: none;
  }
}

/* ===== Desktop Navigation ===== */
.nav-desktop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: var(--bg-card);
  border-right: 1px solid rgba(0, 217, 255, 0.2);
  padding: var(--space-6);
}

@media (min-width: 768px) {
  .nav-desktop {
    display: block;
  }
}
```

### 統一縦長レイアウトコンテナ
```css
/* ===== 全デバイス統一縦長レイアウト ===== */
.unified-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
  background: var(--bg-dark);
}

/* モバイル: フル幅表示 */
@media (min-width: 0px) {
  .unified-container {
    max-width: 100%;
    padding: 0 var(--space-4);
  }
}

/* タブレット・PC: 中央固定幅 + 左右余白 */
@media (min-width: 768px) {
  .unified-container {
    max-width: var(--content-max-width);
    padding: 0 var(--space-4);
    /* 左右余白は自動的に背景色で埋まる */
  }
  
  /* ページ背景（左右余白エリア） */
  body {
    background: var(--bg-dark);
  }
}

/* PC大画面でも同じ幅を維持 */
@media (min-width: 1200px) {
  .unified-container {
    max-width: var(--content-max-width);
    /* 幅は変更しない */
  }
}
```

---

## 🎯 Layout Patterns

### Dashboard Layout
```css
/* ===== Main Dashboard Layout ===== */
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-columns: 280px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  background: var(--bg-dark);
}

.dashboard-header {
  grid-area: header;
  background: var(--bg-card);
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-sidebar {
  grid-area: sidebar;
  background: var(--bg-card);
  border-right: 1px solid rgba(0, 217, 255, 0.2);
  padding: var(--space-6);
  overflow-y: auto;
}

.dashboard-main {
  grid-area: main;
  padding: var(--space-6);
  overflow-y: auto;
}

/* ===== Mobile Dashboard ===== */
@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
  }
  
  .dashboard-sidebar {
    display: none;
  }
}
```

### Card Grid Layout
```css
/* ===== Responsive Card Grid ===== */
.card-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1440px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Modal Layout
```css
/* ===== Modal Overlay ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: var(--space-6);
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

@media (min-width: 768px) {
  .modal-overlay {
    padding: var(--space-8);
  }
  
  .modal-content {
    padding: var(--space-8);
  }
}
```

---

## 🎮 Interactive States & Feedback

### Hover States
```css
/* ===== Interactive Elements ===== */
.interactive {
  transition: all var(--duration-normal) var(--ease-out-cubic);
  cursor: pointer;
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.2);
}

.interactive:active {
  transform: translateY(0);
  transition-duration: var(--duration-fast);
}
```

### Loading States
```css
/* ===== Loading Skeleton ===== */
.skeleton {
  background: linear-gradient(90deg, 
    var(--bg-section) 25%, 
    var(--bg-hover) 50%, 
    var(--bg-section) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* ===== Loading Spinner ===== */
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--bg-section);
  border-top: 3px solid var(--primary-cyber-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## ♿ Accessibility & Motion

### Reduced Motion Support
```css
/* ===== Respect User Preferences ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Focus Management
```css
/* ===== Focus Styles ===== */
.focus-visible {
  outline: 2px solid var(--primary-cyber-blue);
  outline-offset: 2px;
}

.focus-visible:not(:focus-visible) {
  outline: none;
}

/* ===== Skip to Content ===== */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-cyber-blue);
  color: var(--bg-dark);
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  transition: top var(--duration-normal);
}

.skip-to-content:focus {
  top: 6px;
}
```

---

## 🔄 CSS Variables Integration

```css
/* ===== Layout & Animation Tokens ===== */
:root {
  /* Breakpoints */
  --bp-xs: 0px;
  --bp-sm: 375px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1440px;

  /* Container Sizes */
  --container-xs: 100%;
  --container-sm: 100%;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;

  /* Spacing Scale */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Animation Durations */
  --duration-instant: 0s;
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --duration-slower: 0.75s;
  --duration-slowest: 1s;

  /* Easing Functions */
  --ease-linear: linear;
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-out-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
}
```

---

## 📚 Related Documents

- **[Design Architecture](./design-architecture.md)** - デザインシステム設計・管理手法
- **[Brand Identity](./brand-identity.md)** - ブランド・色彩・タイポグラフィ

---

> **⚡ Layout Principle**: 
> レスポンシブ・アクセシブル・パフォーマンス重視の3原則で、
> すべてのデバイス・ユーザーに最適化されたレイアウトシステムを提供します。