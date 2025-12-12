document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const API_URL = 'http://localhost:3000/api/todos';

    // Fetch all todos
    async function fetchTodos() {
        try {
            const response = await fetch(API_URL);
            const todos = await response.json();
            renderTodos(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    // Add new todo
    async function addTodo() {
        const text = todoInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });
            
            if (response.ok) {
                todoInput.value = '';
                fetchTodos();
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    // Toggle todo completion status
    async function toggleTodo(id, currentStatus) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !currentStatus })
            });
            
            fetchTodos();
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }

    // Delete todo
    async function deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this todo?')) return;
        
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    // Render todos to the DOM
    function renderTodos(todos) {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            todoList.innerHTML = '<p class="no-todos">No todos yet. Add one above!</p>';
            return;
        }

        todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoElement.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add event listeners
            const checkbox = todoElement.querySelector('input[type="checkbox"]');
            const deleteBtn = todoElement.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => toggleTodo(todo._id, todo.completed));
            deleteBtn.addEventListener('click', () => deleteTodo(todo._id));

            todoList.appendChild(todoElement);
        });
    }

    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // Initial fetch
    fetchTodos();
});
