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
  }

  createCepRowElement(cep_data: ICep) {
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

    this.tbodyTargetElement.appendChild(tr);
  }

  toggleTableElements() {
    this.pTargetElement.classList.toggle("disable");
    this.tableTargetElement.classList.toggle("disable");
    this.actionsDisplayTargetElement.classList.toggle("disable");
  }
}

const header__form = document.querySelector(
  ".main-header__form"
) as HTMLFormElement;

header__form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const cep_input = document.getElementById(
    "main-header__input-cep"
  ) as HTMLInputElement;

  const api = new Api();
  const cepList = new CepList();

  api.findCep(cep_input.value).then((response) => {
    if (response != null) {
      cepList.createCepRowElement(response);
    }
  });
});
