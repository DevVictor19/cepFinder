/// <reference path="./normalize-string.ts" />

namespace App {
  export function controlInput(e: Event) {
    const targetInput = e.target! as HTMLInputElement;

    let inputValue = normalizeString(targetInput.value.trim());

    if (inputValue.length > 8) {
      inputValue = inputValue.slice(0, -1);
    }

    targetInput.value = inputValue;
  }
}
