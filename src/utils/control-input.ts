import { normalizeString } from "./normalize-string";

export function controlInput(e: Event) {
  const targetInput = e.target! as HTMLInputElement;

  let inputValue = normalizeString(targetInput.value.trim());

  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, -1);
  }

  targetInput.value = inputValue;
}
