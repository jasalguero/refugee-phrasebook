"use strict";!function(){var e="",t={SPREADSHEETS:{SHORT:"https://docs.google.com/spreadsheets/d/1tV8MsUYpk5LW0ZZsZ3lF1ZoM9gK-3xzmCmyVKeszdDs/edit#gid=0",GENERAL:"https://docs.google.com/spreadsheets/d/1hVa7vtHCc7WGkf0idxU0j5YWX0eX0jzavMR5GncG-nU/edit#gid=0",MEDICAL:"https://docs.google.com/spreadsheets/d/1wjmRrkN9WVB4KIeKBy8wDDJ8E51Mh2-JxIBy2KNMFRQ/edit#gid=0",JURIDICAL:"https://docs.google.com/spreadsheets/d/1D7jo-tAyQkmfYvVyT27nZ93ZkyFcZg2vEvf4OMbXJ_c/edit#gid=0"},LANGUAGES:{SHORT:{},GENERAL:{},MEDICAL:{},JURIDICAL:{}}},n={CONTAINER:null,TABLE:null,DATA_TABLE:null},a={target:"SHORT",languages:["D","F","X"],containerClass:"rpb-wrapper"},s={},l={UI:{},API:{},ACTIONS:{},PDF:{}};l.API.getAvailableLanguages=function(){var e=Object.keys(t.LANGUAGES);e.forEach(function(e){var n=new google.visualization.Query(t.SPREADSHEETS[e]);n.setQuery("select * LIMIT 1 OFFSET 1"),n.send(function(t){l.API.processAvailableLanguages(t,e)})})},l.API.processAvailableLanguages=function(e,n){if(e.isError())console.error("Error in query: "+e.getMessage()+" "+e.getDetailedMessage());else for(var a=e.getDataTable(),o=0;o<a.getNumberOfColumns();o++)t.LANGUAGES[n][a.getColumnId(o)]={id:a.getColumnId(o),label:a.getValue(0,o)};n===s.target&&(l.UI.createLanguagesForm("languages-container",t.LANGUAGES[n]),l.API.querySpreadsheet(s))},l.UI.createLanguagesForm=function(e,t){var n=document.getElementsByClassName(e)[0];n.innerHTML="";for(var a=Object.keys(t),l=2;l<a.length;l++){var o=t[a[l]].label,c=t[a[l]].id,g=document.createElement("div");g.classList.add("language-item");var i=document.createElement("input"),r=document.createElement("span");i.type="checkbox",i.value=c,-1!==s.languages.indexOf(c)&&(i.checked=!0),r.innerHTML=o,g.appendChild(i),g.appendChild(r),n.appendChild(g)}},l.UI.createDocumentsForm=function(e){for(var n=document.getElementsByClassName(e)[0],a=Object.keys(t.SPREADSHEETS),l=0;l<a.length;l++){var o=a[l],c=document.createElement("div");c.classList.add("document-item");var g=document.createElement("input"),i=document.createElement("span");g.type="radio",g.name="document",o===s.target&&(g.checked=!0),g.value=o,i.innerHTML=o,c.appendChild(g),c.appendChild(i),n.appendChild(c)}},l.API.querySpreadsheet=function(e){for(var n=new google.visualization.Query(t.SPREADSHEETS[e.target]),a="SELECT C",s=0;s<e.languages.length;s++)a+=", "+e.languages[s];a+=" OFFSET 4",console.debug("Query",e.target,a),n.setQuery(a),n.send(l.API.handleQueryResponse)},l.API.handleQueryResponse=function(e){if(e.isError())console.error("Error in query: "+e.getMessage()+" "+e.getDetailedMessage());else{for(var n=e.getDataTable(),a=0;a<n.getNumberOfColumns();a++){var o=n.getColumnId(a),c=t.LANGUAGES[s.target][o]?t.LANGUAGES[s.target][o].label:"";n.setColumnLabel(a,c)}l.UI.drawTable(new google.visualization.DataView(e.getDataTable()))}},l.UI.drawTable=function(e){n.DATA_VIEW=e,n.DATA_TABLE=new google.visualization.Table(n.TABLE),n.DATA_TABLE.draw(e)},l.UI.createDOM=function(e){n.CONTAINER=document.getElementsByClassName(e.containerClass)[0],n.TABLE=document.getElementsByClassName("rpb-table")[0],l.UI.createSettings()},l.UI.createSettings=function(){},l.UI.createSettingsMenu=function(){n.SETTINGS.innerHTML=e},l.ACTIONS.showSettingsMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.remove("hidden"),document.getElementsByClassName("rpb-main-controls")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.add("hidden")},l.ACTIONS.hideSettingsMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-main-controls")[0].classList.remove("hidden")},l.ACTIONS.toggleLanguagesMenu=function(){document.getElementsByClassName("rpb-language-settings")[0].classList.toggle("hidden")},l.ACTIONS.hideLanguageMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.remove("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden")},l.ACTIONS.toggleDocumentMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.toggle("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.toggle("hidden")},l.ACTIONS.applyLanguages=function(){var e=document.getElementsByClassName("languages-container")[0].querySelectorAll("input[type='checkbox']:checked");s.languages=Array.prototype.map.call(e,function(e){return e.value}),l.API.querySpreadsheet(s),l.ACTIONS.hideSettingsMenu()},l.ACTIONS.applyDocument=function(){s.target=document.getElementsByClassName("documents-container")[0].querySelectorAll("input[type='radio']:checked")[0].value,l.API.querySpreadsheet(s),l.UI.createLanguagesForm("languages-container",t.LANGUAGES[s.target]),l.ACTIONS.hideSettingsMenu()},l.UI.createBindings=function(){document.getElementsByClassName("rpb-settings-btn")[0].onclick=l.ACTIONS.showSettingsMenu,document.getElementsByClassName("rpb-setting-back-btn")[0].onclick=l.ACTIONS.hideSettingsMenu,document.getElementsByClassName("rpb-languages-btn")[0].onclick=l.ACTIONS.toggleLanguagesMenu,document.getElementsByClassName("rpb-languages-apply-btn")[0].onclick=l.ACTIONS.applyLanguages,document.getElementsByClassName("rpb-languages-back-btn")[0].onclick=l.ACTIONS.toggleLanguagesMenu,document.getElementsByClassName("rpb-documents-btn")[0].onclick=l.ACTIONS.toggleDocumentMenu,document.getElementsByClassName("rpb-documents-apply-btn")[0].onclick=l.ACTIONS.applyDocument,document.getElementsByClassName("rpb-documents-back-btn")[0].onclick=l.ACTIONS.showSettingsMenu,document.getElementsByClassName("rpb-print-pdf")[0].onclick=l.PDF.createPDF},l.PDF.createPDF=function(){window.print()},l.initialize=function(){s=a;var e=window.RPB?window.RPB:{};for(var t in e)e.hasOwnProperty(t)&&(s[t]=e[t]);l.UI.createDOM(s),l.UI.createBindings(),l.UI.createDocumentsForm("documents-container"),l.API.getAvailableLanguages()},function(e,t){t=e.createElement("script"),t.type="text/javascript",t.async=!0,t.onload=function(){google.load("visualization","1",{packages:["corechart","table"],callback:l.initialize})},t.src="http://www.google.com/jsapi",e.getElementsByTagName("head")[0].appendChild(t)}(document)}();