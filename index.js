let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editingIndex = null;

const contactTable = document.querySelector("#contactTable tbody");
const contactFormModal = document.getElementById("contactFormModal");
const contactForm = document.getElementById("contactForm");
const searchBox = document.getElementById("searchBox");
const addContactBtn = document.getElementById("addContactBtn");
const cancelBtn = document.getElementById("cancelBtn");
const bgChanger = document.querySelector("h1");

let imgIndex = 0;

bgChanger.addEventListener("click", () => {
  document.body.style.background = `url('${imgIndex}.jpg')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  imgIndex = (imgIndex + 1) % 3;
});

addContactBtn.addEventListener("click", () => {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
  contactFormModal.style.display = "flex";
  editingIndex = null;
});

cancelBtn.addEventListener("click", () => {
  contactFormModal.style.display = "none";
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  if (phone.length !== 10) {
    Toastify({
      text: "Phone number must be 10 digits",
      duration: 3000,
      backgroundColor: "red",
      close: true,
    }).showToast();
    return;
  }

  if (isDuplicateContact(name, email, phone, editingIndex)) {
    Toastify({
      text: "This contact already exists.",
      duration: 3000,
      backgroundColor: "orange",
      close: true,
    }).showToast();
    return;
  }

  if (editingIndex !== null) {
    contacts[editingIndex] = { name, email, phone, address };
  } else {
    contacts.push({ name, email, phone, address });
  }

  saveContactsToLocalStorage();

  contactFormModal.style.display = "none";

  displayContacts();
});

function isDuplicateContact(name, email, phone, excludeIndex = null) {
  return contacts.some(
    (contact, index) =>
      index !== excludeIndex &&
      (contact.name.toLowerCase() === name.toLowerCase() ||
        contact.email.toLowerCase() === email.toLowerCase() ||
        contact.phone === phone)
  );
}

function displayContacts() {
  contactTable.innerHTML = "";
  contacts.forEach((contact, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.email}</td>
      <td>${contact.phone}</td>
      <td>
        <button class="btn btn-warning m-0" onclick="editContact(${index})">Edit</button>
        <button class="btn btn-danger m-0" onclick="deleteContact(${index})">Delete</button>
      </td>
    `;
    contactTable.appendChild(row);
  });
}

function editContact(index) {
  const contact = contacts[index];
  document.getElementById("name").value = contact.name;
  document.getElementById("email").value = contact.email;
  document.getElementById("phone").value = contact.phone;
  document.getElementById("address").value = contact.address;
  contactFormModal.style.display = "flex";
  editingIndex = index;
}

function customAlertWithAnimation(message) {
  const alertBox = document.createElement("div");
  alertBox.style.position = "fixed";
  alertBox.style.top = "50%";
  alertBox.style.left = "50%";
  alertBox.style.transform = "translate(-50%, -50%)";
  alertBox.style.padding = "20px";
  alertBox.style.backgroundColor = "#f9c74f";
  alertBox.style.border = "2px solid #f94144";
  alertBox.style.borderRadius = "10px";
  alertBox.style.textAlign = "center";
  alertBox.style.zIndex = "9999";
  alertBox.style.opacity = "0";
  alertBox.style.transition = "opacity 0.5s";

  const messageText = document.createElement("p");
  messageText.textContent = message;
  alertBox.appendChild(messageText);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.onclick = function () {
    alertBox.style.opacity = "0";
    setTimeout(() => {
      alertBox.remove();
    }, 500);
  };
  alertBox.appendChild(closeButton);

  document.body.appendChild(alertBox);

  // Add fade-in effect
  setTimeout(() => {
    alertBox.style.opacity = "1";
  }, 10);
}

function deleteContact(index) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contacts.splice(index, 1);
    saveContactsToLocalStorage();
    displayContacts();
  }
}

searchBox.addEventListener("input", () => {
  const searchTerm = searchBox.value.toLowerCase();
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.phone.toLowerCase().includes(searchTerm) ||
      contact.address.toLowerCase().includes(searchTerm)
  );
  displayFilteredContacts(filteredContacts);
});

function displayFilteredContacts(filteredContacts) {
  contactTable.innerHTML = "";
  filteredContacts.forEach((contact, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.email}</td>
      <td>${contact.phone}</td>
      <td>
        <button onclick="editContact(${index})" class="btn btn-warning m-0">Edit</button>
        <button onclick="deleteContact(${index})" class="btn btn-danger m-0">Delete</button>
      </td>
    `;
    contactTable.appendChild(row);
  });
}

let sortOrder = {
  name: "ascending",
  email: "ascending",
  phone: "ascending",
};

function sortContacts(field) {
  sortOrder[field] =
    sortOrder[field] === "ascending" ? "descending" : "ascending";

  contacts.sort((a, b) => {
    if (sortOrder[field] === "ascending") {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
    } else {
      if (a[field] > b[field]) return -1;
      if (a[field] < b[field]) return 1;
    }
    return 0;
  });

  updateSortIcons(field);
  saveContactsToLocalStorage();
  displayContacts();
}

function updateSortIcons(sortedField) {
  document.querySelectorAll(".sort-toggle").forEach((span) => {
    span.innerHTML = "";
  });

  const sortIcon = sortOrder[sortedField] === "ascending" ? "▲" : "▼";
  document.getElementById(`${sortedField}SortOrder`).innerHTML = sortIcon;
}

function saveContactsToLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

window.addEventListener("DOMContentLoaded", () => {
  displayContacts();
});
