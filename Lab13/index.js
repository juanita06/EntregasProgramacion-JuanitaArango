document.addEventListener("DOMContentLoaded", function() {
    // Obtener referencias a elementos HTML
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const todoContainer = document.getElementById("todo-container");
    const doingContainer = document.getElementById("doing-container");
    const doneContainer = document.getElementById("done-container");

    // Función para crear una tarjeta de tarea con los botones
    function createTaskCard(text, status) {
        const card = document.createElement("div");
        card.className = "task-card";
        card.dataset.status = status; // Agregar el estado como atributo dataset

        card.innerHTML = `
        <div class="arriba">
        <button class="delete-button">X</button>
        </div>
        <div class="cajatexto">
        <p class="texto">${text}</p>
        </div>
        <div class="abajo">           
        <button class="move-up-button"></button>
        <button class="move-down-button"></button>
        </div>    
        `;                   
    

        // Agregar evento para cambiar el estado de la tarjeta
        const moveUpButton = card.querySelector(".move-up-button");
        moveUpButton.addEventListener("click", () => {
            changeTaskStatus(card, "up");
        });

        const moveDownButton = card.querySelector(".move-down-button");
        moveDownButton.addEventListener("click", () => {
            changeTaskStatus(card, "down");
        });

        // Agregar evento para eliminar la tarjeta
        card.querySelector(".delete-button").addEventListener("click", () => {
            deleteTask(card);
        });

        return card;
    }

    // Función para cambiar el estado de la tarjeta
    function changeTaskStatus(card, direction) {
        const currentContainer = card.parentElement;
        const newStatus = getNextStatus(card, direction);

        // Mover la tarjeta al nuevo contenedor (To Do, Doing o Done)
        const newContainer = getContainerByStatus(newStatus);
        newContainer.appendChild(card);

        // Actualizar el estado de la tarjeta
        card.dataset.status = newStatus;

        // Guardar la tarea en localStorage
        saveTasks();
    }

    // Función para obtener el siguiente estado
    function getNextStatus(card, direction) {
        const statuses = ["To Do", "Doing", "Done"];
        const currentStatus = card.dataset.status;
        const currentIndex = statuses.indexOf(currentStatus);

        if (direction === "up" && currentIndex > 0) {
            return statuses[currentIndex - 1];
        } else if (direction === "down" && currentIndex < 2) {
            return statuses[currentIndex + 1];
        }

        return currentStatus;
    }

    // Función para obtener el contenedor por estado
    function getContainerByStatus(status) {
        switch (status) {
            case "To Do":
                return todoContainer;
            case "Doing":
                return doingContainer;
            case "Done":
                return doneContainer;
        }
    }

    function deleteTask(card) {
        const currentContainer = card.parentElement;
        currentContainer.removeChild(card);

        // Guardar las tareas en localStorage
        saveTasks();
    }

    // Función para guardar las tareas en localStorage
    function saveTasks() {
        const tasks = [];

        [todoContainer, doingContainer, doneContainer].forEach(container => {
            container.querySelectorAll(".task-card").forEach(card => {
                tasks.push({
                    text: card.querySelector(".texto").textContent,
                    status: card.dataset.status,
                });
            });
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Función para cargar las tareas desde el almacenamiento local
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));

        if (tasks) {
            tasks.forEach(task => {
                const taskCard = createTaskCard(task.text, task.status);
                getContainerByStatus(task.status).appendChild(taskCard);
            });
        }
    }

    // Cargar tarjetas desde el localStorage al iniciar la página
    loadTasks();

    // Manejar el envío del formulario
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const text = taskInput.value;
        if (text) {
            // Crea una tarjeta To Do y almacénala en localStorage
            const taskCard = createTaskCard(text, "To Do");
            todoContainer.appendChild(taskCard);
            taskInput.value = "";

            // Guardar la tarea en localStorage
            saveTasks();
        }
    });
});



