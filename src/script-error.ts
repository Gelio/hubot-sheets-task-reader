export interface ScriptError {
  error: Error;
  consoleLogOnly?: boolean;
}

export function isScriptError(value: unknown): value is ScriptError {
  return (value as ScriptError).error instanceof Error;
}

export function handleScriptError(scriptError: ScriptError) {
  console.log(scriptError.error);

  if (scriptError.consoleLogOnly) {
    return [
      'Unfortunately, I encountered an internal error :/',
      'See the logs in the Hubot console for more information',
    ].join('\n');
  } else {
    return [
      'Unfortunately, I encountered an error :/',
      scriptError.error.message,
    ].join('\n');
  }
}
