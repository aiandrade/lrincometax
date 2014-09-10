/*
Copyright (C) 2011 - 2012 Alexander Zagniotov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//http://stackoverflow.com/questions/4845762/onload-handler-for-script-tag-in-internet-explorer
	(function () {
		if (typeof jQuery === "undefined" || jQuery == null ) {
			var done = false;
			var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
   			var script = document.createElement('script');
   			script.type= 'text/javascript';
   			script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";

			script.onload = script.onreadystatechange = function() {
    			if ( !done && (!this.readyState || /loaded|complete/.test( script.readyState ))) {
        			done = true;

					var jQueryObj = jQuery.noConflict();
					jQueryLoadCallback(jQueryObj);
        			// Handle memory leak in IE
        			script.onload = script.onreadystatechange = null;
        			if ( head && script.parentNode ) {
            			head.removeChild( script );
        			}
					script = undefined;
    			}
			};
			// Use insertBefore instead of appendChild  to circumvent an IE6 bug - die IE6, just die! A.Z.
			// head.insertBefore( script, head.firstChild );
			head.appendChild(script);
		} else {
			jQueryLoadCallback();
		}

		function jQueryLoadCallback() {
			var jQueryObj = (typeof arguments[0] === "undefined" || arguments[0] == null || !arguments[0]) ? jQuery : arguments[0];

			(function ($) {

				var parseJson = function(jsonString) { Logger.fatal("Using parseJson stub.."); }
				var version = parseFloat($.fn.jquery);
				if (version >= 1.4) {
					parseJson = $.parseJSON;
				} else if (window.JSON && window.JSON.parse) {
					parseJson =  window.JSON.parse;
				}

				var CGMPGlobal = {};
				var GoogleMapOrchestrator = (function() {

					var builder = {};
					var googleMap = {};
					var initMap = function initMap(map, bubbleAutoPan, zoom, mapType)  {
						googleMap = map;

						var mapTypeIds = [];
						for(var type in google.maps.MapTypeId) {
							mapTypeIds.push(google.maps.MapTypeId[type]);
						}

						if (mapType == "OSM") {
							mapTypeIds.push(mapType);
							googleMap.mapTypes.set(mapType, new google.maps.ImageMapType({
								getTileUrl: function(coord, zoom) {
									return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
								},
								tileSize: new google.maps.Size(256, 256),
								name: "OpenStreet",
								maxZoom: 20
							}));
						} else if (mapType == "roadmap".toUpperCase()) {
							mapType = google.maps.MapTypeId.ROADMAP;
						} else if (mapType == "satellite".toUpperCase()) {
							mapType = google.maps.MapTypeId.SATELLITE;
						} else if (mapType == "hybrid".toUpperCase()) {
							mapType = google.maps.MapTypeId.HYBRID;
						} else if (mapType == "terrain".toUpperCase()) {
							mapType = google.maps.MapTypeId.TERRAIN;
						}

						googleMap.setOptions({
							zoom: zoom,
							mapTypeId: mapType,
							mapTypeControlOptions: {mapTypeIds: mapTypeIds}
						});
					}

					var setMapControls = function setMapControls(mapControlOptions) {
						googleMap.setOptions(mapControlOptions);
					}

					return {
						initMap: initMap,
						setMapControls: setMapControls
					}
				})();


				var LayerBuilder = (function() {

					var googleMap = {};

					var init = function init(map) {
						googleMap = map;
					}

					var buildTrafficLayer = function buildTrafficLayer() {
						var trafficLayer = new google.maps.TrafficLayer();
						trafficLayer.setMap(googleMap);
					}

					var buildBikeLayer = function buildBikeLayer() {
						var bikeLayer = new google.maps.BicyclingLayer();
						bikeLayer.setMap(googleMap);
					}

					var buildPanoramioLayer = function buildPanoramioLayer(userId) {
						if (typeof google.maps.panoramio == "undefined" || !google.maps.panoramio || google.maps.panoramio == null ) {
							Logger.error("We cannot access Panoramio library. Aborting..");
							return false;
						}
						var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
						if (panoramioLayer) {
							if (userId != null && userId != "") {
								panoramioLayer.setUserId(userId);
							}
							panoramioLayer.setMap(googleMap);
						} else {
							Logger.error("Could not instantiate Panoramio object. Aborting..");
						}
					}

					var buildKmlLayer = function buildKmlLayer(url) {
						if (url.toLowerCase().indexOf("http") < 0) {
							Logger.error("KML URL must start with HTTP(S). Aborting..");
							return false;
						}

						var kmlLayer = new google.maps.KmlLayer(url/*, {preserveViewport: true}*/);
						google.maps.event.addListener(kmlLayer, "status_changed", function() {
							kmlLayerStatusEventCallback(kmlLayer);
						});
                  google.maps.event.addListener(kmlLayer, 'defaultviewport_changed', function() {
                     //var bounds = kmlLayer.getDefaultViewport();
                     //googleMap.setCenter(bounds.getCenter());
                  });

						kmlLayer.setMap(googleMap);
					}

					function kmlLayerStatusEventCallback(kmlLayer)  {
							var kmlStatus = kmlLayer.getStatus();
							if (kmlStatus == google.maps.KmlLayerStatus.OK) {
								//Hmmm...
							} else {
								var msg = '';
								switch(kmlStatus) {

										case google.maps.KmlLayerStatus.DOCUMENT_NOT_FOUND:
											msg = CGMPGlobal.errors.kmlNotFound;
										break;
										case google.maps.KmlLayerStatus.DOCUMENT_TOO_LARGE:
											msg = CGMPGlobal.errors.kmlTooLarge;
										break;
										case google.maps.KmlLayerStatus.FETCH_ERROR:
											msg = CGMPGlobal.errors.kmlFetchError;
										break;
										case google.maps.KmlLayerStatus.INVALID_DOCUMENT:
											msg = CGMPGlobal.errors.kmlDocInvalid;
										break;
										case google.maps.KmlLayerStatus.INVALID_REQUEST:
											msg = CGMPGlobal.errors.kmlRequestInvalid;
										break;
										case google.maps.KmlLayerStatus.LIMITS_EXCEEDED:
											msg = CGMPGlobal.errors.kmlLimits;
										break;
										case google.maps.KmlLayerStatus.TIMED_OUT:
											msg = CGMPGlobal.errors.kmlTimedOut;
										break;
										case google.maps.KmlLayerStatus.UNKNOWN:
											msg = CGMPGlobal.errors.kmlUnknown;
										break;
									}
							if (msg != '') {
								var error = CGMPGlobal.errors.kml.replace("[MSG]", msg);
								error = error.replace("[STATUS]", kmlStatus);
								Errors.alertError(error);
								Logger.error("Google returned KML error: " + msg + " (" + kmlStatus + ")");
								Logger.error("KML file: " + kmlLayer.getUrl());
							}
						}
					}

					return {
						init: init,
						buildKmlLayer: buildKmlLayer,
						buildTrafficLayer: buildTrafficLayer,
						buildBikeLayer: buildBikeLayer,
						buildPanoramioLayer: buildPanoramioLayer
					}
				})();



				
				var MarkerBuilder = function () {

					var markers, storedAddresses, badAddresses, wasBuildAddressMarkersCalled, timeout, directionControlsBinded,
					googleMap, csvString, bubbleAutoPan, originalExtendedBounds, originalMapCenter, updatedZoom, mapDivId,
					geocoder, bounds, infowindow, streetViewService, directionsRenderer, directionsService;

					var init = function init(map, autoPan) {

						googleMap = map;
						mapDivId = googleMap.getDiv().id;
						bubbleAutoPan = autoPan;

						google.maps.event.addListener(googleMap, 'click', function () {
							resetMap();
						});

						markers = [];
						badAddresses = [];
						storedAddresses = [];

						updatedZoom = 5;

						timeout = null;
						csvString = null;
						originalMapCenter = null;
						originalExtendedBounds = null;

						directionControlsBinded = false;
						wasBuildAddressMarkersCalled = false;

						geocoder = new google.maps.Geocoder();
						bounds = new google.maps.LatLngBounds();
						infowindow = new google.maps.InfoWindow();
						streetViewService = new google.maps.StreetViewService();

						directionsService = new google.maps.DirectionsService();

						rendererOptions = {
							draggable: true
						};
						directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
						directionsRenderer.setPanel(document.getElementById('rendered-directions-placeholder-' + mapDivId));
					}

					var isBuildAddressMarkersCalled = function isBuildAddressMarkersCalled() {
						return wasBuildAddressMarkersCalled;
					}

					var buildAddressMarkers = function buildAddressMarkers(markerLocations, isGeoMashap, isBubbleContainsPostLink) {

						wasBuildAddressMarkersCalled = true;
						csvString = Utils.trim(markerLocations);
						csvString = Utils.searchReplace(csvString, "'", "");

						if (isGeoMashap === "true") {
							var json = parseJson(csvString);

							if (isBubbleContainsPostLink === "true") {
								parseJsonStructure(json, true);
							} else if (isBubbleContainsPostLink === "false") {
								parseJsonStructure(json, false);
							}
							queryGeocoderService();

						} else if (isGeoMashap == null || isGeoMashap === "false") {
							parseCsv();
							queryGeocoderService();
						}
					}


					function resetMap()  {
						if (originalExtendedBounds != null) {
							if (googleMap.getCenter() != originalExtendedBounds.getCenter()) {
								//Logger.info("Panning map back to its original bounds center: " + originalExtendedBounds.getCenter());
								googleMap.fitBounds(originalExtendedBounds);
								googleMap.setCenter(originalExtendedBounds.getCenter());
							}
						} else 	if (originalMapCenter != null) {
							//Logger.info("Panning map back to its original center: " + originalMapCenter  + " and updated zoom: " + updatedZoom);
							googleMap.setCenter(originalMapCenter);
							googleMap.setZoom(updatedZoom);
						}
					}

					function resetDirectionAddressFields(dirDivId)  {
						$(dirDivId + ' input#a_address').val('');
						$(dirDivId + ' input#b_address').val('');
						$(dirDivId + ' input#a_address').removeClass('d_error');
						$(dirDivId + ' input#b_address').removeClass('d_error');
					}

					function attachEventlistener(marker, markersElement) {

						var localBubbleData = buildBubble(marker.content, markersElement);
						var dirDivId = 'div#direction-controls-placeholder-' + mapDivId;
						var targetDiv = $("div#rendered-directions-placeholder-" + mapDivId);

						google.maps.event.addListener(marker, 'click', function () {

							resetDirectionAddressFields(dirDivId);

							$(dirDivId).fadeOut();
							directionsRenderer.setMap(null);
							targetDiv.html("");
							targetDiv.hide();
							$(dirDivId + ' button#print_sub').hide();

                     validateMarkerStreetViewExists(marker, localBubbleData, dirDivId);
                     attachEventstoDirectionControls(marker, localBubbleData, dirDivId, targetDiv);

							infowindow.setContent(localBubbleData.bubbleContent);
							infowindow.setOptions({disableAutoPan: bubbleAutoPan == "true" ? false : true });
							infowindow.open(googleMap, this);
						});                  
					}

					function attachEventstoDirectionControls(marker, localBubbleData, dirDivId, targetDiv)  {

						var parentInfoBubble = 'div#bubble-' + localBubbleData.bubbleHolderId;
						var addy = marker.content;

						addy = addy.replace("Lat/Long: ", "");

						$(parentInfoBubble + ' a.dirToHereTrigger').live("click", function() {
							var thisId = this.id;
							if (thisId == 'toHere-' + localBubbleData.bubbleHolderId) {
								$(dirDivId).fadeIn();
								$(dirDivId + ' input#a_address').val('');
								$(dirDivId + ' input#b_address').val(addy);
								$(dirDivId + ' input#radio_miles').attr("checked", "checked");
							}
						});

						$(parentInfoBubble + ' a.dirFromHereTrigger').live("click", function() {
							var thisId = this.id;
							if (thisId == 'fromHere-' + localBubbleData.bubbleHolderId) {
								$(dirDivId).fadeIn();
								$(dirDivId + ' input#a_address').val(addy);
								$(dirDivId + ' input#b_address').val('');
								$(dirDivId + ' input#radio_miles').attr("checked", "checked");
							}
						});

						$(dirDivId + ' div.d_close-wrapper').live("click", function(event) {

								resetDirectionAddressFields(dirDivId);

								$(this).parent().fadeOut();
								directionsRenderer.setMap(null);
								targetDiv.html("");
								targetDiv.hide();
								$(dirDivId + ' button#print_sub').hide();
								resetMap();

								return false;
						});
					}

					function validateMarkerStreetViewExists(marker, localBubbleData, dirDivId)  {

						streetViewService.getPanoramaByLocation(marker.position, 50, function (streetViewPanoramaData, status) {
							if (status === google.maps.StreetViewStatus.OK) {
								// ok
									$('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function() {

										var panoramaOptions = {
												navigationControl: true,
												enableCloseButton: true,
												addressControl: false,
												linksControl: true,
												scrollwheel: false,
												addressControlOptions: {
													position: google.maps.ControlPosition.BOTTOM
												},
												position: marker.position,
												pov: {
													heading: 165,
													pitch:0,
													zoom:1
												}
										};	

										var pano = new google.maps.StreetViewPanorama(document.getElementById("bubble-" + localBubbleData.bubbleHolderId), panoramaOptions);
										pano.setVisible(true);

										google.maps.event.addListener(infowindow, 'closeclick', function() {

											resetDirectionAddressFields(dirDivId);
											$(dirDivId).fadeOut();

											if (pano != null) {
												pano.unbind("position");
												pano.setVisible(false);
											}

											pano = null;
										});

										google.maps.event.addListener(pano, 'closeclick', function() {
											if (pano != null) {
												pano.unbind("position");
												pano.setVisible(false);
												$('div#bubble-' + localBubbleData.bubbleHolderId).css("background", "none");
											}

											pano = null;
										});

								});
							} else {
								// no street view available in this range, or some error occurred
								//Logger.warn("There is not street view available for this marker location: " + marker.position + " status: " + status);
								$('a#trigger-' + localBubbleData.bubbleHolderId).live("click", function(e) {
									e.preventDefault();
								});
								$('a#trigger-' + localBubbleData.bubbleHolderId).attr("style", "text-decoration: none !important; color: #ddd !important");

								google.maps.event.addListener(infowindow, 'domready', function () {
									$('a#trigger-' + localBubbleData.bubbleHolderId).removeAttr("href");
									$('a#trigger-' + localBubbleData.bubbleHolderId).attr("style", "text-decoration: none !important; color: #ddd !important");
								});
							}
						});
					}


					function bindDirectionControlsToEvents()  {

						var dirDivId = 'div#direction-controls-placeholder-' + mapDivId;
						var targetDiv = $("div#rendered-directions-placeholder-" + mapDivId);

						$(dirDivId + ' a#reverse-btn').live("click", function(e) {

								var old_a_addr = $(dirDivId + ' input#a_address').val();
								var old_b_addr = $(dirDivId + ' input#b_address').val();

								$(dirDivId + ' input#a_address').val(old_b_addr);
								$(dirDivId + ' input#b_address').val(old_a_addr);
								return false;
						});

						$(dirDivId + ' a#d_options_show').live("click", function() {
								$(dirDivId + ' a#d_options_hide').show();
								$(dirDivId + ' a#d_options_show').hide();
								$(dirDivId + ' div#d_options').show();
								return false;
						});

						$(dirDivId + ' a#d_options_hide').live("click", function() {
								$(dirDivId + ' a#d_options_hide').hide();
								$(dirDivId + ' a#d_options_show').show();
								$(dirDivId + ' div#d_options').hide();
								$(dirDivId + ' input#avoid_hway').removeAttr("checked");
								$(dirDivId + ' input#avoid_tolls').removeAttr("checked");
								$(dirDivId + ' input#radio_km').removeAttr("checked");
								$(dirDivId + ' input#radio_miles').attr("checked", "checked");
								return false;
						});
				
						$(dirDivId + ' button#d_sub').live("click", function() {
								var old_a_addr = $(dirDivId + ' input#a_address').val();
								var old_b_addr = $(dirDivId + ' input#b_address').val();
								var halt = false;
								if (old_a_addr == null || old_a_addr == '') {
									$(dirDivId + ' input#a_address').addClass('d_error');
									halt = true;
								}
					
								if (old_b_addr == null || old_b_addr == '') {
									$(dirDivId + ' input#b_address').addClass('d_error');
									halt = true;
								}

								if (!halt) {

									$(dirDivId + ' button#d_sub').attr('disabled', 'disabled').html("Please wait..");
									// Query direction service
									var travelMode = google.maps.DirectionsTravelMode.DRIVING;
									if ($(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
										travelMode = google.maps.DirectionsTravelMode.WALKING;
									}

									var is_avoid_hway = $(dirDivId + ' input#avoid_hway').is(":checked");
									var is_avoid_tolls = $(dirDivId + ' input#avoid_tolls').is(":checked");
									var is_miles = $(dirDivId + ' input#radio_miles').is(":checked");
									var unitSystem = google.maps.DirectionsUnitSystem.METRIC;

									var request = {
										origin: old_a_addr,
										destination: old_b_addr,
										travelMode: travelMode,
										provideRouteAlternatives: true
									};

									if (is_avoid_hway) {
										request.avoidHighways = true;
									} 

									if (is_avoid_tolls) {
										request.avoidTolls = true;
									}

									if (is_miles) {
										request.unitSystem = google.maps.DirectionsUnitSystem.IMPERIAL;
									} else {
										request.unitSystem = google.maps.DirectionsUnitSystem.METRIC;
									}

									directionsService.route(request, function(response, status) {

										if (status == google.maps.DirectionsStatus.OK) {
											targetDiv.html("");
											targetDiv.show();
											directionsRenderer.setMap(googleMap);
											directionsRenderer.setDirections(response);
											$(dirDivId + ' button#d_sub').removeAttr('disabled').html("Get directions");
											$(dirDivId + ' button#print_sub').fadeIn();
											infowindow.close();

										} else {
											//Logger.error('Could not route directions from "' + old_a_addr + '" to "' + old_b_addr + '", got result from Google: ' + status);
											targetDiv.html("<span style='font-size: 12px; font-weight: bold; color: red'>Could not route directions from<br />'" + old_a_addr + "' to<br />'" + old_b_addr + "'<br />Got result from Google: [" + status + "]</span>");

											$(dirDivId + ' button#print_sub').hide();
											$(dirDivId + ' button#d_sub').removeAttr('disabled').html("Get directions");
										}
									});
								}
						});

						$(dirDivId + ' button#print_sub').live("click", function() {
							var old_a_addr = $(dirDivId + ' input#a_address').val();
							var old_b_addr = $(dirDivId + ' input#b_address').val();

							var dirflag = "d";
							if ($(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
								dirflag = "w";
							}

							var url = "http://maps.google.com/?saddr=" + old_a_addr + "&daddr=" + old_b_addr + "&dirflg=" + dirflag + "&pw=2";
							var is_miles = $(dirDivId + ' input#radio_miles').is(":checked");
							if (is_miles) {
								url += "&doflg=ptm";
							}

							window.open( url );
							return false;
						});

						$(dirDivId + ' input#a_address').live("change focus", function() {
							$(dirDivId + ' input#a_address').removeClass('d_error');
							return false;
						});

						$(dirDivId + ' input#b_address').live("change focus", function() {
							$(dirDivId + ' input#b_address').removeClass('d_error');
							return false;
						});


						$(dirDivId + ' .kd-button').live("click", function() {
							var thisId = this.id;

							if (thisId == 'dir_d_btn') {
								if ($(dirDivId + ' a#dir_d_btn').hasClass('selected')) {
									//Logger.warn("Driving travel mode is already selected");
								} else {
									$(dirDivId + ' a#dir_d_btn').addClass('selected');
									$(dirDivId + ' a#dir_w_btn').removeClass('selected');
								}
							} else 	if (thisId == 'dir_w_btn') {
								if ($(dirDivId + ' a#dir_w_btn').hasClass('selected')) {
									//Logger.warn("Walking travel mode is already selected");
								} else {
									$(dirDivId + ' a#dir_w_btn').addClass('selected');
									$(dirDivId + ' a#dir_d_btn').removeClass('selected');
								}
							}

							return false;
						});

					}

					function buildBubble(contentFromMarker, markersElement) {

						var localBubbleData = [];
						var randomNumber = Math.floor(Math.random() * 111111);

						randomNumber = randomNumber + "-" + mapDivId;

						var	bubble = "<div id='bubble-" + randomNumber + "' style='height: 130px !important; width: 300px !important;' class='bubble-content'>";
						//var bubble = document.createElement("div");
						//bubble.id = "bubble-" + randomNumber;
						//bubble.setAttribute("class", "bubble-content");
						//bubble.style.cssText = "height: 330px !important; width: 300px !important;";


						if (!markersElement.geoMashup) {
							bubble += "<h4>" + CGMPGlobal.translations.address + ":</h4>";
							bubble += "<p class='custom-bubble-text'>" + contentFromMarker + "</p>";
							if (markersElement.customBubbleText != '') {
								//var decodedHtml = $("<p></p>").html(markersElement.customBubbleText).text();
								bubble += "<p class='custom-bubble-text'>" + markersElement.customBubbleText + "</p>";
							}
						} else {
							var substr = markersElement.postTitle.substring(0, 30);
							bubble += "";
							bubble += "<p class='geo-mashup-post-title'><a title='Original post: " + markersElement.postTitle + "' href='" +markersElement.postLink+ "'>" + substr + "..</a></p>";
							bubble += "<p class='geo-mashup-post-excerpt'>" + markersElement.postExcerpt  + "</p>";
						}

                  bubble += "<div class='custom-bubble-links-section'>";
						bubble += "<hr />";
						bubble += "<p class='custom-bubble-text'>" + CGMPGlobal.translations.directions + ": <a id='toHere-" + randomNumber + "' class='dirToHereTrigger' href='javascript:void(0);'>" + CGMPGlobal.translations.toHere + "</a> - <a id='fromHere-" + randomNumber + "' class='dirFromHereTrigger' href='javascript:void(0);'>" + CGMPGlobal.translations.fromHere + "</a> | <a id='trigger-" + randomNumber + "' class='streetViewTrigger' href='javascript:void(0);'>" + CGMPGlobal.translations.streetView + "</a></p>";
						bubble += "</div></div>";

						return {bubbleHolderId : randomNumber, bubbleContent: bubble};
					}

					function parseCsv() {
						var locations = csvString.split("|");

						//Logger.info("Exploded CSV into locations: " + locations);

						for (var i = 0; i < locations.length; i++) {
							var target = locations[i];
							if (target != null && target != "") {
								target = Utils.trim(target);
								if (target == "") {
									//Logger.warn("Given extra marker address is empty");
									continue;
								}
								pushGeoDestination(target, (i + 1));
							}
						}
					}

					function parseJsonStructure(json, infoBubbleContainPostLink)  {

						var index = 1;
						$.each(json, function() {
							if (this.excerpt == null) {
								this.excerpt = '';
							}
							//Logger.info("Looping over JSON object:\n\tTitle: " + this.title + "\n\tAddy: " + this.addy + "\n\tLink: " + this.permalink + "\n\tExcerpt: " + this.excerpt);
							var targetArr = this.addy.split(CGMPGlobal.sep);
                     targetArr[0] = this.location;
                     addGeoPoint(index, targetArr, this.title, this.permalink, this.excerpt, infoBubbleContainPostLink);
							index ++;
						});
						Logger.info("Have " + (index - 1) + " destinations for marker Geo mashup..");
					}
					
					function pushGeoDestination(target, index) {

						 var targetArr = target.split(CGMPGlobal.sep);

						 if (Utils.isNumeric(targetArr[0])) {
							 addGeoPoint(index, targetArr, '', '', '', false);
						 } else if (Utils.isAlphaNumeric(targetArr[0])) {
							 storeAddress(index, targetArr, '', '', '', false);
						 } else {
							 storeAddress(index, targetArr, '', '', '', false);
							 //Logger.warn("Unknown type of geo destination in regexp: " + targetArr[0] + ", fallingback to store it as an address");
						 }
					}

					function storeAddress(zIndex, targetArr, postTitle, postLink, postExcerpt, geoMashup) {

							if (targetArr[2] != null) {
								if (targetArr[2].indexOf("No description provided") != -1) {
									targetArr[2] = '';
								}
							} else {
								targetArr[2] = '';
							}
							//Logger.info("Storing address: " + targetArr[0] + " for marker-to-be for the map ID: " + mapDivId);
							storedAddresses.push({
								address: targetArr[0],
								animation: google.maps.Animation.DROP,
								zIndex: zIndex,
								markerIcon: targetArr[1],
								customBubbleText: targetArr[2],
								postTitle: postTitle,
								postLink: postLink,
								postExcerpt: postExcerpt,
								geoMashup: geoMashup
							});
						}
					
					function addGeoPoint(zIndex, targetArr, postTitle, postLink, postExcerpt, geoMashup) {
					
						var latlngArr = [];
						if (targetArr[0].indexOf(",") != -1) {
							latlngArr = targetArr[0].split(",");
						} else 	if (targetArr[0].indexOf(";") != -1) {
							latlngArr = targetArr[0].split(";");
						}

						if (latlngArr.length == 0) {
							//Logger.warn("Exploded lat/long array has length of zero");
							return false;
						}

						latlngArr[0] = Utils.trim(latlngArr[0]);
						latlngArr[1] = Utils.trim(latlngArr[1]);

						if (latlngArr[0] == '' || latlngArr[1] == '') {
							//Logger.warn("Lat or Long are empty string");
							return false;
						}

						targetArr[0] = new google.maps.LatLng(parseFloat(latlngArr[0]), parseFloat(latlngArr[1]));
						storeAddress(zIndex, targetArr, postTitle, postLink, postExcerpt, geoMashup);
					}
					
					function queryGeocoderService() {
						clearTimeout(timeout);
						if (storedAddresses.length > 0) {
							var element = storedAddresses.shift();

							if (element.address instanceof google.maps.LatLng) {
                        //Logger.info("No need to query Geo service for [" + element.address + "]. Have left " + storedAddresses.length + " items to process!");
								buildLocationFromCoords(element);
                        //setBounds();
							} else {
                        //Logger.info("Passing [" + element.address + "] to Geo service. Have left " + storedAddresses.length + " items to process!");
								var geocoderRequest = {"address": element.address};
								geocoder.geocode(geocoderRequest, function (results, status) {
									geocoderCallback(results, status, element);
								});
							}
						} else {
							
                     setBounds();

							if (badAddresses.length > 0) {
								var msg = "";
								$.each(badAddresses, function (index, addy) {
									msg += "&nbsp;&nbsp;&nbsp;<b>" + (1 + index) + ". " + addy + "</b><br />";
								});

								Errors.alertError(CGMPGlobal.errors.badAddresses.replace('[REPLACE]', msg));
							}
							badAddresses = [];
						}
					}

					function setBounds() {

						if (markers.length > 1) {
							$.each(markers, function (index, marker) {
								if (!bounds.contains(marker.position)) {
									bounds.extend(marker.position);
								}
							});
							originalExtendedBounds = bounds;
							if (bounds != null) {
								googleMap.fitBounds(bounds);
							}
						} else if (markers.length == 1) {
							googleMap.setCenter(markers[0].position);
							updatedZoom = googleMap.getZoom();
							originalMapCenter = googleMap.getCenter();
						}
					}

					function buildLocationFromCoords(element)  {
						var addressPoint = element.address;

						element.address = "Lat/Long: " + addressPoint.lat().toFixed(6) + ", " + addressPoint.lng().toFixed(6);
						instrumentMarker(addressPoint, element);
						queryGeocoderService();
					}

					function geocoderCallback(results, status, element) {
						if (status == google.maps.GeocoderStatus.OK) {
							var addressPoint = results[0].geometry.location;
							instrumentMarker(addressPoint, element);
							timeout = setTimeout(function() { queryGeocoderService(); }, 330);
						} else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
							setBounds();
							storedAddresses.push(element);   	
							timeout = setTimeout(function() { queryGeocoderService(); }, 3000);
						} else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
							//Logger.warn("Got ZERO results for [" + element.address + "]. Have left " + markers.length + " items to process");
							badAddresses.push(element.address);
							timeout = setTimeout(function() { queryGeocoderService(); }, 400);
						}

					}


					function instrumentMarker(point, element) {
						var marker = new google.maps.Marker({
							position: point,
							title: element.address.replace("<br />", " :: "),
							content: element.address,
							zIndex: (element.zIndex + 1000),
							map: googleMap
						});
						if (marker) {

							if (element.markerIcon) {
								var markerIcon = element.markerIcon;
								if (typeof markerIcon == "undefined" || markerIcon === "undefined") {
									markerIcon = '1-default.png';
								}
								marker.setIcon(CGMPGlobal.customMarkersUri + markerIcon);
								
								var shadow = null;
								var defaultMarkers = ['1-default.png', '2-default.png'];
								var defaultPins = ['4-default.png', '5-default.png', '6-default.png', '7-default.png'];

								if ($.inArray(markerIcon, defaultMarkers) != -1) {
									var url = CGMPGlobal.customMarkersUri + "msmarker.shadow.png";
									shadow = buildMarkerImage(url, 59, 32, 0, 0, 16, 33);
								} else 	if ($.inArray(markerIcon, defaultPins) != -1) {
									var url = CGMPGlobal.customMarkersUri + "msmarker.shadow.png";
									shadow = buildMarkerImage(url, 59, 32, 0, 0, 21, 34);
								} else if (markerIcon.indexOf('3-default') != -1) {
									var url = CGMPGlobal.customMarkersUri + "beachflag_shadow.png";
									shadow = buildMarkerImage(url, 37, 32, 0, 0, 10, 33);
								} else {
									shadow = buildMarkerImage(CGMPGlobal.customMarkersUri + "shadow.png", 68, 37, 0, 0, 32, 38);
								}

								marker.setShadow(shadow);
							}

							attachEventlistener(marker, element);
							if (!directionControlsBinded) {
								bindDirectionControlsToEvents();
								directionControlsBinded = true;
							}

							markers.push(marker);
						}
					}

					function buildMarkerImage(url, sizeX, sizeY, pointAX, pointAY, pointBX, pointBY)  {

						var image = new google.maps.MarkerImage(url,
									new google.maps.Size(sizeX, sizeY),
									new google.maps.Point(pointAX, pointAY),
									new google.maps.Point(pointBX, pointBY));

						return image;
					}

					return {
						init: init,
						buildAddressMarkers: buildAddressMarkers,
						isBuildAddressMarkersCalled: isBuildAddressMarkersCalled
					}
				};



				var Utils = (function() {
					var isNumeric = function isNumeric(subject) {
						var numericRegex = /^([0-9?(\-.,;\s{1,})]+)$/;
						return numericRegex.test(subject);
					}
					var isAlphaNumeric = function isAlphaNumeric(subject) {
						var addressRegex = /^([a-zA-Z0-9?(/\-.,\s{1,})]+)$/;
						return addressRegex.test(subject);
					}
					var trim = function trim(subject) {
						var leftTrimRegex = /^\s\s*/;
						var rightTrimRegex = /\s\s*$/;
						var trimRegex = /^\s+|\s+$/g;
						return subject.replace(trimRegex, '');
					}
					var searchReplace = function searchReplace(subject, search, replace) {
						return subject.replace(new RegExp(search, "g"), replace);
					}
					return {
						isNumeric: isNumeric,
						isAlphaNumeric: isAlphaNumeric,
						trim: trim,
						searchReplace: searchReplace
					}
				})();



				var Logger = (function() {
					var info = function info(message) {
						var msg = "Info :: " + message;
						print(msg);
					}
					var raw = function raw(msg) {
						print(msg);
					}
					var warn = function warn(message) {
						var msg = "Warning :: " + message;
						print(msg);
					}
					var error = function error(message) {
						var msg = "Error :: " + message;
						print(msg);
					}
					var fatal = function fatal(message) {
						var msg = "Fatal :: " + message;
						print(msg);
					}
					var print = function print(message) {
						if ( $.browser.msie ) {
							//Die... die... die.... why dont you just, die???
						 } else {
							if ($.browser.mozilla && parseInt($.browser.version) >= 1 ) {
								console.log(message);
							} else if ($.browser.webkit && parseInt($.browser.version) >= 534) {
								console.log(message);
							} else if ($.browser.opera && parseInt($.browser.version) >= 11 ) {
								console.log(message);
							}
						 }
					}

					return {
							info: info,
							raw: raw,
							warn: warn,
							error: error,
							fatal: fatal
						}
				})();


					var Errors = (function() {

							var alertError = function alertError(content)  {

								var mask = $('<div id="cgmp-popup-mask"/>');
								var id = Math.random().toString(36).substring(3);
								var shortcode_dialog = $('<div id="' + id + '" class="cgmp-popup-shortcode-dialog cgmp-popup-window">');
								shortcode_dialog.html("<div class='dismiss-container'><a class='dialog-dismiss' href='javascript:void(0)'>×</a></div><p style='text-align: left; padding: 10px 10px 0 10px'>" + content + "</p><div align='center'><input type='button' class='close-dialog' value='Close' /></div>");

								$('body').append(mask);
								$('body').append(shortcode_dialog);

								var maskHeight = $(document).height();
								var maskWidth = $(window).width();
								$('#cgmp-popup-mask').css({'width':maskWidth,'height':maskHeight, 'opacity':0.1});

								if ($("#cgmp-popup-mask").length == 1) {
									$('#cgmp-popup-mask').show();
								}

								var winH = $(window).height();
								var winW = $(window).width();
								$("div#" + id).css('top',  winH/2-$("div#" + id).height()/2);
								$("div#" + id).css('left', winW/2-$("div#" + id).width()/2);
								$("div#" + id).fadeIn(500); 
								$('.cgmp-popup-window .close-dialog').click(function (e) {
									close_dialog(e, $(this));
								});
								$('.cgmp-popup-window .dialog-dismiss').click(function (e) {
									 close_dialog(e, $(this));
								});

								function close_dialog(e, object) {
									e.preventDefault();

									var parentDialog = $(object).closest("div.cgmp-popup-shortcode-dialog");
									if (parentDialog) {
										$(parentDialog).remove();
									}

									if ($("div.cgmp-popup-shortcode-dialog").length == 0) {
										$('#cgmp-popup-mask').remove();
									}
								}

								$('#cgmp-popup-mask').click(function () {
									$(this).remove();
									$('.cgmp-popup-window').remove();
								});
								$(window).resize(function () {
									var box = $('.window');
									var maskHeight = $(document).height();
									var maskWidth = $(window).width();
									$('#cgmp-popup-mask').css({'width':maskWidth,'height':maskHeight});
									var winH = $(window).height();
									var winW = $(window).width();
									box.css('top',  winH/2 - box.height()/2);
									box.css('left', winW/2 - box.width()/2);
								});
							}

						return {
							alertError: alertError
						}
					})();


				//$(document).ready(function() {

					if ($('object#global-data-placeholder').length == 0) {
						//Logger.fatal("The global HTML <object> element is undefined. Aborting map generation .. d[-_-]b");
						return;
					}

					var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
					var link = document.createElement('link');
					link.type= 'text/css';
					link.rel = 'stylesheet';
					link.href = $("object#global-data-placeholder").find("param#cssHref").val();
					link.media = 'screen';
					head.appendChild(link);

					CGMPGlobal.sep = $("object#global-data-placeholder").find("param#sep").val();
					CGMPGlobal.customMarkersUri = $("object#global-data-placeholder").find("param#customMarkersUri").val();
					CGMPGlobal.errors = $("object#global-data-placeholder").find("param#errors").val();

					CGMPGlobal.errors = parseJson(CGMPGlobal.errors);
					CGMPGlobal.translations = $("object#global-data-placeholder").find("param#translations").val();
					CGMPGlobal.translations = parseJson(CGMPGlobal.translations);

					var version = parseFloat($.fn.jquery);
					if (version < 1.3) {
						alert(CGMPGlobal.errors.oldJquery);
						//Logger.fatal("Client uses jQuery older than the version 1.3.0. Aborting map generation ..");
						return false;
					}

					if (typeof google == "undefined" || !google) {
						Errors.alertError(CGMPGlobal.errors.msgNoGoogle);
						//Logger.fatal("We do not have reference to Google API. Aborting map generation ..");
						return false;
					} else if (typeof GMap2 != "undefined" && GMap2) {
						Errors.alertError(CGMPGlobal.errors.msgApiV2);
						//Logger.fatal("It looks like the webpage has reference to GMap2 object from Google API v2. Aborting map generation ..");
						return false;
					}

					CGMPGlobal.language = $("object#global-data-placeholder").find("param#language").val();
					google.load('maps', '3', {other_params:'sensor=false&libraries=panoramio&language=' + CGMPGlobal.language, callback: function () { google_map_api_callback(); }});

				function google_map_api_callback() {

					$("object.cgmp-json-string-placeholder").each(function (index, element) {

						var currentElementId = $(element).attr('id');
						var jsonString = $(element).find('param#json-string-' + currentElementId).val();
						jsonString = Utils.searchReplace(jsonString, "'", "");
						jsonString = jsonString.replace("&quot;", "");

						var json = parseJson(jsonString);

						if (typeof json == "undefined" || !json) {
							//Logger.fatal("We did not parse JSON from OBJECT param. Aborting map generation ..");
							return false;
						}

						if ($('div#' + json.id).length > 0) {

								var googleMap = new google.maps.Map(document.getElementById(json.id));

								GoogleMapOrchestrator.initMap(googleMap, json.bubbleautopan, parseInt(json.zoom), json.maptype);
								LayerBuilder.init(googleMap);
								var markerBuilder = new MarkerBuilder();
								markerBuilder.init(googleMap, json.bubbleautopan);


								var controlOptions = {
										mapTypeControl: (json.maptypecontrol === 'true'),
										panControl: (json.pancontrol === 'true'),
										zoomControl: (json.zoomcontrol === 'true'),
										scaleControl: (json.scalecontrol === 'true'),
										scrollwheel: (json.scrollwheelcontrol === 'true'),
										streetViewControl: (json.streetviewcontrol === 'true'),
										tilt: (json.tiltfourtyfive === 'true' ? 45 : null),
										draggable: (json.draggable === 'true'),
										overviewMapControl: true,
										overviewMapControlOptions: {opened: false}
								};
								GoogleMapOrchestrator.setMapControls(controlOptions);

								if (json.showpanoramio === "true") {
									LayerBuilder.buildPanoramioLayer(json.panoramiouid);
								}

								if (json.showbike === "true") {
									LayerBuilder.buildBikeLayer();
								}
								if (json.showtraffic === "true") {
									LayerBuilder.buildTrafficLayer();
								}

								if (json.kml != null && Utils.trim(json.kml) != '') {
									LayerBuilder.buildKmlLayer(json.kml);
								} else {

									if (json.markerlist != null && Utils.trim(json.markerlist) != '') {
										markerBuilder.buildAddressMarkers(json.markerlist, json.addmarkermashup, json.addmarkermashupbubble);
									}

									var isBuildAddressMarkersCalled = markerBuilder.isBuildAddressMarkersCalled();
									if (!isBuildAddressMarkersCalled) {
										Errors.alertError(CGMPGlobal.errors.msgMissingMarkers);
									}
								}
						} else {
							//Logger.fatal("It looks like the map DIV placeholder ID [" + json.id + "] does not exist in the page!");
						}
					});

				}
					//});
			}(jQueryObj));
		}
	})();
