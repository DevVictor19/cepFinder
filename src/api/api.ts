namespace App {
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

  export const api = new Api();
}
