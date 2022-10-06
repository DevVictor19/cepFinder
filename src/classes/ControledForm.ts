interface IInputElements {
  [key: string]: HTMLInputElement;
}

export class ControledForm {
  formElement: HTMLFormElement;
  inputElements: IInputElements = {};

  constructor(form: HTMLFormElement, inputs: IInputElements) {
    this.formElement = form;
    this.inputElements = inputs;
  }

  addInputValidationHandler(
    inputName: keyof IInputElements,
    event: keyof HTMLElementEventMap,
    validateFn: (e: Event) => void
  ) {
    this.inputElements[inputName].addEventListener(event, validateFn);
  }

  addSubmitHandler(handler: (event: SubmitEvent) => void) {
    this.formElement.addEventListener("submit", handler);
  }
}
