var myInputSearch = document.getElementById("search");
var dataArchived = document.getElementById("dataArchived");
var deleteItems = document.querySelector(".deleteItems");
var checkBoxAll = document.querySelector(".checkBoxAll");
var modalDelete = document.querySelector(".modalDelete");
var yesBtn = document.querySelector(".yesBtn");
var cancelBtn = document.querySelector(".cancelBtn");

var trash = [];
var restore = [];
var checked = [];

trash = JSON.parse(localStorage.getItem("trashedItem")) || [];
display();

// Display Data
function display() {
  var container = "";
  for (var i = 0; i < trash.length; i++) {
    container += createData(i);
  }

  dataArchived.innerHTML = container;
}

function createData(i) {
  return `
                      <tr class="align-middle text-center">
              <td><input type="checkbox" name="" class="isChecked" data-index="${trash[i].id}"></td>
              
  
              <td>${trash[i].Name}</td>
  
              
              <td >
                <button class="btn text-dark-emphasis " >
                  <i class="fa-solid fa-arrows-rotate restoreItem"  data-index="${trash[i].id}"></i>
                </button>
                
              </td>
              <td >
                  <button class="btn text-danger ">
                    <i class="fa-regular fa-trash-can deleteItem" data-index="${trash[i].id}"></i>
                  </button>
                  
              </td>
            </tr>
          `;
}

myInputSearch.addEventListener("input", function () {
  var term = myInputSearch.value;

  var container = "";
  for (var i = 0; i < trash.length; i++) {
    if (trash[i].Name.toLowerCase().includes(term.toLowerCase())) {
      container += createData(i);
    }
    dataArchived.innerHTML = container;
  }
});

// Event  for delete buttons
dataArchived.addEventListener("click", function (e) {
  if (e.target.classList.contains("deleteItem")) {
    const index = e.target.getAttribute("data-index");
    var item = trash.findIndex((el) => el.id == index);
    modalDelete.classList.remove("d-none");

    var handleDelete = function () {
      if (item !== -1) {
        trash.splice(item, 1);
        localStorage.setItem("trashedItem", JSON.stringify(trash));
        display();
      }
      modalDelete.classList.add("d-none");
      yesBtn.removeEventListener("click", handleDelete);
    };

    yesBtn.addEventListener("click", handleDelete);

    cancelBtn.addEventListener("click", function () {
      modalDelete.classList.add("d-none");
      yesBtn.removeEventListener("click", handleDelete);
    });
  }
  myInputSearch.value = "";
});

// Event  for Restore
dataArchived.addEventListener("click", function (e) {
  if (e.target.classList.contains("restoreItem")) {
    const index = e.target.getAttribute("data-index");
    var item = trash.findIndex((el) => el.id == index);

    var restoredMarks = trash.splice(item, 1)[0];
    restore = JSON.parse(localStorage.getItem("marks")) || [];
    restore.unshift(restoredMarks);
    localStorage.setItem("trashedItem", JSON.stringify(trash));
    localStorage.setItem("marks", JSON.stringify(restore));
    display();
  }
});

// Event checkbox
dataArchived.addEventListener("click", function (e) {
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

// Delete multiple items with confirmation modal
deleteItems.addEventListener("click", function (e) {
  if (checkBoxAll.checked || checked.length > 0) {
    modalDelete.classList.remove("d-none");
    const handleDelete = function () {
      if (checkBoxAll.checked) {
        trash = [];
      } else if (checked.length > 0) {
        for (var i = 0; i < checked.length; i++) {
          for (var j = trash.length - 1; j >= 0; j--) {
            if (checked[i] == trash[j].id) {
              trash.splice(j, 1);
            }
          }
        }
      }
      checked = [];
      localStorage.setItem("trashedItem", JSON.stringify(trash));
      display();
      checkBoxAll.checked = false;
      modalDelete.classList.add("d-none");

      yesBtn.removeEventListener("click", handleDelete);
      cancelBtn.removeEventListener("click", handleCancel);
    };

    const handleCancel = function () {
      modalDelete.classList.add("d-none");
      yesBtn.removeEventListener("click", handleDelete);
      cancelBtn.removeEventListener("click", handleCancel);
    };

    yesBtn.addEventListener("click", handleDelete);
    cancelBtn.addEventListener("click", handleCancel);
  }
  myInputSearch.value = "";
});
