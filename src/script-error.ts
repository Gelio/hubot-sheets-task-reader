export interface ScriptError {
  error: Error;
  consoleLogOnly?: boolean;
}

export function isScriptError(value: unknown): value is ScriptError {
  return (value as ScriptError).error instanceof Error;
}
