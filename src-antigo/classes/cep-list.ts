import { cepStorage } from "../store/app-storage";
import { ICep } from "../models/cep";

export class CepList {
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

  private removeCep(cep: string) {
    this.tbodyTargetElement.removeChild(document.getElementById(cep)!);

    const newCeps = cepStorage.localItems.filter(
      (cep_object) => cep_object.cep !== cep
    );

    if (newCeps.length === 0) {
      this.toggleTableElements();
    }

    cepStorage.localItems = newCeps;
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
