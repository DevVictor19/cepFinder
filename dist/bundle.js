"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var App;
(function (App) {
    class AppStorage {
        constructor(storageName) {
            this.storageName = storageName;
        }
        insertNewLocalItem(newItem) {
            localStorage.setItem(this.storageName, JSON.stringify([...this.localItems, newItem]));
        }
        get localItems() {
            return JSON.parse(localStorage.getItem(this.storageName));
        }
        set localItems(newItems) {
            localStorage.setItem(this.storageName, JSON.stringify(newItems));
        }
    }
    App.cepStorage = new AppStorage("ceps");
})(App || (App = {}));
var App;
(function (App) {
    class CepList {
        constructor() {
            this.tableTargetElement = document.querySelector(".main-content__table");
            this.tbodyTargetElement = document.getElementById("main-content__tbody");
            this.pTargetElement = document.querySelector(".main-content__text");
            this.actionsDisplayTargetElement = document.querySelector(".main-content__actions");
            if (App.cepStorage.localItems.length > 0) {
                this.render(App.cepStorage.localItems);
                this.toggleTableElements();
            }
        }
        addNewCep(newCep) {
            if (App.cepStorage.localItems.length === 0) {
                this.toggleTableElements();
            }
            this.createCepRowElement(newCep);
            App.cepStorage.insertNewLocalItem(newCep);
        }
        resetCeps() {
            App.cepStorage.localItems = [];
            this.toggleTableElements();
        }
        goToCep(cep) {
            document.getElementById(cep).scrollIntoView({
                behavior: "smooth",
            });
        }
        focusCep(cep) {
            const cepEl = document.getElementById(cep);
            cepEl.classList.add("focus");
            setTimeout(() => {
                cepEl.classList.remove("focus");
            }, 3000);
        }
        render(ceps) {
            for (let cep of ceps) {
                this.createCepRowElement(cep);
            }
        }
        removeCep(cep) {
            this.tbodyTargetElement.removeChild(document.getElementById(cep));
            const newCeps = App.cepStorage.localItems.filter((cep_object) => cep_object.cep !== cep);
            if (newCeps.length === 0) {
                this.toggleTableElements();
            }
            App.cepStorage.localItems = newCeps;
        }
        createCepRowElement(cep_data) {
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
            remove_td.classList.add("main-content__tbody-td", "main-content__tbody-td--remove");
            remove_td.innerText = "X";
            remove_td.addEventListener("click", (e) => {
                const targetEl = e.target;
                this.removeCep(targetEl.parentElement.id);
            });
            tr.appendChild(remove_td);
            this.tbodyTargetElement.appendChild(tr);
        }
        toggleTableElements() {
            this.pTargetElement.classList.toggle("disable");
            this.tableTargetElement.classList.toggle("disable");
            this.actionsDisplayTargetElement.classList.toggle("disable");
        }
    }
    App.CepList = CepList;
})(App || (App = {}));
var App;
(function (App) {
    class Api {
        constructor() {
            this.endpoint = "https://viacep.com.br/ws/enteredCep/json/";
        }
        findCep(cep) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch(this.endpoint.replace("enteredCep", cep));
                if (!response.ok) {
                    alert("Não foi possível fazer a busca do CEP, tente novamente mais tarde...");
                    return;
                }
                const data = yield response.json();
                if (data.erro === "true") {
                    alert("CEP inexistente, busque por outro cep ou confira se há erro no existente.");
                    return;
                }
                const newCep = {
                    cep: App.normalizeString(data.cep),
                    district: data.bairro,
                    locality: data.logradouro,
                    state: data.localidade,
                    stateTag: data.uf,
                };
                return newCep;
            });
        }
    }
    App.api = new Api();
})(App || (App = {}));
var App;
(function (App) {
    function normalizeString(str) {
        return str.replace(/\D/g, "");
    }
    App.normalizeString = normalizeString;
})(App || (App = {}));
var App;
(function (App) {
    function controlInput(e) {
        const targetInput = e.target;
        let inputValue = App.normalizeString(targetInput.value.trim());
        if (inputValue.length > 8) {
            inputValue = inputValue.slice(0, -1);
        }
        targetInput.value = inputValue;
    }
    App.controlInput = controlInput;
})(App || (App = {}));
var App;
(function (App) {
    const ceps = new App.CepList();
    const header_inputText = document.getElementById("main-header__input-cep");
    const header_form = document.querySelector(".main-header__form");
    const actions_inputText = document.getElementById("main-content__actions-input");
    const actions_form = document.querySelector(".main-content__actions-form");
    function header_form_submitHandler(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            if (header_inputText.value.length !== 8) {
                alert("Insira um cep válido! Um cep deve conter 8 digitos");
                return;
            }
            if (App.cepStorage.localItems.find((item) => item.cep === header_inputText.value)) {
                ceps.goToCep(header_inputText.value);
                ceps.focusCep(header_inputText.value);
                alert("Cep já pesquisado, verifique na lista");
                return;
            }
            const newCep = yield App.api.findCep(header_inputText.value);
            if (!newCep) {
                alert("Algo deu errado... tente novamente.");
                return;
            }
            ceps.addNewCep(newCep);
            ceps.goToCep(newCep.cep);
            ceps.focusCep(newCep.cep);
            header_inputText.value = "";
        });
    }
    function action_form_submitHandler(e) {
        e.preventDefault();
        if (actions_inputText.value.length !== 8) {
            alert("Insira um cep válido! Um cep deve conter 8 digitos");
            return;
        }
        if (!App.cepStorage.localItems.find((item) => item.cep === actions_inputText.value)) {
            alert("Cep não existe na lista, pesquise na barra superior.");
            return;
        }
        ceps.goToCep(actions_inputText.value);
        ceps.focusCep(actions_inputText.value);
        actions_inputText.value = "";
    }
    header_inputText.addEventListener("input", App.controlInput);
    header_form.addEventListener("submit", header_form_submitHandler);
    document.getElementById("main-content__deleteAll-btn").addEventListener("click", () => ceps.resetCeps());
    actions_inputText.addEventListener("input", App.controlInput);
    actions_form.addEventListener("submit", action_form_submitHandler);
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map