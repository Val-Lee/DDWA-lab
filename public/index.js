let app = {
    Model: {
        AirPlane: {},
        WarPlane: {},
        CivilPlane: {}
    },
    Crud: {
        createObject: {},
        createPlane: {},
        deletePlane: {},
        editPlane: {}
    },
    Services: {
        getPlanesById: {},
        getPlanes: {},
        fillForm: {},
        fillTable: {},
        changeType: {},
        Validator: {}
    }
}

app.Model.AirPlane = class {
    constructor(number, model, company, seats, year, country) {
        this.number = number;
        this.model = model;
        this.company = company;
        this.seats = seats;
        this.year = year;
        this.country = country;
    }
    set Number(number) {
        this.number = number;
    }
    get Number() {
        return this.number;
    }
    set Model(model) {
        this.model = model;
    }
    get Model() {
        return this.model;
    }
    set Company(company) {
        this.company = company;
    }
    get Company() {
        return this.company;
    }
    set Seats(seats) {
        this.seats = seats;
    }
    get Seats() {
        return this.seats;
    }
    set Year(year) {
        this.year = year;
    }
    get Year() {
        return this.year;
    }
    set Country(country) {
        this.country = country;
    }
    get Country() {
        return this.country;
    }

}

app.Model.WarPlane = class extends app.Model.AirPlane {
    constructor(cannons, stealth) {
        super(number, model, company, seats, year, country);
        this.type = 'war';
        this.cannons = cannons;
        this.stealth = stealth;
    }
    set Cannons(cannons) {
        this.cannons = cannons;
    }
    get Cannons() {
        return this.cannons;
    }
    set Stealth(stealth) {
        this.stealth = stealth;
    }
    get Stealth() {
        return this.stealth;
    }
}

app.Model.CivilPlane = class extends app.Model.AirPlane {
    constructor(flight, comfort) {
        super(number, model, company, seats, year, country)        
        this.type = 'civil';
        this.flight = flight;
        this.comfort = comfort;
    }
    set Flight(flight) {
        this.flight = flight;
    }
    get Flight() {
        return this.flight;
    }
    set Comfort(comfort) {
        this.comfort = comfort;
    }
    get Comfort() {
        return this.comfort;
    }
}

app.Crud.createObject = function () {
    let obj = null
    if (document.getElementById("warPlane").checked) {
        obj = new app.Model.WarPlane();
        obj.Cannons = document.getElementById("cannons").value;
        if (document.getElementById("stealth_t").checked) {
            obj.Stealth = true;
        }
        else {
            obj.Stealth = false;
        }
    }
    else {
        obj = new app.Model.CivilPlane();
        obj.Flight = document.getElementById("flight").value;
        obj.Comfort = document.getElementById("comfort").value;
    }
    obj.Number = document.getElementById("number").value;
    obj.Company = document.getElementById("company").value;
    obj.Seats = document.getElementById("seats").value;
    obj.Year = document.getElementById("year").value;
    obj.Country = document.getElementById("country").value;
    obj.Model = document.getElementById("model").value;
    return obj
}

app.Crud.createPlane = function (plane) {
    var validator = new app.Services.Validator(plane)
    if (!validator.isEmpty(plane)) {
        var url = "http://localhost:3000/planes"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(plane));
        app.Services.getPlanes();
    }
}

app.Crud.deletePlane = function (planeId) {
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

app.Crud.editPlane = function (planeId) {
    let temp = app.Crud.createObject();
    let validator = new app.Services.Validator(temp)
    if (!validator.isEmpty(temp)) {
        let url = "http://localhost:3000/planes/"
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", url + planeId, true)
        xhr.setRequestHeader("Content-Type", "application/json");
        if (temp.type == "civil") {
            xhr.send(JSON.stringify({
                type: temp.type,
                model: temp.Model,
                company: temp.Company,
                flight: temp.Flight,
                number: temp.Number,
                seats: temp.Seats,
                year: temp.Year,
                country: temp.Country,
                comfort: temp.Comfort
            })
            );
        }
        else {
            xhr.send(JSON.stringify({
                type: temp.type,
                model: temp.Model,
                company: temp.Company,
                number: temp.Number,
                seats: temp.Seats,
                year: temp.Year,
                country: temp.Country,
                cannons: temp.Cannons,
                stealth: temp.Stealth
            })
            );
        }
    }
    app.Services.getPlanes();
    document.getElementById("save").innerText = "Save";
    document.getElementById("save").setAttribute("onclick", "createPlane(createObject())");
}



app.Services.getPlanesById = function (id, flag) {
    app.Services.showForm();
    var url = "http://localhost:3000/planes/"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + id, true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            if (flag) {
                app.Services.fillForm(data);
            }
            else {
                app.Services.fillInfo(data);
            }
        }
    }
}

app.Services.getPlanes = function () {
    var url = "http://localhost:3000/planes"
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            app.Services.fillTable(data);
        }
    }
    document.getElementById("showAll").click();

}

app.Services.fillTable = function (data) {
    let html = "<caption>Air plane</caption>" +
        "<tr>" +
        "<th>Number</th>" +
        " <th>Model</th>" +
        "<th>Air company</th>" +
        "<th>Number of seats</th>" +
        "<th>Year</th>" +
        "<th>Country</th>" +

        "</tr>"
    for (var i = 0; i < data.length; i++) {
        html += "<tr id=" + data[i].id + ">" +
            "<td onclick=app.Services.getPlanesById(" + data[i].id + "," + false + ")>" + data[i].number + "</td>" +
            "<td>" + data[i].model + "</td>" +
            "<td>" + data[i].company + "</td>" +
            "<td>" + data[i].seats + "</td>" +
            "<td>" + data[i].year + "</td>" +
            "<td>" + data[i].country + "</td>" +
            "<td><button value=" + data[i].id + " onclick=app.Crud.deletePlane(this.value)>Delete</button>" +
            "<td><button value=" + data[i].id + " onclick=app.Services.getPlanesById(" + data[i].id + "," + true + ")>Edit</button>" +
            "</tr>"
    }
    document.getElementById('table').innerHTML = html;
}

app.Services.fillInfo = function (data) {
    document.getElementById("info").style.display = "block";
    document.getElementById("table").style.display = "none";
    document.getElementById("create").style.display = "none";
    if (data.type == "war") {

        var html = "<caption>Air plane</caption>" +
            "<tr>" +
            "<th>Number</th>" +
            " <th>Model</th>" +
            "<th>Air company</th>" +
            "<th>Number of seats</th>" +
            "<th>Year</th>" +
            "<th>Country</th>" +
            "<th>Cannons</th>" +
            "<th>Stealth</th>" +
            "</tr>" +
            "<tr>" +
            "<td>" + data.number + "</td>" +
            "<td>" + data.model + "</td>" +
            "<td>" + data.company + "</td>" +
            "<td>" + data.seats + "</td>" +
            "<td>" + data.year + "</td>" +
            "<td>" + data.country + "</td>" +
            "<td>" + data.cannons + "</td>" +
            "<td>" + data.stealth + "</td>" +
            "</tr>"

    }
    else {
        var html =
            "<tr>" +
            "<th>Number</th>" +
            " <th>Model</th>" +
            "<th>Air company</th>" +
            "<th>Number of seats</th>" +
            "<th>Year</th>" +
            "<th>Country</th>" +
            "<th>Flight</th>" +
            "<th>Comfort class</th>" +
            "</tr>" +
            "<tr>" +
            "<td>" + data.number + "</td>" +
            "<td>" + data.model + "</td>" +
            "<td>" + data.company + "</td>" +
            "<td>" + data.seats + "</td>" +
            "<td>" + data.year + "</td>" +
            "<td>" + data.country + "</td>" +
            "<td>" + data.flight + "</td>" +
            "<td>" + data.comfort + "</td>" +
            "</tr>"
    }

    document.getElementById('info').innerHTML = html;
}

app.Services.changeType = function () {
    if (document.getElementById("warPlane").checked) {
        document.getElementById("war").style.display = "block";
        document.getElementById("civil").style.display = "none";
    }
    else if (document.getElementById("civilPlane").checked) {
        document.getElementById("war").style.display = "none";
        document.getElementById("civil").style.display = "block";
    }
}
app.Services.fillForm = function (data) {
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
    document.getElementById("save").setAttribute("onclick", "app.Crud.editPlane(" + data.id + ")");

}
app.Services.Validator = function (plane) {

    let validationMessage = "<br>Field is empty";

    this.isEmpty = function (plane) {
        let flag = false;

        if (plane.Number <= 0) {
            flag = true;
            document.getElementById("l_number").innerHTML = validationMessage;
        }

        if (plane.Model == 0) {
            flag = true;
            document.getElementById("l_model").innerHTML = validationMessage;
        }

        if (plane.Company == 0) {
            flag = true;
            document.getElementById("l_company").innerHTML = validationMessage;
        }

        if (plane.Seats <= 20) {
            flag = true;
            document.getElementById("l_seats").innerHTML = '<br>Less than 20';
        }

        if (plane.Country == 0) {
            flag = true;
            document.getElementById("l_country").innerHTML = validationMessage;
        }



        var cDate = null;


        if ((cDate = new Date(plane.Year)) == 'Invalid Date') {
            flag = true;
            document.getElementById("l_year").innerHTML = '<br>Invalid Date';
        }

        if (document.getElementById("civil").style.display == "block") {
            if (plane.Flight == 0) {
                flag = true;
                document.getElementById("l_flight").innerHTML = validationMessage;
            }
        }
        if (document.getElementById("war").style.display == "") {
            if (plane.Cannons < 0) {
                flag = true;
                document.getElementById("l_cannons").innerHTML = validationMessage;
            }
        }
        return flag;
    }
}

app.Services.showForm = function () {
    document.getElementById("create").style.display = "block";
    document.getElementById("table").style.display = "none";
    document.getElementById("info").style.display = "none";
}
app.Services.showAll = function () {
    document.getElementById("create").style.display = "none";
    document.getElementById("table").style.display = "block";
    document.getElementById("info").style.display = "none";
}


app.Services.clearFields = function () {
    document.getElementById("number").value = "";
    document.getElementById("model").value = "";
    document.getElementById("company").value = "";
    document.getElementById("seats").value = "";
    document.getElementById("year").value = "";
    document.getElementById("country").value = "";
    document.getElementById("cannons").value = "";
    document.getElementById("flight").value = "";    
}

app.Services.search = function (searchField) {
  
}
//////////////////////////////
//fillInfo
//html = tr th if data.type == "war" th
//else 