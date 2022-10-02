namespace App {
  export function normalizeString(str: string) {
    return str.replace(/\D/g, "");
  }
}
