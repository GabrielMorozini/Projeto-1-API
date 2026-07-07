import { createUser } from './scripts/api/create.js';
import { renderUsers, findUserById } from './scripts/dom/render.js';

form.add.addEventListener('submit', async (event) => {
    event.preventDefault();

    const apiUrl = 'http://localhost:8000/api/users'
    const form = document.getElementById('create-user-form');
    const formError = document.getElementById('form-error');

    hideError();

    
    try {
        await createUser(apiUrl, {name, age, email})
        form.reset();
        renderUsers(apiUrl);
    } catch(error) {
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