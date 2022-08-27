const header_cep_input = document.querySelector("#main-header__input-cep");
const header_btn_submit = document.querySelector("#main-header__submit-btn");
const list_cep_input = document.querySelector("#main-content__actions-input");
const list_btn_submit = document.querySelector("#main-content__actions-btn");

const endpoint = "https://viacep.com.br/ws/enteredCep/json/"

window.onload = renderAllCeps;

// reusable functions
function normalizeString(str) {
  return str.replace(/\D/g, '');
};

function toggleMainContent() {
  document.querySelector(".main-content__text").classList.toggle("disable");
  document.querySelector(".main-content__table").classList.toggle("disable");
  document.querySelector(".main-content__actions").classList.toggle("disable");
};

function controlInput(e, targetInput) {
  let inputValue = normalizeString(e.target.value.trim());

  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, -1);
  }

  targetInput.value = inputValue;
};

function goToCep(cep) {
  const currentCepItem = document.getElementById(cep);

  currentCepItem.scrollIntoView({behavior: 'smooth'});
};

function blurCep(cep) {
  const currentCepItem = document.getElementById(cep);

  currentCepItem.classList.add('focus');

  setTimeout(() => {
    currentCepItem.classList.remove('focus');
  }, 3000);
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
};

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
    
    deleteCep(cep);

    if (JSON.parse(localStorage.getItem("ceps")).length === 0) toggleMainContent();
  });
  tr.appendChild(remove_td);

  tbody.appendChild(tr);
};

function cepExists(cep) {
  const localCeps = JSON.parse(localStorage.getItem("ceps"));

  return !!localCeps?.find(cepData => cepData.cep === cep);
};

function deleteCep(cep) {
  const newLocalCeps = 
    JSON.parse(localStorage.getItem("ceps"))
    .filter(obj => obj.cep !== cep);

  localStorage.setItem("ceps", JSON.stringify(newLocalCeps));
};

function deleteAllCeps() {
  localStorage.setItem("ceps", JSON.stringify([]));
};

function renderAllCeps() {
  const localCeps  = JSON.parse(localStorage.getItem("ceps"));
  if(!localCeps || localCeps.length === 0) return;

  toggleMainContent();

  localCeps.forEach(cepData => {
    createCep(cepData);
  });
};

// header input control
async function header_handleSubmit() {
  const currentInputValue = header_cep_input.value;

  if (currentInputValue.length !== 8) {
    alert("Por favor, insira um cep válido: 8 números e sem caracteres especiais.");
    return;
  }

  if (cepExists(currentInputValue)) {
    alert("CEP já pesquisado. Iremos te mostrar o cep destacando-o na lista.");
    goToCep(currentInputValue);
    blurCep(currentInputValue);
    return;
  }

  const newCep = await getCep(currentInputValue);
  if(!newCep) return;
  
  createCep(newCep);
  
  const localCeps  = JSON.parse(localStorage.getItem("ceps"));

  if(!localCeps || localCeps.length === 0) {
    toggleMainContent();
    localStorage.setItem("ceps", JSON.stringify([newCep]));
  } else {
    const updatedLocalCeps = [...localCeps, newCep];
    localStorage.setItem("ceps", JSON.stringify(updatedLocalCeps));
  }

  goToCep(currentInputValue);
  blurCep(currentInputValue);
}

// list input control 
function list_handleSubmit() {
  const currentInputValue = list_cep_input.value;

  if (currentInputValue.length !== 8) {
    alert("Por favor, insira um cep válido: 8 números e sem caracteres especiais.");
    return;
  }

  if(!cepExists(currentInputValue)) {
    alert("Cep não foi encontrado na lista. Tente buscar por esse CEP no canto superior direito.");
    return;
  }

  goToCep(currentInputValue);
  blurCep(currentInputValue);
}

//event listeners
header_cep_input.addEventListener("input", (e) => controlInput(e, header_cep_input));
header_btn_submit.addEventListener("click", header_handleSubmit);

document.querySelector("#main-content__deleteAll-btn")
  .addEventListener("click", () => {
    document.querySelector("#main-content__tbody").innerHTML = "";
    deleteAllCeps();
    toggleMainContent();
  });

list_cep_input.addEventListener("input", (e) => controlInput(e, list_cep_input));
list_btn_submit.addEventListener("click", list_handleSubmit);