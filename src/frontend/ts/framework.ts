class Framework{

  /**
   * @brief Generic request for this project
   * @param metodo  Specifies GET or POST
   * @param url     URL where to make the request
   * @param responseHandler Stores an object with some functions (only drawItems for now)
   * @param data This parameter has several functions:
   *              @li For a GET method: If present, then it contains the modal object where
   *                  the data for edit the selected device is held.
   *              @li For a GET method: If not present, then all devices should be drawn
   *              @li For a POST method: Contains the JSON to be sent to the server
   */
  public request(metodo: string, url: string, responseHandler:HandleResponse, data?: any) {
    let xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
          
        if (xmlHttp.status == 200) {
          if (metodo === "GET") {
            let listaDisp: Array<Device> = JSON.parse(xmlHttp.responseText);
            console.log("llego info del servidor", listaDisp);
    
            if (data != undefined)  {
              console.log("Edit single device");
              let formObject = <HTMLElement>data;

              // Get all data from server and loads it on modal popup (edit option)
              (<HTMLInputElement>formObject.querySelector("#chgNombre")).focus();
              (<HTMLInputElement>formObject.querySelector("#chgNombre")).value = listaDisp["name"];
              (<HTMLInputElement>formObject.querySelector("#chgDesc")).focus();
              (<HTMLInputElement>formObject.querySelector("#chgDesc")).value = listaDisp["description"];

              if (listaDisp["type"] == 0) {
                (<HTMLInputElement>formObject.querySelector('#chgtipoLampara')).checked = true;
              }
              else if(listaDisp["type"] == 1) {
                (<HTMLInputElement>formObject.querySelector('#chgtipoGenerico')).checked = true;
              }
            }
            else {
              responseHandler.drawItems(listaDisp);
            }
          }
        } else {
            alert("ERROR en la consulta");
        }
            
      }
    }
    xmlHttp.open(metodo, url, true);
    if (data != undefined && metodo === "POST") {
      xmlHttp.setRequestHeader("Content-Type", "application/json");  
      xmlHttp.send(JSON.stringify(data));

    } else {
      
      xmlHttp.send();
    }
  }
}