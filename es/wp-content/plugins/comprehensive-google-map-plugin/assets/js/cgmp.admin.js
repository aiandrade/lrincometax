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

var jQueryCgmp = jQuery.noConflict();

function sendShortcodeToEditor(container_id) {
	(function ($) {
		var id = '#' + container_id;
		var code = buildShortcode(id, $);
		send_to_editor('<br />' + code + '<br />');
	}(jQueryCgmp));
}


function displayShortcodeInPopup(container_id) {
	(function ($) {
		var id = '#' + container_id;
		var code = buildShortcode(id, $);
		var content = "Select the generated shortcode text below including the square brackets and press CTRL+C (CMMND+C on Mac) to copy:<br /><br /><div id='inner-shortcode-dialog'><b>" 
			+ code + "</b></div><br /><br />Paste the copied text into your post/page";
		displayPopupWithContent(content, $);
	}(jQueryCgmp));
}

function displayPopupWithContent(content, $)  {

		var mask = $('<div id="cgmp-popup-mask"/>');
		var id = Math.random().toString(36).substring(3);
		var shortcode_dialog = $('<div id="' + id + '" class="cgmp-popup-shortcode-dialog cgmp-popup-window">');
		shortcode_dialog.html("<div class='dismiss-container'><a class='dialog-dismiss' href='javascript:void(0)'>×</a></div><p style='padding: 10px 10px 0 10px'>" + content + "</p><div align='center'><input type='button' class='close-dialog' value='Close' /></div>");

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

function buildShortcode(id, $) {
	var code = "[google-map-v3 ";
	$(id + ' .shortcodeitem').each(function() {
	
		var role = $(this).attr('role');
		var val =  $(this).val();

		if (role == 'addmarkerlisthidden') {
			val = $('<div />').text(val).html();
			val = val.replace(new RegExp("'", "g"), "");
			val = val.replace(new RegExp("\"", "g"), "");
		}

		if ($(this).attr('type') == "checkbox") {
			val = $(this).is(":checked");
		}

		if ($(this).attr('type') == "radio") {
			var name = $(this).attr('name');
			val = $('input[name=' + name + ']:checked').val();
			role = name;
		}
	
		if (role == null || typeof role == "undefined" || role == "undefined") {
			role = $(this).attr('id');
		}

		if (role != null && role != "" && val != null && val != "") {

			if (role.indexOf("_") > 0) {
				role = role.replace(/_/g,"");
			} if (role.indexOf("hidden") > 0) {
				role = role.replace(/hidden/g,"");
			}
			code += role + "=" + "\"" + val + "\" ";
		}
	});
	code = code.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	code += "]";
	return code;
}


(function ($) {

	var CGMPGlobal = {};

	CGMPGlobal.sep = $("object#global-data-placeholder param#sep").val();

	if (CGMPGlobal.sep == null || CGMPGlobal.sep == "undefined") {
		CGMPGlobal.sep = "{}";
	}
	CGMPGlobal.customMarkersUri = $("object#global-data-placeholder param#customMarkersUri").val();
	CGMPGlobal.defaultLocationText = $("object#global-data-placeholder param#defaultLocationText").val();
	CGMPGlobal.defaultBubbleText = $("object#global-data-placeholder param#defaultBubbleText").val();

	var lists = [];

		function initTokenHolders()  {

				lists = [];
				var parentElements = "div.widget-google-map-container ul.token-input-list, div#google-map-container-metabox ul.token-input-list";

				$.map($(parentElements), function(element) {
					var id = $(element).attr("id");

					if (id != null && id.indexOf('__i__') == -1) {
						var hiddenInput = "#" + element.id + "hidden";
						var csv = $(hiddenInput).val();

						var holderList = $(element).tokenInput({holderId: id});

						if (csv != null && csv != "") {
							var locations = csv.split("|");
							$.map(locations, function (element) {
								holderList.add(element);
							});
						}

						lists.push({id : id, obj: holderList});
					}
				});
		}

		function initMarkerInputDataFieldsEvent()  {

			$("input.marker-text-details").live("focus", function () {

				if ($(this).val().indexOf("Enter marker") != -1) {
					$(this).val("");
					$(this).removeClass("marker-input-info-text");
				} else {
					$(this).removeClass("marker-input-info-text");
				}
			});

			$("input.marker-text-details").live("blur", function () {
				var value = $(this).val().replace(/^\s+|\s+$/g, '');
				if (value == "") {

					$(this).addClass("marker-input-info-text");

					if ($(this).attr("id").indexOf("bubble") == -1) {
						$(this).val(CGMPGlobal.defaultLocationText);
					} else {
						$(this).val(CGMPGlobal.defaultBubbleText);
					}
				}
			});

		}


		function initAddLocationEevent()  {

			$("input.add-additonal-location").live("click", function (source) {

				var listId = $(this).attr("id") + "list";
				var tokenList = {};
				$.map($(lists), function(element) {
					if (element.id == listId) {
						tokenList = element.obj;
						return;
					}
				});

				var iconHolderInput = "#" + $(this).attr("id") + "input"; //addmarkerinput
				var targetInput = "#" + $(this).attr("id").replace("addmarker", "locationaddmarkerinput"); //locationaddmarkerinput
				var customBubbleTextInput = "#" + $(this).attr("id").replace("addmarker", "bubbletextaddmarkerinput"); //bubbletextaddmarkerinput
				var customBubbleText = $(customBubbleTextInput).val();
				customBubbleText = customBubbleText.replace(/^\s+|\s+$/g, '');
				var customIconListId = "#" + $(this).attr("id") + "icons";
				var selectedIcon = $(customIconListId + " input[name='custom-icons-radio']:checked").val();

				if ($(targetInput).val() != null && $(targetInput).val() != "" && $(targetInput).val().indexOf("Enter marker") == -1) {

					var target = $(targetInput).val().replace(/^\s+|\s+$/g, '');
					var chars = new RegExp(/^(?=.*(\d|[a-zA-Z])).{5,}$/);
					var hasValidChars = chars.test(target);
					if (hasValidChars) {

						customBubbleText = CGMPGlobal.sep + customBubbleText;
						if (customBubbleText.indexOf("Enter marker") != -1) {
							customBubbleText = '';
						}
						target = target.replace(new RegExp("'", "g"), "");
						customBubbleText = customBubbleText.replace(new RegExp("'", "g"), "");
						customBubbleText = customBubbleText.replace(new RegExp("\"", "g"), "");
						
						tokenList.add(target + CGMPGlobal.sep + selectedIcon + customBubbleText);

						resetPreviousIconSelection($(customIconListId));

						$(customIconListId + " img#default-marker-icon").attr("style", "cursor: default; ");
						$(customIconListId + " img#default-marker-icon").addClass('selected-marker-image');
						$(customIconListId + " input#default-marker-icon-radio").attr('checked', 'checked');

						$(iconHolderInput).attr("style", "");
						$(iconHolderInput).addClass("default-marker-icon");
						$(targetInput).val(CGMPGlobal.defaultLocationText);
						$(customBubbleTextInput).val(CGMPGlobal.defaultBubbleText);
						$(targetInput).addClass("marker-input-info-text");
						$(customBubbleTextInput).addClass("marker-input-info-text");
						//$(targetInput).focus();

					} else {
						fadeInOutOnError(targetInput);
					}
				} else {
					fadeInOutOnError(targetInput);
				}

				return false;
			});
		}

		function fadeInOutOnError(targetInput)  {

			$(targetInput).fadeIn("slow", function() {
				$(this).addClass("errorToken");
			});

			$(targetInput).fadeOut(function() {
				$(this).removeClass("errorToken");
				$(this).fadeIn("slow");
			});
		}


		function resetPreviousIconSelection(parentDiv)  {
			$.each(parentDiv.children(), function() {
				var liImg = $(this).find("img");

				if (liImg != null) {
					$(liImg).attr("style", "");
					$(liImg).removeClass('selected-marker-image');
				}
			});
		}

		function initMarkerIconEvents() {

			$("div.custom-icons-placeholder a img").live("click", function () {
				var currentSrc = $(this).attr('src');
				if (currentSrc != null) {

					var parentDiv = $(this).closest("div.custom-icons-placeholder");
					resetPreviousIconSelection(parentDiv);
					$(this).parent("a").siblings('input[name="custom-icons-radio"]').attr("checked", "checked");
					doMarkerIconUpdateOnSelection(parentDiv, $(this));
				}
			});


			$("input[name='custom-icons-radio']").live("click", function () {

				var img = $(this).siblings("a").children('img');
				var currentSrc = $(img).attr('src');
					if (currentSrc != null) {
						var parentDiv = $(this).closest("div.custom-icons-placeholder");
						resetPreviousIconSelection(parentDiv);
						doMarkerIconUpdateOnSelection(parentDiv, img);
					}
			});
		}

		function doMarkerIconUpdateOnSelection(parentDiv, img)  {

			$(img).attr("style", "cursor: default; ");
			$(img).addClass('selected-marker-image');

			var currentSrc = $(img).attr('src');
			var inputId = $(parentDiv).attr("id").replace("icons", "input");
			$("#" + inputId).attr("style", "background: url('" + currentSrc + "') no-repeat scroll 0px 0px transparent !important");
			$("#" + inputId).attr("readonly", "readonly");
			$("#" + inputId).removeClass("default-marker-icon");
			//$("#" + inputId).focus();
		}

		function initTooltips()  {

			$('a.google-map-tooltip-marker').live("hover", function() {
			var tooltip_marker_id = $(this).attr('id');

				$("a#" + tooltip_marker_id + "[title]").tooltip({
					effect: 'slide',
					opacity: 0.8,
					tipClass : "google-map-tooltip",
					offset: [-5, 0],
					events: {
						def: "click, mouseleave"
					}
				});

				$("a#" + tooltip_marker_id).live("mouseout", function(event) {
					if ($(this).data('tooltip')) {
						$(this).data('tooltip').hide();
					}
				});
			});
		}

		function initGeoMashupEvent() {

			$("input.marker-geo-mashup").live("change", function (source) {
				var checkboxId = $(this).attr("id");
				var customIconsId = checkboxId.replace("mashup", "icons");
				var kmlId = checkboxId.replace("addmarkermashup", "kml");

				if ($(this).is(":checked")) {
					$("#" + kmlId).closest("fieldset").fadeOut();
					$("#" + customIconsId).closest("fieldset").fadeOut();
					$("#" + checkboxId + "hidden").val("true");
				} else {
					$("#" + kmlId).closest("fieldset").fadeIn();
					$("#" + customIconsId).closest("fieldset").fadeIn();
					$("#" + checkboxId + "hidden").val("false");
				}
			});
		}

		function checkedGeoMashupOnInit() {

			$.each($("input.marker-geo-mashup"), function() {
				var checkboxId = $(this).attr("id");
				var hiddenIdVal = $("#" + checkboxId + "hidden").val();
				var customIconsId = checkboxId.replace("mashup", "icons");
				var kmlId = checkboxId.replace("addmarkermashup", "kml");

				if (hiddenIdVal == "true") {
					$(this).attr("checked", "checked");
					$("#" + kmlId).closest("fieldset").hide();
					$("#" + customIconsId).closest("fieldset").hide();
				} else {
					$(this).removeAttr("checked");
					$("#" + kmlId).closest("fieldset").show();
					$("#" + customIconsId).closest("fieldset").show();
				}
			});
		}


		$(document).ready(function() {
			initTokenHolders();
			initAddLocationEevent();
			initMarkerInputDataFieldsEvent();
			initTooltips();
			initMarkerIconEvents();
			checkedGeoMashupOnInit();
			initGeoMashupEvent() ;

			if (typeof $("ul.tools-tabs-nav").tabs == "function") {
				$("ul.tools-tabs-nav").tabs("div.tools-tab-body", {
					tabs: 'li',
					effect: 'default'
				});
			}
		});


		$('div.widget-google-map-container').ajaxSuccess(
			function (e, x, o) {
				if (o.data != null)	{
					var indexOf = o.data.indexOf('id_base=comprehensivegooglemap');
					if (indexOf > 0) {
						initTokenHolders();
						checkedGeoMashupOnInit();
					}
				}
			}
		);

}(jQueryCgmp));
