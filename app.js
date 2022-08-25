const header_cep_input = document.querySelector("#main-header__input-cep");
const header_btn_submit = document.querySelector("#main-header__submit-btn");

const endpoint = "https://viacep.com.br/ws/enteredCep/json/"

// cep data manipulation functions
async function getCep(cep) {
  const response = await fetch(endpoint.replace("enteredCep", cep));

  if (!response.ok) {
    alert("Não foi possível fazer a busca do CEP, tente novamente mais tarde...");
    return;
  }

  const data = await response.json();
  
  if(data.erro === "true") {
    alert("CEP inexistente, busque por outro cep ou confira se há erro no existente.");
    return;
  }

  const newCep = {
    cep:  data.cep,
    district: data.bairro,
    locality: data.localidade,
    state: data.uf,
  };
  
  return newCep;
}

// reusable functions
function normalizeString(str) {
  return str.replace(/\D/g, '');
}

// header input control
header_cep_input.addEventListener("keyup", function(e) {
  let inputValue = normalizeString(e.target.value.trim());

  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, -1);
  }

  header_cep_input.value = inputValue;
});

header_btn_submit.addEventListener("click", function() {
  const currentInputValue = header_cep_input.value;

  if (currentInputValue.length !== 8) {
    alert("Por favor, insira um cep válido: 8 números e sem caracteres especiais.");
    return;
  }

  getCep(currentInputValue);
});

