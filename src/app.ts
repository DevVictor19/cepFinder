interface ICep {
  cep: string;
  district: string;
  locality: string;
  state: string;
  stateTag: string;
}

function normalizeString(str: string) {
  return str.replace(/\D/g, "");
}

class Api {
  private endpoint = "https://viacep.com.br/ws/enteredCep/json/";

  async findCep(cep: string): Promise<void | ICep> {
    const response = await fetch(this.endpoint.replace("enteredCep", cep));

    if (!response.ok) {
      alert(
        "Não foi possível fazer a busca do CEP, tente novamente mais tarde..."
      );
      return;
    }

    const data = await response.json();

    if (data.erro === "true") {
      alert(
        "CEP inexistente, busque por outro cep ou confira se há erro no existente."
      );
      return;
    }

    const newCep: ICep = {
      cep: normalizeString(data.cep),
      district: data.bairro,
      locality: data.logradouro,
      state: data.localidade,
      stateTag: data.uf,
    };

    return newCep;
  }
}

const api = new Api();

class AppStorage<T> {
  private storageName: string;

  constructor(storageName: string) {
    this.storageName = storageName;
  }

  insertNewLocalItem(newItem: T) {
    localStorage.setItem(
      this.storageName,
      JSON.stringify([...this.localItems, newItem])
    );
  }

  get localItems(): T[] {
    return JSON.parse(localStorage.getItem(this.storageName)!);
  }

  set localItems(newItems: T[]) {
    localStorage.setItem(this.storageName, JSON.stringify(newItems));
  }
}

const cepStorage = new AppStorage<ICep>("ceps");

class CepList {
  private tableTargetElement: HTMLTableElement;
  private tbodyTargetElement: HTMLTableElement;
  private pTargetElement: HTMLParagraphElement;
  private actionsDisplayTargetElement: HTMLDivElement;

  constructor() {
    this.tableTargetElement = document.querySelector(
      ".main-content__table"
    ) as HTMLTableElement;

    this.tbodyTargetElement = document.getElementById(
      "main-content__tbody"
    ) as HTMLTableElement;

    this.pTargetElement = document.querySelector(
      ".main-content__text"
    ) as HTMLParagraphElement;

    this.actionsDisplayTargetElement = document.querySelector(
      ".main-content__actions"
    ) as HTMLDivElement;

    if (cepStorage.localItems.length > 0) {
      this.render(cepStorage.localItems);
      this.toggleTableElements();
    }
  }

  addNewCep(newCep: ICep) {
    if (cepStorage.localItems.length === 0) {
      this.toggleTableElements();
    }
    this.createCepRowElement(newCep);
    cepStorage.insertNewLocalItem(newCep);
  }

  removeCep(cep: string) {
    this.tbodyTargetElement.removeChild(document.getElementById(cep)!);

    const newCeps = cepStorage.localItems.filter(
      (cep_object) => cep_object.cep !== cep
    );

    if (newCeps.length === 0) {
      this.toggleTableElements();
    }

    cepStorage.localItems = newCeps;
  }

  resetCeps() {
    cepStorage.localItems = [];
    this.toggleTableElements();
  }

  goToCep(cep: string) {
    (document.getElementById(cep) as HTMLTableCellElement).scrollIntoView({
      behavior: "smooth",
    });
  }

  focusCep(cep: string) {
    const cepEl = document.getElementById(cep) as HTMLTableCellElement;

    cepEl.classList.add("focus");

    setTimeout(() => {
      cepEl.classList.remove("focus");
    }, 3000);
  }

  private render(ceps: ICep[]) {
    for (let cep of ceps) {
      this.createCepRowElement(cep);
    }
  }

  private createCepRowElement(cep_data: ICep) {
    const { cep, locality, district, stateTag, state } = cep_data;

    const tr = document.createElement("tr");
    tr.classList.add("main-content__tbody-tr");
    tr.setAttribute("id", cep);

    const cep_td = document.createElement("td");
    cep_td.classList.add("main-content__tbody-td");
    cep_td.innerText = cep;
    tr.appendChild(cep_td);

    const locality_td = document.createElement("td");
    locality_td.classList.add("main-content__tbody-td");
    locality_td.innerText = locality;
    tr.appendChild(locality_td);

    const district_td = document.createElement("td");
    district_td.classList.add("main-content__tbody-td");
    district_td.innerText = district;
    tr.appendChild(district_td);

    const state_td = document.createElement("td");
    state_td.classList.add("main-content__tbody-td");
    state_td.innerText = `${state} (${stateTag})`;
    tr.appendChild(state_td);

    const remove_td = document.createElement("td");
    remove_td.classList.add(
      "main-content__tbody-td",
      "main-content__tbody-td--remove"
    );
    remove_td.innerText = "X";
    remove_td.addEventListener("click", (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      this.removeCep(targetEl.parentElement!.id);
    });
    tr.appendChild(remove_td);

    this.tbodyTargetElement.appendChild(tr);
  }

  private toggleTableElements() {
    this.pTargetElement.classList.toggle("disable");
    this.tableTargetElement.classList.toggle("disable");
    this.actionsDisplayTargetElement.classList.toggle("disable");
  }
}

const ceps = new CepList();

function controlInput(e: Event) {
  const targetInput = e.target! as HTMLInputElement;

  let inputValue = normalizeString(targetInput.value.trim());

  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, -1);
  }

  targetInput.value = inputValue;
}

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
}

// events
header_inputText.addEventListener("input", controlInput);
header_form.addEventListener("submit", header_form_submitHandler);

(
  document.getElementById("main-content__deleteAll-btn") as HTMLButtonElement
).addEventListener("click", () => ceps.resetCeps());

actions_inputText.addEventListener("input", controlInput);
actions_form.addEventListener("submit", action_form_submitHandler);
