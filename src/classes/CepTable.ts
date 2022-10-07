import { ICep } from "../models/cep";
import { IUpdatable } from "../models/updatable";
import { State } from "../store/State";

export class CepTable implements IUpdatable {
  private tableElement: HTMLTableElement;
  private tableMenuElement: HTMLDivElement;
  private tbodyElement: HTMLTableElement;
  private emptyParagraphTextElement: HTMLParagraphElement;
  private tableMenuIsVisible: boolean = false;

  constructor(
    table: HTMLTableElement,
    tableMenu: HTMLDivElement,
    tableBody: HTMLTableElement,
    emptyText: HTMLParagraphElement,
    initialValues: ICep[]
  ) {
    this.tableElement = table;
    this.tableMenuElement = tableMenu;
    this.tbodyElement = tableBody;
    this.emptyParagraphTextElement = emptyText;

    if (initialValues.length > 0) {
      initialValues.forEach((item) => {
        this.render(item);
      });
      this.toggleMenuTableElements();
    }
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

  private render(data: ICep) {
    this.tbodyElement.innerHTML += `<tr class="main-content__tbody-tr" id="${data.cep}">
      <td class="main-content__tbody-td">${data.cep}</td>
      <td class="main-content__tbody-td">${data.locality}</td>
      <td class="main-content__tbody-td">${data.district}</td>
      <td class="main-content__tbody-td">${data.state} (${data.stateTag})</td>
      <td class="main-content__tbody-td main-content__tbody-td--remove" id="remove-${data.cep}" >X</td>
    </tr>
    `;

    const remove_td = document.getElementById(`remove-${data.cep}`)!;
    remove_td.addEventListener("click", () => {
      State.getInstace().updateSlice<ICep[]>("ceps", (s) => {
        return s.filter((item) => item.cep !== data.cep);
      });
    });
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
