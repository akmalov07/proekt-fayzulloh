const API_URL = 'https://68078417e81df7060eba9d22.mockapi.io/contacts/contact';

let editingId = null;

async function fetchContacts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  document.getElementById('contactList').innerHTML = '';
  data.forEach(contact => renderContact(contact));
}

function renderContact(contact) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${contact.name} - ${contact.number}</span>
    <div>
      <button onclick="startEdit('${contact.id}', '${contact.name}', '${contact.number}')">Изменить</button>
      <button onclick="deleteContact('${contact.id}')">Удалить</button>
    </div>
  `;
  document.getElementById('contactList').appendChild(li);
}


async function addContact() {
  const name = document.getElementById('nameInput').value.trim();
  const number = document.getElementById('numberInput').value.trim();

  if (!name || !number) return alert('Пожалуйста, заполните все поля!');

  const contactData = { name, number };

  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    editingId = null;
    document.querySelector('button').innerText = 'Добавить контакт';
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
  }

  document.getElementById('nameInput').value = '';
  document.getElementById('numberInput').value = '';
  fetchContacts();
}

async function deleteContact(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchContacts();
}

function startEdit(id, name, number) {
  document.getElementById('nameInput').value = name;
  document.getElementById('numberInput').value = number;
  editingId = id;
  document.querySelector('button').innerText = 'Обновить контакт';
}

fetchContacts();