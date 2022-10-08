import { ICep } from "../models/cep";
import { IUpdatable } from "../models/updatable";
import { State } from "../store/State";

export class CepTable implements IUpdatable {
  private tableElement: HTMLTableElement;
  private tableMenuElement: HTMLDivElement;
  private deleteAllButtonElement: HTMLButtonElement;
  private tbodyElement: HTMLTableElement;
  private emptyParagraphTextElement: HTMLParagraphElement;
  private tableMenuIsVisible: boolean = false;

  constructor(
    table: HTMLTableElement,
    tableMenu: HTMLDivElement,
    deleteAllBtn: HTMLButtonElement,
    tableBody: HTMLTableElement,
    emptyText: HTMLParagraphElement,
    initialValues: ICep[]
  ) {
    this.tableElement = table;
    this.tableMenuElement = tableMenu;
    this.deleteAllButtonElement = deleteAllBtn;
    this.tbodyElement = tableBody;
    this.emptyParagraphTextElement = emptyText;

    if (initialValues.length > 0) {
      initialValues.forEach((item) => {
        this.render(item);
      });
      this.toggleMenuTableElements();
    }

    this.deleteAllButtonElement.addEventListener(
      "click",
      this.deleteAllCeps.bind(this)
    );

    this.tbodyElement.addEventListener("click", (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;

      if (targetEl.classList[1] !== "main-content__tbody-td--remove") return;

      State.getInstace().updateSlice<ICep[]>("ceps", (state) => {
        return state.filter((item) => item.cep !== targetEl.parentElement!.id);
      });
    });
  }

  update(items: ICep[]) {
    if (this.tableMenuIsVisible && items.length === 0) {
      this.toggleMenuTableElements();
    }

    if (!this.tableMenuIsVisible && items.length > 0) {
      this.toggleMenuTableElements();
    }

    this.resetTableData();
    items.forEach((item) => {
      this.render(item);
    });
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

  deleteAllCeps() {
    this.resetTableData();
    State.getInstace().updateSlice<ICep[]>("ceps", (_) => []);
  }

  private render(data: ICep) {
    this.tbodyElement.innerHTML += `<tr class="main-content__tbody-tr" id="${data.cep}">
      <td class="main-content__tbody-td">${data.cep}</td>
      <td class="main-content__tbody-td">${data.locality}</td>
      <td class="main-content__tbody-td">${data.district}</td>
      <td class="main-content__tbody-td">${data.state} (${data.stateTag})</td>
      <td class="main-content__tbody-td main-content__tbody-td--remove">X</td>
    </tr>
    `;
  }

  private toggleMenuTableElements() {
    this.tableMenuIsVisible = !this.tableMenuIsVisible;
    this.emptyParagraphTextElement.classList.toggle("disable");
    this.tableElement.classList.toggle("disable");
    this.tableMenuElement.classList.toggle("disable");
  }

  private resetTableData() {
    this.tbodyElement.innerHTML = "";
  }
}
