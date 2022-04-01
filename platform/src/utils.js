export function warning(message, throwable) {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message, throwable)
  }
  try {
    throw new Error(message)
  } catch (e) {}
}
