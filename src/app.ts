import "./styles.css";

import { ControledForm } from "./classes/ControledForm";
import { controlInput } from "./utils/control-input";

const headerForm = new ControledForm(
  document.querySelector(".main-header__form") as HTMLFormElement,
  {
    cepInput: document.getElementById(
      "main-header__input-cep"
    ) as HTMLInputElement,
  }
);

headerForm.addInputValidationHandler("cepInput", "input", controlInput);
headerForm.addSubmitHandler((e) => {
  e.preventDefault();
  alert("header submit");
});
