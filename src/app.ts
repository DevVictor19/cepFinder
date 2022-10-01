interface ICep {
  cep: string;
  district: string;
  locality: string;
  state: string;
  stateTag: string;
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
      cep: data.cep,
      district: data.bairro,
      locality: data.logradouro,
      state: data.localidade,
      stateTag: data.uf,
    };

    return newCep;
  }
}

abstract class AppStorage<T> {
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

class CepList extends AppStorage<ICep> {
  private tableTargetElement: HTMLTableElement;
  private tbodyTargetElement: HTMLTableElement;
  private pTargetElement: HTMLParagraphElement;
  private actionsDisplayTargetElement: HTMLDivElement;

  constructor() {
    super("ceps");

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

    if (this.localItems.length > 0) {
      this.render(this.localItems);
      this.toggleTableElements();
    }
  }

  addNewCep(newCep: ICep) {
    if (this.localItems.length === 0) {
      this.toggleTableElements();
    }
    this.createCepRowElement(newCep);
    this.insertNewLocalItem(newCep);
  }

  removeCep(cep: string) {
    this.tbodyTargetElement.removeChild(document.getElementById(cep)!);
    const newCeps = this.localItems.filter(
      (cep_object) => cep_object.cep !== cep
    );
    this.localItems = newCeps;
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
const api = new Api();

const handleHeaderInputSubmits = async (event: SubmitEvent) => {
  event.preventDefault();

  const headerInput = document.getElementById(
    "main-header__input-cep"
  ) as HTMLInputElement;

  const newCep = await api.findCep(headerInput.value);

  if (newCep) {
    ceps.addNewCep(newCep);
  }
};

const headerForm = <HTMLFormElement>(
  document.querySelector(".main-header__form")
);

headerForm.addEventListener("submit", handleHeaderInputSubmits);
