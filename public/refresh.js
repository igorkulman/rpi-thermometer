updateThermometer(document.getElementById("temp").innerHTML);

xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    updateThermometer(xmlhttp.responseText);
        }
    };

setInterval(function() {
                    xmlhttp.open("GET", "/temperature", true);
                    xmlhttp.send();
                }, 30000);

function updateThermometer(temp)
{
	var val = Math.round(100-2*temp);
	document.getElementById("t").style.background = "-webkit-linear-gradient(top, #fff 0%, #fff "+val+"%, #db3f02 "+val+"%, #db3f02 100%)";
	document.getElementById("temp").innerHTML = temp;
}
