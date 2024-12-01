var myInputName = document.getElementById("Name");
var myInputURL = document.getElementById("URL");
var btnAdd = document.getElementById("btnAdd");
var btnUpdate = document.getElementById("btnUpdate");
var data = document.getElementById("data");
var deleteItems = document.querySelector(".deleteItems");
var checkBoxAll = document.querySelector(".checkBoxAll");
var myInputSearch = document.getElementById("search");
var alertOverlay = document.getElementById("alertOverlay");
var closeAlertBtn = document.getElementById("closeAlert");

var markBox = [];
var checked = [];
var trash = [];
var updateIndex = 0;

markBox = JSON.parse(localStorage.getItem("marks")) || [];
display();

function createData(i) {
  return `
                    <tr class="align-middle text-center">
            <td><input type="checkbox" name="" class="isChecked" data-index="${markBox[i].id}"></td>
          

            <td>${markBox[i].Name}</td>

            <td ><a href="${markBox[i].URL}" class="text-black-50" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i></a></td>
            <td >
              <button class="btn text-primary " >
                <i class="fa-solid fa-pen updateItem"  data-index="${markBox[i].id}"></i>
              </button>
              
            </td>
            <td >
                <button class="btn text-danger ">
                  <i class="fa-regular fa-trash-can deleteItem" data-index="${markBox[i].id}"></i>
                </button>
                
            </td>
          </tr>
        `;
}

// Add items
btnAdd.addEventListener("click", function () {
  if (validationName() && validationURL()) {
    var data = {
      Name: myInputName.value,
      URL: myInputURL.value,
      id: Date.now() + Math.floor(Math.random() * 1000),
    };

    markBox.unshift(data);
    localStorage.setItem("marks", JSON.stringify(markBox));
    display();
    clear();
  } else {
    alertOverlay.classList.remove("d-none");
    closeAlertBtn.addEventListener("click", function () {
      alertOverlay.classList.add("d-none");
    });
  }
});

// Display Data
function display() {
  var container = "";
  for (var i = 0; i < markBox.length; i++) {
    container += createData(i);
  }

  data.innerHTML = container;
}

//  delete buttons
data.addEventListener("click", function (e) {
  if (e.target.classList.contains("deleteItem")) {
    const index = e.target.getAttribute("data-index");
    var item = markBox.findIndex((el) => String(el.id) === String(index));

    trash = JSON.parse(localStorage.getItem("trashedItem")) || [];

    var deleteMarks = markBox.splice(item, 1)[0];
    trash.unshift(deleteMarks);
    localStorage.setItem("marks", JSON.stringify(markBox));
    localStorage.setItem("trashedItem", JSON.stringify(trash));

    display();
    myInputSearch.value = "";
  }
});

// Event checkbox
data.addEventListener("click", function (e) {
  // Handle checkbox checked
  if (e.target.type === "checkbox" && e.target.checked) {
    const index = e.target.getAttribute("data-index");

    if (!checked.includes(index)) {
      checked.push(index);
    }
  }

  // Handle checkbox canceled
  if (e.target.type === "checkbox" && !e.target.checked) {
    const index = e.target.getAttribute("data-index");

    var itemIndex = checked.indexOf(index);
    if (itemIndex !== -1) {
      checked.splice(itemIndex, 1);
    }
  }
});

// Event Update
data.addEventListener("click", function (e) {
  if (e.target.classList.contains("updateItem")) {
    const index = e.target.getAttribute("data-index");

    var itemIndex = markBox.findIndex((el) => el.id == index);

    updateIndex = itemIndex;
    myInputName.value = markBox[itemIndex].Name;
    myInputURL.value = markBox[itemIndex].URL;
    btnAdd.classList.add("d-none");
    btnUpdate.classList.remove("d-none");
  }
});

//Update
btnUpdate.addEventListener("click", function () {
  var data = {
    Name: myInputName.value,
    URL: myInputURL.value,
    id: Date.now() + Math.floor(Math.random() * 1000),
  };

  markBox.splice(updateIndex, 1, data);
  localStorage.setItem("marks", JSON.stringify(markBox));
  display();
  btnAdd.classList.remove("d-none");
  btnUpdate.classList.add("d-none");
  clear();
});

//Delete multi item
deleteItems.addEventListener("click", function (e) {
  trash = JSON.parse(localStorage.getItem("trashedItem")) || [];
  if (checkBoxAll.checked) {
    for (var i = 0; i < markBox.length; i++) {
      trash.unshift(markBox[i]);
    }
    markBox = [];
    localStorage.setItem("marks", JSON.stringify(markBox));
    localStorage.setItem("trashedItem", JSON.stringify(trash));
    display();
    checkBoxAll.checked = false;
    checked = [];
  } else if (checked.length > 0) {
    for (var i = 0; i < checked.length; i++) {
      for (var j = 0; j < markBox.length; j++) {
        if (checked[i] == markBox[j].id) {
          var deleteMarks = markBox.splice(j, 1)[0];

          trash.unshift(deleteMarks);
        }
      }
    }
    checked = [];
    localStorage.setItem("marks", JSON.stringify(markBox));
    localStorage.setItem("trashedItem", JSON.stringify(trash));
    display();
    checkBoxAll.checked = false;
  }
  myInputSearch.value = "";
});

//search
myInputSearch.addEventListener("input", function () {
  var term = myInputSearch.value;

  var container = "";
  for (var i = 0; i < markBox.length; i++) {
    if (markBox[i].Name.toLowerCase().includes(term.toLowerCase())) {
      container += createData(i);
    }
    data.innerHTML = container;
  }
});

//Validation

function validationName() {
  var regex = /^[a-zA-Z][a-zA-Z0-9 _-]{2,19}$/;
  var text = myInputName.value;

  if (regex.test(text)) {
    myInputName.classList.add("is-valid");
    myInputName.classList.remove("is-invalid");
    return true;
  } else {
    myInputName.classList.remove("is-valid");
    myInputName.classList.add("is-invalid");
    return false;
  }
}

myInputName.addEventListener("input", function () {
  validationName();
});

function validationURL() {
  var regex =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;

  var text = myInputURL.value;

  if (regex.test(text)) {
    myInputURL.classList.add("is-valid");
    myInputURL.classList.remove("is-invalid");
    return true;
  } else {
    myInputURL.classList.remove("is-valid");
    myInputURL.classList.add("is-invalid");
    return false;
  }
}

myInputURL.addEventListener("input", function () {
  validationURL();
});

function clear() {
  myInputName.classList.remove("is-valid");
  myInputURL.classList.remove("is-valid");
  myInputName.value = "";
  myInputURL.value = "";
}
