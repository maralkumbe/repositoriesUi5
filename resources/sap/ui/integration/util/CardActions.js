/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/integration/library","sap/ui/base/ManagedObject","sap/base/Log","sap/ui/integration/util/BindingResolver","sap/ui/integration/util/DataProviderFactory"],function(l,a,M,L,B,D){"use strict";function _(s){if(s&&typeof s==="object"){return s.name;}return s;}var A=a.AreaType,C=a.CardActionType,b=l.ListType;var c=M.extend("sap.ui.integration.util.CardActions",{metadata:{library:"sap.ui.integration",properties:{card:{type:"object"},areaType:{type:"sap.ui.integration.AreaType",defaultValue:A.None}}}});c.prototype.exit=function(){this._oAreaControl=null;};c.prototype.attach=function(i,o){this._oAreaControl=o;if(!i.actions){this._fireActionReady();return;}var d=i.actions[0];if(d&&d.type){this._attachAction(i,d);}else{this._fireActionReady();}};c.prototype._setItemTemplateTypeFormatter=function(o){var t=this,d=t._oAreaControl,i=d._oItemTemplate;var e=M.bindingParser("{path:''}");e.formatter=function(v){var f=this.getBindingContext(),m=this.getModel(),p,P;if(f){p=f.getPath();}P=B.resolveValue(o.parameters,m,p);if(v.__resolved){if(!v.__enabled||v.__enabled==="false"){return b.Inactive;}return b.Navigation;}if(!v.__promise){v.__promise=true;d._oServiceManager.getService(_(o.service)).then(function(n){if(n){n.enabled({parameters:P}).then(function(E){v.__resolved=true;v.__enabled=E;d.getModel().checkUpdate(true);}).catch(function(){v.__resolved=true;v.__enabled=false;});}else{v.__resolved=true;v.__enabled=false;}});}return b.Inactive;};i.bindProperty("type",e);};c.prototype._setSingleActionEnabledState=function(i,o){var d=this._oAreaControl,e=d.getBindingContext(),p,m=d.getModel(),P;if(e){P=e.getPath();}p=B.resolveValue(o.parameters,m,P);return new Promise(function(r){d._oServiceManager.getService(_(o.service)).then(function(n){if(n){n.enabled({parameters:p}).then(function(E){r(E);}).catch(function(){r(false);});}else{r(false);}}).catch(function(){r(false);});});};c.prototype._setItemTemplateEnabledState=function(o){var d,t,i=this._oAreaControl._oItemTemplate;if(typeof o.enabled==="object"){d=o.enabled;d.formatter=function(v){if(!v||v==="false"){return b.Inactive;}return b.Navigation;};}if(d){i.bindProperty("type",d);}else{t=(o.enabled===false||o.enabled==="false")?b.Inactive:b.Navigation;i.setProperty("type",t);}};c.prototype._fireActionReady=function(){var h=this.getAreaType()===A.Header;var e=h?"_actionHeaderReady":"_actionContentReady";this._oAreaControl.fireEvent(e);};c.prototype._handleServiceAction=function(s,o){var d=s.getBindingContext(),m=s.getModel(),p;if(d){p=d.getPath();}this._oAreaControl._oServiceManager.getService(_(o.service)).then(function(S){if(S){S.navigate({parameters:B.resolveValue(o.parameters,m,p)});}}).catch(function(e){L.error("Navigation service unavailable",e);}).finally(function(){this._processAction(s,o,m,p);}.bind(this));};c.prototype._handleAction=function(s,o){var d=s.getBindingContext(),m=s.getModel(),p;if(d){p=d.getPath();}this._processAction(s,o,m,p);};c.prototype._attachPressEvent=function(o,d,s){o.attachPress(function(e){var S=e.getSource();if(d.service){this._handleServiceAction(S,d);}else{this._handleAction(S,d);}}.bind(this));};c.prototype._attachAction=function(i,o){var d=this.getAreaType()===A.ContentItem?this._oAreaControl._oItemTemplate:this._oAreaControl,e=true,s=this.getAreaType(),S=s===A.Header||s===A.Content,f=s===A.ContentItem,g=true;if(o.service){if(this.getAreaType()===A.ContentItem){this._setItemTemplateTypeFormatter(o);}e=false;}else if(f){this._setItemTemplateEnabledState(o);e=false;}if(S&&o.service){this._setSingleActionEnabledState(i,o).then(function(E){if(E){this._attachPressEvent(d,o,S);}this._fireActionReady();}.bind(this));}else{if(e){g=o.enabled!==false&&o.enabled!=="false";}if(g){this._attachPressEvent(d,o,S);}this._fireActionReady();}};c.prototype._processAction=function(s,o,m,p){var h=this._getHostInstance(),d=this.getCard(),u=o.url;if(u){u=B.resolveValue(u,m,p);}c.fireAction({card:d,host:h,action:o,parameters:B.resolveValue(o.parameters,m,p),source:s,url:u});};c.prototype._getHostInstance=function(){var o=this.getCard();if(o){return o.getHostInstance();}return null;};c.prototype.fireAction=function(s,t,p){var h=this._getHostInstance(),o=this.getCard(),d=this._extractActionConfigurations(o,p),e={card:o,host:h,action:{type:t},parameters:d,source:s};c.fireAction(e);};c.fireAction=function(m){var h=m.host,o=m.card,d=m.action,p=m.parameters||{},e={type:d.type,card:o,actionSource:m.source,manifestParameters:p,parameters:p},f=o.fireAction(e);if(!f){return false;}if(h){f=h.fireAction(e);}if(f){c._doPredefinedAction(m);}return f;};c._doPredefinedAction=function(m){var o=m.action,f,u;switch(o.type){case C.Navigation:u=m.url;if(u){window.open(u,o.target||"_blank");}break;case C.Custom:f=o.action;if(f&&jQuery.isFunction(f)){f(m.card,m.source);}break;case C.Submit:if(m.source&&m.source.isA("sap.ui.integration.cards.BaseContent")){c.handleSubmitAction(m);}break;}};c.handleSubmitAction=function(m){var d,o=m.card,e=o._oDataProviderFactory,f=m.source,g=m.parameters;if(!g.configuration){return;}f.onActionSubmitStart(g);d=e.create({request:g.configuration});d.getData().then(function(r){f.onActionSubmitEnd(r,null);},function(E){L.error(E);f.onActionSubmitEnd(null,{error:E});}).finally(function(){e.remove(d);});};c.prototype._extractActionConfigurations=function(o,p){var r=o&&o.getManifestEntry("/sap.card/configuration/actionHandlers/submit");if(!r){return p;}return{data:p,configuration:{"mode":r.mode||"cors","url":r.url,"method":r.method||"POST","parameters":Object.assign({},p,r.parameters),"headers":r.headers,"xhrFields":{"withCredentials":!!r.withCredentials}}};};return c;});