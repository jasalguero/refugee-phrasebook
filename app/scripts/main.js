// Self executable function that will initialize the app
(() => {

  // Here will be the HTML structured from index.html so it can be inserted
  const SettingsMenuHtml = ``;

  const CONSTANTS = {
    // Target spreadsheets
    SPREADSHEETS: {
      GENERAL: 'https://docs.google.com/spreadsheets/d/1hVa7vtHCc7WGkf0idxU0j5YWX0eX0jzavMR5GncG-nU/edit#gid=0',
      MEDICAL: 'https://docs.google.com/spreadsheets/d/1wjmRrkN9WVB4KIeKBy8wDDJ8E51Mh2-JxIBy2KNMFRQ/edit#gid=0',
      JURIDICAL: 'https://docs.google.com/spreadsheets/d/1D7jo-tAyQkmfYvVyT27nZ93ZkyFcZg2vEvf4OMbXJ_c/edit#gid=0'
    },
    // List of available languages for the queries
    // LANGUAGES: {}

    // TODO: list of languages

    LANGUAGES: {
      GENERAL: {},
      MEDICAL: {},
      JURIDICAL: {}
    }

  };

  // Variables that will hold the HTML elems the app will build and use during the lifecycle
  const ELEMS = {
    CONTAINER: null,
    TABLE: null
  };

  // Default configuration
  const DEFAULTS = {
    target: 'GENERAL',
    languages: ['C', 'D', 'E', 'F'],
    containerClass: 'rpb-wrapper'
  };

  let config = {};

  var APP = {
    UI: {},
    API: {},
    ACTIONS: {}
  };

  APP.API.getAvailableLanguages = () => {

    var documents = Object.keys(CONSTANTS.LANGUAGES);

    documents.forEach((document) => {
      var query = new google.visualization.Query(CONSTANTS.SPREADSHEETS[document]);
      query.setQuery('select * LIMIT 1 OFFSET 1');
      query.send((response) => {
        APP.API.processAvailableLanguages(response, document);
      });
    });


  };

  APP.API.processAvailableLanguages = (response, document) => {
    if (response.isError()) {
      console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    } else {
      var dataTable = response.getDataTable();

      // get all the values except the first two columns that don't hold language name
      for (let i = 2; i < dataTable.getNumberOfColumns(); i++) {
        CONSTANTS.LANGUAGES[document][dataTable.getColumnId(i)] = {id: dataTable.getColumnId(i), label: dataTable.getValue(0, i)};
      }
    }

    if (document === config.target) {
      APP.UI.createLanguagesForm('languages-container', CONSTANTS.LANGUAGES[document]);
    }
  };

  APP.UI.createLanguagesForm = (container, languages) => {
    let langForm = document.getElementsByClassName(container)[0];
    let langIds = Object.keys(languages);
    for (let i = 2; i < langIds.length; i++) {
      let langLabel = languages[langIds[i]].label;
      let langId = languages[langIds[i]].id;

      let wrapper = document.createElement('div');
      wrapper.classList.add('language-item');
      let input = document.createElement('input');
      let label = document.createElement('span');

      input.type = 'checkbox';
      input.value = langId;
      label.innerHTML = langLabel;

      wrapper.appendChild(input);
      wrapper.appendChild(label);
      langForm.appendChild(wrapper);
    }
  };

  APP.UI.createDocumentsForm = (container) => {
    let docForm = document.getElementsByClassName(container)[0];
    let documents = Object.keys(CONSTANTS.SPREADSHEETS);
    for (let i = 0; i < documents.length; i++) {
      let langLabel = documents[i];
      let langId = documents[i];

      let wrapper = document.createElement('div');
      wrapper.classList.add('document-item');
      let input = document.createElement('input');
      let label = document.createElement('span');

      input.type = 'radio';
      input.name = 'document';
      input.value = langId;
      label.innerHTML = langLabel;

      wrapper.appendChild(input);
      wrapper.appendChild(label);
      docForm.appendChild(wrapper);
    }
  };

  APP.API.querySpreadsheet = (conf) => {
    let queryObject = new google.visualization.Query(CONSTANTS.SPREADSHEETS[conf.target]);
    //select the english column for phrase names
    let query = 'SELECT I';
    for (let i = 0; i < conf.languages.length; i++) {
      query += ', ' + conf.languages[i];
    }

    query += ' OFFSET 4';

    queryObject.setQuery(query);
    queryObject.send(APP.API.handleQueryResponse);
  };

  APP.API.handleQueryResponse = (response) => {
    if (response.isError()) {
      console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    } else {

      let dataTable = response.getDataTable();

      // set the column names
      for (let i = 0; i < dataTable.getNumberOfColumns(); i++) {
        let columnId = dataTable.getColumnId(i);

        let language = CONSTANTS.LANGUAGES[config.target][columnId] ? CONSTANTS.LANGUAGES[config.target][columnId].label : '';

        dataTable.setColumnLabel(i, language);
      }
      APP.UI.drawTable(new google.visualization.DataView(response.getDataTable()))
    }
  };

  APP.UI.drawTable = (dataView) => {
    var table = new google.visualization.Table(ELEMS.TABLE);
    table.draw(dataView);
  };

  /**
   * Create the DOM structure for the app
   */
  APP.UI.createDOM = (conf) => {
    ELEMS.CONTAINER = document.getElementsByClassName(conf.containerClass)[0];
    ELEMS.TABLE = document.getElementsByClassName('rpb-table')[0];

    APP.UI.createSettings();
    // APP.UI.createTableElems();
  };

  APP.UI.createSettings = () => {
    // APP.UI.createLanguagesForm('languages-container', CONSTANTS.LANGUAGES);
    // ELEMS.SETTINGS = document.createElement('div');
    // ELEMS.SETTINGS.classList.add('rpb-settings-container');
    // ELEMS.CONTAINER.appendChild(ELEMS.SETTINGS);
    // APP.UI.createSettingsMenu();
  };

  APP.UI.createSettingsMenu = () => {
    ELEMS.SETTINGS.innerHTML = SettingsMenuHtml;
  };

  APP.ACTIONS.showSettingsMenu = () => {
    document.getElementsByClassName('rpb-settings-menu')[0].classList.remove('hidden');
    document.getElementsByClassName('rpb-main-controls')[0].classList.add('hidden');
    document.getElementsByClassName('rpb-language-settings')[0].classList.add('hidden');
    document.getElementsByClassName('rpb-document-settings')[0].classList.add('hidden');
  };

  APP.ACTIONS.hideSettingsMenu = () => {
    document.getElementsByClassName('rpb-settings-menu')[0].classList.add('hidden');
    document.getElementsByClassName('rpb-language-settings')[0].classList.add('hidden');
    document.getElementsByClassName('rpb-document-settings')[0].classList.add('hidden');
    document.getElementsByClassName('rpb-main-controls')[0].classList.remove('hidden');
  };

  APP.ACTIONS.toggleLanguagesMenu = () => {
    document.getElementsByClassName('rpb-language-settings')[0].classList.toggle('hidden');
  };

  APP.ACTIONS.hideLanguageMenu = () => {
    document.getElementsByClassName('rpb-settings-menu')[0].classList.remove('hidden');
    document.getElementsByClassName('rpb-language-settings')[0].classList.add('hidden');
  };

  APP.ACTIONS.toggleDocumentMenu = () => {
    document.getElementsByClassName('rpb-settings-menu')[0].classList.toggle('hidden');
    document.getElementsByClassName('rpb-document-settings')[0].classList.toggle('hidden');
  };

  APP.ACTIONS.applyLanguages = () => {
    let selectedLanguages = document.getElementsByClassName('languages-container')[0].querySelectorAll("input[type='checkbox']:checked");
    config.languages = Array.prototype.map.call(selectedLanguages, (input) => {
      return input.value;
    });

    APP.API.querySpreadsheet(config);
    APP.ACTIONS.hideSettingsMenu();
  };

  APP.ACTIONS.applyDocument = () => {
    let selectedLanguages = document.getElementsByClassName('documents-container')[0].querySelectorAll("input[type='radio']").value;
    debugger;
    APP.API.querySpreadsheet(config);
    APP.ACTIONS.hideSettingsMenu();
  };



  // APP.UI.createTableElems = () => {
  //   ELEMS.TABLE = document.createElement('div');
  //   ELEMS.TABLE.classList.add('rpb-table');
  //   ELEMS.CONTAINER.appendChild(ELEMS.TABLE);
  // };

  APP.UI.createBindings = () => {
    document.getElementsByClassName('rpb-settings-btn')[0].onclick = APP.ACTIONS.showSettingsMenu;
    document.getElementsByClassName('rpb-setting-back-btn')[0].onclick = APP.ACTIONS.hideSettingsMenu;
    document.getElementsByClassName('rpb-languages-btn')[0].onclick = APP.ACTIONS.toggleLanguagesMenu;
    document.getElementsByClassName('rpb-languages-apply-btn')[0].onclick = APP.ACTIONS.applyLanguages;
    document.getElementsByClassName('rpb-languages-back-btn')[0].onclick = APP.ACTIONS.toggleLanguagesMenu;
    document.getElementsByClassName('rpb-documents-btn')[0].onclick = APP.ACTIONS.toggleDocumentMenu;
    document.getElementsByClassName('rpb-documents-apply-btn')[0].onclick = APP.ACTIONS.applyDocument;
    document.getElementsByClassName('rpb-documents-back-btn')[0].onclick = APP.ACTIONS.showSettingsMenu;
  };

  /**
   * Starting point for the module
   */
  APP.initialize = () => {
    // get provided defaults or the general defaults
    config = DEFAULTS;

    let RPB = window.RPB ? window.RPB : {};
    for (let property in RPB) {
      if (RPB.hasOwnProperty(property)) {
        config[property] = RPB[property];
      }
    }
    APP.UI.createDOM(config);
    APP.UI.createBindings();
    APP.UI.createDocumentsForm('documents-container');

    APP.API.getAvailableLanguages();
    APP.API.querySpreadsheet(config);
  };

  (function (d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      // remote script has loaded
      google.load('visualization', '1', {packages: ['corechart', 'table'], callback: APP.initialize});
    };
    script.src = 'http://www.google.com/jsapi';
    d.getElementsByTagName('head')[0].appendChild(script);
  }(document));

})();
