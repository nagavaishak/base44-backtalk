import { useEffect, useState, useRef } from "react";

// Loads local (synchronous) data with a brief skeleton + quiet error/retry.
export function useLocal(load, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const mounted = useRef(true);
  const run = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = load();
      setTimeout(() => {
        if (mounted.current) setState({ loading: false, data, error: null });
      }, 220);
    } catch (e) {
      if (mounted.current) setState({ loading: false, data: null, error: e.message || "Couldn't load" });
    }
  };
  useEffect(() => {
    mounted.current = true;
    run();
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { ...state, retry: run };
}