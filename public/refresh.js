xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("temp").innerHTML = xmlhttp.responseText;
        }
    };

setInterval(function() {
                    xmlhttp.open("GET", "/temperature", true);
                    xmlhttp.send();
                }, 30000);
