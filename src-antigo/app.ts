import "./styles.css";

import { CepList } from "./classes/cep-list.js";
import { Api } from "./api/api.js";
import { cepStorage } from "./store/app-storage.js";
import { controlInput } from "./utils/control-input.js";

// intances
const ceps = new CepList();
const api = new Api();

// elements selection
const header_inputText = document.getElementById(
  "main-header__input-cep"
) as HTMLInputElement;

const header_form = document.querySelector(
  ".main-header__form"
) as HTMLFormElement;

const actions_inputText = document.getElementById(
  "main-content__actions-input"
) as HTMLFormElement;

const actions_form = document.querySelector(
  ".main-content__actions-form"
) as HTMLFormElement;

// handlers
async function header_form_submitHandler(e: SubmitEvent) {
  e.preventDefault();

  if (header_inputText.value.length !== 8) {
    alert("Insira um cep válido! Um cep deve conter 8 digitos");
    return;
  }

  if (
    cepStorage.localItems.find((item) => item.cep === header_inputText.value)
  ) {
    ceps.goToCep(header_inputText.value);
    ceps.focusCep(header_inputText.value);
    alert("Cep já pesquisado, verifique na lista");
    return;
  }

  const newCep = await api.findCep(header_inputText.value);

  if (!newCep) {
    alert("Algo deu errado... tente novamente.");
    return;
  }

  ceps.addNewCep(newCep);
  ceps.goToCep(newCep.cep);
  ceps.focusCep(newCep.cep);
  header_inputText.value = "";
}

function action_form_submitHandler(e: SubmitEvent) {
  e.preventDefault();

  if (actions_inputText.value.length !== 8) {
    alert("Insira um cep válido! Um cep deve conter 8 digitos");
    return;
  }

  if (
    !cepStorage.localItems.find((item) => item.cep === actions_inputText.value)
  ) {
    alert("Cep não existe na lista, pesquise na barra superior.");
    return;
  }

  ceps.goToCep(actions_inputText.value);
  ceps.focusCep(actions_inputText.value);
  actions_inputText.value = "";
}

// events
header_inputText.addEventListener("input", controlInput);
header_form.addEventListener("submit", header_form_submitHandler);

(
  document.getElementById("main-content__deleteAll-btn") as HTMLButtonElement
).addEventListener("click", () => ceps.resetCeps());

actions_inputText.addEventListener("input", controlInput);
actions_form.addEventListener("submit", action_form_submitHandler);
