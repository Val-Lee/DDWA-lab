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

function WarPlane() {
    AirPlane.call(this)
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
function test() {
    // alert('test')
    var FormData = new FormData(document.forms.plane)
    var url = "http://localhost:3000/planes"    
    var xhr = new XMLHttpRequest();
    // var plane = new AirPlane();
    // plane.setModel('Boeng 747')
    // plane.setCompany('123')
    // console.log(plane.getModel(), plane.getCompany())

    xhr.open("POST", url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    
    xhr.send(FormData);
}
function postPlane() {
    var url = "http://localhost:3000/planes";

    var data = {};
    data.firstname = "John";
    data.lastname = "Snow";
    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "201") {
            console.table(users);
        } else {
            console.error(users);
        }
    }
    xhr.send(json);
}
// var plane = new AirPlane();
// console.log(plane.getModel(), plane.getCompany())
// plane.setModel('Boeng 747')
// plane.setCompany('123')
// console.log(plane.getModel(), plane.getCompany())
// var warPlane = new WarPlane();
// warPlane.setModel('war')
// console.log(warPlane.getModel())

// var civilPlane = new CivilPlane();
// civilPlane.setFlight('flight')
// console.log(civilPlane.getFlight())