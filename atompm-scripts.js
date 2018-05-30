/* --------------- Utilities --------------- */

// Get the value of a key in the query string from the URL
//function getQSValue(key) {
//    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
//    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
//    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
//}

// Convert a string to a version number: e.g., '1.5.2' -> 1.52
//function strToVersion(version) {
//    v = 0;
//    try {
//        version = version.split('.');
//        for (i = 0; i < version.length; i++) {
//            v += parseInt(version[version.length - i - 1]) * Math.pow(10, i);
//        }
//    }
//    catch (err) {
//        return null;
//    }
//    return v;
//}

// Returns the name of the latest version of AToMPM
//function getAToMPMVersionName() {
//    return $('meta[name=versionName]').attr('content'); // current version name in meta attributes
//}

function onreadystatechange(ev) {
     if( req.readyState == 4 )
     {
         console.debug(method+' '+url+' >> '+req.status);
         if( req.status == 0 )
             WindowManagement.openDialog(__FATAL_ERROR,'lost connection to back-end');
         else if( onresponse )
             onresponse(req.status,req.responseText);
         else if( ! utils.isHttpSuccessCode(req.status) )
             WindowManagement.openDialog(_ERROR,req.responseText);
     }
 }

function setAToMPMVersionName() {

    $(download_dev).text('Download AToMPM');
    $(latest_version).text("here");
    $(version_time).text("");

    var httpReq = new XMLHttpRequest();

    var isHttpSuccessCode = function(statusCode)
	{
		return Math.floor(statusCode/100.0) == 2;
	};

    var onreadystatechange = function(ev) {
         if( httpReq.readyState == 4 )
         {
             if( isHttpSuccessCode(httpReq.status)){
                 var resp = JSON.parse(httpReq.responseText);
                var curr_version = resp['tag_name'];

                if (curr_version == undefined){
                    return;
                }

                console.log(typeof resp);
                console.log(resp['tag_name']);
                $(download_dev).text('Download AToMPM ' + curr_version);
                $(latest_version).text(curr_version);

                var time_at = resp['published_at'];
                time_at = time_at.split("T")[0];
                $(version_time).text(", released on " + time_at);


             }
         }
    };

    httpReq.open("GET", "https://api.github.com/repos/AToMPM/atompm/releases/latest");
    httpReq.onreadystatechange = onreadystatechange;
    httpReq.send(null);
}

// Tab behavior: load the appropriate page
function load(div) {
    $('.entry').hide(); // hide all divs with CSS class "entry" (a dummy class)
    $(div).fadeIn();    // show only the requested div
}

/* --------------- Onload --------------- */

// If a version number is present in the query string, check if it is the latest version and display the appropriate message
//$(document).ready(function () {
//    version = strToVersion(getQSValue("version"));
//    if (version != null) {
//        msg = "";
//        if (version < strToVersion($('meta[name=version]').attr('content'))) {   // current version in meta attributes
//            $(topbar).append('<a href="#dev" onclick="load(&#39;#dev&#39;);">You do not have the latest version of AToMPM. Click here to download the latest version.</a>');
//        }
//        else {
//            $(topbar).text("You currently have the latest version " + getQSValue("version"));
//        }
//        $(topbar).fadeToggle(1500);
//    }
//});

// Load the div specified in the URL after the hashtag
//$(document).ready(function () {
//    var requestedDiv = window.location.hash;
//    if (requestedDiv != '') {
//        load(requestedDiv);
//    }
//});

// Set the name of the latest AToMPM version in all fields dynamically
$(document).ready(function () {

    setAToMPMVersionName();

});