function AirPlane(model, company) {
    this.model = model;
    this.company = company;

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
    AirPlane.call(this)
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
        obj.setCompany(document.getElementById("company").value);
        obj.setModel(document.getElementById("model").value);
        obj.setCannons(document.getElementById("cannons").value);
    }
    else {
        var obj = new CivilPlane();
        obj.setCompany(document.getElementById("company").value);
        obj.setModel(document.getElementById("model").value)
        obj.setFlight(document.getElementById("flight").value);
    }
    return obj
}

function createPlane(plane) {
    var url = "http://localhost:3000/planes"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(plane));
}

function getPlanes() {
    var url = "http://localhost:3000/planes"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    // alert( xhr.responseText )
    // return JSON.parse(xhr.responseText);
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && (xhr.status == 200)) {
    //         var Data = JSON.parse(xhr.responseText);
    //         console.log(Data);
    //         console.log(Data.first);

    //     } else {
    //         console.log("not ready yet")
    //     }
    // }
    // return this.Data.first
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            fillTable(data)
    //     }
    //     return data;
    // }
    var data =  JSON.parse(xhr.responseText);
}}}

function fillTable(data) {
    // var jsonObj = getPlanes();
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement("tr");
        tr.innerHTML =
            "<td>" + data[i].model + "</td>";
        "<td>" + data[i].company + "</td>";
    }
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