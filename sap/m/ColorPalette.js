/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/Device','sap/ui/base/DataType','sap/ui/core/library','sap/ui/core/delegate/ItemNavigation','./Button','./Dialog','./library','./ColorPaletteRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/ui/unified/ColorPickerDisplayMode"],function(C,D,a,c,I,B,b,l,d,e,K,q,f){"use strict";var g=c.CSSColor;var h;var i;var j=l.ButtonType;var k=a.getType("boolean");var m="sapMColorPaletteSquare";var S=5;var M=2;var n=15;var L=sap.ui.getCore().getLibraryResourceBundle("sap.m");var o=C.extend("sap.m.ColorPalette",{metadata:{library:"sap.m",properties:{colors:{type:"sap.ui.core.CSSColor[]",group:"Appearance",defaultValue:["gold","darkorange","indianred","darkmagenta","cornflowerblue","deepskyblue","darkcyan","olivedrab","darkslategray","azure","white","lightgray","darkgray","dimgray","black"]}},aggregations:{_defaultColorButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_moreColorsButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{colorSelect:{parameters:{"value":{type:"sap.ui.core.CSSColor"},"defaultAction":{type:"boolean"}}}}}});o.prototype.init=function(){this._oDefaultColor=null;this._bShowDefaultColorButton=false;this._bShowMoreColorsButton=false;this._bShowRecentColorsSection=false;this._oDisplayMode=f.Default;this._oMoreColorsDialog=null;this._oPaletteColorItemNavigation=null;this._oRecentColorItemNavigation=null;this._recentColors=[];};o.prototype.exit=function(){if(this._oMoreColorsDialog){this._oMoreColorsDialog.destroy();delete this._oMoreColorsDialog;}if(this._oPaletteColorItemNavigation){this.removeDelegate(this._oPaletteColorItemNavigation);this._oPaletteColorItemNavigation.destroy();delete this._oPaletteColorItemNavigation;}if(this._oRecentColorItemNavigation){this.removeDelegate(this._oRecentColorItemNavigation);this._oRecentColorItemNavigation.destroy();delete this._oRecentColorItemNavigation;}};o.prototype.setColors=function(r){r=this.validateProperty("colors",r);if(r.length<M||r.length>n){throw new Error("Cannot set property 'colors' - array must has minimum 2 and maximum 15 elements");}return this.setProperty("colors",r);};o.prototype._setDisplayMode=function(r){var s=this._getColorPicker();s.setDisplayMode(r);this._oDisplayMode=r;return this;};o.prototype._getDisplayMode=function(){return this._oDisplayMode;};o.prototype._getColorPicker=function(){return this._ensureMoreColorsDialog()._oColorPicker;};o.prototype.ontap=function(E){var t=q(E.target),s,$;$=t.closest("."+m);if(!$.length){return;}s=$.attr("data-sap-ui-color");this._fireColorSelect(s,false,E);};o.prototype.onsaptabnext=o.prototype.onsaptabprevious=function(E){var r=this._getElementInfo(E.target);if(r.bIsMoreColorsButton){this.fireEvent("_colorNotSelected",{_originalEvent:E});return;}if(r.bIsDefaultColorButton){this._fireColorSelect(this._getDefaultColor(),true,E);return;}o.prototype.ontap.apply(this,arguments);};o.prototype.onsapenter=o.prototype.ontap;o.prototype.onsapspace=function(E){E.preventDefault();};o.prototype.onkeyup=function(E){if(E.which===K.SPACE){E.preventDefault();o.prototype.ontap.apply(this,arguments);}};o.prototype.onsaphome=o.prototype.onsapend=function(E){var r=this._getElementInfo(E.target);if(r.bIsDefaultColorButton||r.bIsMoreColorsButton){E.preventDefault();E.stopImmediatePropagation(true);}};o.prototype.onAfterRendering=function(){this._ensureItemNavigation();};o.prototype.pushToRecentColors=function(s){var r=this._recentColors.indexOf(s);if(r>-1){this._recentColors.splice(r,1);}else if(this._recentColors.length===5){this._recentColors.pop();}this._recentColors.unshift(s);this.invalidate();};o.prototype._createDefaultColorButton=function(){return new B(this.getId()+"-btnDefaultColor",{width:"100%",type:j.Transparent,text:L.getText("COLOR_PALETTE_DEFAULT_COLOR"),visible:this._getShowDefaultColorButton(),press:function(E){this._fireColorSelect(this._getDefaultColor(),true,E);}.bind(this)});};o.prototype._getDefaultColor=function(){return this._oDefaultColor;};o.prototype._setDefaultColor=function(r){if(!g.isValid(r)){throw new Error("Cannot set internal property '_defaultColor' - invalid value: "+r);}this._oDefaultColor=r;return this;};o.prototype._getShowDefaultColorButton=function(){return this._bShowDefaultColorButton;};o.prototype._setShowDefaultColorButton=function(v){if(!k.isValid(v)){throw new Error("Cannot set internal property 'showDefaultColorButton' - invalid value: "+v);}this._bShowDefaultColorButton=v;if(v&&!this._getDefaultColorButton()){this.setAggregation("_defaultColorButton",this._createDefaultColorButton());}if(this._getDefaultColorButton()){this._getDefaultColorButton().setVisible(v);}return this;};o.prototype._getDefaultColorButton=function(){return this.getAggregation("_defaultColorButton");};o.prototype._createMoreColorsButton=function(){return new B(this.getId()+"-btnMoreColors",{width:"100%",type:j.Transparent,text:L.getText("COLOR_PALETTE_MORE_COLORS"),visible:this._getShowMoreColorsButton(),press:this._openColorPicker.bind(this)});};o.prototype._getShowMoreColorsButton=function(){return this._bShowMoreColorsButton;};o.prototype._getShowRecentColorsSection=function(){return this._bShowRecentColorsSection;};o.prototype._getRecentColors=function(){return this._recentColors;};o.prototype._setShowRecentColorsSection=function(v){if(!k.isValid(v)){throw new Error("Cannot set internal property 'showRecentColorsSection' - invalid value: "+v);}this._bShowRecentColorsSection=v;return this;};o.prototype._setShowMoreColorsButton=function(v){if(!k.isValid(v)){throw new Error("Cannot set internal property 'showMoreColorsButton' - invalid value: "+v);}this._bShowMoreColorsButton=v;if(v&&!this._getMoreColorsButton()){this.setAggregation("_moreColorsButton",this._createMoreColorsButton());}if(this._getMoreColorsButton()){this._getMoreColorsButton().setVisible(v);}return this;};o.prototype._getMoreColorsButton=function(){return this.getAggregation("_moreColorsButton");};o.prototype._openColorPicker=function(){this.fireEvent("_beforeOpenColorPicker");this._ensureMoreColorsDialog().open();};o.prototype._ensureMoreColorsDialog=function(){if(!this._oMoreColorsDialog){this._oMoreColorsDialog=this._createMoreColorsDialog();}return this._oMoreColorsDialog;};o.prototype._createMoreColorsDialog=function(){var r=new b(this.getId()+"-moreColorsDialog",{stretch:!!D.system.phone,title:L.getText("COLOR_PALETTE_MORE_COLORS_TITLE")}).addStyleClass("CPDialog");this._ensureUnifiedLibrary();r.addContent(r._oColorPicker=new h({mode:i.HSL,displayMode:this._oDisplayMode}));r.setBeginButton(new B({text:L.getText("COLOR_PALETTE_MORE_COLORS_CONFIRM"),press:function(E){r.close();if(r._oColorPicker.getColorString()){this._fireColorSelect(r._oColorPicker.getColorString(),false,E);}}.bind(this)}));r.setEndButton(new B({text:L.getText("COLOR_PALETTE_MORE_COLORS_CANCEL"),press:function(){r.close();}}));return r;};o.prototype._ensureUnifiedLibrary=function(){var u;if(!h){sap.ui.getCore().loadLibrary("sap.ui.unified");u=sap.ui.require("sap/ui/unified/library");h=sap.ui.requireSync("sap/ui/unified/ColorPicker");i=u.ColorPickerMode;}};o.prototype._focusFirstElement=function(){var F=this._getShowDefaultColorButton()?this._getDefaultColorButton().getDomRef():this._getAllPaletteColorSwatches()[0];F.focus();};o.prototype._fireColorSelect=function(r,s,O){this.fireColorSelect({value:r,defaultAction:s,_originalEvent:O});this.pushToRecentColors(r);};o.prototype._ensureItemNavigation=function(){var P=[],r=[];if(!this._oPaletteColorItemNavigation){this._oPaletteColorItemNavigation=new p(this);this._oPaletteColorItemNavigation.setColumns(S);this._oPaletteColorItemNavigation.setCycling(false);this.addDelegate(this._oPaletteColorItemNavigation);this._oPaletteColorItemNavigation.attachEvent(I.Events.BorderReached,this._onSwatchContainerBorderReached,this);}if(!this._oRecentColorItemNavigation){this._oRecentColorItemNavigation=new p(this);this._oRecentColorItemNavigation.setColumns(S);this._oRecentColorItemNavigation.setCycling(false);this.addDelegate(this._oRecentColorItemNavigation);this._oRecentColorItemNavigation.attachEvent(I.Events.BorderReached,this._onSwatchContainerBorderReached,this);}P=P.concat(this._getAllPaletteColorSwatches());r=r.concat(this._getAllRecentColorSwatches());r=r.slice(0,this._getRecentColors().length);this._oPaletteColorItemNavigation.setRootDomRef(this.getDomRef("swatchCont-paletteColor"));this._oPaletteColorItemNavigation.setItemDomRefs(P);this._oRecentColorItemNavigation.setRootDomRef(this.getDomRef("swatchCont-recentColors"));this._oRecentColorItemNavigation.setItemDomRefs(r);};o.prototype._onSwatchContainerBorderReached=function(E){var N,s,H=["saphome","sapend"].indexOf(E.getParameter("event").type)>-1,r=this._getAllRecentColorSwatches()[0]?this._getElementInfo(E.mParameters.event.target).bIsRecentColorSwatch:false;if(E.getParameter(p.BorderReachedDirection)===p.BorderReachedDirectionForward){if(this._getShowMoreColorsButton()&&!r){N=this._getMoreColorsButton();}else if(!H&&this._bShowRecentColorsSection&&!r&&this._getRecentColors().length>0){N=this._getAllRecentColorSwatches()[0];}else if(!H&&this._getShowDefaultColorButton()){N=this._getDefaultColorButton();}else if(!H){N=this._getAllPaletteColorSwatches()[0];}}else{if(this._getShowDefaultColorButton()&&!r){N=this._getDefaultColorButton();}else if(!H&&this._bShowRecentColorsSection&&!r&&this._getRecentColors().length>0){N=this._getAllRecentColorSwatches()[0];}else if(!H&&this._getShowMoreColorsButton()){N=this._getMoreColorsButton();}else if(!H&&!this._getShowDefaultColorButton()){s=this._getAllPaletteColorSwatches();N=s[s.length-1];}else if(!H){s=this._getAllPaletteColorSwatches();N=s[this._oPaletteColorItemNavigation._getIndexOfTheFirstItemInLastRow()];}}if(N){N.focus();}return N;};o.prototype.onsapnext=function(E){var N,r=this._getElementInfo(E.target);if(!(r.bIsDefaultColorButton||r.bIsMoreColorsButton)){return;}E.preventDefault();E.stopImmediatePropagation(true);if(r.bIsDefaultColorButton){N=this._getAllPaletteColorSwatches()[0];}else if(this._getRecentColors().length>0&&!r.bIsRecentColorSwatch&&this._bShowRecentColorsSection){N=this._getAllRecentColorSwatches()[0];}else{N=this._getShowDefaultColorButton()?this._getDefaultColorButton():this._getAllPaletteColorSwatches()[0];}N.focus();};o.prototype.onsapprevious=function(E){var N,F=this._getElementInfo(E.target),A;if(!(F.bIsDefaultColorButton||F.bIsMoreColorsButton||E.target===this._getAllRecentColorSwatches()[0])){return;}E.preventDefault();E.stopImmediatePropagation(true);A=this._getAllPaletteColorSwatches();if(F.bIsMoreColorsButton||(!F.bIsMoreColorsButton&&this.bIsRecentColorSwatch)){N=E.keyCode===K.ARROW_UP?A[this._oPaletteColorItemNavigation._getIndexOfTheFirstItemInLastRow()]:A[A.length-1];}else if(F.bIsRecentColorSwatch&&!this._bShowMoreColorsButton&&!this._bShowDefaultColorButton){A=this._getAllPaletteColorSwatches();N=A[this._oPaletteColorItemNavigation._getIndexOfTheFirstItemInLastRow()];}else if(this._getRecentColors().length>0&&!F.bIsRecentColorSwatch&&this._bShowRecentColorsSection){N=this._getAllRecentColorSwatches()[0];}else if(this._getShowMoreColorsButton()){N=this._getMoreColorsButton();}else{N=A[this._oPaletteColorItemNavigation._getIndexOfTheFirstItemInLastRow()];}N.focus();};o.prototype._getAllPaletteColorSwatches=function(){return this.$().find("."+m).get().slice(0,this.getColors().length);};o.prototype._getAllRecentColorSwatches=function(){return this.$().find("."+m).get().slice(this.getColors().length);};o.prototype._getElementInfo=function(E){var r=this._getShowDefaultColorButton()&&e(E,this._getDefaultColorButton().getDomRef()),s=!r&&this._getShowMoreColorsButton()&&e(E,this._getMoreColorsButton().getDomRef()),t=this._getAllRecentColorSwatches().indexOf(E)>-1,u=this._getAllPaletteColorSwatches().indexOf(E)>-1;return{bIsDefaultColorButton:r,bIsMoreColorsButton:s,bIsASwatch:u,bIsRecentColorSwatch:t};};var p=I.extend("sap.m.ItemNavigationHomeEnd",{constructor:function(){I.apply(this,arguments);this.setHomeEndColumnMode(true);this.fireEvent=function(N,E){var s;if(N===I.Events.BorderReached){s=p.BorderReachedDirectionBackward;if(["sapnext","sapend"].indexOf(E.event.type)>-1){s=p.BorderReachedDirectionForward;}E[p.BorderReachedDirection]=s;}I.prototype.fireEvent.apply(this,arguments);};}});p.BorderReachedDirection="direction";p.BorderReachedDirectionForward="BorderReachedDirectionForward";p.BorderReachedDirectionBackward="BorderReachedDirectionBackward";p.prototype.getColumns=function(){return this.iColumns;};p.prototype.onsapprevious=function(E){var r=e(this.getRootDomRef(),E.target),A=E.keyCode===K.ARROW_UP&&this.getFocusedIndex()===0;if(!r){return;}if(!A){I.prototype.onsapprevious.apply(this,arguments);return;}E.preventDefault();this.fireEvent(I.Events.BorderReached,{index:0,event:E});};p.prototype.onsapnext=function(E){var r=e(this.getRootDomRef(),E.target),s,t,u;if(!r){return;}if(E.keyCode!==K.ARROW_DOWN){I.prototype.onsapnext.apply(this,arguments);return;}t=this.getFocusedIndex();u=this._getItemInfo(t);if(u.bIsLastItem&&u.bIsInTheLastColumn){E.preventDefault();this.fireEvent(I.Events.BorderReached,{index:t,event:E});return;}if(u.bNextRowExists&&!u.bItemSameColumnNextRowExists){E.preventDefault();s=this.getItemDomRefs();s[s.length-1].focus();return;}I.prototype.onsapnext.apply(this,arguments);};p.prototype.onsaphome=function(E){var r=e(this.getRootDomRef(),E.target),s;if(!r){return;}s=this._getItemInfo(this.getFocusedIndex());if(!s.bIsInTheFirstColumn){I.prototype.onsaphome.apply(this,arguments);return;}E.preventDefault();if(s.bIsFirstItem){this.fireEvent(I.Events.BorderReached,{index:0,event:E});}else{this.getItemDomRefs()[0].focus();}};p.prototype.onsapend=function(E){var r=e(this.getRootDomRef(),E.target),s;if(!r){return;}s=this._getItemInfo(this.getFocusedIndex());if(!(s.bIsLastItem||s.bIsInTheLastColumn)){I.prototype.onsapend.apply(this,arguments);return;}E.preventDefault();if(s.bIsLastItem){this.fireEvent(I.Events.BorderReached,{index:this.getItemDomRefs().length-1,event:E});}else{this.getItemDomRefs()[this.getItemDomRefs().length-1].focus();}};p.prototype._getItemInfo=function(r){var s=this.getItemDomRefs().length,t=r===(s-1),u=s>this.getColumns()?this.getColumns():s,v=r%this.getColumns()===0,w=(r+1)%u===0,x=Math.floor(r/this.getColumns())+1,N,y;N=x*this.getColumns()<s;y=N&&(r+this.getColumns())<s;return{bIsFirstItem:r===0,bIsLastItem:t,bIsInTheLastColumn:w,bIsInTheFirstColumn:v,bNextRowExists:N,bItemSameColumnNextRowExists:y};};p.prototype._getIndexOfTheFirstItemInLastRow=function(){return Math.floor((this.getItemDomRefs().length-1)/this.getColumns())*this.getColumns();};o.prototype._ItemNavigation=p;o.prototype._ColorsHelper={RGB_TO_NAMED_COLORS_MAP:{"#FFB200":"gold","#FF8C00":"darkorange","#CD5C5C":"indianred","#8B008B":"darkmagenta","#6495ED":"cornflowerblue","#00BFFF":"deepskyblue","#008B8B":"darkcyan","#6B8E23":"olivedrab","#2F4F4F":"darkslategray","#F0FFFF":"azure","#FFFFFF":"white","#D3D3D3":"lightgray","#A9A9A9":"darkgray","#696969":"dimgray","#000000":"black"},NAME_COLORS_TO_RGB_MAP:{"gold":"#FFB200","darkorange":"#FF8C00","indianred":"#CD5C5C","darkmagenta":"#8B008B","cornflowerblue":"#6495ED","deepskyblue":"#00BFFF","darkcyan":"#008B8B","olivedrab":"#6B8E23","darkslategray":"#2F4F4F","azure":"#F0FFFF","white":"#FFFFFF","lightgray":"#D3D3D3","darkgray":"#A9A9A9","dimgray":"#696969","black":"#000000"},getNamedColor:function(s){var H="";if(!s||s.toLowerCase().indexOf("hsl")!==-1){return undefined;}if(s.indexOf("#")===-1){return this.NAME_COLORS_TO_RGB_MAP[s.toLowerCase()]?s.toLowerCase():undefined;}if(s.length===4){H=["#",s[1],s[1],s[2],s[2],s[3],s[3]].join("");}else{H=s;}H=H.toUpperCase();return this.RGB_TO_NAMED_COLORS_MAP[H];}};return o;});