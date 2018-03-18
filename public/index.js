var app = {
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

app.Model.AirPlane = function (number, model, company, seats, year, country) {
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

app.Model.WarPlane = function (cannons, stealth) {
    app.Model.AirPlane.call(this);
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

app.Model.CivilPlane = function (flight, comfort) {
    app.Model.AirPlane.call(this)
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

app.Crud.createObject = function () {
    if (document.getElementById("warPlane").checked) {
        var obj = new app.Model.WarPlane();
        obj.setCannons(document.getElementById("cannons").value);
        if (document.getElementById("stealth_t").checked) {
            obj.setStealth(true);
        }
        else {
            obj.setStealth(false);
        }
    }
    else {
        var obj = new app.Model.CivilPlane();
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
        document.location.reload();
    }
    else {
        alert("Delete aborted!");
    }
}

app.Crud.editPlane = function (planeId) {
    var temp = app.Crud.createObject();
    var validator = new app.Services.Validator(temp)
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
    // document.location.reload();
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
//////////////////////////////////////
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

    var validationMessage = "<br>Field is empty";

    this.isEmpty = function (plane) {
        var flag = false;

        if (plane.getNumber() <= 0) {
            flag = true;
            document.getElementById("l_number").innerHTML = validationMessage;
        } else { document.getElementById("l_number").innerHTML = "";}
        var regexModel = /[A-Za-z0-99999]+/
        if (!regexModel.test(plane.getModel())) {            
            flag = true;
            document.getElementById("l_model").innerHTML = validationMessage;
        }
        else { document.getElementById("l_model").innerHTML = "";}

        if (!regexModel.test(plane.getCompany())) {
            flag = true;
            document.getElementById("l_company").innerHTML = validationMessage;
        }
        else { document.getElementById("l_company").innerHTML = "";}

        if (plane.getSeats() <= 20) {
            flag = true;
            document.getElementById("l_seats").innerHTML = '<br>Less than 20';
        }
        else { document.getElementById("l_seats").innerHTML = "";}
        var regex = /[A-Za-z]+/
        if (!regex.test(plane.getCountry())) {
            flag = true;
            document.getElementById("l_country").innerHTML = '<br>Invalid format';
        }
        else { document.getElementById("l_country").innerHTML = "";}



        var cDate = new Date();


        // if ((cDate = new Date(plane.getYear())) == 'Invalid Date') {
            // debugger;
        if ( plane.getYear() > 2018 || plane.getYear() < 1850 ) {
            
            flag = true;
            document.getElementById("l_year").innerHTML = '<br>Invalid Date';
        }
        else { document.getElementById("l_year").innerHTML = "";}

        // if (plane.getYear() == undefined) {
        //     flag = true;
        //     document.getElementById("l_year").innerHTML = validationMessage;
        // }
        // else { document.getElementById("l_year").innerHTML = "";}
        if (document.getElementById("civil").style.display == "block") {
            if (plane.getFlight() == 0) {
                flag = true;
                document.getElementById("l_flight").innerHTML = validationMessage;
            }
            else { document.getElementById("l_flight").innerHTML = "";}
        }
        if (document.getElementById("war").style.display == "block") {
            if (plane.getCannons() < 0 || plane.getCannons() == "") {
                flag = true;
                document.getElementById("l_cannons").innerHTML = validationMessage;
            }
            else { document.getElementById("l_cannons").innerHTML = "";}
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
    document.getElementById("create").style.display = "none"    ;
    document.getElementById("table").style.display = "block";
    document.getElementById("info").style.display = "none";        
}
//////////////////////////////
//fillInfo
//html = tr th if data.type == "war" th
//else 