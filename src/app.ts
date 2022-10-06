import "./styles.css";

import { controlInput } from "./utils/control-input";

class ControledForm {
  formElement: HTMLFormElement;
  inputElement: HTMLInputElement;

  constructor(formSelector: string, inputSelector: string) {
    this.formElement = document.querySelector(formSelector) as HTMLFormElement;
    this.inputElement = document.querySelector(
      inputSelector
    ) as HTMLInputElement;
  }

  addEvent<T extends HTMLElement>(
    event: keyof HTMLElementEventMap,
    targetEl: T,
    eventHandlerFn: (event: Event) => void
  ) {
    targetEl.addEventListener(event, eventHandlerFn);
  }
}

const headerForm = new ControledForm(
  ".main-header__form",
  "#main-header__input-cep"
);

headerForm.addEvent("input", headerForm.inputElement, controlInput);
headerForm.addEvent("submit", headerForm.formElement, (e: Event) => {
  e.preventDefault();
  console.log("teste");
});
