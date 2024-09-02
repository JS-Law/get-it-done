import { saveProjectsToLocalStorage } from ".";
import { loadProjectsFromLocalStorage } from ".";
class Project {
    #tasks; // Private field

    constructor(projectName, dueDate, status = 'Not Started'){
        this.#tasks = [];
        this.projectName = projectName;
        this.dueDate = dueDate;
        this.status = status
    }

    addNewTask(taskObject){
        this.#tasks.push(taskObject);
    }

    getTasks() {
        return [...this.#tasks]; // Return a copy to prevent external modifications
    }

    removeTask(taskToRemove){
        this.#tasks = this.#tasks.filter(task => task !== taskToRemove);
    }
    setProjectInProgress(){
        this.status = 'In Progress'
    }

    setProjectComplete(){
        this.status = 'Complete'
    }

}

function getUserInput(promptText){
    try {
        let userInput = prompt(promptText);
        return userInput;
    } catch (error) {
        console.error('Prompt not defined');
        return 'Error';
    }
}

function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = String(hours).padStart(2, '0');

    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
}

class Task {
    constructor(name, dueDate, dateCreated, priority, description = '', notes = '', checkList = [], status) {
        this.name = name;
        this.dueDate = dueDate;
        this.dateCreated = dateCreated;
        this.priority = priority;
        this.description = description;
        this.notes = notes;
        this.checkList = checkList.map(item => ({ name: item, completed: false }));
        this.status = status;
    }

    addItemToCheckList(...itemsToAdd) {
        itemsToAdd.forEach(item => {
            this.checkList.push({ name: item, completed: false });
        });
    }

    removeItemFromCheckList(itemToRemove) {
        this.checkList = this.checkList.filter(item => item.name !== itemToRemove);
    }

    completeSubtask(itemName) {
        const subtask = this.checkList.find(item => item.name === itemName);
        if (subtask) {
            subtask.completed = true;
            this.checkIfAllSubtasksCompleted();
        }
    }

    checkIfAllSubtasksCompleted(taskElement) {
        const allCompleted = this.checkList.every(item => item.completed);
        if (allCompleted && taskElement) {
            this.setStatusComplete();
            taskElement.classList.add('task-completed');
        }
    }

    setStatusComplete() {
        this.status = 'Complete';
    }

    setStatusInProgress() {
        this.status = 'In Progress';
    }

    setTaskPriority(taskPriority) {
        this.priority = taskPriority;
    }
}



function displayTasks(project) {
    // Locate or create the project tab
    let projectTab = document.querySelector(`[data-project="${project.projectName}"]`);
    if (!projectTab) {
        const tabsGroup = document.querySelector('.tabs');
        projectTab = document.createElement('li');
        projectTab.setAttribute('data-project', project.projectName);

        const projectTabTitleLink = document.createElement('a');
        projectTabTitleLink.textContent = `${project.projectName}`;
        projectTabTitleLink.href = '#';

        projectTab.appendChild(projectTabTitleLink);
        tabsGroup.appendChild(projectTab);

        projectTabTitleLink.addEventListener('click', () => {
            switchToProjectTab(project);
        });
    }

    // Create or locate the content container for tasks
    let projectContent = document.querySelector(`#content-${project.projectName}`);
    if (!projectContent) {
        projectContent = document.createElement('div');
        projectContent.id = `content-${project.projectName.replace(/\s+/g, '_')}`;
        projectContent.classList.add('project-content');
        projectContent.style.width = '100%';

        const projectSection = document.querySelector('#project-section');
        projectSection.appendChild(projectContent);
    }

    projectContent.innerHTML = ''; // Clear previous content

    // Create columns for High, Medium, Low priorities
    const highPriorityColumn = createPriorityColumn('High', 'High Priority', project, 'high');
    const mediumPriorityColumn = createPriorityColumn('Medium', 'Medium Priority', project, 'medium');
    const lowPriorityColumn = createPriorityColumn('Low', 'Low Priority', project, 'low');

    projectContent.appendChild(highPriorityColumn);
    projectContent.appendChild(mediumPriorityColumn);
    projectContent.appendChild(lowPriorityColumn);

    makeTasksDraggable();
}

function showTaskInputForm(column, priority, project) {
    const form = document.createElement('div');
    form.classList.add('task-input-form');

    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.placeholder = 'Task Name';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Task';
    addButton.classList.add('add-task-button');

    addButton.addEventListener('click', () => {
        const taskName = taskNameInput.value;
        let projects = loadProjectsFromLocalStorage(); // Load existing projects
    
        if (taskName) {
            const newTask = new Task(taskName, getTimestamp(), getTimestamp(), priority, '', '', [], 'Not Started');
            project.addNewTask(newTask); // Add task to project
    
            const taskElement = createTaskElement(newTask);
            makeTaskDraggable(taskElement);
            column.appendChild(taskElement);
    
            // Find the correct project in the projects array and update it
            const updatedProjectIndex = projects.findIndex(p => p.projectName === project.projectName);
            if (updatedProjectIndex !== -1) {
                projects[updatedProjectIndex] = project;
            }
    
            saveProjectsToLocalStorage(projects); // Update localStorage after adding the task
            form.remove();
        }
    });
    

    form.appendChild(taskNameInput);
    form.appendChild(addButton);
    column.appendChild(form);
}


function createPriorityColumn(priority, title, project) {
    const column = document.createElement('div');
    column.classList.add('column');
    column.id = `${priority.toLowerCase()}-priority-column`;
    column.style.width = '33.3%';

    const columnHeader = document.createElement('div');
    columnHeader.style.display = 'flex';
    columnHeader.style.justifyContent = 'space-between';

    const columnTitle = document.createElement('h2');
    columnTitle.id = `${priority.toLowerCase()}-priority-column-title`;
    columnTitle.textContent = title;
    columnTitle.classList.add('column-titles');

    const addTaskButton = document.createElement('button');
    addTaskButton.classList.add('column-button');
    const icon = document.createElement('span');
    icon.className = 'material-icons';
    icon.textContent = 'add';
    addTaskButton.appendChild(icon);
    const buttonText = document.createTextNode('Add Task');
    addTaskButton.appendChild(buttonText);

    addTaskButton.addEventListener('click', () => showTaskInputForm(column, priority, project));

    columnHeader.appendChild(columnTitle);
    columnHeader.appendChild(addTaskButton);
    column.appendChild(columnHeader);

    // Iterate over the tasks to add them to the column
    project.getTasks().forEach(task => {
        if (task.priority.toLowerCase() === priority.toLowerCase()) { // Case-insensitive comparison
            const taskElement = createTaskElement(task, project);  // Pass project to createTaskElement
            column.appendChild(taskElement);
        }
    });


    return column;
}




function createTaskElement(task, project) {  // Ensure project is passed
    console.log('Creating task element for task:', task);
    console.log('Project object in createTaskElement:', project);

    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    
    const taskTitleHeader = document.createElement('div');
    taskTitleHeader.id = 'task-header-container';
    taskTitleHeader.style.display = 'flex';
    taskTitleHeader.style.justifyContent = 'space-between';

    const taskTitleElement = document.createElement('h3');
    taskTitleElement.textContent = task.name;
    taskTitleElement.classList.add('task-title');

    const divider = document.createElement('hr');
    divider.classList.add('divider');

    const checklist = document.createElement('ul');
    checklist.classList.add('checklist');

    task.checkList.forEach((item, index) => {
        const listItem = createChecklistItem(item, task, index, taskElement, project);  // Pass project
        checklist.appendChild(listItem);
    });

    const addSubtaskButton = document.createElement('button');
    addSubtaskButton.classList.add('add-subtask-button');
    addSubtaskButton.textContent = 'Add Subtask';
    addSubtaskButton.style.marginTop = '0';
    addSubtaskButton.style.marginBottom = '15px';

    addSubtaskButton.addEventListener('click', () => {
        const subTaskContainer = document.createElement('div');
        subTaskContainer.classList.add('subtask-container');

        const newSubtaskInput = document.createElement('input');
        newSubtaskInput.type = 'text';
        newSubtaskInput.placeholder = 'Subtask Name';

        const saveSubtaskButton = document.createElement('button');
        saveSubtaskButton.textContent = 'Save';
        saveSubtaskButton.classList.add('subtask-button');

        saveSubtaskButton.addEventListener('click', () => {
            if (newSubtaskInput.value) {
                task.addItemToCheckList(newSubtaskInput.value);
                const newSubtaskItem = createChecklistItem(newSubtaskInput.value, task, task.checkList.length - 1, taskElement, project);
                checklist.appendChild(newSubtaskItem);
                makeTasksDraggable(); // Reapply draggable functionality

                // Persist changes
                let projects = loadProjectsFromLocalStorage();
                if (projects) {
                    const updatedProjectIndex = projects.findIndex(p => p.projectName === project.projectName);
                    if (updatedProjectIndex !== -1) {
                        projects[updatedProjectIndex] = project;
                        saveProjectsToLocalStorage(projects);
                    } else {
                        console.error('Project not found for update:', project.projectName);
                    }
                }
                
                newSubtaskInput.remove();
                saveSubtaskButton.remove();
            }
        });

        subTaskContainer.appendChild(newSubtaskInput);
        subTaskContainer.appendChild(saveSubtaskButton);
        taskElement.appendChild(subTaskContainer);
    });

    taskElement.appendChild(taskTitleHeader);
    taskTitleHeader.appendChild(taskTitleElement);
    taskTitleHeader.appendChild(addSubtaskButton);
    taskElement.appendChild(divider);
    taskElement.appendChild(checklist);

    return taskElement;
}




function createChecklistItem(item, task, index, taskElement, project) {
    const listItem = document.createElement('li');
    listItem.className = 'subchecklist';

    const container = document.createElement('div');
    container.className = 'container';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `cbx-${task.name}-${index}`;
    checkbox.style.display = 'none';

    const label = document.createElement('label');
    label.setAttribute('for', checkbox.id);
    label.className = 'check';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "18px");
    svg.setAttribute("height", "18px");
    svg.setAttribute("viewBox", "0 0 18 18");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z");

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", "1 9 7 14 15 4");

    svg.appendChild(path);
    svg.appendChild(polyline);
    label.appendChild(svg);
    container.appendChild(checkbox);
    container.appendChild(label);

    listItem.appendChild(container);

    const taskContent = document.createElement('span');
    taskContent.textContent = item.name || item;
    listItem.appendChild(taskContent);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            listItem.classList.add('completed');
            setTimeout(() => {
                task.completeSubtask(item.name || item);
                task.checkIfAllSubtasksCompleted(taskElement);

                let projects = loadProjectsFromLocalStorage();
                if (projects) {
                    const updatedProjectIndex = projects.findIndex(p => p.projectName === project.projectName);
                    if (updatedProjectIndex !== -1) {
                        projects[updatedProjectIndex] = project;
                        saveProjectsToLocalStorage(projects);
                    } else {
                        console.error('Project not found for update:', project.projectName);
                    }
                }
            }, 1000);
        }
    });

    return listItem;
}







function makeTaskDraggable(task) {
    task.draggable = true;
    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
    });
}


function makeTasksDraggable() { // Line 172
    const columns = document.querySelectorAll('.column'); // Line 173

    columns.forEach(column => { // Line 174
        column.addEventListener('dragover', (e) => { // Line 175
            e.preventDefault(); // Line 176
            // The element currently being dragged
            const dragging = document.querySelector('.dragging'); // Line 177
            if (dragging) { // Line 178
                column.appendChild(dragging); // Line 179
            }
        });

        column.addEventListener('drop', (e) => { // Line 182
            e.preventDefault(); // Line 183
            const dragging = document.querySelector('.dragging'); // Line 184
            if (dragging) { // Line 185
                column.appendChild(dragging); // Line 186
                dragging.classList.remove('dragging'); // Line 187
            } else { // Line 188
            }
        });
    });

    const tasks = document.querySelectorAll('.task'); // Line 193
    tasks.forEach(task => { // Line 194
        task.draggable = true; // Line 195
        task.addEventListener('dragstart', () => { // Line 196
            task.classList.add('dragging'); // Line 197
        });

        task.addEventListener('dragend', () => { // Line 200
            task.classList.remove('dragging'); // Line 201
        });
    }); 
}

function switchToProjectTab(project) {
    // Hide all project contents
    const allProjectContents = document.querySelectorAll('.project-content');
    allProjectContents.forEach(content => {
        content.style.display = 'none';
    });

    // Log the project name and the ID we're trying to select
    // console.log(`Switching to project tab: ${project.projectName}`);
    // console.log(`Looking for element with ID: content-${project.projectName}`);

    // Show the selected project content
    const selectedProjectContent = document.querySelector(`#content-${project.projectName.replace(/\s+/g, '_')}`);

    // console.log('Selected project content:', selectedProjectContent); // Log the element found

    if (selectedProjectContent) {
        selectedProjectContent.style.display = 'flex';
    } else {
        // console.error(`No element found with ID: content-${project.projectName}`);
    }

    // Update the active tab
    const tabs = document.querySelectorAll('.tabs li');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const activeTab = document.querySelector(`[data-project="${project.projectName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}


export {
    Project,
    Task,
    getTimestamp,
    displayTasks,
}