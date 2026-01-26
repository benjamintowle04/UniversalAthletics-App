// Utility to silence console.* in production or when SILENCE_CONSOLE env is set
const shouldSilence = process?.env?.NODE_ENV === 'production' || (process?.env?.SILENCE_CONSOLE === '1');

if (shouldSilence) {
  // Replace console methods with no-ops
  const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace', 'group', 'groupCollapsed', 'groupEnd'] as const;
  // @ts-ignore
  methods.forEach((m) => (console[m] = () => {}));
}

export default function initSilenceConsole() {
  // runtime initializer (no-op, module side-effects are the silencer)
}
