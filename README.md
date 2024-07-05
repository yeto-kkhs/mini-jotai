# mini-jotai

## できること

```tsx
// シンプルな初期値の設定を持つだけのアトム
const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
      <button onClick={() => setCount((prev) => prev - 1)}>
        -1
      </button>
    </div>
  );
}
```

## memo

- `atom` は状態を持たない設計図的なもの
- 値は `store` に `atom` をキーとして保存される
  - `store = WeakMap<Atom, Value>`
  - `WeakMap` を使用しているので `atom` をコンポーネント内で作成しても `stpre`
    が肥大化?しないんだと思う(`atom` は `useMemo` なりする必要あり)
- `Context`
  で状態を管理するんじゃなくて、各コンポーネントごとに状態を持っている（`useState`
  or `useReducer`）
- 状態を管理しているのは `store`
  で、それをもとに各コンポーネントに状態を持たせて `useEffect`
  内でサブスクライブすることで React の世界との同期を行なっている
  - 外部ストアとの同期という点では `useSyncExternalStore` もあるが、 Jotai では
    `useEffect` を使用しているっぽい
