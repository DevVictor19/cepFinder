const header_cep_input = document.querySelector("#main-header__input-cep");
const header_btn_submit = document.querySelector("#main-header__submit-btn");

const endpoint = "https://viacep.com.br/ws/enteredCep/json/"

// reusable functions
function normalizeString(str) {
  return str.replace(/\D/g, '');
}

function toggleMainContent() {
  document.querySelector(".main-content__text").classList.toggle("disable");
  document.querySelector(".main-content__table").classList.toggle("disable");
  document.querySelector(".main-content__actions").classList.toggle("disable");
};

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
    cep: normalizeString(data.cep),
    district: data.bairro,
    locality: data.logradouro,
    state: data.localidade,
    stateTag: data.uf,
  };
  
  return newCep;
}

function createCep(cep_data) {
  const {cep, locality, district, stateTag, state} = cep_data;
  const tbody = document.querySelector("#main-content__tbody");

  const tr = document.createElement('tr');
  tr.classList.add('main-content__tbody-tr');
  tr.setAttribute("id", cep);

  const cep_td = document.createElement('td');
  cep_td.classList.add('main-content__tbody-td');
  cep_td.innerText = cep;
  tr.appendChild(cep_td);

  const locality_td = document.createElement('td');
  locality_td.classList.add('main-content__tbody-td');
  locality_td.innerText = locality;
  tr.appendChild(locality_td);
  
  const district_td = document.createElement('td');
  district_td.classList.add('main-content__tbody-td');
  district_td.innerText = district;
  tr.appendChild(district_td);

  const state_td = document.createElement('td');
  state_td.classList.add('main-content__tbody-td');
  state_td.innerText = `${state} (${stateTag})`;
  tr.appendChild(state_td);

  const remove_td = document.createElement('td');
  remove_td.classList.add('main-content__tbody-td','main-content__tbody-td--remove');
  remove_td.innerText = "X";
  remove_td.addEventListener("click", (e) => {
    tbody.removeChild(e.target.parentElement);
  });
  tr.appendChild(remove_td);

  tbody.appendChild(tr);
};

function cepExists(cep) {
  const localCeps = JSON.parse(localStorage.getItem("ceps"));

  return !!localCeps.find(cepData => cepData.cep === cep);
};

window.onload = () => {
  const localCeps  = JSON.parse(localStorage.getItem("ceps"))
  if(!localCeps) return;

  toggleMainContent();

  localCeps.forEach(cepData => {
    createCep(cepData);
  });
};

// header input control
function header_handleKeyPress(e) {
  let inputValue = normalizeString(e.target.value.trim());

  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, -1);
  }

  header_cep_input.value = inputValue;
}

async function header_handleSubmit() {
  const currentInputValue = header_cep_input.value;

  if (currentInputValue.length !== 8) {
    alert("Por favor, insira um cep válido: 8 números e sem caracteres especiais.");
    return;
  }

  if (cepExists(currentInputValue)) {
    alert("Esse cep já foi pesquisado, verifique na lista");
    return;
  }

  const newCep = await getCep(currentInputValue);
  if(!newCep) return;
  
  createCep(newCep);
  
  const localCeps  = JSON.parse(localStorage.getItem("ceps"));

  if(localCeps) {
    const updatedLocalCeps = [...localCeps, newCep];
    localStorage.setItem("ceps", JSON.stringify(updatedLocalCeps));
  } else {
    toggleMainContent();
    localStorage.setItem("ceps", JSON.stringify([newCep]));
  }
}

//event listeners
header_cep_input.addEventListener("keyup", header_handleKeyPress);
header_btn_submit.addEventListener("click", header_handleSubmit);
