let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editingIndex = null;

const contactTable = document.querySelector("#contactTable tbody");
const contactFormModal = document.getElementById("contactFormModal");
const contactForm = document.getElementById("contactForm");
const searchBox = document.getElementById("searchBox");
const addContactBtn = document.getElementById("addContactBtn");
const cancelBtn = document.getElementById("cancelBtn");

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

  if (isDuplicateContact(name, email, phone, editingIndex)) {
    alert("This contact already exists.");
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
        <button class="editBtn" onclick="editContact(${index})">Edit</button>
        <button class="deleteBtn" onclick="deleteContact(${index})">Delete</button>
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
        <button onclick="editContact(${index})">Edit</button>
        <button onclick="deleteContact(${index})">Delete</button>
      </td>
    `;
    contactTable.appendChild(row);
  });
}

function sortContacts(field) {
  contacts.sort((a, b) => {
    if (a[field] < b[field]) return -1;
    if (a[field] > b[field]) return 1;
    return 0;
  });
  saveContactsToLocalStorage();
  displayContacts();
}

function saveContactsToLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

window.addEventListener("DOMContentLoaded", () => {
  displayContacts();
});
