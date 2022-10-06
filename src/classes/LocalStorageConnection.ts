import { IUpdatable } from "../models/updatable";

export class LocalStorageConnection<T> implements IUpdatable {
  constructor(private localStorageName: string) {
    if (!localStorage.getItem(this.localStorageName)) {
      localStorage.setItem(this.localStorageName, JSON.stringify([]));
    }
  }

  get items(): T[] {
    return JSON.parse(localStorage.getItem(this.localStorageName)!);
  }

  update<T>(items: T[]) {
    localStorage.setItem(this.localStorageName, JSON.stringify(items));
  }

  reset() {
    localStorage.setItem(this.localStorageName, JSON.stringify([]));
  }
}
