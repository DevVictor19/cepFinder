import "./styles.css";

import { controlInput } from "./utils/control-input";

abstract class ControledInput {
  formElement: HTMLFormElement;
  inputElement: HTMLInputElement;

  constructor(
    formSelector: string,
    inputSelector: string,
    inputControlFn: (e: Event) => void
  ) {
    this.formElement = document.querySelector(formSelector) as HTMLFormElement;
    this.inputElement = document.querySelector(
      inputSelector
    ) as HTMLInputElement;

    this.formElement.addEventListener("submit", this.submit.bind(this));
    this.inputElement.addEventListener("input", inputControlFn);
  }

  abstract submit(event: SubmitEvent): void;

  protected resetValues() {
    this.inputElement.value = "";
  }
}

class HeaderForm extends ControledInput {
  constructor(
    formSelector: string,
    inputSelector: string,
    inputControlFn: (e: Event) => void
  ) {
    super(formSelector, inputSelector, inputControlFn);
  }

  submit(event: SubmitEvent) {
    event.preventDefault();
    console.log("teste");
    this.resetValues();
  }
}

const headerForm = new HeaderForm(
  ".main-header__form",
  "#main-header__input-cep",
  controlInput
);
