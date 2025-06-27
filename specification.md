# React-Konva Component Builder 仕様書

## 概要
React-Konvaコンポーネントを視覚的に作成・配置し、Reactコンポーネントのコードを自動生成するWebアプリケーション。

## 主要機能

### 1. キャンバスエディタ
- **グリッドシステム**: ピクセル単位での正確な配置を実現
  - グリッドサイズ: 任意の値を指定可能（デフォルト: 8px）
  - プリセット: 4px, 8px, 16px, 32px
  - スナップ機能: グリッドへの自動吸着
  - ルーラー表示: X軸・Y軸の座標表示

- **図形ツールパレット**
  - 基本図形: Rect, Circle, Ellipse, Line, Polygon, Star
  - テキスト: Text, Label
  - 画像: Image
  - パス: Path, Arrow

### 2. プロパティパネル
選択した図形のプロパティを編集
- 位置 (x, y)
- サイズ (width, height, radius等)
- スタイル (fill, stroke, strokeWidth, opacity等)
- 変形 (rotation, scaleX, scaleY)
- その他の図形固有プロパティ

### 3. レイヤー管理
- レイヤーの追加/削除
- レイヤーの順序変更
- レイヤーの表示/非表示
- レイヤーのロック

### 4. コード生成・表示パネル（右側）
- リアルタイムコード生成
- シンタックスハイライト
- コピーボタン
- エクスポートオプション:
  - 関数コンポーネント
  - クラスコンポーネント
  - TypeScript対応

## 技術スタック
- **フロントエンド**: React + TypeScript
- **UI**: Konva + react-konva
- **状態管理**: Zustand or Redux Toolkit
- **スタイリング**: Tailwind CSS
- **コードエディタ**: Monaco Editor or CodeMirror
- **ビルドツール**: Vite

## UI レイアウト
```
┌─────────────────────────────────────────────────────────┐
│ ヘッダー (ツールバー)                                    │
├──────────┬────────────────────────────┬─────────────────┤
│          │                            │                 │
│ ツール   │     キャンバス             │  コード表示     │
│ パレット │   (グリッド付き)           │  パネル         │
│          │                            │                 │
│          │                            │ [コピー]        │
├──────────┼────────────────────────────┴─────────────────┤
│ レイヤー │            プロパティパネル                   │
│ パネル   │                                              │
└──────────┴──────────────────────────────────────────────┘
```

## 実装フェーズ
1. **Phase 1**: 基本UIとグリッドシステム
2. **Phase 2**: 図形の配置とドラッグ&ドロップ
3. **Phase 3**: プロパティ編集機能
4. **Phase 4**: コード生成とエクスポート
5. **Phase 5**: 高度な機能（グループ化、テンプレート等）

## 座標系仕様
- キャンバスの左上が原点 (0, 0)
- 生成されるStageコンポーネントの左上も (0, 0) に対応
- 全ての要素の位置は左上基準で指定

## 出力コード例
```jsx
import React from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

const GeneratedComponent = () => {
  return (
    <Stage width={800} height={600}>
      <Layer>
        <Rect
          x={100}
          y={100}
          width={200}
          height={100}
          fill="#ff0000"
          stroke="#000000"
          strokeWidth={2}
        />
        <Circle
          x={400}
          y={300}
          radius={50}
          fill="#00ff00"
        />
        <Text
          x={150}
          y={250}
          text="Hello Konva"
          fontSize={20}
          fill="#000000"
        />
      </Layer>
    </Stage>
  );
};

export default GeneratedComponent;
```