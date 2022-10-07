import "./styles.css";

import { controlInput } from "./utils/control-input";
import { ControledForm } from "./classes/ControledForm";
import { ConnectApi } from "./classes/ConnectApi";
import { ICep } from "./models/cep";
import { LocalStorageConnection } from "./classes/LocalStorageConnection";
import { State } from "./store/State";

const state = State.getInstace();
const localCeps = new LocalStorageConnection<ICep[]>("ceps");
const cepApi = new ConnectApi("https://viacep.com.br/ws/");

state.createSlice("ceps", localCeps.items);
state.addSubscribe("ceps", localCeps);

console.log(state.getState((s) => s.ceps));

const headerForm = new ControledForm(
  document.querySelector(".main-header__form") as HTMLFormElement,
  {
    cepInput: document.getElementById(
      "main-header__input-cep"
    ) as HTMLInputElement,
  }
);

headerForm.addInputControlHandler("cepInput", "input", controlInput);
headerForm.addSubmitHandler(headerSubmitHandler);

async function headerSubmitHandler(e: SubmitEvent) {
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

    if (data.erro === "true") {
      alert("Cep não encontrado, tente outra vez");
      return;
    }

    if (!data) {
      throw new Error("did not get values");
    }
    state.updateSlice<ICep[]>("ceps", (s) => [...s, data]);
  } catch (e) {
    console.log(e);
  }
}
