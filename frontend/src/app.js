import { createUser } from './script/api/create.js';
import { renderUsers, findUserById } from './script/dom/render.js';
import { deleteUser } from './script/api/delete.js';
import { updateUser, patchUser } from './script/api/update.js';

// Config
const apiUrl = 'http://localhost:8000/api/users';

// DOM
const form = document.getElementById('create-user-form');
const formTitle = document.getElementById('form-title');
const submitBtn = form.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById('cancel-edit');
const formError = document.getElementById('form-error');

// Estado de edição:
let editingId = null;
let originalUser = null;

// Criação / edição do usuário
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;

    hideError();

    try {
        if (editingId !== null) {
            // === MODO EDIÇÃO ===
            const changed = {};
            if (name !== originalUser.name) changed.name = name;
            if (Number(age) !== originalUser.age) changed.age = age;
            if (email !== originalUser.email) changed.email = email;

            // Nada mudou? Sai da edição.
            if (Object.keys(changed).length === 0) {
                exitEditMode();
                return;
            }

            // Todos mudaram -> PUT; alguns -> PATCH
            const allChanged = Object.keys(changed).length === 3;

            if (allChanged) {
                await updateUser(apiUrl, editingId, { name, age, email });
            } else {
                await patchUser(apiUrl, editingId, changed);
            }
        } else {
            // === MODO CRIAÇÃO ===
            await createUser(apiUrl, { name, age, email });
        }

        exitEditMode();
        form.reset();
        renderUsers(apiUrl);
    } catch (error) {
        showError(error.message);
    }
});

// Carregamento da lista de usuários
document.addEventListener('DOMContentLoaded', () => renderUsers(apiUrl));

function showError(message) {
    formError.textContent = message;
    formError.classList.remove('d-none');
}

function hideError() {
    formError.classList.add('d-none');
    formError.textContent = '';
}

// função auxiliar
function getUserFromCard(button) {
    const card = button.closest('.user-card');
    return findUserById(Number(card.id));
}

const usersSection = document.getElementById('users');

usersSection.addEventListener('click', async (event) => {
    const { target } = event;

    if (target.dataset.action === 'edit') {
        enterEditMode(getUserFromCard(target));
    }

    if (target.dataset.action === 'delete') {
        const user = getUserFromCard(target);

        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(apiUrl, user.id);

            if (editingId === user.id) exitEditMode();

            renderUsers(apiUrl);
        } catch (error) {
            showError(error.message);
        }
    }
});

// Edita usuário baseado no id
function enterEditMode(user) {
    editingId = user.id;
    // Cria uma cópia para comparar a nova versão com a cópia da antiga
    originalUser = { ...user };

    document.getElementById('name').value = user.name;
    document.getElementById('age').value = user.age;
    document.getElementById('email').value = user.email;

    formTitle.textContent = 'Edit User';
    submitBtn.textContent = 'Update';
    cancelBtn.style.display = '';

    document.getElementById('name').focus();
}

// reseta e limpa o estado voltando para o Create User
function exitEditMode() {
    editingId = null;
    originalUser = null;
    formTitle.textContent = 'Create User';
    submitBtn.textContent = 'Create';
    cancelBtn.style.display = 'none';
    form.reset();
}

cancelBtn.addEventListener('click', exitEditMode);