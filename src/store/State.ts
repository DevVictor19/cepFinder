interface ISlices {
  [key: string]: {};
}

export class State {
  private static instance: State;
  slices: ISlices = {};

  private constructor() {}

  public static initialize(): State {
    if (!State.instance) {
      State.instance = new State();
    }

    return State.instance;
  }

  createSlice(name: string, initialValue: object) {
    if (this.slices[name]) {
      this.dispatchError(
        "createSlice: you are trying to create an existing slice in state"
      );
    }
    this.slices = { ...this.slices, [name]: initialValue };
  }

  updateSlice(name: string, content: object) {
    if (!this.slices[name]) {
      this.dispatchError(
        "updateSlice: slice name does not match with any slice in state"
      );
    }

    this.slices[name] = { ...content };
  }

  getSlice<T extends object>(name: string): T {
    if (!this.slices[name]) {
      this.dispatchError(
        "getSlice: slice name does not match with any slice in state"
      );
    }
    return this.slices[name] as T;
  }

  private dispatchError(message: string): never {
    throw new Error(message);
  }
}
