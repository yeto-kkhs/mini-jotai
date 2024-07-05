import style from "./App.module.css";
import { atom, Provider, useAtom } from "./jotai";
import { useRenderingCount } from "./util";

const countAtom = atom(0);
const countAtom2 = atom(10);

function App() {
  return (
    <div className={style.vStack}>
      <div>
        <p>root</p>
        <p>countAtom: {"<Provider>A</Provider>"}, C</p>
        <p>countAtom2: D</p>
      </div>
      <div className={style.hStack}>
        <Provider>
          <A />
        </Provider>
        <B />
        <D />
      </div>
    </div>
  );
}

function A() {
  const rc = useRenderingCount();
  const [count, setCount] = useAtom(countAtom);

  return (
    <div className={style.vStack}>
      <div>
        <p>A: {count}, rc: {rc}</p>
        <button onClick={() => setCount(count + 2)}>A+=2</button>
      </div>
    </div>
  );
}

function B() {
  const rc = useRenderingCount();
  return (
    <div className={style.vStack}>
      <p>B: through rc: {rc}</p>
      <C />
    </div>
  );
}

function C() {
  const [count, setCount] = useAtom(countAtom);
  const rc = useRenderingCount();
  return (
    <div>
      <p>C: {count}, rc: {rc}</p>
      <button onClick={() => setCount((p) => p + 1)}>C+=1</button>
    </div>
  );
}

function D() {
  const [count, setCount] = useAtom(countAtom2);
  const r = useRenderingCount();
  return (
    <div>
      <p>D:{count}, rc: {r}</p>
      <button onClick={() => setCount((count) => count * 2)}>D*=2</button>
    </div>
  );
}

export default App;
