
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
const url = "http://localhost:3000/planes/"
const xhr = new XMLHttpRequest();
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

app.Crud.createPlane = async function (plane) {
    let validator = new app.Services.Validator(plane)
    if (!validator.isEmpty(plane)) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json,',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(plane)
    }).then(plane => plane.json())
    app.Services.getPlanes();
    }
}

app.Crud.deletePlane = async function (planeId) {
    if (confirm("Are you sure?")) {
        let options = { method: 'Delete' };
        fetch(url + planeId, options)
        .then(response => response.json());
        document.location.reload();
    }
    else {
        alert("Delete aborted!");
    }
}

app.Crud.editPlane = function (planeId) {
    let temp = app.Crud.createObject();
    let validator = new app.Services.Validator(temp)
    if (!validator.isEmpty(temp)) {
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
    // app.Services.getPlanes();
    document.getElementById("save").innerText = "Save";
    document.getElementById("save").setAttribute("onclick", "createPlane(createObject())");
}



app.Services.getPlanesById = async function (id, flag) {
    app.Services.showForm();
    fetch(url + id)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Status code: ' +
                    response.status);
                return;
            }
            response.json().then(function (data) {
                if (flag) {
                    app.Services.fillForm(data);
                }
                else {
                    app.Services.fillInfo(data);
                }
            });
        }
        )
}
this.planes = [];
app.Services.getPlanes = async function () {  
    fetch(url)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Status code: ' +
                    response.status);
                return;
            }
            response.json().then(function (data) {
                planes = [];
                planes=data;
                app.Services.fillTable(data);
            });
        }
        )
    document.getElementById("showAll").click();
}

app.Services.fillTable = function (data) {
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
        } else { document.getElementById("l_number").innerHTML = ""; }
        const regexModel = /[A-Za-z0-99999]+/
        if (!regexModel.test(plane.Model)) {
            flag = true;
            document.getElementById("l_model").innerHTML = validationMessage;
        }
        else { document.getElementById("l_model").innerHTML = ""; }

        if (!regexModel.test(plane.Company)) {
            flag = true;
            document.getElementById("l_company").innerHTML = validationMessage;
        }
        else { document.getElementById("l_company").innerHTML = ""; }

        if (plane.Seats <= 20) {
            flag = true;
            document.getElementById("l_seats").innerHTML = '<br>Less than 20';
        }
        else { document.getElementById("l_seats").innerHTML = ""; }
        const regex = /[A-Za-z]+/
        if (!regex.test(plane.Country)) {
            flag = true;
            document.getElementById("l_country").innerHTML = '<br>Invalid format';
        }
        else { document.getElementById("l_country").innerHTML = ""; }

        if (plane.Year > 2018 || plane.Year < 1850) {

            flag = true;
            document.getElementById("l_year").innerHTML = '<br>Invalid Date';
        }
        else { document.getElementById("l_year").innerHTML = ""; }
        if (document.getElementById("civil").style.display == "block") {
            if (plane.Flight == 0) {
                flag = true;
                document.getElementById("l_flight").innerHTML = validationMessage;
            }
            else { document.getElementById("l_flight").innerHTML = ""; }
        }
        if (document.getElementById("war").style.display == "block") {
            if (plane.Cannons < 0 || plane.Cannons == "") {
                flag = true;
                document.getElementById("l_cannons").innerHTML = validationMessage;
            }
            else { document.getElementById("l_cannons").innerHTML = ""; }
        }
        return flag;
    }
}

app.Services.showForm = function () {
    document.getElementById("create").style.display = "block";
    document.getElementById("table").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("search").style.display = "none";        
}
app.Services.showAll = function () {
    document.getElementById("create").style.display = "none";
    document.getElementById("table").style.display = "block";
    document.getElementById("info").style.display = "none";
    document.getElementById("search").style.display = "block";    
    app.Services.getPlanes();
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
app.Services.planesGenerator = function* () {
    for (let plane of planes) {
        yield plane;
    }
}
app.Services.search = function (searchField) {
        const searchText = document.getElementById('searchField').value || '';
        const generator = app.Services.planesGenerator();
        let item = generator.next();
        while (!item.done) {
            if (item.value.model.includes(searchText) || item.value.country.includes(searchText) ||
                item.value.company.includes(searchText) || searchText == '') {
                document.getElementById(item.value.id).hidden = false;
            } else {
                document.getElementById(item.value.id).hidden = true;
            }
            item = generator.next();
        } 
}

function spreadExample() {
    let [first, second, ...spread] = "first second hello".split(" ");
    alert(spread);
}

if (window.Worker) {
    let worker = new Worker('worker.js');
    let delay = new Date() - new Date(localStorage.getItem('lastUpdate'));
    if (delay < 60000) {
        worker.postMessage(60000 - delay);
    } else {
        worker.postMessage(0);
    };
    worker.onmessage = function(e) {
        document.getElementById('count').textContent = e.data;
        localStorage.setItem('lastUpdate', new Date());
    };
}