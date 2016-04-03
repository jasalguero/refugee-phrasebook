const DATA_SOURCE_URL = "https://docs.google.com/spreadsheets/d/1hVa7vtHCc7WGkf0idxU0j5YWX0eX0jzavMR5GncG-nU/edit#gid=0";

const DEFAULT = {

};

let CONFIG = {
  LANGUAGES: {}
};

let getAvailableLanguages = () => {
  var query = new google.visualization.Query(DATA_SOURCE_URL);
  query.setQuery('select * LIMIT 1 OFFSET 1');
  query.send(processAvailableLanguages);
};

let processAvailableLanguages = (response) => {
  if (response.isError()) {
    console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
  } else {
    var dataTable = response.getDataTable();

    // get all the values except the first two columns that don't hold language name
    for(let i = 2; i < dataTable.getNumberOfColumns(); i ++) {
      CONFIG.LANGUAGES[dataTable.getColumnId(i)] = {id: dataTable.getColumnId(i), label: dataTable.getValue(0,i)};
    }
    createLanguageForm(dataTable);
    querySpreadsheet();
  }
};

let createLanguageForm = (dataTable) => {
  // remove loading status
  let elem = document.getElementById('langLoading');
  elem.parentNode.removeChild(elem);

  let langForm = document.getElementById('langForm');

  for(let i = 2; i < dataTable.getNumberOfColumns(); i ++) {
    let langLabel = dataTable.getValue(0,i);
    let langId = dataTable.getColumnId(i);

    let wrapper = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("span");

    input.type = "checkbox";
    input.value = langId;
    label.innerHTML = langLabel;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    langForm.appendChild(wrapper);
  }

  let updateButton = document.createElement("input");
  updateButton.onclick = updateQuery;
  updateButton.type = "button";
  updateButton.value = "Update Table";
  updateButton.innerHTML = "Update Table";
  langForm.appendChild(updateButton);
};

let updateQuery = () => {
  let query = "SELECT B";
  let  selectedLanguages = document.getElementById('langForm').querySelectorAll('input[type="checkbox"]:checked');
  for (let i = 0; i < selectedLanguages.length; i++) {
    query += ", " + selectedLanguages[i].value;
  }

  query += " OFFSET 4";

  var theQuery = new google.visualization.Query(DATA_SOURCE_URL);
  theQuery.setQuery(query);
  console.log(query);
  theQuery.send(handleQueryResponse);
};




let querySpreadsheet = (config) => {
  var query = new google.visualization.Query(DATA_SOURCE_URL);
  query.setQuery('SELECT B, C, D, E, F OFFSET 4');
  query.send(handleQueryResponse);
};

let handleQueryResponse = (response) => {
  if (response.isError()) {
    console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
  } else {

    let dataTable = response.getDataTable();

    // set the column names
    for(let i = 0; i < dataTable.getNumberOfColumns(); i ++) {
      let columnId = dataTable.getColumnId(i);
      let language = CONFIG.LANGUAGES[columnId] ? CONFIG.LANGUAGES[columnId].label : "";
      dataTable.setColumnLabel(i, language);
    }

    dataTable.setColumnLabel(0, 'PHRASE');

    drawTable(new google.visualization.DataView(response.getDataTable()))
  }
};

let drawTable = (dataView) => {
  var table = new google.visualization.Table(document.getElementById('output'));


  table.draw(dataView);
};

window.onload = () => {
  getAvailableLanguages();
};

