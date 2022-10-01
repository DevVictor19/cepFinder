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
                cep: data.cep,
                district: data.bairro,
                locality: data.logradouro,
                state: data.localidade,
                stateTag: data.uf,
            };
            return newCep;
        });
    }
}
const DUMMY_CEPS = [
    {
        cep: "416350",
        district: "ba",
        state: "teste",
        locality: "teste",
        stateTag: "teste",
    },
    {
        cep: "416250",
        district: "ba",
        state: "teste",
        locality: "teste",
        stateTag: "teste",
    },
    {
        cep: "413350",
        district: "ba",
        state: "teste",
        locality: "teste",
        stateTag: "teste",
    },
    {
        cep: "416150",
        district: "ba",
        state: "teste",
        locality: "teste",
        stateTag: "teste",
    },
    {
        cep: "419350",
        district: "ba",
        state: "teste",
        locality: "teste",
        stateTag: "teste",
    },
];
class CepList {
    constructor() {
        this.tableTargetElement = document.querySelector(".main-content__table");
        this.tbodyTargetElement = document.getElementById("main-content__tbody");
        this.pTargetElement = document.querySelector(".main-content__text");
        this.actionsDisplayTargetElement = document.querySelector(".main-content__actions");
        this.currentCeps = DUMMY_CEPS;
        if (this.currentCeps.length > 0) {
            this.renderAllCeps();
            this.toggleTableElements();
        }
    }
    renderAllCeps() {
        for (let cep of this.currentCeps) {
            this.createCepRowElement(cep);
        }
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
        this.tbodyTargetElement.appendChild(tr);
    }
    toggleTableElements() {
        this.pTargetElement.classList.toggle("disable");
        this.tableTargetElement.classList.toggle("disable");
        this.actionsDisplayTargetElement.classList.toggle("disable");
    }
}
const ceps = new CepList();
//# sourceMappingURL=app.js.map