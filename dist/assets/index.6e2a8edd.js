var _=Object.defineProperty;var v=(n,e,t)=>e in n?_(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var i=(n,e,t)=>(v(n,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();function b(n){return n.replace(/\D/g,"")}function f(n){const e=n.target;let t=b(e.value.trim());t.length>8&&(t=t.slice(0,-1)),e.value=t}class E{constructor(e,t){i(this,"formElement");i(this,"inputElements",{});this.formElement=e,this.inputElements=t}addInputControlHandler(e,t,o){this.inputElements[e].addEventListener(t,o)}addSubmitHandler(e){this.formElement.addEventListener("submit",e)}}class w{constructor(e){this.apiUrl=e,this.apiUrl=e}async get(e){try{const t=await fetch(this.apiUrl+e);if(!t.ok)throw new Error("something went wrong...");return await t.json()}catch(t){console.log(t)}}}class C{constructor(e){this.localStorageName=e,localStorage.getItem(this.localStorageName)||localStorage.setItem(this.localStorageName,JSON.stringify([]))}get items(){return JSON.parse(localStorage.getItem(this.localStorageName))}update(e){localStorage.setItem(this.localStorageName,JSON.stringify(e))}reset(){localStorage.setItem(this.localStorageName,JSON.stringify([]))}}const c=class{constructor(){i(this,"slices",{});i(this,"subscribers",{})}static getInstace(){return c.instance||(c.instance=new c),c.instance}createSlice(e,t){this.slices[e]&&this.dispatchError("createSlice: you are trying to create an existing slice in state"),this.slices={...this.slices,[e]:t},this.subscribers[e]=[]}updateSlice(e,t){this.slices[e]||this.dispatchError("updateSlice: slice name does not match with any slice in state"),this.slices[e]=t(this.slices[e]),this.subscribers[e].length>0&&this.dispatchUpdateFor(e)}addSubscribe(e,t){this.subscribers[e]||this.dispatchError("subscribe: the slice was not initialized for assing subscribers"),this.subscribers[e]=[...this.subscribers[e],t]}getState(e){return e(this.slices)}dispatchError(e){throw new Error(e)}dispatchUpdateFor(e){this.subscribers[e].forEach(t=>{t.update(this.slices[e])})}};let u=c;i(u,"instance");class L{constructor(e,t,o,s,r,a){i(this,"tableElement");i(this,"tableMenuElement");i(this,"deleteAllButtonElement");i(this,"tbodyElement");i(this,"emptyParagraphTextElement");i(this,"tableMenuIsVisible",!1);this.tableElement=e,this.tableMenuElement=t,this.deleteAllButtonElement=o,this.tbodyElement=s,this.emptyParagraphTextElement=r,a.length>0&&(a.forEach(h=>{this.render(h)}),this.toggleMenuTableElements()),this.deleteAllButtonElement.addEventListener("click",this.deleteAllCeps.bind(this)),this.tbodyElement.addEventListener("click",h=>{const g=h.target;g.classList[1]==="main-content__tbody-td--remove"&&u.getInstace().updateSlice("ceps",S=>S.filter(I=>I.cep!==g.parentElement.id))})}update(e){!this.tableMenuIsVisible&&e.length>0&&this.toggleMenuTableElements(),this.resetTableData(),e.forEach(t=>{this.render(t)})}goToCep(e){document.getElementById(e).scrollIntoView({behavior:"smooth"})}focusCep(e){const t=document.getElementById(e);t.classList.add("focus"),setTimeout(()=>{t.classList.remove("focus")},3e3)}deleteAllCeps(){this.resetTableData(),this.toggleMenuTableElements(),u.getInstace().updateSlice("ceps",e=>[])}render(e){this.tbodyElement.innerHTML+=`<tr class="main-content__tbody-tr" id="${e.cep}">
      <td class="main-content__tbody-td">${e.cep}</td>
      <td class="main-content__tbody-td">${e.locality}</td>
      <td class="main-content__tbody-td">${e.district}</td>
      <td class="main-content__tbody-td">${e.state} (${e.stateTag})</td>
      <td class="main-content__tbody-td main-content__tbody-td--remove">X</td>
    </tr>
    `}toggleMenuTableElements(){this.tableMenuIsVisible=!this.tableMenuIsVisible,this.emptyParagraphTextElement.classList.toggle("disable"),this.tableElement.classList.toggle("disable"),this.tableMenuElement.classList.toggle("disable")}resetTableData(){this.tbodyElement.innerHTML=""}}const l=u.getInstace(),y=new C("ceps"),T=new w("https://viacep.com.br/ws/");l.createSlice("ceps",y.items);l.addSubscribe("ceps",y);const d=new L(document.querySelector(".main-content__table"),document.querySelector(".main-content__actions"),document.getElementById("main-content__deleteAll-btn"),document.getElementById("main-content__tbody"),document.querySelector(".main-content__text"),l.getState(n=>n.ceps));l.addSubscribe("ceps",d);const p=new E(document.querySelector(".main-header__form"),{cepInput:document.getElementById("main-header__input-cep")});p.addInputControlHandler("cepInput","input",f);p.addSubmitHandler(x);async function x(n){n.preventDefault();const e=p.inputElements.cepInput.value;if(e.length!==8){alert("Insira um cep v\xE1lido! Deve ser composto apenas 8 n\xFAmeros");return}if(l.getState(t=>t.ceps).find(t=>t.cep===e)){alert("Cep j\xE1 pesquisado, verifique na lista");return}try{const t=await T.get(`${e}/json`);if(t.erro==="true"){alert("Cep n\xE3o encontrado, tente outra vez");return}if(!t)throw new Error("did not get values");const o={cep:b(t.cep),district:t.bairro,locality:t.logradouro,state:t.localidade,stateTag:t.uf};l.updateSlice("ceps",s=>[...s,o]),d.goToCep(e),d.focusCep(e),p.inputElements.cepInput.value=""}catch(t){console.log(t)}}const m=new E(document.querySelector(".main-content__actions-form"),{tableSearchInput:document.getElementById("main-content__actions-input")});m.addInputControlHandler("tableSearchInput","input",M);m.addSubmitHandler(N);function M(n){f(n);const e=n.target.value,o=l.getState(s=>s.ceps).filter(s=>s.cep.indexOf(e)>-1);d.update(o)}function N(n){n.preventDefault();const e=m.inputElements.tableSearchInput.value;if(e.length!==8){alert("Insira um cep v\xE1lido! Deve ser composto apenas 8 n\xFAmeros");return}if(!document.getElementById(e)){alert("Cep n\xE3o existe na lista");return}d.goToCep(e),d.focusCep(e),m.inputElements.tableSearchInput.value=""}
