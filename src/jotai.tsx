/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Updater<Value> = (prev: Value) => Value;

type Store = {
  get: <Value>(atom: Atom<Value>) => Value;
  set: <Value>(
    atom: Atom<Value>,
  ) => (newValue: Value | Updater<Value>) => void;
  subscribe: (atom: Atom<unknown>, callback: () => void) => () => void;
};

function createStore(): Store {
  const atomMap = new WeakMap<Atom<unknown>, unknown>();
  const subscribers = new WeakMap<Atom<unknown>, Set<() => void>>();

  return {
    get: <Value,>(atom: Atom<Value>) => {
      if (atomMap.has(atom)) {
        return atomMap.get(atom) as Value;
      }
      return atom.initialValue;
    },
    set: (atom) => {
      if (!atomMap.has(atom)) {
        atomMap.set(atom, atom.initialValue);
      }
      return (newValue) => {
        const prevValue = atomMap.get(atom);
        const finalValue = typeof newValue === "function"
          ? (newValue as Updater<unknown>)(prevValue)
          : newValue;

        if (!Object.is(prevValue, finalValue)) {
          atomMap.set(atom, finalValue);
          subscribers.get(atom)?.forEach((callback) => callback());
        }
      };
    },
    subscribe: (atom, callback) => {
      if (!subscribers.has(atom)) {
        subscribers.set(atom, new Set());
      }
      subscribers.get(atom)?.add(callback);
      return () => {
        subscribers.get(atom)?.delete(callback);
      };
    },
  };
}

const StoreContext = createContext<Store | null>(null);

type Props = {
  children: ReactNode;
  store?: Store;
};
export function Provider({ children, store }: Props) {
  const storeRef = useRef<Store>();
  if (!store && !storeRef.current) {
    storeRef.current = createStore();
  }

  return (
    <StoreContext.Provider value={(store ?? storeRef.current) as Store}>
      {children}
    </StoreContext.Provider>
  );
}

const defaultStore = createStore();
function useStore() {
  const store = useContext(StoreContext);
  return store ?? defaultStore;
}

type Atom<Value> = {
  toString: () => string;
  initialValue: Value;
};

let keyCount = 0;

export function atom<Value>(initialValue: Value) {
  const key = `atom${keyCount++}`;
  return {
    toString: () => key,
    initialValue,
  };
}

export function useSetAtom<Value>(atom: Atom<Value>) {
  const store = useStore();
  return store.set(atom);
}

export function useAtomValue<Value>(atom: Atom<Value>) {
  const store = useStore();
  const [[value], setState] = useState(
    () => [store.get(atom), store, atom],
  );

  const rerender = useCallback(() => {
    setState((prev) => {
      const nextValue = store.get(atom);
      if (
        Object.is(prev[0], nextValue) && prev[1] === store && prev[2] === atom
      ) {
        return prev;
      }
      return [store.get(atom), store, atom];
    });
  }, [atom, store]);

  useEffect(() => {
    const unsubscribe = store.subscribe(atom, rerender);
    rerender();
    return unsubscribe;
  }, [store, atom, rerender]);

  return value;
}

export function useAtom<Value>(atom: Atom<Value>) {
  const setAtom = useSetAtom(atom);
  const value = useAtomValue(atom);
  return [value, setAtom] as const;
}
