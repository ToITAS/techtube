//const fileElem = document.querySelector(".file-input");
//const annet = document.querySelector("#annet");
const temaDropdownElem = document.querySelector("#tema");
var temaer;
const temaDropdownItems = [];
//var urlHome = "http://192.168.1.143";
var urlHome = window.location.protocol + "//" + window.location.host;
const emneknaggerElem = document.querySelector("#emneknagger");

const moduleVelgerDropdownElem = document.querySelector("#moduleVelger");
const moduleVelgerDropdownItems = [
  "Undertittel",
  "Brødtekst",
  "Kodeblokk",
  "Bilde url",
];

const nameDropdownElem = document.querySelector("#navn");
var brukere;
const nameDropdownItems = [];
const modulesElem = document.querySelector(".modules");

var currId = 0;

window.onload = async () => {
  const response = await fetch(urlHome + "/api/brukere", {
    mode: "no-cors",
  }).then((res) => res.json());

  brukere = response;

  brukere?.forEach((user) => {
    nameDropdownItems.push(user.brukernavn);
  });

  const temaRes = await fetch(urlHome + "/api/tema", { mode: "no-cors" }).then(
    (res) => res.json()
  );

  temaer = temaRes;

  temaer?.forEach((tema) => {
    temaDropdownItems.push(tema.navn);
  });

  temaDropdownItems.forEach((item) => {
    const newItem = document.createElement("Option");
    newItem.value = item;
    newItem.innerHTML = item;
    temaDropdownElem.appendChild(newItem);
  });

  nameDropdownItems.forEach((item) => {
    const newItem = document.createElement("Option");
    newItem.value = item;
    newItem.innerHTML = item;
    nameDropdownElem.appendChild(newItem);
  });

  moduleVelgerDropdownItems.forEach((item) => {
    const newItem = document.createElement("Option");
    newItem.value = item;
    newItem.innerHTML = item;
    moduleVelgerDropdownElem.appendChild(newItem);
  });
};

async function onSend() {
  const brukernavn = document.querySelector("#navn").value;
  var brukerId;
  brukere.forEach((bruker) => {
    if (bruker.brukernavn == brukernavn) brukerId = bruker.bruker_id;
  });

  const selectedTema = document.querySelector("#tema").value;
  var temaId;
  temaer.forEach((tema) => {
    if (tema.navn == selectedTema) temaId = tema.tema_id;
  });

  var moduler = [];

  const moduleElems = [...modulesElem.children].forEach((item) => {
    moduler.push({
      type: item.classList[1],
      tekst: [...item.children][0].value,
    });
  });

  const knagger = emneknaggerElem.value.split(",");

  const newArticle = {
    tittel: document.querySelector("#tittelInput").value,
    temaId,
    lagtTilAvId: brukerId,
    moduler,
    emneknagger: knagger,
  };

  const response = await fetch(urlHome + "/api/artikler/ny", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newArticle),
  });

  if (response.status == 200) {
    const responseJson = await response.json();
    window.location = `/artikler/${responseJson.articleId}`;
  }
}

function removeModule(moduleId) {
  try {
    console.log(moduleId);
    document.querySelector("#module-" + moduleId).remove();
  } catch (err) {
    console.log(err);
  }
}

function addModuleClicked() {
  const selectedModule = moduleVelgerDropdownElem.value;
  addModule(selectedModule.toLowerCase());
}

function addModule(type) {
  if (type == "module velger") return;
  const moduleElem = document.createElement("div");
  moduleElem.id = `module-${currId}`;
  moduleElem.classList = "module " + type;

  const moduleText = document.createElement("textarea");
  moduleText.style.width = "100%";
  moduleText.placeholder = type;
  moduleElem.appendChild(moduleText);

  const delButton = document.createElement("button");
  delButton.innerHTML = "&#10134";
  delButton.style.width = "100%";

  const moduleId = currId;
  delButton.onclick = () => removeModule(moduleId);

  moduleElem.appendChild(delButton);
  moduleElem.appendChild(document.createComment("br"));

  modulesElem.appendChild(moduleElem);
  currId++;
}
