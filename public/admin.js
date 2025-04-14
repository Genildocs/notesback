// Configurações
const API_URL = '/api';
const ITEMS_PER_PAGE = 10;

// Estado da aplicação
let currentPage = 1;
let totalUsers = 0;
let users = [];
let filteredUsers = [];

// Elementos do DOM
const usersTableBody = document.getElementById('usersTableBody');
const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const showingFrom = document.getElementById('showingFrom');
const showingTo = document.getElementById('showingTo');
const totalUsersSpan = document.getElementById('totalUsers');

// Verificar autenticação
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
      return;
    }

    const user = await response.json();
    if (user.data.user.role !== 'admin') {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    }
  } catch (error) {
    console.error('Erro de autenticação:', error);
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
};

// Funções auxiliares
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const getStatusBadge = (active) => {
    return active ? 
        '<span class="status-badge active">Ativo</span>' : 
        '<span class="status-badge inactive">Inativo</span>';
};

const getRoleBadge = (role) => {
    return role === 'admin' ? 
        '<span class="role-badge admin">Admin</span>' : 
        '<span class="role-badge user">Usuário</span>';
};

// Carregar usuários
const loadUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Erro ao carregar usuários');
        
        users = await response.json();
        filteredUsers = [...users];
        totalUsers = users.length;
        
        updatePagination();
        renderUsers();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar usuários');
    }
};

// Renderizar usuários
const renderUsers = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const usersToShow = filteredUsers.slice(start, end);

    usersTableBody.innerHTML = usersToShow.map(user => `
        <tr class="fade-in">
            <td class="px-6 py-4 whitespace-nowrap">${user.username}</td>
            <td class="px-6 py-4 whitespace-nowrap">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getRoleBadge(user.role)}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(user.active)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="editUser('${user._id}')" class="btn-action edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteUser('${user._id}')" class="btn-action delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
};

// Atualizar paginação
const updatePagination = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(start + ITEMS_PER_PAGE - 1, filteredUsers.length);

    showingFrom.textContent = start;
    showingTo.textContent = end;
    totalUsersSpan.textContent = filteredUsers.length;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = end >= filteredUsers.length;
};

// Filtrar usuários
const filterUsers = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const roleFilterValue = roleFilter.value;

    filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilterValue || user.role === roleFilterValue;
        return matchesSearch && matchesRole;
    });

    currentPage = 1;
    updatePagination();
    renderUsers();
};

// Editar usuário
const editUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) throw new Error('Erro ao carregar usuário');
        
        const user = await response.json();
        if (!user) return;

        document.getElementById('editUserId').value = userId;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editStatus').value = user.active ? 'active' : 'inactive';

        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar usuário');
    }
};

// Deletar usuário
const deleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar usuário');
        
        await loadUsers();
        alert('Usuário deletado com sucesso');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar usuário');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadUsers();
    updatePagination();

    searchInput.addEventListener('input', filterUsers);
    roleFilter.addEventListener('change', filterUsers);

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            renderUsers();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const maxPage = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
        if (currentPage < maxPage) {
            currentPage++;
            updatePagination();
            renderUsers();
        }
    });

    document.getElementById('cancelEdit').addEventListener('click', () => {
        document.getElementById('editModal').classList.add('hidden');
    });

    document.getElementById('editUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('editUserId').value;
        const userData = {
            username: document.getElementById('editUsername').value,
            email: document.getElementById('editEmail').value,
            role: document.getElementById('editRole').value,
            active: document.getElementById('editStatus').value === 'active'
        };

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error('Erro ao atualizar usuário');
            
            await loadUsers();
            document.getElementById('editModal').classList.add('hidden');
            alert('Usuário atualizado com sucesso');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar usuário');
        }
    });
}); 