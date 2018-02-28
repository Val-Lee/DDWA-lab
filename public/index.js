function AirPlane(number, model, company, seats, year, country) {
    this.number = number;
    this.model = model;
    this.company = company;
    this.seats = seats;
    this.year = year;
    this.country = country;

    this.setNumber = function (number) {
        this.number = number;
    }
    this.getNumber = function () {
        return this.number;
    }
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
    this.setSeats = function (seats) {
        this.seats = seats;
    }
    this.getSeats = function () {
        return this.seats;
    }
    this.setYear = function (year) {
        this.year = year;
    }
    this.getYear = function () {
        return this.year;
    }
    this.setCountry = function (country) {
        this.country = country;
    }
    this.getCountry = function () {
        return this.country;
    }

}

function WarPlane(cannons, stealth) {
    AirPlane.call(this);
    this.type = 'war';
    this.cannons = cannons;
    this.stealth = stealth;
    this.setCannons = function (cannons) {
        this.cannons = cannons;
    }
    this.getCannons = function () {
        return this.cannons;
    }
    this.setStealth = function (stealth) {
        this.stealth = stealth;
    }
    this.getStealth = function () {
        return this.stealth;
    }
}

function CivilPlane(flight, comfort) {
    AirPlane.call(this)
    this.type = 'civil';
    this.flight = flight;
    this.comfort = comfort;
    this.setFlight = function (flight) {
        this.flight = flight;
    }
    this.getFlight = function () {
        return this.flight;
    }
    this.setComfort = function (comfort) {
        this.comfort = comfort;
    }
    this.getComfort = function () {
        return this.comfort;
    }
}

function createObject() {
    if (document.getElementById("warPlane").checked) {
        var obj = new WarPlane();
        obj.setCannons(document.getElementById("cannons").value);
        if (document.getElementById("stealth_t").checked) {
            obj.setStealth(true);
        }
        else {
            obj.setStealth(false);
        }
    }
    else {
        var obj = new CivilPlane();
        obj.setFlight(document.getElementById("flight").value);
        obj.setComfort(document.getElementById("comfort").value);

    }
    obj.setNumber(document.getElementById("number").value);
    obj.setCompany(document.getElementById("company").value);
    obj.setSeats(document.getElementById("seats").value)
    obj.setYear(document.getElementById("year").value)
    obj.setCountry(document.getElementById("country").value)
    obj.setModel(document.getElementById("model").value)
    return obj
}

function createPlane(plane) {
    var validator = new Validator(plane)
    if (!validator.isEmpty(plane)) {
        var url = "http://localhost:3000/planes"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(plane));
        getPlanes();
    }
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
        if (data.stealth) {
            document.getElementById("stealth_t").click();
        }
        else {
            document.getElementById("stealth_f").click();
        }
    }
    else if (data.type == "civil") {
        document.getElementById("civilPlane").click();
        document.getElementById("flight").value = data.flight;
        document.getElementById("comfort").value = data.comfort;
    }
    document.getElementById("number").value = data.number;
    document.getElementById("model").value = data.model;
    document.getElementById("company").value = data.company;
    document.getElementById("number").value = data.number;
    document.getElementById("seats").value = data.seats;
    document.getElementById("year").value = data.year;
    document.getElementById("country").value = data.country;
    document.getElementById("save").innerText = "Edit";
    document.getElementById("save").setAttribute("onclick", "editPlane(" + data.id + ")");

}
function editPlane(planeId) {
    var temp = createObject();
    var validator = new Validator(temp)
    if (!validator.isEmpty(temp)) {
        var url = "http://localhost:3000/planes/"
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url + planeId, true)
        xhr.setRequestHeader("Content-Type", "application/json");
        if (temp.type == "civil") {
            xhr.send(JSON.stringify({
                type: temp.type,
                model: temp.getModel(),
                company: temp.getCompany(),
                flight: temp.getFlight(),
                number: temp.getNumber(),
                seats: temp.getSeats(),
                year: temp.getYear(),
                country: temp.getCountry(),
                comfort: temp.getComfort()
            })
            );
        }
        else {
            xhr.send(JSON.stringify({
                type: temp.type,
                model: temp.getModel(),
                company: temp.getCompany(),
                number: temp.getNumber(),
                seats: temp.getSeats(),
                year: temp.getYear(),
                country: temp.getCountry(),
                cannons: temp.getCannons(),
                stealth: temp.getStealth()
            })
            );
        }
    }
    getPlanes();
    document.getElementById("save").innerText = "Save";
    document.getElementById("save").setAttribute("onclick", "createPlane(createObject())");
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
        "<th>Number</th>" +
        " <th>Model</th>" +
        "<th>Air company</th>" +
        "<th>Number of seats</th>" +
        "<th>Year</th>" +
        "<th>Country</th>" +

        "</tr>"
    for (var i = 0; i < data.length; i++) {
        html += "<tr id=" + data[i].id + " onclick=getPlanesById(" + data[i].id + ")>" +
            "<td>" + data[i].number + "</td>" +
            "<td>" + data[i].model + "</td>" +
            "<td>" + data[i].company + "</td>" +
            "<td>" + data[i].seats + "</td>" +
            "<td>" + data[i].year + "</td>" +
            "<td>" + data[i].country + "</td>" +
            "<td><button value=" + data[i].id + " onclick=deletePlane(this.value)>Delete</button>" +
            "<td><button value=" + data[i].id + ">Edit</button>" +
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


function Validator(plane) {

    var validationMessage = "<br>Field is empty";

    this.isEmpty = function (plane) {
        var flag = false;

        if (plane.getNumber() == 0) {
            flag = true;
            document.getElementById("l_number").innerHTML = validationMessage;
        }

        if (plane.getModel() == 0) {
            flag = true;
            document.getElementById("l_model").innerHTML = validationMessage;
        }

        if (plane.getCompany() == 0) {
            flag = true;
            document.getElementById("l_company").innerHTML = validationMessage;
        }

        if (plane.getSeats() == 0) {
            flag = true;
            document.getElementById("l_seats").innerHTML = validationMessage;
        }

        if (plane.getCountry() == 0) {
            flag = true;
            document.getElementById("l_country").innerHTML = validationMessage;
        }

        
        
        var cDate = null;
        
        
        if ((cDate = new Date(plane.getYear())) == 'Invalid Date') {
            flag = true;
            document.getElementById("l_year").innerHTML = '<br>Invalid Date';
        }
        
        if (plane.getYear() == undefined) {
            flag = true;
            document.getElementById("l_year").innerHTML = validationMessage;
        }
        if (document.getElementById("civil").style.display == "block"){
        if (plane.getFlight() == 0) {
            flag = true;
            document.getElementById("l_flight").innerHTML = validationMessage;
        }
    }
    if (document.getElementById("war").style.display == ""){
        if (plane.getCannons() == 0) {
            flag = true;
            document.getElementById("l_cannons").innerHTML = validationMessage;
        }
    }
        return flag;
    }
}