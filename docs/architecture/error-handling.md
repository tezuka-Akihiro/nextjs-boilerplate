# tsumiage エラーハンドリング戦略（厳格版）

## 概要
Next.js + Supabase + TypeScript構成でのエラーハンドリング戦略。**最も厳格・安全な方針**を採用し、ユーザー体験とシステム安定性を両立する。

## 1. エラー分類・重大度定義

### 1.1 **重大度レベル**

| レベル | 説明 | 対応方針 | ユーザー通知 | 監視通知 |
|--------|------|----------|------------|----------|
| **CRITICAL** | システム全体停止、データ破損 | 即座に復旧作業、全機能停止 | エラーページ表示 | 即時アラート |
| **ERROR** | 機能停止、API障害 | 代替手段提供、ログ保存 | エラーメッセージ表示 | 5分以内通知 |
| **WARN** | 予期しない状況、性能劣化 | 監視強化、ログ分析 | 一部制限表示 | 30分以内通知 |
| **INFO** | 正常な状況変化 | ログ記録のみ | 通知なし | 通知なし |

### 1.2 **エラー種別分類**

#### API・バックエンドエラー
- **データベース接続失敗** (CRITICAL)
- **Supabase API障害** (ERROR)
- **タイムアウト** (WARN → ERROR)
- **認証失敗** (WARN → ERROR)
- **バリデーションエラー** (WARN)

#### フロントエンド例外
- **JavaScript実行時エラー** (ERROR)
- **ネットワーク切断** (WARN)
- **フォーム入力異常** (WARN)
- **ページ読み込み失敗** (ERROR)

## 2. 層別エラーハンドリング戦略

### 2.1 **Resource層（データアクセス）**

**決定済みルール：**
```typescript
interface ResourceError {
  code: string;
  message: string;
  originalError?: unknown;
  timestamp: string;
  context?: Record<string, unknown>;
}

class BaseResource {
  protected async executeQuery<T>(
    operation: () => Promise<{ data: T | null; error: any }>
  ): Promise<{ success: true; data: T } | { success: false; error: ResourceError }> {
    try {
      const { data, error } = await operation();
      
      if (error) {
        // Supabaseエラーを統一形式に変換
        return {
          success: false,
          error: {
            code: error.code || 'UNKNOWN_DB_ERROR',
            message: error.message || 'データベースエラーが発生しました',
            originalError: error,
            timestamp: new Date().toISOString(),
            context: { operation: operation.name }
          }
        };
      }
      
      if (!data) {
        return {
          success: false,
          error: {
            code: 'NO_DATA_FOUND',
            message: 'データが見つかりませんでした',
            timestamp: new Date().toISOString()
          }
        };
      }
      
      return { success: true, data };
    } catch (error) {
      // 予期しないエラー
      return {
        success: false,
        error: {
          code: 'UNEXPECTED_ERROR',
          message: 'システムエラーが発生しました',
          originalError: error,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}
```

**タイムアウト設定（厳格）：**
- **通常クエリ**: 5秒
- **重要処理（彼女GET投稿）**: 10秒
- **バッチ処理**: 30秒

### 2.2 **Task層（ビジネスロジック）**

**決定済みルール：**
```typescript
interface TaskResult<T> {
  success: boolean;
  data?: T;
  error?: {
    type: 'VALIDATION_ERROR' | 'BUSINESS_RULE_ERROR' | 'RESOURCE_ERROR';
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

abstract class BaseTask<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TaskResult<TOutput>>;
  
  protected handleResourceError(resourceError: ResourceError): TaskResult<never> {
    return {
      success: false,
      error: {
        type: 'RESOURCE_ERROR',
        code: resourceError.code,
        message: resourceError.message,
        details: { timestamp: resourceError.timestamp }
      }
    };
  }
  
  protected validateBusinessRules(input: TInput): TaskResult<TInput> | null {
    // ビジネスルールバリデーション
    // 例：彼女GET投稿の重複チェック
    return null; // 成功時
  }
}
```

### 2.3 **Controller層（統合処理）**

**決定済みルール：**
```typescript
interface ControllerResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    type: 'VALIDATION_ERROR' | 'PERMISSION_ERROR' | 'BUSINESS_ERROR' | 'SYSTEM_ERROR';
    message: string;
    code: string;
    fields?: ValidationError[];
  };
}

abstract class BaseController {
  protected async executeWithTransaction<T>(
    operations: Array<() => Promise<TaskResult<unknown>>>
  ): Promise<ControllerResponse<T>> {
    try {
      // トランザクション実行
      for (const operation of operations) {
        const result = await operation();
        if (!result.success) {
          // 即座にロールバック
          return this.handleTaskError(result.error!);
        }
      }
      
      return { success: true };
    } catch (error) {
      // システムエラー（最高重大度）
      return {
        success: false,
        error: {
          type: 'SYSTEM_ERROR',
          code: 'TRANSACTION_FAILED',
          message: 'システム処理でエラーが発生しました。時間を置いて再度お試しください。'
        }
      };
    }
  }
}
```

### 2.4 **API層（エンドポイント）**

**決定済みルール：**
```typescript
// Next.js API Routes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validationResult = validateRequest(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: '入力内容に不備があります',
          fields: validationResult.errors
        }
      }, { status: 400 });
    }
    
    // Controller呼び出し
    const result = await controller.execute(body);
    
    if (!result.success) {
      const statusCode = getStatusCodeFromError(result.error!);
      return NextResponse.json(result, { status: statusCode });
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    // 予期しないエラー（Critical）
    console.error('API Critical Error:', error);
    return NextResponse.json({
      success: false,
      error: {
        type: 'SYSTEM_ERROR',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'システムエラーが発生しました'
      }
    }, { status: 500 });
  }
}

function getStatusCodeFromError(error: any): number {
  switch (error.type) {
    case 'VALIDATION_ERROR': return 400;
    case 'PERMISSION_ERROR': return 403;
    case 'BUSINESS_ERROR': return 422;
    case 'SYSTEM_ERROR': return 500;
    default: return 500;
  }
}
```

## 3. フロントエンド エラーハンドリング

### 3.1 **React Error Boundary（決定済み）**

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class GlobalErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // エラー監視サービスへ送信（厳格モード）
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // エラー詳細を記録
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // TODO: エラー監視サービス（Sentry等）への送信
    console.error('Error Report:', errorReport);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>申し訳ございません。エラーが発生しました。</h2>
          <button onClick={() => window.location.reload()}>
            ページを再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 3.2 **API呼び出しエラーハンドリング（決定済み）**

```typescript
interface ApiClient {
  post<T>(url: string, data: unknown): Promise<{ success: true; data: T } | { success: false; error: ApiError }>;
}

class ApiClient implements ApiClient {
  async post<T>(url: string, data: unknown) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false as const,
          error: {
            type: result.error.type,
            message: result.error.message,
            code: result.error.code,
            statusCode: response.status
          }
        };
      }

      return { success: true as const, data: result.data };
    } catch (error) {
      // ネットワークエラー・JSON解析エラー等
      return {
        success: false as const,
        error: {
          type: 'NETWORK_ERROR',
          message: 'ネットワークエラーが発生しました。接続を確認してください。',
          code: 'NETWORK_FAILURE'
        }
      };
    }
  }
}
```

### 3.3 **フォームエラー表示（決定済み）**

```typescript
interface FormErrorDisplayProps {
  errors: Record<string, ValidationError>;
  showGlobalError?: boolean;
}

const FormErrorDisplay: FC<FormErrorDisplayProps> = ({ errors, showGlobalError = true }) => {
  const globalError = errors['_global'];
  const fieldErrors = Object.entries(errors).filter(([key]) => key !== '_global');

  return (
    <div className="error-container">
      {showGlobalError && globalError && (
        <div className="alert alert-error mb-4">
          <span className="font-medium">エラー:</span> {globalError.message}
        </div>
      )}
      
      {fieldErrors.map(([field, error]) => (
        <div key={field} className="field-error text-red-600 text-sm mt-1">
          {error.message}
        </div>
      ))}
    </div>
  );
};
```

## 4. ログ管理戦略

### 4.1 **ログレベル定義（決定済み）**

```typescript
enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private static instance: Logger;
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  critical(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log(LogLevel.CRITICAL, message, context, error);
    // Critical ログは即座に通知
    this.sendImmediateAlert(message, error, context);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };

    console.log(JSON.stringify(logEntry));
    
    // TODO: 外部ログサービスへの送信
  }

  private sendImmediateAlert(message: string, error?: Error, context?: Record<string, unknown>) {
    // TODO: 即時アラート送信の実装
  }
}
```

## 5. 監視・通知戦略

### 5.1 **監視対象・通知基準（決定済み）**

| 監視項目 | 閾値 | 通知レベル | 対応時間 |
|----------|------|-----------|----------|
| **API応答時間** | >3秒 | WARN | 30分以内 |
| **API応答時間** | >10秒 | ERROR | 5分以内 |
| **エラー率** | >5% | WARN | 30分以内 |
| **エラー率** | >10% | ERROR | 5分以内 |
| **データベース接続** | 失敗 | CRITICAL | 即時 |
| **認証失敗** | >50回/分 | ERROR | 5分以内 |

### 5.2 **彼女GET投稿の特別監視（決定済み）**

```typescript
interface GirlfriendGetPostMonitoring {
  // 投稿失敗の監視
  postFailureRate: {
    threshold: 1; // 1回でも失敗したら即時通知
    notificationLevel: 'CRITICAL';
  };
  
  // データ整合性の監視
  dataConsistencyCheck: {
    interval: '1hour'; // 1時間ごとにチェック
    checks: [
      'relationship_status_consistency',
      'marriage_deadline_validity',
      'experience_point_accuracy'
    ];
  };
  
  // トランザクション監視
  transactionMonitoring: {
    timeout: 10000; // 10秒
    rollbackTracking: true;
    partialFailureAlert: 'CRITICAL';
  };
}
```

## 6. 運用方針

### 6.1 **エラー対応手順（決定済み）**

1. **CRITICAL**: 即座にシステム停止判断、復旧作業開始
2. **ERROR**: 5分以内に原因調査、代替手段の提供
3. **WARN**: 30分以内に状況確認、対策検討
4. **INFO**: 定期レビューで傾向分析

### 6.2 **ユーザー通知方針（決定済み）**

**致命的エラー（CRITICAL）:**
- システム全体メンテナンス画面表示
- 復旧見込み時間の表示

**機能エラー（ERROR）:**
- 該当機能のエラーメッセージ表示
- 代替手段の案内（可能な場合）

**軽微なエラー（WARN）:**
- 一部機能制限の通知
- 継続利用可能である旨の表示

## 7. 未決定事項

### 7.1 **要検討項目**

1. **エラー監視サービスの選定**
   - Sentry
   - Bugsnag
   - 自前実装

2. **アラート通知方法**
   - Slack
   - メール
   - SMS

3. **ログ保存期間・容量制限**
   - 開発環境: 7日間
   - 本番環境: 30日間（要検討）

### 7.2 **後で決定する項目**

1. 国際化対応時のエラーメッセージ多言語化
2. パフォーマンス監視ツールの導入
3. エラー分析ダッシュボードの構築

---

**注釈**: この戦略は「最も厳格・安全な方針」を採用しており、開発初期段階では過剰に見える場合があります。実運用開始後、必要に応じて調整を行います。