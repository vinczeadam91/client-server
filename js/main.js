// Keys of users

let keysOfUsers = ["id", "name", "email"];


// Get data from server

function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };

    return fetch(url, fetchOptions).then(
        res => res.json(),
        err => console.error(err)

    );
}

function startLoadData() {
    getServerData("http://localhost:3000/users").then(
        data => dataLoader(data, "users")
    );
}

let getData = document.querySelector("#getData");

getData.addEventListener("click", startLoadData);

// Load data into the table

function dataLoader(data, tableID) {
    let table = document.querySelector(`#${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" is not found`);
        return;
    }
    let tbody = table.querySelector("tbody");
    tbody.innerHTML = '';
    let newRow = newUserRow();
    tbody.appendChild(newRow);


    for (let row of data) {
        let tr = createAnyElement("tr");
        for (let k of keysOfUsers) {
            let td = createAnyElement("td");

            let input = createAnyElement("input", {
                class: "form-control",
                value: row[k],
                name: k
            });

            if (k == "id") {
                input.setAttribute("readonly", true);

                
            }
            td.appendChild(input);
            tr.appendChild(td);

        }

        let btngroup = createButtonGroup();
        tr.appendChild(btngroup);
        tbody.appendChild(tr);
    }


}

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

function createButtonGroup() {
    let group = createAnyElement("div", { class: "btn btn-group" });
    let btnInfo = createAnyElement("button", { class: "btn btn-info", onclick: "setRow(this)" });
    btnInfo.innerHTML = '<i class="fa fa-edit"></i>';
    let btnDanger = createAnyElement("button", { class: "btn btn-danger", onclick: "removeRow(this)" });
    btnDanger.innerHTML = '<i class="fa fa-minus-circle"></i>';

    group.appendChild(btnInfo);
    group.appendChild(btnDanger);

    let td = createAnyElement("td");
    td.appendChild(group);
    return td;


}

function removeRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let id = tr.querySelector("td:first-child").innerHTML;
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };

    fetch(`http://localhost:3000/users/${id}`, fetchOptions).then(
        res => res.json(),
        err => console.error(err)

    ).then(
        data => {
            startLoadData();
        }


    );

}

// Create new user

function newUserRow(row) {

    let tr = createAnyElement("tr");
    for (let k of keysOfUsers) {
        let td = createAnyElement("td");
        let input = createAnyElement("input", { class: "form-control", name: k });

        td.appendChild(input);
        tr.appendChild(td);
    }

    let newButton = createAnyElement("button", { class: "btn btn-success", onclick: "createUsers(this)" });
    newButton.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
    let td = createAnyElement("td");
    td.appendChild(newButton);
    tr.appendChild(td);
    return tr;
}

function createUsers(btn) {
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    delete data.id;
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'Application/json'
        },

        body: JSON.stringify(data)
    };
    fetch('http://localhost:3000/users', fetchOptions).then(
        res => res.json(),
        err => console.error(err)
    ).then(
        data => startLoadData()
    );
}

function getRowData(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }

    return data;
}

function setRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr);

    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'Application/json'
        },

        body: JSON.stringify(data)
    };

    fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
        res => res.json(),
        err => console.error(err)
    ).then(
        data => startLoadData()
    );
}
