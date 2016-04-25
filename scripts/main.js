"use strict";!function(e){var t="",n={SPREADSHEETS:{GENERAL:"https://docs.google.com/spreadsheets/d/1hVa7vtHCc7WGkf0idxU0j5YWX0eX0jzavMR5GncG-nU/edit#gid=0",MEDICAL:"https://docs.google.com/spreadsheets/d/1wjmRrkN9WVB4KIeKBy8wDDJ8E51Mh2-JxIBy2KNMFRQ/edit#gid=0",JURIDICAL:"https://docs.google.com/spreadsheets/d/1D7jo-tAyQkmfYvVyT27nZ93ZkyFcZg2vEvf4OMbXJ_c/edit#gid=0"},LANGUAGES:{}},s={TABLE:null},a={target:n.SPREADSHEETS.GENERAL,languages:["C","D","E","F"],containerClass:"rpb-wrapper"},l={},i={UI:{},API:{},ACTIONS:{}};i.API.getAvailableLanguages=function(){var e=new google.visualization.Query(n.SPREADSHEETS.GENERAL);e.setQuery("select * LIMIT 1 OFFSET 1"),e.send(i.API.processAvailableLanguages)},i.API.processAvailableLanguages=function(e){if(e.isError())console.error("Error in query: "+e.getMessage()+" "+e.getDetailedMessage());else for(var t=e.getDataTable(),s=2;s<t.getNumberOfColumns();s++)n.LANGUAGES[t.getColumnId(s)]={id:t.getColumnId(s),label:t.getValue(0,s)};i.UI.createLanguageForm("languages-container",n.LANGUAGES)},i.UI.createLanguageForm=function(e,t){for(var n=document.getElementsByClassName(e)[0],s=Object.keys(t),a=2;a<s.length;a++){var l=t[s[a]].label,i=t[s[a]].id,g=document.createElement("div");g.classList.add("language-item");var o=document.createElement("input"),c=document.createElement("span");o.type="checkbox",o.value=i,c.innerHTML=l,g.appendChild(o),g.appendChild(c),n.appendChild(g)}},i.API.querySpreadsheet=function(e){for(var t=new google.visualization.Query(e.target),n="SELECT I",s=0;s<e.languages.length;s++)n+=", "+e.languages[s];n+=" OFFSET 4",t.setQuery(n),t.send(i.API.handleQueryResponse)},i.API.handleQueryResponse=function(e){if(e.isError())console.error("Error in query: "+e.getMessage()+" "+e.getDetailedMessage());else{for(var t=e.getDataTable(),s=0;s<t.getNumberOfColumns();s++){var a=t.getColumnId(s),l=n.LANGUAGES[a]?n.LANGUAGES[a].label:"";t.setColumnLabel(s,l)}i.UI.drawTable(new google.visualization.DataView(e.getDataTable()))}},i.UI.drawTable=function(e){var t=new google.visualization.Table(s.TABLE);t.draw(e)},i.UI.createDOM=function(e){s.CONTAINER=document.getElementsByClassName(e.containerClass)[0],i.UI.createSettings(),i.UI.createTableElems()},i.UI.createSettings=function(){},i.UI.createSettingsMenu=function(){s.SETTINGS.innerHTML=t},i.ACTIONS.showSettingsMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.remove("hidden"),document.getElementsByClassName("rpb-main-controls")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.add("hidden")},i.ACTIONS.hideSettingsMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.add("hidden"),document.getElementsByClassName("rpb-main-controls")[0].classList.remove("hidden")},i.ACTIONS.showLanguageMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.add("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.remove("hidden")},i.ACTIONS.hideLanguageMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.remove("hidden"),document.getElementsByClassName("rpb-language-settings")[0].classList.add("hidden")},i.ACTIONS.toggleDocumentMenu=function(){document.getElementsByClassName("rpb-settings-menu")[0].classList.toggle("hidden"),document.getElementsByClassName("rpb-document-settings")[0].classList.toggle("hidden")},i.ACTIONS.applyLanguages=function(){var e=document.getElementsByClassName("languages-container")[0].querySelectorAll("input[type='checkbox']:checked"),t=Array.prototype.map.call(e,function(e){return e.value});l.languages=t,i.API.querySpreadsheet(l),i.ACTIONS.hideSettingsMenu()},i.UI.createTableElems=function(){s.TABLE=document.createElement("div"),s.TABLE.classList.add("rpb-table"),s.CONTAINER.appendChild(s.TABLE)},i.UI.createBindings=function(){document.getElementsByClassName("rpb-settings-btn")[0].onclick=i.ACTIONS.showSettingsMenu,document.getElementsByClassName("rpb-setting-back-btn")[0].onclick=i.ACTIONS.hideSettingsMenu,document.getElementsByClassName("rpb-languages-btn")[0].onclick=i.ACTIONS.showLanguageMenu,document.getElementsByClassName("rpb-languages-apply-btn")[0].onclick=i.ACTIONS.applyLanguages,document.getElementsByClassName("rpb-languages-back-btn")[0].onclick=i.ACTIONS.showSettingsMenu,document.getElementsByClassName("rpb-documents-btn")[0].onclick=i.ACTIONS.toggleDocumentMenu,document.getElementsByClassName("rpb-documents-back-btn")[0].onclick=i.ACTIONS.showSettingsMenu},i.initialize=function(){l=a;for(var t in e)e.hasOwnProperty(t)&&(l[t]=e[t]);i.UI.createDOM(l),i.UI.createBindings(),i.API.getAvailableLanguages(),i.API.querySpreadsheet(l)},window.onload=function(){i.UI.createBindings(),i.initialize()}}(RPB||{});