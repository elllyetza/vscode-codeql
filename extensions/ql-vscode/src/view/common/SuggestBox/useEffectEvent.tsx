import * as React from "react";

type AnyFunction = (...args: any[]) => any;

// `toString()` prevents bundlers from trying to `import { useInsertionEffect } from 'react'`
const useInsertionEffect = (React as any)["useInsertionEffect".toString()] as
  | AnyFunction
  | undefined;

const useSafeInsertionEffect = useInsertionEffect || ((fn) => fn());

// Copy of https://github.com/floating-ui/floating-ui/blob/a70e4e2350627ba61bdfd72f86475d0905c2a17e/packages/react/src/hooks/utils/useEffectEvent.ts
// since it's not exported
export function useEffectEvent<T extends AnyFunction>(callback?: T) {
  const ref = React.useRef<AnyFunction | undefined>(() => {});

  useSafeInsertionEffect(() => {
    ref.current = callback;
  });

  return React.useCallback<AnyFunction>(
    (...args) => ref.current?.(...args),
    [],
  ) as T;
}
