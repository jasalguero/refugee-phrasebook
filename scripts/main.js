"use strict";!function(){var e="",t={SPREADSHEETS:{GENERAL:"https://docs.google.com/spreadsheets/d/1hVa7vtHCc7WGkf0idxU0j5YWX0eX0jzavMR5GncG-nU/edit#gid=0",MEDICAL:"https://docs.google.com/spreadsheets/d/1wjmRrkN9WVB4KIeKBy8wDDJ8E51Mh2-JxIBy2KNMFRQ/edit#gid=0",JURIDICAL:"https://docs.google.com/spreadsheets/d/1D7jo-tAyQkmfYvVyT27nZ93ZkyFcZg2vEvf4OMbXJ_c/edit#gid=0"},LANGUAGES:{}},n={TABLE:null},a={target:t.SPREADSHEETS.GENERAL,languages:["C","D","E","F"],containerClass:"rpb-wrapper"},s={},l={UI:{},API:{},ACTIONS:{}};l.API.getAvailableLanguages=function(){var e=new google.visualization.Query(t.SPREADSHEETS.GENERAL);e.setQuery("select * LIMIT 1 OFFSET 1"),e.send(l.API.processAvailableLanguages)},l.API.processAvailableLanguages=function(e){if(e.isError())console.error("Error in query: "+e.getMessage()+" "+e.getDetailedMessage());else for(var n=e.getDataTable(),a=2;a<n.getNumberOfColumns();a++)t.LANGUAGES[n.getColumnId(a)]={id:n.getColumnId(a),label:n.getValue(0,a)};l.UI.createLanguagesForm("languages-container",t.LANGUAGES)},l.UI.createLanguagesForm=function(e, t){for(var n=document.getElementsByClassName(e)[0],a=Object.keys(t),s=2; s<a.length; s++){var l=t[a[s]].label,i=t[a[s]].id,o=document.createElement("div");o.classList.add("language-item");var g=document.createElement("input"),c=document.createElement("span");g.type="checkbox",g.value=i,c.innerHTML=l,o.appendChild(g),o.appendChild(c),n.appendChild(o)}},l.API.querySpreadsheet=function(e){for(var t=new google.visualization.Query(e.target),n="SELECT I",a=0; a<e.languages.length; a++)n+=", "+e.languages[a];n+=" OFFSET 4",t.setQuery(n),t.send(l.API.handleQueryResponse)},l.API.handleQueryResponse=function(e){if(e.isError())console.error("Error in query: "+e.getMessage()+" "+e.getDetailedMessage());else{for(var n=e.getDataTable(),a=0;a<n.getNumberOfColumns();a++){var s=n.getColumnId(a),i=t.LANGUAGES[s]?t.LANGUAGES[s].label:"";n.setColumnLabel(a,i)}l.UI.drawTable(new google.visualization.DataView(e.getDataTable()))}},l.UI.drawTable=function(e){var t=new google.visualization.Table(n.TABLE);t.draw(e)},l.UI.createDOM=function(e){n.CONTAINER=document.getElementsByClassName(e.containerClass)[0],l.UI.createSettings(),l.UI.createTableElems()},l.UI.createSettings=function(){},l.UI.createSettingsMenu=function(){n.SETTINGS.innerHTML=e},l.ACTIONS.showSettingsMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.remove("hidden"),document.getElementsByClassName("rpb-main-controls")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.add("hidden")},l.ACTIONS.hideSettingsMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-main-controls")[0].classList.remove("hidden")},l.ACTIONS.showLanguageMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.remove("hidden")},l.ACTIONS.hideLanguageMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.remove("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden")},l.ACTIONS.toggleDocumentMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.toggle("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.toggle("hidden")},l.ACTIONS.applyLanguages=function(){var e=document.getElementsByClassName("languages-container")[0].querySelectorAll("input[type='checkbox']:checked"),t=Array.prototype.map.call(e,function(e){return e.value});s.languages=t,l.API.querySpreadsheet(s),l.ACTIONS.hideSettingsMenu()},l.UI.createTableElems=function(){n.TABLE=document.createElement("div"),n.TABLE.classList.add("rpb-table"),n.CONTAINER.appendChild(n.TABLE)},l.UI.createBindings=function(){document.getElementsByClassName("rpb-settings-btn")[0].onclick=l.ACTIONS.showSettingsMenu,document.getElementsByClassName("rpb-setting-back-btn")[0].onclick=l.ACTIONS.hideSettingsMenu,document.getElementsByClassName("rpb-languages-btn")[0].onclick=l.ACTIONS.showLanguageMenu,document.getElementsByClassName("rpb-languages-apply-btn")[0].onclick=l.ACTIONS.applyLanguages,document.getElementsByClassName("rpb-languages-back-btn")[0].onclick=l.ACTIONS.showSettingsMenu,document.getElementsByClassName("rpb-documents-btn")[0].onclick=l.ACTIONS.toggleDocumentMenu,document.getElementsByClassName("rpb-documents-back-btn")[0].onclick=l.ACTIONS.showSettingsMenu},l.initialize=function(){s=a;var e=window.RPB?window.RPB:{};for(var t in e)e.hasOwnProperty(t)&&(s[t]=e[t]);l.UI.createDOM(s),l.UI.createBindings(),l.API.getAvailableLanguages(),l.API.querySpreadsheet(s)},window.onload=function(){},function(e,t){t=e.createElement("script"),t.type="text/javascript",t.async=!0,t.onload=function(){google.load("visualization","1",{packages:["corechart","table"],callback:l.initialize})},t.src="http://www.google.com/jsapi",e.getElementsByTagName("head")[0].appendChild(t)}(document)}();
