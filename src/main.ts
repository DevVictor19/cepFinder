import "./styles.css";

import { normalizeString } from "./utils/normalize-string";
import { controlInput } from "./utils/control-input";
import { ControledForm } from "./classes/ControledForm";
import { ConnectApi } from "./classes/ConnectApi";
import { ICep } from "./models/cep";
import { LocalStorageConnection } from "./classes/LocalStorageConnection";
import { State } from "./store/State";
import { CepTable } from "./classes/CepTable";

const state = State.getInstace();
const localCeps = new LocalStorageConnection<ICep[]>("ceps");
const cepApi = new ConnectApi("https://viacep.com.br/ws/");

state.createSlice("ceps", localCeps.items);
state.addSubscribe("ceps", localCeps);

const cepTable = new CepTable(
  document.querySelector(".main-content__table") as HTMLTableElement,
  document.querySelector(".main-content__actions") as HTMLDivElement,
  document.getElementById("main-content__deleteAll-btn") as HTMLButtonElement,
  document.getElementById("main-content__tbody") as HTMLTableElement,
  document.querySelector(".main-content__text") as HTMLParagraphElement,
  state.getState((s) => s.ceps)
);

state.addSubscribe("ceps", cepTable);

const headerForm = new ControledForm(
  document.querySelector(".main-header__form") as HTMLFormElement,
  {
    cepInput: document.getElementById(
      "main-header__input-cep"
    ) as HTMLInputElement,
  }
);

headerForm.addInputControlHandler("cepInput", "input", controlInput);
headerForm.addSubmitHandler(headerFormSubmitHandler);

async function headerFormSubmitHandler(e: SubmitEvent) {
  e.preventDefault();

  const currentInputValue = headerForm.inputElements["cepInput"].value;

  if (currentInputValue.length !== 8) {
    alert("Insira um cep válido! Deve ser composto apenas 8 números");
    return;
  }

  if (
    state
      .getState<ICep[]>((s) => s.ceps)
      .find((item) => item.cep === currentInputValue)
  ) {
    alert("Cep já pesquisado, verifique na lista");
    return;
  }

  try {
    const data = await cepApi.get<any>(`${currentInputValue}/json`);

    if (data.erro === true) {
      alert("Cep não encontrado, tente outra vez");
      return;
    }

    if (!data) {
      throw new Error("did not get values");
    }

    const newCep: ICep = {
      cep: normalizeString(data.cep),
      district: data.bairro,
      locality: data.logradouro,
      state: data.localidade,
      stateTag: data.uf,
    };

    state.updateSlice<ICep[]>("ceps", (s) => [...s, newCep]);
    cepTable.goToCep(currentInputValue);
    cepTable.focusCep(currentInputValue);
    headerForm.inputElements["cepInput"].value = "";
  } catch (e) {
    console.log(e);
  }
}

const tableForm = new ControledForm(
  document.querySelector(".main-content__actions-form") as HTMLFormElement,
  {
    tableSearchInput: document.getElementById(
      "main-content__actions-input"
    ) as HTMLInputElement,
  }
);

tableForm.addInputControlHandler(
  "tableSearchInput",
  "input",
  tableFormInputHandler
);
tableForm.addSubmitHandler(tableFormSubmitHandler);

function tableFormInputHandler(e: Event) {
  controlInput(e);

  const currentInputValue = (e.target as HTMLInputElement).value;
  const currentCepsInList = state.getState<ICep[]>((s) => s.ceps);
  const filteredCeps = currentCepsInList.filter(
    (cepItem) => cepItem.cep.indexOf(currentInputValue) > -1
  );

  cepTable.update(filteredCeps);
}

function tableFormSubmitHandler(e: SubmitEvent) {
  e.preventDefault();

  const currentInputValue = tableForm.inputElements["tableSearchInput"].value;

  if (currentInputValue.length !== 8) {
    alert("Insira um cep válido! Deve ser composto apenas 8 números");
    return;
  }

  if (!document.getElementById(currentInputValue)) {
    alert("Cep não existe na lista");
    return;
  }

  cepTable.goToCep(currentInputValue);
  cepTable.focusCep(currentInputValue);
  tableForm.inputElements["tableSearchInput"].value = "";
}
