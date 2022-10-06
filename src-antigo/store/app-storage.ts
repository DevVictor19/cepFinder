import { ICep } from "../models/cep";

class AppStorage<T> {
  private storageName: string;

  constructor(storageName: string) {
    this.storageName = storageName;
    localStorage.setItem(this.storageName, JSON.stringify([]));
  }

  insertNewLocalItem(newItem: T) {
    localStorage.setItem(
      this.storageName,
      JSON.stringify([...this.localItems, newItem])
    );
  }

  get localItems(): T[] {
    return JSON.parse(localStorage.getItem(this.storageName)!);
  }

  set localItems(newItems: T[]) {
    localStorage.setItem(this.storageName, JSON.stringify(newItems));
  }
}

export const cepStorage = new AppStorage<ICep>("ceps");
