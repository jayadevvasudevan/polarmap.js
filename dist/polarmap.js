/*
 PolarMap.js 0.6.2 (de4a964)
 (c) 2014-2015 Arctic Connect, Geo Sensor Web Lab
*/
!function(t,o,e,n){if("undefined"==typeof e)var e={};e.PolarMap={version:"0.6.2",Control:{},Util:{}},"object"==typeof module&&"object"==typeof module.exports?module.exports=e.PolarMap:"function"==typeof define&&define.amd&&define(e.PolarMap),e.PolarMap.Control.Rotation=e.Control.extend({options:{position:"topright",cwText:"&orarr;",cwTitle:"Rotate Clockwise",ccwText:"&olarr;",ccwTitle:"Rotate Counter-Clockwise"},onAdd:function(){var t="leaflet-control-rotation",o=e.DomUtil.create("div",t+" leaflet-bar"),n=this.options;return this._cwButton=this._createButton(n.cwText,n.cwTitle,t+"-cw",o,this._rotateCW),this._ccwButton=this._createButton(n.ccwText,n.ccwTitle,t+"-ccw",o,this._rotateCCW),o},_rotateCW:function(){this.options.onRotateCW&&this.options.onRotateCW()},_rotateCCW:function(){this.options.onRotateCCW&&this.options.onRotateCCW()},_createButton:function(t,o,n,i,a){var s=e.DomUtil.create("a",n,i);return s.innerHTML=t,s.href="#",s.title=o,e.DomEvent.on(s,"mousedown dblclick",e.DomEvent.stopPropagation).on(s,"click",e.DomEvent.stop).on(s,"click",a,this).on(s,"click",this._refocusOnMap,this),s}}),e.PolarMap.Control.rotation=function(t){return new e.PolarMap.Control.Rotation(t)},e.PolarMap.TileLayer=e.TileLayer.extend({}),e.PolarMap.tileLayer=function(t,o){return new e.PolarMap.TileLayer(t,o)};var i=20037509.762000002;e.PolarMap.layer3573=e.PolarMap.tileLayer("http://{s}.tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png",{name:"ac_3573",crs:"EPSG:3573",minZoom:0,maxZoom:18,tms:!1,origin:[-i,i],maxResolution:(i- -i)/256,projectedBounds:e.bounds(e.point(-i,i),e.point(i,-i)),center:[90,0],zoom:4,continuousWorld:!1,noWrap:!0,attribution:'Map &copy; <a href="http://arcticconnect.org">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}),e.PolarMap.Util.Hash=e.Class.extend({options:{map:null,lastHash:null,movingMap:!1,changeDefer:100,changeTimeout:null,isListening:!1,hashChangeInterval:null,getBaseLayer:null,setBaseLayer:null},initialize:function(o,i){i=e.setOptions(this,i),this.HAS_HASHCHANGE=function(){var o=t.documentMode;return"onhashchange"in t&&(o===n||o>7)}(),this.onHashChange=e.Util.bind(this.onHashChange,this),this.map=o,this.options.lastHash=null,this.onHashChange(),this.options.isListening||this.startListening()},formatHash:function(t){var o=[],e=t.getCenter(),n=t.getZoom(),i=Math.max(0,Math.ceil(Math.log(n)/Math.LN2));return null!==this.options.getBaseLayer&&o.push(this.options.getBaseLayer()),o.push(n,e.lat.toFixed(i),e.lng.toFixed(i)),"#"+o.join("/")},onHashChange:function(){if(!this.options.changeTimeout){var t=this;this.options.changeTimeout=setTimeout(function(){t.update(),t.options.changeTimeout=null},this.options.changeDefer)}},onMapMove:function(){if(this.options.movingMap||!this.map._loaded)return!1;var t=this.formatHash(this.map);this.options.lastHash!=t&&(location.replace(t),this.options.lastHash=t)},parseHash:function(t){0===t.indexOf("#")&&(t=t.substr(1));var o=t.split("/");if(4===o.length){var n=o[0],i=parseInt(o[1],10),a=parseFloat(o[2]),s=parseFloat(o[3]);return""===n||isNaN(i)||isNaN(a)||isNaN(s)?!1:{baseLayer:n,center:new e.LatLng(a,s),zoom:i}}if(3===o.length){var i=parseInt(o[0],10),a=parseFloat(o[1]),s=parseFloat(o[2]);return isNaN(i)||isNaN(a)||isNaN(s)?!1:{center:new e.LatLng(a,s),zoom:i}}return!1},removeFrom:function(){this.options.changeTimeout&&clearTimeout(this.options.changeTimeout),this.options.isListening&&this.stopListening(),this.map=null},startListening:function(){this.map.on("moveend",this.onMapMove,this),this.HAS_HASHCHANGE?e.DomEvent.addListener(t,"hashchange",this.onHashChange):(clearInterval(this.options.hashChangeInterval),this.options.hashChangeInterval=setInterval(this.onHashChange,50)),this.options.isListening=!0},stopListening:function(){this.map.off("moveend",this.onMapMove,this),this.HAS_HASHCHANGE?e.DomEvent.removeListener(t,"hashchange",this.onHashChange):clearInterval(this.options.hashChangeInterval),this.options.isListening=!1},update:function(){var t=location.hash;if(t!==this.options.lastHash){var o=this.parseHash(t);o?(this.options.movingMap=!0,o.baseLayer!==n&&this.options.setBaseLayer(o.baseLayer),this.map.setView(o.center,o.zoom),this.options.movingMap=!1):this.onMapMove(this.map)}}}),e.PolarMap.Util.hash=function(t,o){return new e.PolarMap.Util.Hash(t,o)},e.PolarMap.Map=e.Map.extend({options:{changingMap:!1,fadeAnimation:!0,trackResize:!0,markerZoomAnimation:!0,center:e.latLng([90,0]),zoom:1},initialize:function(t,o){o=e.setOptions(this,o);o.baseLayer.options;this._initContainer(t),this._initLayout(),this._onResize=e.bind(this._onResize,this),this._initEvents(),o.maxBounds&&this.setMaxBounds(o.maxBounds),o.center&&o.zoom!==n&&this.setView(e.latLng(o.center),o.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this.callInitHooks(),this.on("baselayerchange",function(t){t.layer.options;this._update(t.layer)}),this._update(o.baseLayer)},loadTileProjection:function(t){if(this.options.changingMap)return!1;if(this._usingTileProjection(t))console.log("That tile layer is already active.");else{{t.options}this._dropTileLayers(),this._update(t)}},_defineMapCRS:function(t,o){for(var n=[],i=o.minZoom;i<=o.maxZoom;i++)n.push(o.maxResolution/Math.pow(2,i));return new e.Proj.CRS(t,o.proj4def,{origin:o.origin,resolutions:n,bounds:o.projectedBounds})},_dropTileLayers:function(){var t=this;t.eachLayer(function(o){o instanceof e.TileLayer&&t.removeLayer(o)})},_setMapCRS:function(t,o){switch(t){case"EPSG:3857":return e.CRS.EPSG3857;case"EPSG:3395":return e.CRS.EPSG3395;case"EPSG:4326":return e.CRS.EPSG4326;default:return this._defineMapCRS(t,o)}},_update:function(t){if(this.options.changingMap)return!1;this.options.changingMap=!0;var o=this.getCenter(),e=this.getZoom();this._updateCRSAndLayers(t.options),this.addLayer(t,!0),this.setView(o,e,{reset:!0}),this.setMaxBounds(t.options.bounds),this.options.changingMap=!1},_updateAllLayers:function(t){var o=this;t.eachLayer?t.eachLayer(function(t){o._updateAllLayers(t)}):t.redraw?t.redraw():t.update?t.update():console.log("Don't know how to update",t)},_updateCRSAndLayers:function(t){this.options.crs=this._setMapCRS(t.crs,t),this._updateAllLayers(this)},_usingTileProjection:function(t){var o=!1,e=this._layers;for(var n in e)if(o=e[n]===t)break;return o}}),e.PolarMap.map=function(t,o){return new e.PolarMap.Map(t,o)};var a={tileHeader:"Arctic Connect: ",attribution:'Map &copy; <a href="http://arcticconnect.org">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',locationDetectionError:"Location detection error: "};proj4.defs([["EPSG:3571","+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],["EPSG:3572","+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],["EPSG:3573","+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],["EPSG:3574","+proj=laea +lat_0=90 +lon_0=-40 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],["EPSG:3575","+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],["EPSG:3576","+proj=laea +lat_0=90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"]]);for(var s=["EPSG:3571","EPSG:3572","EPSG:3573","EPSG:3574","EPSG:3575","EPSG:3576"],r={},i=20037509.762000002,h=0;h<s.length;h++){var l=s[h],p=3571+h,c="http://{s}.tiles.arcticconnect.org/osm_"+p+"/{z}/{x}/{y}.png";r[a.tileHeader+l]=e.PolarMap.tileLayer(c,{name:"ac_"+p,crs:l,minZoom:0,maxZoom:18,tms:!1,origin:[-i,i],maxResolution:(i- -i)/256,projectedBounds:e.bounds(e.point(-i,i),e.point(i,-i)),continuousWorld:!1,noWrap:!0,attribution:a.attribution})}for(var h=0;6>h;h++){var u=0===h?5:h-1,d=5===h?0:h+1,m=r[a.tileHeader+"EPSG:"+(3571+h)];m.prev=r[a.tileHeader+"EPSG:"+(3571+u)],m.next=r[a.tileHeader+"EPSG:"+(3571+d)]}t.PolarMap=e.Class.extend({options:{geosearch:!1,locate:!1,permalink:!0},statics:{VERSION:e.PolarMap.version},initialize:function(t,o){var n=this;e.Util.setOptions(this,o),this.tiles=r,this.layersControl=e.control.layers(this.tiles,null),this.rotationControls=e.PolarMap.Control.rotation({onRotateCW:function(){n.map.loadTileProjection(n.getBaseLayer().next)},onRotateCCW:function(){n.map.loadTileProjection(n.getBaseLayer().prev)}}),this.map=e.PolarMap.map(t,{baseLayer:this.tiles[a.tileHeader+"EPSG:3573"],center:[90,0],zoom:4}),this.layersControl.addTo(this.map),this.rotationControls.addTo(this.map),this.options.geosearch&&this._initGeosearch(),this.options.locate&&this._initLocate(),this.options.permalink&&this._initPermalink()},addLayer:function(t,o){this.map.addLayer(t),"undefined"!=typeof o&&o.switcher&&this.layersControl.addOverlay(t,o.name)},getBaseLayer:function(){var t=null;for(var o in this.tiles)this.tiles.hasOwnProperty(o)&&this.map.hasLayer(this.tiles[o])&&(t=this.tiles[o]);return t},_initGeosearch:function(){new e.Control.GeoSearch({provider:new e.GeoSearch.Provider.OpenStreetMap,showMarker:!1}).addTo(this.map)},_initLocate:function(){var t=this,o=e.circle();this.map.on("locationfound",function(e){o.setLatLng(e.latlng),o.setRadius(e.accuracy),t.map.hasLayer(o)||o.addTo(t.map),t._setProjectionForLongitude(e.longitude)}),this.map.on("locationerror",function(t){console.warn(a.locationDetectionError,t)}),this.map.locate()},_initPermalink:function(){var t=this;this.hash=e.PolarMap.Util.hash(this.map,{getBaseLayer:function(){return t.getBaseLayer().options.name},setBaseLayer:function(o){t._setBaseLayer(o)}})},_setBaseLayer:function(t){var o=this;for(var e in this.tiles)this.tiles.hasOwnProperty(e)&&this.tiles[e].options.name===t&&o.map.loadTileProjection(this.tiles[e])},_setProjectionForLongitude:function(t){var o;o=t>=-180&&-165>=t?"EPSG:3571":t>-165&&-125>=t?"EPSG:3572":t>-125&&-70>=t?"EPSG:3573":t>-70&&-15>=t?"EPSG:3574":t>-15&&50>=t?"EPSG:3575":t>50&&135>=t?"EPSG:3576":"EPSG:3571",this.map.loadTileProjection(this.tiles[a.tileHeader+o])}}),t.polarMap=function(t,o){return new PolarMap(t,o)}}(window,document,L);