var RPB = ((APP) => {

  const CONSTANTS = {
    SPREADSHEETS: {
      GENERAL: "https://docs.google.com/spreadsheets/d/1hVa7vtHCc7WGkf0idxU0j5YWX0eX0jzavMR5GncG-nU/edit#gid=0",
      MEDICAL: "https://docs.google.com/spreadsheets/d/1wjmRrkN9WVB4KIeKBy8wDDJ8E51Mh2-JxIBy2KNMFRQ/edit#gid=0",
      JURIDICAL: "https://docs.google.com/spreadsheets/d/1D7jo-tAyQkmfYvVyT27nZ93ZkyFcZg2vEvf4OMbXJ_c/edit#gid=0"
    },
    LANGUAGES: {}
  };

  let ELEMS = {
    TABLE: null
  };

  const DEFAULTS = {
    target: CONSTANTS.SPREADSHEETS.GENERAL,
    languages: ['C', 'D', 'E', 'F'],
    container: 'rpb-container'
  };

  let config = {};

  var APP = APP || {};

  let API = {};

  APP.getAvailableLanguages = () => {
    var query = new google.visualization.Query(CONSTANTS.SPREADSHEETS.GENERAL);
    query.setQuery('select * LIMIT 1 OFFSET 1');
    query.send(APP.processAvailableLanguages);
  };

  APP.processAvailableLanguages = (response) => {
    if (response.isError()) {
      console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    } else {
      var dataTable = response.getDataTable();

      // get all the values except the first two columns that don't hold language name
      for (let i = 2; i < dataTable.getNumberOfColumns(); i++) {
        CONSTANTS.LANGUAGES[dataTable.getColumnId(i)] = {id: dataTable.getColumnId(i), label: dataTable.getValue(0, i)};
      }
      // APP.createLanguageForm(dataTable);
      // APP.querySpreadsheet(config);
    }
  };

  APP.createLanguageForm = (dataTable) => {
    // remove loading status
    let elem = document.getElementById('langLoading');
    elem.parentNode.removeChild(elem);

    let langForm = document.getElementById('langForm');

    for (let i = 2; i < dataTable.getNumberOfColumns(); i++) {
      let langLabel = dataTable.getValue(0, i);
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
    updateButton.onclick = APP.updateQuery;
    updateButton.type = "button";
    updateButton.value = "Update Table";
    updateButton.innerHTML = "Update Table";
    langForm.appendChild(updateButton);
  };

  APP.updateQuery = () => {
    let query = "SELECT B";
    let selectedLanguages = document.getElementById("langForm").querySelectorAll('input[type="checkbox"]:checked');
    for (let i = 0; i < selectedLanguages.length; i++) {
      query += ", " + selectedLanguages[i].value;
    }

    query += " OFFSET 4";

    var theQuery = new google.visualization.Query(CONSTANTS.SPREADSHEETS.GENERAL);
    theQuery.setQuery(query);
    theQuery.send(APP.handleQueryResponse);
  };

  APP.querySpreadsheet = (config) => {
    let queryObject = new google.visualization.Query(config.target);
    let query = "SELECT B";
    for (let i = 0; i < config.languages.length; i++) {
      query += ", " + config.languages[i];
    }

    query += " OFFSET 4";

    queryObject.setQuery(query);
    queryObject.send(APP.handleQueryResponse);
  };

  APP.handleQueryResponse = (response) => {
    if (response.isError()) {
      console.error("Error in query: " + response.getMessage() + " " + response.getDetailedMessage());
    } else {

      let dataTable = response.getDataTable();

      // set the column names
      for (let i = 0; i < dataTable.getNumberOfColumns(); i++) {
        let columnId = dataTable.getColumnId(i);
        let language = CONSTANTS.LANGUAGES[columnId] ? CONSTANTS.LANGUAGES[columnId].label : "";
        dataTable.setColumnLabel(i, language);
      }

      dataTable.setColumnLabel(0, "PHRASE");

      APP.drawTable(new google.visualization.DataView(response.getDataTable()))
    }
  };

  APP.drawTable = (dataView) => {
    var table = new google.visualization.Table(ELEMS.TABLE);
    table.draw(dataView);
  };

  /**
   * Create the DOM structure for the app
   */
  APP.createDOM = (config) => {
    ELEMS.CONTAINER = document.getElementsByClassName(config.container)[0];

    APP.createSettingsButton();
    APP.createSettings();
    APP.createTableElems();
  };

  APP.createSettings = () => {
    ELEMS.SETTINGS = document.createElement("div");
    ELEMS.SETTINGS.classList.add("rpb-settings-container");
    ELEMS.CONTAINER.appendChild(ELEMS.SETTINGS);
  };

  APP.createSettingsButton = () => {
    let settingsButton = document.createElement("input");
    settingsButton.onclick = APP.showSettings;
    settingsButton.type = "button";
    settingsButton.value = "Settings";
    settingsButton.classList.add("btn");
    settingsButton.classList.add("rpb-settings-btn");
    ELEMS.CONTAINER.appendChild(settingsButton);
  };

  APP.showSettings = () => {
    ELEMS.TABLE.classList.toggle("hidden");
    ELEMS.SETTINGS.classList.toggle("hidden");
  };

  APP.createTableElems = () => {
    ELEMS.TABLE = document.createElement("div");
    ELEMS.TABLE.classList.add("rpb-table");
    ELEMS.CONTAINER.appendChild(ELEMS.TABLE);
  };

  /**
   * Starting point for the module
   */
  APP.initialize = () => {
    // get provided defaults or the general defaults
    APP.config = APP.CONFIG || DEFAULTS;

    APP.createDOM(APP.config);
    APP.getAvailableLanguages();
    APP.querySpreadsheet(APP.config);
  };

  window.onload = () => {
    APP.initialize();
  };
})(RPB || {});

