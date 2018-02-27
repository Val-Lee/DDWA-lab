function AirPlane(model, company, type) {
    this.model = model;
    this.company = company;
    this.type = ""

    this.setModel = function (model) {
        this.model = model;
    }
    this.getModel = function () {
        return this.model;
    }
    this.setCompany = function (company) {
        this.company = company;
    }
    this.getCompany = function () {
        return this.company;
    }

}

function WarPlane(cannons) {
    AirPlane.call(this);
    this.type = 'war';
    this.cannons = cannons;
    this.setCannons = function (cannons) {
        this.cannons = cannons;
    }
    this.getCannons = function () {
        return this.cannons;
    }
}

function CivilPlane(flight) {
    AirPlane.call(this)
    this.type = 'civil';
    this.flight = flight;
    this.setFlight = function (flight) {
        this.flight = flight;
    }
    this.getFlight = function () {
        return this.flight;
    }
}

function createObject() {
    if (document.getElementById("warPlane").checked) {
        var obj = new WarPlane();
        obj.setCannons(document.getElementById("cannons").value);
    }
    else {
        var obj = new CivilPlane();
        obj.setFlight(document.getElementById("flight").value);
    }
    obj.setCompany(document.getElementById("company").value);
    obj.setModel(document.getElementById("model").value)
    return obj
}

function createPlane(plane) {
    var url = "http://localhost:3000/planes"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(plane));
    getPlanes();
}

function deletePlane(planeId) {
    var url = "http://localhost:3000/planes/"
    var xhr = new XMLHttpRequest();
    if (confirm("Are you sure?")) {
        xhr.open("DELETE", url + planeId, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
        location.reload();
    }
    else {
        alert("Delete aborted!");
    }
}

function fillForm(data) {
    if (data.type == "war") {
        document.getElementById("warPlane").click();
        document.getElementById("cannons").value = data.cannons;
        
    }
    else if (data.type == "civil") {
        document.getElementById("civilPlane").click(); 
        document.getElementById("flight").value = data.flight;
        
    }        
    document.getElementById("model").value = data.model;
    document.getElementById("company").value = data.company;
    var temp = createObject();
    // override onclick save button
    //call put method
    //override back to post method when put method finished
    editPlane(data.id, temp);
}
    function editPlane(Planeid, temp) {
        // alert(temp.type);    
        document.getElementById("save").innerText = "Edit"        
        document.getElementById("save").setAttribute("onclick", "editPlane()");
        var url = "http://localhost:3000/planes/"
        var xhr = new XMLHttpRequest(); 
        xhr.open("PUT", url + Planeid, true)
        xhr.setRequestHeader("Content-Type", "application/json");
        if(temp.type == "civil"){
        xhr.send(JSON.stringify({
            company: temp.type,            
            model: temp.getModel(),
            company: temp.getCompany(),
            flight: temp.getFlight()
        })
        );
    }
    else{
        xhr.send(JSON.stringify({
            company: temp.type,            
            model: temp.getModel(),
            company: temp.getCompany(),
            cannons: temp.getCannons()
        })
        );
    }
            
    
}
function test() {
    alert("asd");
}
function getPlanesById(id) {
    var url = "http://localhost:3000/planes/"
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", url + id, true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            fillForm(data)
        }
    }
}

function getPlanes() {
    var url = "http://localhost:3000/planes"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            fillTable(data);
        }
    }
}

function fillTable(data) {
    var table = document.getElementById("table");
    var html = "<caption>Air plane</caption>" +
        "<tr>" +
        "<th>ID</th>" +
        " <th>Model</th>" +
        "<th>Air company</th>" +
        "</tr>"
    for (var i = 0; i < data.length; i++) {
        html += "<tr id=" + data[i].id + " onclick=getPlanesById(" + data[i].id + ")>" +
            "<td>" + data[i].id + "</td>" +
            "<td>" + data[i].model + "</td>" +
            "<td>" + data[i].company + "</td>" +
            "<td><button value=" + data[i].id + " onclick=deletePlane(this.value)>Delete</button>" +
            "<td><button value=" + data[i].id + " onclick=editPlane(this.value)>Edit</button>" +
            "</tr>"
    }
    document.getElementById('table').innerHTML = html;
}

function changeType() {
    if (document.getElementById("warPlane").checked) {
        document.getElementById("war").style.display = "block";
        document.getElementById("civil").style.display = "none";
    }
    else if (document.getElementById("civilPlane").checked) {
        document.getElementById("war").style.display = "none";
        document.getElementById("civil").style.display = "block";
    }
}


// self.getAll = function () {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', DDWAApp.CONSTANTS.SERVICE_URL, true);
//     xhr.send();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState != 4) return;
//         if (xhr.status == 200) {
//             var data = JSON.parse(xhr.responseText);
//             var scopes = [];
//             for (var i = 0; i < data.length; i++) {
//                 var scope = new DDWAApp.Models.CalculatedScope();
//                 scope.initialize(data);
//                 scopes.push(scope);
//             }
//             var table = document.getElementById("scopesList");
//             for (var i = 0; i < scopes.length; i++) {
//                 var tr = document.createElement("tr");
//                 tr.innerHTML =
//                     "<td>" + scopes[i].getPIN() + "</td>";
//                 table.tBodies[0].appendChild(tr);
//             }
//         }
//     }
// };