/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/ChangeHandlerMediator","sap/base/Log"],function(C,L){"use strict";var A={};var a="columns";var b="cells";var I="items";A.applyChange=function(c,t,p){var m=p.modifier;var v=p.view;var o=p.appComponent;var d=c.getDefinition();var e=c.getContent();var g=function(h){return h&&h.content&&h.content.createFunction;};var f=function(e,h){return e.newFieldSelector&&(e.newFieldIndex!==undefined)&&e.bindingPath&&e.oDataServiceVersion&&!!g(h);};return C.getChangeHandlerSettings({"scenario":"addODataField","oDataServiceVersion":e.oDataServiceVersion}).then(function(h){if(e&&f(e,h)){var T=m.getBindingTemplate(t,I,v);var i=m.createControl('sap.m.Text',o,v,e.newFieldSelector.id+'--column',{text:"{/#"+e.entityType+"/"+e.bindingPath+"/@sap:label}"});if(T){var j={"appComponent":p.appComponent,"view":p.view,"fieldSelector":e.newFieldSelector.id+'--field',"bindingPath":e.bindingPath};var k=g(h);var s=k(m,j);m.insertAggregation(T,b,s,e.newFieldIndex,v);m.updateAggregation(t,I);c.setRevertData(e.newFieldSelector.id+'--field');}var l=m.createControl('sap.m.Column',o,v,e.newFieldSelector);m.insertAggregation(l,'header',i,0,v);m.insertAggregation(t,a,l,e.newFieldIndex,v);return true;}else{L.error("Change does not contain sufficient information to be applied or ChangeHandlerMediator could not be retrieved: ["+d.layer+"]"+d.namespace+"/"+d.fileName+"."+d.fileType);}});};A.revertChange=function(c,t,p){var m=p.modifier;var v=p.view;var o=p.appComponent;var d=c.getContent();var T=m.getBindingTemplate(t,I);if(T){m.removeAggregation(T,b,m.bySelector(c.getRevertData(),o,v));m.updateAggregation(t,I);}m.removeAggregation(t,a,m.bySelector(d.newFieldSelector,o,v));c.resetRevertData();return true;};A.completeChangeContent=function(c,s,p){var o=p.appComponent;var d=c.getDefinition();if(!d.content){d.content={};}if(s.parentId){c.addDependentControl(s.parentId,"targetTable",p);}else{throw new Error("oSpecificChangeInfo.parentId attribute required");}if(s.bindingPath){d.content.bindingPath=s.bindingPath;}else{throw new Error("oSpecificChangeInfo.bindingPath attribute required");}if(s.oDataInformation.entityType){d.content.entityType=s.oDataInformation.entityType;}else{throw new Error("oSpecificChangeInfo.entityType attribute required");}if(s.newControlId){d.content.newFieldSelector=p.modifier.getSelector(s.newControlId,o);}else{throw new Error("oSpecificChangeInfo.newControlId attribute required");}if(s.index===undefined){throw new Error("oSpecificChangeInfo.targetIndex attribute required");}else{d.content.newFieldIndex=s.index;}if(s.oDataServiceVersion===undefined){throw new Error("oSpecificChangeInfo.oDataServiceVersion attribute required");}else{d.content.oDataServiceVersion=s.oDataServiceVersion;}};return A;},true);