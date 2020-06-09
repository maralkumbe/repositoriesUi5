/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/theming/Parameters","sap/ui/core/library"],function(P,c){"use strict";var I=c.IconColor;var a={apiVersion:2};a.fNestedItemPaddingLeft=Number.parseFloat(P.get("_sap_m_IconTabBar_SelectListItem_PaddingLeft"));a.render=function(r,s){var i=s.getVisibleItems(),o=s._oIconTabHeader,t=o._checkTextOnly(),T=o.getVisibleTabFilters().length,n=this.fNestedItemPaddingLeft,l=0;var h=i.some(function(b){return b.getIconColor()!==I.Default;});s.checkIconOnly();var A=Number.parseFloat(P.get("_sap_m_IconTabBar_SelectListItem_PaddingLeftAdditional"));if(h){n+=A;if(A){l++;}}this.renderList(r,i,s,o,t,l,n,T);};a.renderList=function(r,b,s,o,t,l,p,S){if(!b.length){return;}r.openStart("ul",s).attr("role","menu").class("sapMITBSelectList");if(t){r.class("sapMITBSelectListTextOnly");}r.openEnd();for(var i=0;i<b.length;i++){var d=b[i],e;if(o){e=o.getVisibleTabFilters().indexOf(d._getRealTab());}if(d._getRootTab()._getSelectList()===s){e=i;S=b.length;}var f=p*l;d.renderInSelectList(r,s,e,S,f);var g=d._getRealTab().getItems();if(g.length){r.openStart("li").openEnd();l++;a.renderList(r,g,s,null,t,l,p,g.length);l--;r.close("li");}}r.close("ul");};return a;},true);