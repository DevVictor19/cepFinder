const header_cep_input = document.querySelector("#main-header__input-cep");
const header_btn_submit = document.querySelector("#main-header__submit-btn");

const endpoint = "https://viacep.com.br/ws/enteredCep/json/"

// reusable functions
function normalizeString(str) {
  return str.replace(/\D/g, '');
}

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
  
  console.log(newCep);

  return newCep;
}

// header input control
function header_handleKeyPress(e) {
  let inputValue = normalizeString(e.target.value.trim());

  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, -1);
  }

  header_cep_input.value = inputValue;
}

function header_handleSubmit() {
  const currentInputValue = header_cep_input.value;

  if (currentInputValue.length !== 8) {
    alert("Por favor, insira um cep válido: 8 números e sem caracteres especiais.");
    return;
  }

  getCep(currentInputValue);
}

//event listeners
header_cep_input.addEventListener("keyup", header_handleKeyPress);
header_btn_submit.addEventListener("click", header_handleSubmit);
