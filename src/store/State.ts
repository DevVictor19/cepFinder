interface ISlices {
  [key: string]: any;
}

export class State {
  private static instance: State;
  slices: ISlices = {};

  private constructor() {}

  public static getInstace(): State {
    if (!State.instance) {
      State.instance = new State();
    }

    return State.instance;
  }

  createSlice(name: string, initialValue: any) {
    if (this.slices[name]) {
      this.dispatchError(
        "createSlice: you are trying to create an existing slice in state"
      );
    }
    this.slices = { ...this.slices, [name]: initialValue };
  }

  updateSlice<T>(name: string, callback: (stateSnapShot: T) => T) {
    if (!this.slices[name]) {
      this.dispatchError(
        "updateSlice: slice name does not match with any slice in state"
      );
    }

    this.slices[name] = callback(this.slices[name]);
  }

  getState<T extends ISlices>(callback: (stateSnapShot: ISlices) => T): T {
    return callback(this.slices);
  }

  private dispatchError(message: string): never {
    throw new Error(message);
  }
}
