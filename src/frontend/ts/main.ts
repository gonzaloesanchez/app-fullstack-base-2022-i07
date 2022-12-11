declare const M;

class Main implements EventListenerObject, HandleResponse{
 
    private framework: Framework = new Framework();
    private id:number = 0;

    getAllDevices() {
        this.framework.request("GET", "http://localhost:8000/devices",this);
    }

    getDeviceById(device_id: Number,formObject: any) {
        this.framework.request("GET", "http://localhost:8000/device/" + device_id,this,formObject);
    }


    updateDeviceState(device_id: Number, state:Number) {
        let json = { id: device_id,newState:state};
        this.framework.request("POST", "http://localhost:8000/deviceChange",this,json);
    }

    updateDevice(device_id:number,updates: any)  {
        this.framework.request("POST", "http://localhost:8000/deviceChange/" + device_id,this,updates);
    }

    addDevice(new_device: any) {
        this.framework.request("POST", "http://localhost:8000/deviceAdd",this,new_device);
    }

    removeDevice(device_id: number) {
        let json = { id: device_id };
        this.framework.request("POST", "http://localhost:8000/deviceDelete",this,json);
    }

    drawItems(listaDisp: Array<Device>) {
            
        let cajaDips = document.getElementById("cajaDisp");
        let grilla:string = "<ul class='collection'>";
        for (let disp of listaDisp) {
        

            grilla += ` <li class="collection-item avatar">`;
            
            if (disp.type == 0) {
                grilla+=`<img src="static/images/lightbulb.png" alt="" class="circle"> `   
            } else {
                grilla+=`<img src="static/images/window.png" alt="" class="circle"> `  
            }
            
            grilla += ` <span class="title negrita">${disp.name}
            </span>
            <p>${disp.description}
            </p>
            <a class="waves-effect waves-teal btn-flat modal-trigger" id="btnChange_${disp.id}" href="#addChange">
                <i class="material-icons left">create</i>Editar
            </a>
            <a class="waves-effect waves-teal btn-flat" id="btnDelete_${disp.id}">
                <i class="material-icons left">cancel</i>Eliminar
            </a>

            <a href="#!" class="secondary-content">
              <div class="switch">
                  <label>
                    Off`;
            if (disp.state) {
                grilla += `<input id="cb_${disp.id}" miAtt="mi dato 1" type="checkbox" checked>`;    
            } else {
                grilla += `<input id="cb_${disp.id}" miAtt="mi dato 2" type="checkbox">`;    
            }
            
            
            grilla +=`<span class="lever"></span>
                    On
                  </label>
                </div>
          </a>
          </li>`;
        }
        grilla += "</ul>"
        
        cajaDips.innerHTML = grilla;

        for (let disp of listaDisp) {
            let cb = document.getElementById("cb_" + disp.id);
            let btnDeleteGrid = document.getElementById("btnDelete_" + disp.id);
            let btnChangeGrid = document.getElementById("btnChange_" + disp.id);
            cb.addEventListener("click", this);
            btnDeleteGrid.addEventListener("click", this);
            btnChangeGrid.addEventListener("click", this);
        }
    }

    handleEvent(object: Event): void {
     
        let tipoEvento: string = object.type;
       
        let objEvento: HTMLElement;
        objEvento = <HTMLElement>object.target;
        
        //Handler for refresh device list
        if (objEvento.id == "btnReload") {
            this.getAllDevices();
        } 

        // Handler for state check boxes
        else if (objEvento.id.startsWith("cb_")) {
            let idDisp = objEvento.id.substring(3);
            
            this.updateDeviceState(parseInt(idDisp),(<HTMLInputElement>objEvento).checked ? 1 : 0);
            console.log("Dispositivo " + idDisp + " actualizado");
        
        } 

        // Handler for delete item
        else if (objEvento.id.startsWith("btnDelete_")) {
            let idDisp = objEvento.id.substring(10);

            if (confirm("Se desea eliminar el dispositivo " + idDisp + ". " + "Esta seguro de continuar?")) {
                this.removeDevice(parseInt(idDisp));
                console.log("Dispositivo " + idDisp + " eliminado");
                this.getAllDevices();
            } else {
                console.log('Accion cancelada');
            }
        }
        //Handler for several change buttons (gets changes on modal window)
        else if (objEvento.id.startsWith("btnChange_")) {
            let idDisp = objEvento.id.substring(10);
            let objModal = document.getElementById("addChange");
            this.getDeviceById(parseInt(idDisp),objModal);
            this.id = parseInt(idDisp);
        }
        
        //Handler for Accept new device button
        else if(objEvento.id == "btnInsert"){
            let objModal = document.getElementById("addPopup");
            let newDevice = JSON.parse('{"id": 0, "name": " ", "description": " ", "state": 0, "type": 0}');

            newDevice["name"] = (<HTMLInputElement>objModal.querySelector("#txtNombre")).value;
            newDevice["description"] = (<HTMLInputElement>objModal.querySelector("#txtDesc")).value;
            if ((<HTMLInputElement>objModal.querySelector("#newDeviceState")).checked) {
                newDevice["state"] = 1;
            }
            else {
                newDevice["state"] = 0;
            }

            if ((<HTMLInputElement>objModal.querySelector('#tipoLampara')).checked)  {
                newDevice["type"] = 1;
            }
            else if((<HTMLInputElement>objModal.querySelector('#tipoGenerico')).checked) {
                newDevice["type"] = 0;
            }
            else {
                newDevice["type"] = 2;
            }

            this.addDevice(newDevice);
            this.getAllDevices();
        }

        //Handler for accept change button
        else if(objEvento.id == "btnChange"){
            let objModal = document.getElementById("addChange");
            let chgDevice = JSON.parse('{"name": " ", "description": " ", "type": 0}');

            
            chgDevice["name"] = (<HTMLInputElement>objModal.querySelector("#chgNombre")).value;
            chgDevice["description"] = (<HTMLInputElement>objModal.querySelector("#chgDesc")).value;
 

            if ((<HTMLInputElement>objModal.querySelector('#chgtipoLampara')).checked)  {
                chgDevice["type"] = 0;
            }
            else if((<HTMLInputElement>objModal.querySelector('#chgtipoGenerico')).checked) {
                chgDevice["type"] = 1;
            }
            this.updateDevice(this.id,chgDevice);
            this.getAllDevices();
        }

    }
}

window.addEventListener("load", () => {

   var elems = document.querySelectorAll('select');
   var instances = M.FormSelect.init(elems, "");

    M.updateTextFields();
    
    var elemsM = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsM, "");

    let main: Main = new Main();

    //Listeners for the buttons
    let btn = document.getElementById("btnReload");
    btn.addEventListener("click", main);
    let btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener("click", main);
    let btnChange = document.getElementById("btnChange");
    btnChange.addEventListener("click", main); 
});

