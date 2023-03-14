export function warning(message, throwable) {
  if (throwable) {
    console.error(message, throwable);
  } else {
    console.error(message);
  }
}
