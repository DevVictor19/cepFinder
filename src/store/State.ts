import { IUpdatable } from "../models/updatable";

interface ISlices {
  [key: string]: any;
}
interface ISubscribers {
  [key: string]: Partial<IUpdatable[]>;
}

export class State {
  private static instance: State;
  private slices: ISlices = {};
  private subscribers: ISubscribers = {};

  private constructor() {}

  public static getInstace(): State {
    if (!State.instance) {
      State.instance = new State();
    }

    return State.instance;
  }

  createSlice<T>(name: string, initialValue: T) {
    if (this.slices[name]) {
      this.dispatchError(
        "createSlice: you are trying to create an existing slice in state"
      );
    }

    this.slices = { ...this.slices, [name]: initialValue };
    this.subscribers[name] = [];
  }

  updateSlice<T>(name: string, callback: (stateSnapShot: T) => T) {
    if (!this.slices[name]) {
      this.dispatchError(
        "updateSlice: slice name does not match with any slice in state"
      );
    }

    this.slices[name] = callback(this.slices[name]);

    if (this.subscribers[name].length > 0) {
      this.dispatchUpdateFor(name);
    }
  }

  addSubscribe(name: string, subscriberInstance: IUpdatable) {
    if (!this.subscribers[name]) {
      this.dispatchError(
        "subscribe: the slice was not initialized for assing subscribers"
      );
    }

    this.subscribers[name] = [...this.subscribers[name], subscriberInstance];
  }

  getState<T extends ISlices>(callback: (stateSnapShot: ISlices) => T): T {
    return callback({ ...this.slices });
  }

  private dispatchError(message: string): never {
    throw new Error(message);
  }

  private dispatchUpdateFor(name: string) {
    this.subscribers[name].forEach((subscriberInstance) => {
      subscriberInstance!.update(this.slices[name]);
    });
  }
}
