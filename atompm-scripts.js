/* --------------- Utilities --------------- */

// Get the value of a key in the query string from the URL
function getQSValue(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

// Convert a string to a version number: e.g., '1.5.2' -> 1.52
function strToVersion(version) {
    v = 0;
    try {
        version = version.split('.');
        for (i = 0; i < version.length; i++) {
            v += parseInt(version[version.length - i - 1]) * Math.pow(10, i);
        }
    }
    catch (err) {
        return null;
    }
    return v;
}

// Returns the name of the latest version of AToMPM
function getAToMPMVersionName() {
    return $('meta[name=versionName]').attr('content'); // current version name in meta attributes
}

// Tab behavior: load the appropriate page
function load(div) {
    $('.entry').hide(); // hide all divs with CSS class "entry" (a dummy class)
    $(div).fadeIn();    // show only the requested div
}

/* --------------- Onload --------------- */

// If a version number is present in the query string, check if it is the latest version and display the appropriate message
$(document).ready(function () {
    version = strToVersion(getQSValue("version"));
    if (version != null) {
        msg = "";
        if (version < strToVersion($('meta[name=version]').attr('content'))) {   // current version in meta attributes
            $(topbar).append('<a href="#dev" onclick="load(&#39;#dev&#39;);">You do not have the latest version of AToMPM. Click here to download the latest version.</a>');
        }
        else {
            $(topbar).text("You currently have the latest version " + getQSValue("version"));
        }
        $(topbar).fadeToggle(1500);
    }
});

// Load the div specified in the URL after the hashtag
$(document).ready(function () {
    var requestedDiv = window.location.hash;
    if (requestedDiv != '') {
        load(requestedDiv);
    }
});

// Set the name of the latest AToMPM version in all fields dynamically
$(document).ready(function () {
    $(download_dev).text('Download ' + getAToMPMVersionName());
    $(latest_version).text(getAToMPMVersionName());
});