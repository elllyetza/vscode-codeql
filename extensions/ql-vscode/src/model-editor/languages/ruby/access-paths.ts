export function parseRubyMethodFromPath(path: string): string {
  const match = path.match(/Method\[([^\]]+)].*/);
  if (match) {
    return match[1];
  } else {
    return "";
  }
}

export function parseRubyAccessPath(path: string): {
  methodName: string;
  path: string;
} {
  const match = path.match(/Method\[([^\]]+)]\.(.*)/);
  if (match) {
    return { methodName: match[1], path: match[2] };
  } else {
    return { methodName: "", path: "" };
  }
}

export function rubyMethodSignature(typeName: string, methodName: string) {
  return `${typeName}#${methodName}`;
}
