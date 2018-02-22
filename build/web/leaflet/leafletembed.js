/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// set up AJAX request


function getXmlHttpObject() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return null;
}

var map;
var ajaxRequest;
var plotlist;
var plotlayers = [];
var LeafIcon;
var greenIcon;
var markerGroup;
var marker;
var url = "http://192.168.0.107:8082/getAllLoc?key=25";
function askForPlots() {
    // request the marker info with AJAX for the current bounds
    var bounds = map.getBounds();
    var minll = bounds.getSouthWest();
    var maxll = bounds.getNorthEast();
    var msg = 'leaflet/findbybbox.cgi?format=leaflet&bbox=' + minll.lng + ',' + minll.lat + ',' + maxll.lng + ',' + maxll.lat;
    ajaxRequest.onreadystatechange = stateChanged;
    ajaxRequest.open('GET', msg, true);
    ajaxRequest.send(null);
    getLoc();

}
function initmap() {
    ajaxRequest = getXmlHttpObject();
    if (ajaxRequest === null) {
        alert("This browser does not support HTTP Request");
        return;
    }
    // set up the map
    map = new L.Map('map');

    // create the tile layer with correct attribution
    var osmUrl = 'http://192.168.0.105/hot/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org"> OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 08, maxZoom: 20, attribution: osmAttrib});

    // start the map in South-East England
    map.setView(new L.LatLng(17.4457309, 78.4881306), 9);
    map.addLayer(osm);
    LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: '', //http://localhost:8080/OSM/leaflet/images/marker-shadow.png
            iconSize: [70, 70], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 85], // the same for the shadow
            popupAnchor: [15, -90] // point from which the popup should open relative to the iconAnchor

        }
    });



//var redIcon = new LeafIcon({iconUrl:'http://localhost:8080/OSM/leaflet/images/layers.png'});
    greenIcon = new LeafIcon({iconUrl: 'images/blink.png'});

//L.marker([17.4404976,78.4758313], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
//marker = L.marker([17.4457309,78.4881306], {icon: greenIcon}).addTo(map).bindPopup("Sample Marker.");
    getLoc();

}

var animatedMarker;
var line;
var tracks;
function getLoc() {
    if (map.hasLayer(markerGroup)) {
        map.removeLayer(markerGroup);
    }
    markerGroup = L.layerGroup().addTo(map);

    L.marker([17.56566, 78.23652], {icon: greenIcon}).addTo(markerGroup);
    L.marker([17.2365, 78.32656], {icon: greenIcon}).addTo(markerGroup);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200)
        {

            console.log(this.responseText);
            var res = JSON.parse(this.responseText);
            // console.log(res);
            if (map.hasLayer(markerGroup))
            {
                map.removeLayer(markerGroup);
            }
            markerGroup = L.layerGroup().addTo(map);
            // map.addLayer(osm);
            if (res !== null) {
                console.log("Res=" + res);
                var err = "" + res.Error;
                if (err === "no") {
                    tracks = res.Tracks;
                    if (tracks !== null) {
                        for (i in tracks) {


                            var lat = tracks[i].lat, log = tracks[i].log;
                            //var newLatLng = new L.LatLng(lat, log);
                            console.log("new lat =" + lat + ", Log=" + log);
                            //var markerL = L.marker([lat,log], {icon: greenIcon}).addTo(map).bindPopup(""+tracks[i].driverName+"") 
                            var markerL = L.marker([lat, log], {icon: greenIcon});



                            L.marker([lat, log], {icon: greenIcon}).addTo(markerGroup);




                            markerL.addTo(markerGroup).bindPopup("" + tracks[i].driverName + "");
                            console.log("Marker =" + markerL.toString());
                            //console.log("Marker ="+marker);

                        }

                    } else {
                        document.getElementById("data").innerHTML = "Journey not yet started today..!";
                    }

                } else {
                    document.getElementById("data").innerHTML = "" + res.Message;
                }
            }

        } else if (this.readyState !== 4 && this.status === 408) {
            document.getElementById("data").innerHTML = "408 : Unable to reach " + url + " Kindly check with tech team!!";
        } else if (this.readyState !== 4 && this.status === 404) {
            document.getElementById("data").innerHTML = "404 : Unable to reach " + url + " Kindly check with tech team!!";
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("X-AUTH-TOKEN", "dsfsffdfds");
    xmlhttp.send();
    setTimeout(getLoc, 10000);

}



function stateChanged() {
    // if AJAX returned a list of markers, add them to the map
    if (ajaxRequest.readyState == 4) {
        //use the info here that was returned
        if (ajaxRequest.status == 200) {
            plotlist = eval("(" + ajaxRequest.responseText + ")");
            removeMarkers();
            for (i = 0; i < plotlist.length; i++) {
                var plotll = new L.LatLng(plotlist[i].lat, plotlist[i].lon, true);
                var plotmark = new L.Marker(plotll);
                plotmark.data = plotlist[i];
                map.addLayer(plotmark);
                plotmark.bindPopup("<h3>" + plotlist[i].name + "</h3>" + plotlist[i].details);
                plotlayers.push(plotmark);
            }
        }
    }
}

function removeMarkers() {
    for (i = 0; i < plotlayers.length; i++) {
        map.removeLayer(plotlayers[i]);
    }
    plotlayers = [];
}

// then add this as a new function...
function onMapMove(e) {
    alert("Map Moved");
    askForPlots();
}



/* 
 // * To change this license header, choose License Headers in Project Properties.
 // * To change this template file, choose Tools | Templates
 // * and open the template in the editor.
 // */
//// set up AJAX request
//
//
//function getXmlHttpObject() {
//	if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
//	if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
//	return null;
//}
//
//var map;
//var ajaxRequest;
//var plotlist;
//var plotlayers=[];
//function askForPlots() {
//	// request the marker info with AJAX for the current bounds
//	var bounds=map.getBounds();
//	var minll=bounds.getSouthWest();
//	var maxll=bounds.getNorthEast();
//	var msg='leaflet/findbybbox.cgi?format=leaflet&bbox='+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat;
//	ajaxRequest.onreadystatechange = stateChanged;
//	ajaxRequest.open('GET', msg, true);
//	ajaxRequest.send(null);
//}
//function initmap() {
//    ajaxRequest=getXmlHttpObject();
//if (ajaxRequest==null) {
//	alert ("This browser does not support HTTP Request");
//	return;
//}
//	// set up the map
//	map = new L.Map('map');
//
//	// create the tile layer with correct attribution
//	var osmUrl='http://123.201.150.240/hot/{z}/{x}/{y}.png';
//	var osmAttrib='Map data © <a href="http://openstreetmap.org"> OpenStreetMap</a> contributors';
//	var osm = new L.TileLayer(osmUrl, {minZoom: 10, maxZoom: 18, attribution: osmAttrib});		
//
//	// start the map in South-East England
//	map.setView(new L.LatLng(17.4457309,78.4881306),9);
//	map.addLayer(osm);
//        
//        var LeafIcon = L.Icon.extend({
//    options: {
//        shadowUrl: 'http://localhost:8080/OSM/leaflet/images/marker-shadow.png',
//        iconSize:     [38, 95],
//        shadowSize:   [50, 64],
//        iconAnchor:   [22, 94],
//        shadowAnchor: [4, 62],
//        popupAnchor:  [-3, -76]
//    }
//});
//       
//var redIcon = new LeafIcon({iconUrl:'http://localhost:8080/OSM/leaflet/images/layers.png'});
//var greenIcon = new LeafIcon({iconUrl:'http://localhost:8080/OSM/leaflet/images/marker-icon.png'});
//
//        var marker = L.marker([17.4462868,78.4853797], {icon: greenIcon}).addTo(map).bindPopup("Sample Marker.");
//        L.marker([17.4404976,78.4758313], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
//L.marker([17.4373306,78.466933], {icon: redIcon}).addTo(map).bindPopup("I am a red leaf.");
//        console.log(marker);
//      
//        
//        
//}
//function stateChanged() {
//	// if AJAX returned a list of markers, add them to the map
//	if (ajaxRequest.readyState==4) {
//		//use the info here that was returned
//		if (ajaxRequest.status==200) {
//			plotlist=eval("(" + ajaxRequest.responseText + ")");
//			removeMarkers();
//			for (i=0;i<plotlist.length;i++) {
//				var plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
//				var plotmark = new L.Marker(plotll);
//				plotmark.data=plotlist[i];
//				map.addLayer(plotmark);
//				plotmark.bindPopup("<h3>"+plotlist[i].name+"</h3>"+plotlist[i].details);
//				plotlayers.push(plotmark);
//			}
//		}
//	}
//}
//
//function removeMarkers() {
//	for (i=0;i<plotlayers.length;i++) {
//		map.removeLayer(plotlayers[i]);
//	}
//	plotlayers=[];
//}
//
//// then add this as a new function...
//    function onMapMove(e) {
//        alert("Map Moved");
//        askForPlots(); }
//    
//    
//    
//
