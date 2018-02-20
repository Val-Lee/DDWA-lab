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
var plane = new AirPlane();
console.log(plane.getModel(), plane.getCompany())
plane.setModel('Boeng 747')
plane.setCompany('123')
console.log(plane.getModel(), plane.getCompany())
var warPlane = new WarPlane();
warPlane.setModel('war')
console.log(warPlane.getModel())

var civilPlane = new CivilPlane();
civilPlane.setFlight('flight')
console.log(civilPlane.getFlight())