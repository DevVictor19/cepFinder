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
    getCep(cep) {
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
class CepList extends Api {
    fetchCep(cep) {
        this.getCep(cep).then((response) => console.log(response));
    }
}
const cep_list = new CepList();
cep_list.fetchCep("41635210");
//# sourceMappingURL=app.js.map