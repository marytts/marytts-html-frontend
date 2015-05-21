
/* Mary global information */
var mary_host = "localhost";
var mary_port = "59125";

var current_voice = 0;
var current_language = 0;
var current_region = 0;

/***********************************************************************************
 ** Listing
 ***********************************************************************************/

function listLanguages()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listLanguages";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            
            var result = JSON.parse(xmlhttp.responseText)['result'];
            
            var languages = document.getElementById('languages');
            languages.innerHTML = ""; // Clean first
            
            var len=result.length;
            for(var i=0; i<len; i++)
            {

	            var value = result[i];

                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = value;
                if (value == current_language)
                {
                    opt.selected = true;
                }
                
                languages.appendChild(opt);
            }
        }
    }
}

                
function listRegions()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listRegions";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?language=" + current_language , true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            
            var result = JSON.parse(xmlhttp.responseText)['result'];
            
            var regions = document.getElementById('regions');
            regions.innerHTML = ""; // Clean first
            
            var len=result.length;
            for(var i=0; i<len; i++)
            {

	            var value = result[i];

                var radio_item = document.createElement("input");
		        radio_item.type = "radio";
		        radio_item.name = "region";
		        radio_item.id = value;
		        radio_item.value = value;
                radio_item.onclick = selectRegion;
                
                if (value == current_region)
                {
		            radio_item.checked = true;
                }
                
		        var text_node = document.createTextNode(value);
                
                
		        var label = document.createElement("label");
		        label.appendChild(radio_item);
		        label.appendChild(text_node);
                
                regions.appendChild(label);
            }
        }
    }
}

function listVoices()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/listVoices";
    
    // Build post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true); // FIXME: add locale !
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var result = JSON.parse(xmlhttp.responseText)['result'];
            var select = document.getElementsByName("voices")[0];
            select.innerHTML = "";
            select.options.length = 0;
            var len=result.length;
            for(var i=0; i<len; i++) {
	            var value = result[i];
                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = value;
                if (value == current_voice)
                {
                    opt.selected = true;
                }
                select.appendChild(opt);
            }
    
        }
    }
}

/***********************************************************************************
 ** Initialisation
 ***********************************************************************************/
function getCurrentLanguage()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentLanguage";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_language = JSON.parse(xmlhttp.responseText)['result'];
            listLanguages();

            // Re new the region !
            getCurrentRegion();
        }
    }
}


function getCurrentRegion()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentRegion";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_region = JSON.parse(xmlhttp.responseText)['result'];
            listRegions();
        }
    }
}


function getCurrentVoice()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/getCurrentVoice";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            current_voice = JSON.parse(xmlhttp.responseText)['result'];
            listVoices();
        }
    }
}

function initialisation()
{
    getCurrentLanguage(); // Implicit renew the region too !
    getCurrentVoice();
}


/***********************************************************************************
 ** Setters
 ***********************************************************************************/

function selectLanguage()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/setLanguage";

    var language = document.getElementById('languages').value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?language=" + language, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            getCurrentLanguage();
            getCurrentVoice();
        }
    }
}

function selectRegion()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/setRegion";

    var region = 0;
    
    var radios = document.getElementsByName('region');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            region = radios[i].value;
            
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?region=" + region, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            getCurrentVoice();
        }
    }
}

function selectVoice()
{
    var base_url = "http://" + mary_host + ":" + mary_port + "/setVoice";

    var voice = document.getElementById('voices').value;
    
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", base_url + "?voice=" + voice, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        }
    }
}

function setOutputLevel()
{
            
    // var base_url = "http://" + mary_host + ":" + mary_port + "/setLoggerLevel";
    
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.open("GET", base_url, true);
    // xmlhttp.send();

    
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         current_locale = JSON.parse(xmlhttp.responseText)['result'];
    //         listLocales();
    //     }
    // }
}
