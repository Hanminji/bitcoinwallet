/* ------------------------------------------------------------------------- 
{
    "methodType":"",
    "params":"",
    "userRequest":{},
    "fCallback":""
}
------------------------------------------------------------------------- */

var global_url = "http://127.0.0.1:3000"
var xhttp = new XMLHttpRequest()

var RESTAPICall = function(requestJSON) {
  xhttp.open(requestJSON.methodType, global_url + requestJSON.params, true)
  xhttp.setRequestHeader("Content-type", "application/json")
  xhttp.addEventListener("load", requestJSON.fCallback)
  if (requestJSON.methodType == "POST") {
    console.log(JSON.stringify(requestJSON.userRequest))
    xhttp.send(JSON.stringify(requestJSON.userRequest))
  } else {
    xhttp.send()
  }
}
