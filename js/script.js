document.addEventListener('DOMContentLoaded', () => {
    // --- Seleksi Elemen DOM ---
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');
    const validationError = document.getElementById('validation-error');
    const validationErrorDate = document.getElementById('validation-error-date');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterContainer = document.querySelector('.filter-buttons');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    // Mengambil data dari localStorage atau menggunakan array kosong
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // --- Fungsi ---

    /**
     * Menyimpan array todos ke localStorage
     */
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    /**
     * Merender (menampilkan) semua item to-do ke dalam list
     */
    const renderTodos = () => {
        todoList.innerHTML = ''; // Kosongkan list sebelum merender ulang
        
        // Filter todos berdasarkan filter yang aktif
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        const filteredTodos = todos.filter(todo => {
            if (activeFilter === 'completed') return todo.completed;
            if (activeFilter === 'pending') return !todo.completed;
            return true; // 'all'
        });

        deleteAllBtn.style.display = todos.length > 0 ? 'inline-block' : 'none';

        if (filteredTodos.length === 0) {
            todoList.innerHTML = `<p class="empty-list-message">Belum ada tugas.</p>`;
            return;
        }
        
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            if (todo.completed) {
                todoItem.classList.add('completed');
            }
            todoItem.dataset.id = todo.id;

            const formattedDate = todo.date ? new Date(todo.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '';

            todoItem.innerHTML = `
                <div class="todo-content">
                    <span class="todo-text">${todo.text}</span>
                    ${todo.date ? `<span class="todo-date">${formattedDate}</span>` : ''}
                </div>
                <div class="todo-actions">
                    <button class="complete-btn" title="Tandai Selesai"><i class="fas fa-check-circle"></i></button>
                    <button class="delete-btn" title="Hapus Tugas"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });
    };

    /**
     * Menambahkan to-do baru
     */
    const addTodo = (e) => {
        e.preventDefault();
        const todoText = todoInput.value.trim();
        const todoDateValue = todoDate.value;
        

        if (todoText === '') {
            validationError.style.display = 'block';
            todoInput.classList.add('invalid');
            return;
        } else {
            validationError.style.display = 'none';
            todoInput.classList.remove('invalid');
        }

        if (todoDateValue === '') {
            validationErrorDate.style.display = 'block';
            todoDate.classList.add('invalid');
            return;
        } else {
            validationErrorDate.style.display = 'none';
            todoDate.classList.remove('invalid');
        }

        const newTodo = {
            id: Date.now(),
            text: todoText,
            date: todoDateValue,
            completed: false
        };

        todos.unshift(newTodo); // Tambahkan ke awal array
        
        saveTodos();
        renderTodos();

        todoForm.reset();
        todoInput.focus();
        todoDate.valueAsDate = new Date(); // Reset tanggal ke hari ini
    };

    /**
     * Menangani klik pada tombol Selesai atau Hapus
     */
    const handleListClick = (e) => {
        const target = e.target;
        const todoItem = target.closest('li.todo-item');
        if (!todoItem) return;

        const todoId = Number(todoItem.dataset.id);

        if (target.closest('.complete-btn')) {
            const todo = todos.find(t => t.id === todoId);
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();
        }

        if (target.closest('.delete-btn')) {
            todos = todos.filter(t => t.id !== todoId);
            saveTodos();
            renderTodos();
        }
    };

    /**
     * Menangani klik pada tombol filter
     */
    const handleFilterClick = (e) => {
        const target = e.target.closest('.filter-btn');
        if (!target) return;

        filterBtns.forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        
        renderTodos(); // Render ulang list sesuai filter
    };

    const deleteAllTodos = () => {
        if (todos.length > 0) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    };
    
    // --- Event Listeners ---
    todoForm.addEventListener('submit', addTodo);
    todoList.addEventListener('click', handleListClick);
    filterContainer.addEventListener('click', handleFilterClick);
    deleteAllBtn.addEventListener('click', deleteAllTodos);
    // --- Inisialisasi ---
    todoDate.valueAsDate = new Date();
    renderTodos();
});