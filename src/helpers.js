import { saveProjectsToLocalStorage } from ".";
import { loadProjectsFromLocalStorage } from ".";

// Add CSS for visual feedback
const style = document.createElement('style');
style.textContent = `
.new-item {
    animation: highlight 2s ease-in-out;
}

@keyframes highlight {
    0% { background-color: rgba(144, 238, 144, 0.5); }
    100% { background-color: transparent; }
}

.task-complete-animation {
    animation: completeTask 1.5s ease-in-out;
}

@keyframes completeTask {
    0% { background-color: rgba(144, 238, 144, 0); }
    50% { background-color: rgba(144, 238, 144, 0.5); }
    100% { background-color: rgba(144, 238, 144, 0); }
}

.shake {
    animation: shake 0.5s linear;
}

@keyframes shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
    100% { transform: translateX(0); }
}

.pulse {
    animation: pulse 1s ease-in-out;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}`;

// Add the style to the document
document.head.appendChild(style);

class Project {
    #tasks; // Private field

    constructor(projectName, dueDate, status = 'Not Started'){
        this.#tasks = [];
        this.projectName = projectName;
        this.dueDate = dueDate;
        this.status = status;
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
        console.error('Error getting user input:', error);
        return 'Error';
    }
}

// Improved error handling for localStorage operations
function safeLoadProjectsFromLocalStorage() {
    try {
        return loadProjectsFromLocalStorage();
    } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        return [];
    }
}

function safeSaveProjectsToLocalStorage(projects) {
    try {
        saveProjectsToLocalStorage(projects);
        return true;
    } catch (error) {
        console.error('Error saving projects to localStorage:', error);
        return false;
    }
}

// Generate a unique ID for tasks and subtasks
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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
        this.id = generateUUID(); // Add unique ID for the task
        this.name = name;
        this.dueDate = dueDate;
        this.dateCreated = dateCreated;
        this.priority = priority;
        this.description = description;
        this.notes = notes;
        // Convert checklist items to include unique IDs
        this.checkList = checkList.map(item => {
            if (typeof item === 'string') {
                return { id: generateUUID(), name: item, completed: false };
            } else if (item && item.name) {
                // If item already has an ID, keep it, otherwise generate one
                return { 
                    id: item.id || generateUUID(),
                    name: item.name, 
                    completed: item.completed || false 
                };
            }
            return null;
        }).filter(item => item !== null);
        this.status = status;
    }

    addItemToCheckList(...itemsToAdd) {
        itemsToAdd.forEach(item => {
            // Create a subtask with a unique ID, handling both string inputs and object inputs
            const subtask = {
                id: generateUUID(),
                name: typeof item === 'string' ? item : (item.name || ''),
                completed: typeof item === 'object' ? (item.completed || false) : false
            };
            this.checkList.push(subtask);
            console.log(`Added subtask with ID ${subtask.id}: ${subtask.name}`);
        });
    }

    removeItemFromCheckList(itemIdOrName) {
        // Support removal by either ID or name
        this.checkList = this.checkList.filter(item => {
            return item.id !== itemIdOrName && item.name !== itemIdOrName;
        });
    }

    completeSubtask(itemIdOrName) {
        // Prioritize ID lookup but keep name for backward compatibility
        // This should be used with caution as name-based lookups could cause linking issues
        let subtask;
        
        // First try to find by ID (preferred)
        if (typeof itemIdOrName === 'string' && itemIdOrName.includes('-')) {
            subtask = this.checkList.find(item => item.id === itemIdOrName);
        }
        
        // If not found, try by name (legacy support)
        if (!subtask) {
            subtask = this.checkList.find(item => item.name === itemIdOrName);
        }
        
        if (subtask) {
            subtask.completed = true;
            this.checkIfAllSubtasksCompleted();
            return true;
        }
        
        return false;
    }

    checkIfAllSubtasksCompleted(taskElement) {
        const allCompleted = this.checkList.length > 0 && this.checkList.every(item => item.completed);
        if (allCompleted) {
            this.setStatusComplete();
            
            // Add visual indication if taskElement is provided
            if (taskElement) {
                taskElement.classList.add('task-completed');
                
                // Add completion animation
                taskElement.classList.add('task-complete-animation');
                setTimeout(() => {
                    taskElement.classList.remove('task-complete-animation');
                }, 1500);
            }
            
            return true;
        }
        return false;
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
    // Hide all project contents first to prevent visual duplication
    const allProjectContents = document.querySelectorAll('.project-content');
    allProjectContents.forEach(content => {
        content.style.display = 'none';
    });

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
    let projectContent = document.querySelector(`#content-${project.projectName.replace(/\s+/g, '_')}`);
    
    // Only create new project content if it doesn't exist
    if (!projectContent) {
        projectContent = document.createElement('div');
        projectContent.id = `content-${project.projectName.replace(/\s+/g, '_')}`;
        projectContent.classList.add('project-content');
        
        // Initially hide the new project content until explicitly shown
        projectContent.style.display = 'none';
        
        // Set all styles in one place
        projectContent.style.flexDirection = 'row';
        projectContent.style.justifyContent = 'space-between';
        projectContent.style.gap = '1rem';
        projectContent.style.width = '100%';
        projectContent.style.padding = '1rem';

        const projectSection = document.querySelector('#project-section');
        projectSection.appendChild(projectContent);
    }

    // Clear previous content AFTER we've confirmed the project content exists
    projectContent.innerHTML = '';

    // Check if columns already exist before creating new ones
    const existingColumns = projectContent.querySelectorAll('.column');
    if (existingColumns.length === 0) {
        // Create columns for High, Medium, Low priorities
        const highPriorityColumn = createPriorityColumn('High', 'High Priority', project, 'high');
        const mediumPriorityColumn = createPriorityColumn('Medium', 'Medium Priority', project, 'medium');
        const lowPriorityColumn = createPriorityColumn('Low', 'Low Priority', project, 'low');

        projectContent.appendChild(highPriorityColumn);
        projectContent.appendChild(mediumPriorityColumn);
        projectContent.appendChild(lowPriorityColumn);
    }

    makeTasksDraggable();
    
    // Return the project content element for reference
    return projectContent;
}

// Helper function to update project in localStorage
function updateProjectInStorage(project) {
    if (!project || !project.projectName) {
        console.warn('Cannot update undefined project in localStorage');
        return false;
    }

    try {
        let projects = safeLoadProjectsFromLocalStorage();
        if (!projects) {
            projects = [];
        }

        const updatedProjectIndex = projects.findIndex(p => p && p.projectName === project.projectName);
        if (updatedProjectIndex !== -1) {
            projects[updatedProjectIndex] = project;
        } else {
            console.warn(`Project ${project.projectName} not found for update, adding it to projects array`);
            projects.push(project);
        }

        safeSaveProjectsToLocalStorage(projects);
        return true;
    } catch (error) {
        console.error('Error updating project in localStorage:', error);
        return false;
    }
}

function showTaskInputForm(column, priority, project) {
    console.log('showTaskInputForm called with:', { column: column?.id, priority, project: project?.projectName });
    
    // Verify we have a valid column
    if (!column) {
        console.error('Invalid column reference');
        return;
    }
    
    // If project is missing but column has data-project-name, try to get project from localStorage
    if (!project || !project.projectName) {
        const projectName = column.getAttribute('data-project-name');
        if (projectName) {
            try {
                const projects = safeLoadProjectsFromLocalStorage();
                project = projects.find(p => p && p.projectName === projectName);
                if (!project) {
                    console.error('Could not find project with name:', projectName);
                    return;
                }
            } catch (error) {
                console.error('Error getting project from localStorage:', error);
                return;
            }
        } else {
            console.error('No project name found on column');
            return;
        }
    }
    
    console.log('Using project:', project.projectName);

    // Remove existing forms to prevent duplicates
    const existingForms = column.querySelectorAll('.task-input-form');
    existingForms.forEach(form => form.remove());

    const form = document.createElement('div');
    form.classList.add('task-input-form');
    form.style.marginTop = '10px';
    form.style.marginBottom = '10px';

    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.placeholder = 'Task Name';
    taskNameInput.classList.add('task-name-input');
    taskNameInput.style.marginRight = '5px';

    // Add focus for better UX
    setTimeout(() => taskNameInput.focus(), 0);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Task';
    addButton.classList.add('add-task-button');

    // Also allow Enter key to submit
    taskNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskName = taskNameInput.value.trim();
        
        if (!taskName) {
            console.warn('Task name is required');
            taskNameInput.classList.add('error');
            setTimeout(() => taskNameInput.classList.remove('error'), 2000);
            return;
        }
        
        try {
            console.log('Adding new task to project:', project.projectName);
            
            // Double-check priority value - default to column's priority if not provided
            const taskPriority = priority || column.getAttribute('data-priority') || 'Medium';
            
            // Create new task with the given priority
            const newTask = new Task(taskName, getTimestamp(), getTimestamp(), taskPriority, '', '', [], 'Not Started');
            
            // Add task to project
            project.addNewTask(newTask);
            
            // Make sure to pass the project to createTaskElement
            const taskElement = createTaskElement(newTask, project);
            
            if (taskElement) {
                // Make the task draggable
                makeTaskDraggable(taskElement);
                
                // Add the task to the correct column
                column.appendChild(taskElement);
                
                // Save project state to localStorage
                updateProjectInStorage(project);
                
                // Re-apply draggable behavior to ensure everything works
                setTimeout(() => makeTasksDraggable(), 0);
                
                console.log('Task added successfully:', taskName);
            }
        } catch (error) {
            console.error('Error adding new task:', error);
        } finally {
            form.remove();
        }
    }

    // Add click handler to the button
    addButton.addEventListener('click', addTask);
    
    form.appendChild(taskNameInput);
    form.appendChild(addButton);
    column.appendChild(form);
}


function createPriorityColumn(priority, title, project) {
    if (!project || !project.projectName) {
        console.error('Invalid project reference in createPriorityColumn', project);
        return null;
    }

    const column = document.createElement('div');
    column.classList.add('column');
    column.id = `${priority.toLowerCase()}-priority-column`;
    
    // Store project reference on the column itself for future reference
    column.setAttribute('data-project-name', project.projectName);
    // Also store priority for future reference
    column.setAttribute('data-priority', priority.toLowerCase());
    // Let CSS handle the width to ensure responsive layout

    const columnHeader = document.createElement('div');
    columnHeader.style.display = 'flex';
    columnHeader.style.justifyContent = 'space-between';

    const columnTitle = document.createElement('h2');
    columnTitle.id = `${priority.toLowerCase()}-priority-column-title`;
    columnTitle.textContent = title;
    columnTitle.classList.add('column-titles');

    const addTaskButton = document.createElement('button');
    addTaskButton.classList.add('column-button');
    addTaskButton.setAttribute('data-priority', priority);
    addTaskButton.setAttribute('data-project-name', project.projectName);
    addTaskButton.id = `add-task-${priority.toLowerCase()}-${project.projectName.replace(/\s+/g, '_')}`;
    
    const icon = document.createElement('span');
    icon.className = 'material-icons';
    icon.textContent = 'add';
    addTaskButton.appendChild(icon);
    
    const buttonText = document.createTextNode('Add Task');
    addTaskButton.appendChild(buttonText);

    // Store project in a closure to ensure it's available when clicked
    // Use a named function to avoid issues with 'this' binding
    function addTaskHandler(e) {
        e.stopPropagation(); // Prevent bubbling
        
        // Get the latest project reference to ensure it's up to date
        try {
            // Try to get the project from the current project reference first
            let currentProject = project;
            
            // If somehow the project reference is lost, try to get it from localStorage
            if (!currentProject || !currentProject.projectName) {
                const projectName = addTaskButton.getAttribute('data-project-name');
                if (projectName) {
                    const projects = safeLoadProjectsFromLocalStorage();
                    currentProject = projects.find(p => p && p.projectName === projectName);
                }
            }
            
            if (!currentProject || !currentProject.projectName) {
                console.error('Could not find project reference for add task button');
                return;
            }
            
            console.log(`Add Task clicked for ${priority} priority in project ${currentProject.projectName}`);
            showTaskInputForm(column, priority, currentProject);
        } catch (error) {
            console.error('Error handling add task button click:', error);
        }
    }
    
    // Attach the event listener with our handler
    addTaskButton.addEventListener('click', addTaskHandler);

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

    // Store project reference as a data attribute to ensure it's always available
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    
    // Store task ID and name for reference
    taskElement.setAttribute('data-task-id', task.id);
    taskElement.setAttribute('data-task-name', task.name);
    
    // Store project name as a data attribute for reference
    if (project && project.projectName) {
        taskElement.setAttribute('data-project-name', project.projectName);
    }
    
    const taskTitleHeader = document.createElement('div');
    taskTitleHeader.id = 'task-header-container';
    taskTitleHeader.style.display = 'flex';
    taskTitleHeader.style.justifyContent = 'space-between';
    taskTitleHeader.style.alignItems = 'center';

    const taskTitleElement = document.createElement('h3');
    taskTitleElement.textContent = task.name;
    taskTitleElement.classList.add('task-title');

    // Create Add Subtask Button with improved styling
    const addSubtaskButton = document.createElement('button');
    addSubtaskButton.classList.add('add-subtask-button');
    addSubtaskButton.textContent = 'Add Subtask';
    addSubtaskButton.style.marginLeft = '10px';
    addSubtaskButton.style.padding = '5px 10px';
    addSubtaskButton.style.borderRadius = '4px';
    addSubtaskButton.style.cursor = 'pointer';
    addSubtaskButton.style.backgroundColor = '#f0f0f0';
    addSubtaskButton.style.border = '1px solid #ccc';

    const divider = document.createElement('hr');
    divider.classList.add('divider');

    const checklist = document.createElement('ul');
    checklist.classList.add('checklist');

    // Add the checklist items
    task.checkList.forEach((item, index) => {
        const listItem = createChecklistItem(item, task, index, taskElement, project);  // Pass project
        checklist.appendChild(listItem);
    });

    // Add subtask button event handler with improved form display
    addSubtaskButton.addEventListener('click', function(e) {
        console.log('Add subtask button clicked');
        e.stopPropagation(); // Prevent event bubbling
        
        // Remove any existing subtask input forms
        const existingForms = taskElement.querySelectorAll('.subtask-container');
        existingForms.forEach(form => form.remove());
        
        // Create a container for the subtask input form
        const subTaskContainer = document.createElement('div');
        subTaskContainer.classList.add('subtask-container');
        subTaskContainer.style.marginTop = '10px';
        subTaskContainer.style.marginBottom = '10px';
        subTaskContainer.style.display = 'flex';
        subTaskContainer.style.alignItems = 'center';

        // Create input field with better styling
        const newSubtaskInput = document.createElement('input');
        newSubtaskInput.type = 'text';
        newSubtaskInput.placeholder = 'Enter subtask name...';
        newSubtaskInput.style.flex = '1';
        newSubtaskInput.style.marginRight = '5px';
        newSubtaskInput.style.padding = '5px';
        newSubtaskInput.style.borderRadius = '4px';
        newSubtaskInput.style.border = '1px solid #ccc';

        // Create save button with better styling
        const saveSubtaskButton = document.createElement('button');
        saveSubtaskButton.textContent = 'Save';
        saveSubtaskButton.classList.add('subtask-button');
        saveSubtaskButton.style.padding = '5px 10px';
        saveSubtaskButton.style.borderRadius = '4px';
        saveSubtaskButton.style.backgroundColor = '#4caf50';
        saveSubtaskButton.style.color = 'white';
        saveSubtaskButton.style.border = 'none';
        saveSubtaskButton.style.cursor = 'pointer';

        // Add the save functionality with improved project reference handling
        function saveSubtask() {
            // Validate input
            const subtaskName = newSubtaskInput.value.trim();
            if (!subtaskName) {
                newSubtaskInput.style.borderColor = 'red';
                newSubtaskInput.classList.add('shake');
                setTimeout(() => {
                    newSubtaskInput.style.borderColor = '#ccc';
                    newSubtaskInput.classList.remove('shake');
                }, 2000);
                return;
            }
            
            console.log('Adding new subtask:', subtaskName);
            
            try {
                // Validate task
                if (!task) {
                    console.error('Task object is missing, cannot add subtask');
                    showError('Could not add subtask: Task not found');
                    return;
                }
                
                // Get updated project reference - first try using provided project
                let currentProject = project;
                
                // If project is missing or invalid, try getting it from task element
                if (!currentProject || !currentProject.projectName) {
                    console.log('Project reference missing, attempting to retrieve from DOM attributes');
                    
                    // Try getting project name from taskElement
                    if (taskElement && taskElement.hasAttribute('data-project-name')) {
                        const projectName = taskElement.getAttribute('data-project-name');
                        console.log('Found project name in DOM:', projectName);
                        
                        // Try to find project in localStorage
                        const projects = safeLoadProjectsFromLocalStorage();
                        if (projects && projects.length > 0) {
                            currentProject = projects.find(p => p && p.projectName === projectName);
                            
                            if (currentProject) {
                                console.log('Found project in localStorage:', currentProject.projectName);
                                
                                // Find the task in the project to ensure we're working with the latest version
                                const projectTasks = currentProject.getTasks();
                                const updatedTask = projectTasks.find(t => t && t.name === task.name);
                                
                                if (updatedTask) {
                                    // Update our task reference to use the one from localStorage
                                    task = updatedTask;
                                    console.log('Updated task reference from localStorage');
                                }
                            } else {
                                console.warn(`Project '${projectName}' not found in localStorage`);
                            }
                        }
                    }
                }
                
                // Final validation check for project
                if (!currentProject || !currentProject.projectName) {
                    console.error('Could not find valid project reference after all attempts');
                    showError('Could not add subtask: Project reference not found');
                    return;
                }
                
                // Add the new subtask to the task
                task.addItemToCheckList(subtaskName);
                console.log(`Added '${subtaskName}' to task's checklist. New length: ${task.checkList.length}`);
                
                // Get the newly added subtask with its generated ID
                const newSubtask = task.checkList[task.checkList.length - 1];
                console.log('New subtask added:', newSubtask);
                
                // Create and add the new subtask item to the checklist with visual feedback
                const newSubtaskItem = createChecklistItem(
                    newSubtask, 
                    task, 
                    task.checkList.length - 1, 
                    taskElement, 
                    currentProject
                );
                
                if (newSubtaskItem) {
                    // Add a highlight effect to the new item
                    newSubtaskItem.classList.add('new-item');
                    checklist.appendChild(newSubtaskItem);
                    
                    // Remove highlight after animation
                    setTimeout(() => {
                        newSubtaskItem.classList.remove('new-item');
                    }, 2000);
                    
                    // Persist changes to localStorage
                    if (updateProjectInStorage(currentProject)) {
                        console.log('Successfully saved project with new subtask to localStorage');
                    } else {
                        console.error('Failed to save project with new subtask to localStorage');
                    }
                } else {
                    console.error('Failed to create checklist item element');
                    showError('Error creating subtask item');
                }
            } catch (error) {
                console.error('Error while adding subtask:', error);
                showError('Error adding subtask');
            } finally {
                // Remove the input form
                subTaskContainer.remove();
            }
        }
        
        // Helper function to show an error message
        function showError(message) {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = message;
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.style.marginTop = '5px';
            
            taskElement.appendChild(errorMessage);
            setTimeout(() => {
                errorMessage.remove();
            }, 3000);
        }

        // Add event listeners for save button and Enter key
        saveSubtaskButton.addEventListener('click', saveSubtask);
        newSubtaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveSubtask();
            }
        });

        // Build and append the form
        subTaskContainer.appendChild(newSubtaskInput);
        subTaskContainer.appendChild(saveSubtaskButton);
        
        // Insert the form right after the checklist
        checklist.insertAdjacentElement('afterend', subTaskContainer);
        
        // Focus the input field
        setTimeout(() => newSubtaskInput.focus(), 0);
    });

    // Build the task element structure
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

    // Store subtask ID and name for reference
    if (item && item.id) {
        listItem.setAttribute('data-subtask-id', item.id);
    }
    
    // Store task ID and name for reference
    if (task) {
        if (task.id) {
            listItem.setAttribute('data-task-id', task.id);
        }
        if (task.name) {
            listItem.setAttribute('data-task-name', task.name);
        }
    }
    
    // If project not provided but taskElement has project name, try to find it
    if (!project && taskElement && taskElement.hasAttribute('data-project-name')) {
        const projectName = taskElement.getAttribute('data-project-name');
        try {
            // Use the safe version of loadProjectsFromLocalStorage
            const projects = safeLoadProjectsFromLocalStorage();
            if (projects) {
                project = projects.find(p => p && p.projectName === projectName);
                if (project && project.projectName) {
                    listItem.setAttribute('data-project-name', project.projectName);
                    console.log(`Found project '${project.projectName}' for subtask item`);
                }
            }
        } catch (error) {
            console.error('Error finding project in localStorage:', error);
        }
    } else if (project && project.projectName) {
        listItem.setAttribute('data-project-name', project.projectName);
        console.log(`Using provided project '${project.projectName}' for subtask item`);
    }

    const container = document.createElement('div');
    container.className = 'container';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    // Use task ID and subtask ID to create a truly unique checkbox ID
    checkbox.id = `cbx-${task ? (task.id || task.name) : 'task'}-${item && item.id ? item.id : index}`;
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

    // Ensure item is properly formatted whether it's a string or object
    const itemId = typeof item === 'object' && item.id ? item.id : null;
    const itemName = typeof item === 'object' ? item.name : item;
    const taskContent = document.createElement('span');
    taskContent.textContent = itemName;
    listItem.appendChild(taskContent);

    // Set initial state if item is already completed
    if (typeof item === 'object' && item.completed) {
        checkbox.checked = true;
        listItem.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            try {
                // Add visual feedback for completing subtask
                listItem.classList.add('completed');
                
                // Add a pulse animation for feedback
                listItem.classList.add('pulse');
                setTimeout(() => {
                    listItem.classList.remove('pulse');
                }, 1000);
                
                setTimeout(() => {
                    // Get task and subtask IDs from data attributes
                    const taskId = task ? task.id : (taskElement ? taskElement.getAttribute('data-task-id') : null);
                    const subtaskId = itemId;
                    
                    if (!taskId) {
                        console.error('Missing task ID, cannot complete subtask');
                        showErrorMessage('Error: Missing task ID');
                        return;
                    }
                    
                    if (!subtaskId) {
                        console.error('Missing subtask ID, cannot complete subtask');
                        showErrorMessage('Error: Missing subtask ID');
                        return;
                    }
                    
                    console.log(`Completing subtask with ID: ${subtaskId}, in task ID: ${taskId}`);
                    
                    // Try to complete the subtask using only its ID
                    if (task && subtaskId) {
                        const subtask = task.checkList.find(s => s.id === subtaskId);
                        if (subtask) {
                            subtask.completed = true;
                            const allCompleted = task.checkIfAllSubtasksCompleted(taskElement);
                            console.log(`Marked subtask with ID ${subtaskId} as completed`);
                            
                            if (allCompleted) {
                                console.log(`All subtasks completed for task: ${task.name} (ID: ${taskId})`);
                            }
                            
                            // Update the project in localStorage if available
                            if (project && project.projectName) {
                                updateProjectInStorage(project);
                                return; // Success! No need to continue
                            }
                        } else {
                            console.warn(`Subtask with ID ${subtaskId} not found in task's checklist`);
                        }
                    }

                    // If we got here, we need to look up the project from localStorage
                    let updatedProject = project;
                    
                    // If the direct project reference is missing, try to find it
                    if (!updatedProject || !updatedProject.projectName) {
                        console.log('Project reference missing, attempting to find it');
                        
                        // First try from the list item's data attribute
                        if (listItem.hasAttribute('data-project-name')) {
                            const projectName = listItem.getAttribute('data-project-name');
                            console.log(`Found project name in list item: ${projectName}`);
                            
                            let projects = safeLoadProjectsFromLocalStorage();
                            if (projects) {
                                updatedProject = projects.find(p => p && p.projectName === projectName);
                                if (updatedProject) {
                                    console.log(`Found project in localStorage: ${updatedProject.projectName}`);
                                }
                            }
                        }
                        
                        // If still not found, try from task element
                        if (!updatedProject && taskElement && taskElement.hasAttribute('data-project-name')) {
                            const projectName = taskElement.getAttribute('data-project-name');
                            console.log(`Found project name in task element: ${projectName}`);
                            
                            let projects = safeLoadProjectsFromLocalStorage();
                            if (projects) {
                                updatedProject = projects.find(p => p && p.projectName === projectName);
                                
                                if (updatedProject) {
                                    console.log(`Found project in localStorage: ${updatedProject.projectName}`);
                                    
                                    // Try to find the task by ID first
                                    const taskId = listItem.getAttribute('data-task-id') || 
                                                 (taskElement ? taskElement.getAttribute('data-task-id') : null);
                                    
                                    if (taskId) {
                                        // Find task by ID
                                        const updatedTask = updatedProject.getTasks().find(t => t && t.id === taskId);
                                        if (updatedTask) {
                                            console.log(`Found task by ID in project: ${updatedTask.name}`);
                                            
                                            // Try to find subtask by ID first
                                            if (itemId) {
                                                const checklistItem = updatedTask.checkList.find(item => item.id === itemId);
                                                if (checklistItem) {
                                                    checklistItem.completed = true;
                                                    console.log(`Marked subtask with ID ${itemId} as completed`);
                                                    
                                                    // Check if all subtasks are completed
                                                    updatedTask.checkIfAllSubtasksCompleted();
                                                    updateProjectInStorage(updatedProject);
                                                    return;
                                                }
                                            }
                                            
                                            // Fallback to name lookup
                                            const checklistItem = updatedTask.checkList.find(item => item.name === itemName);
                                            if (checklistItem) {
                                                checklistItem.completed = true;
                                                console.log(`Marked subtask '${itemName}' as completed`);
                                                
                                                // Check if all subtasks are completed
                                                updatedTask.checkIfAllSubtasksCompleted();
                                                updateProjectInStorage(updatedProject);
                                                return;
                                            } else {
                                                console.warn(`Could not find checklist item '${itemName}' in task`);
                                            }
                                        }
                                    } else {
                                        // Fallback to task name lookup
                                        const taskName = task ? task.name : listItem.getAttribute('data-task-name');
                                        if (taskName) {
                                            const updatedTask = updatedProject.getTasks().find(t => t && t.name === taskName);
                                            
                                            if (updatedTask) {
                                                console.log(`Found task by name in project: ${updatedTask.name}`);
                                                
                                                // Only use ID-based lookup for subtasks
                                                if (itemId) {
                                                    const checklistItem = updatedTask.checkList.find(s => s.id === itemId);
                                                    if (checklistItem) {
                                                        checklistItem.completed = true;
                                                        console.log(`Marked subtask with ID ${itemId} as completed`);
                                                        
                                                        // Check if all subtasks are completed
                                                        updatedTask.checkIfAllSubtasksCompleted();
                                                        updateProjectInStorage(updatedProject);
                                                        return;
                                                    } else {
                                                        console.warn(`Could not find subtask with ID ${itemId} in task ${updatedTask.id}`);
                                                    }
                                                } else {
                                                    console.warn('No subtask ID available, cannot complete subtask');
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    // If we got this far, we couldn't update the project in localStorage
                    console.warn('Could not update project in localStorage after completing subtask');
                    showErrorMessage('Could not save your changes');
                    
                }, 1000); // End of setTimeout
            } catch (error) {
                console.error('Error completing subtask:', error);
                showErrorMessage('Error completing subtask');
            }
        }
    });
    
    // Helper function for showing error messages
    function showErrorMessage(message) {
        const errorMsg = document.createElement('div');
        errorMsg.textContent = message;
        errorMsg.style.color = 'red';
        errorMsg.style.fontSize = '12px';
        errorMsg.style.position = 'absolute';
        errorMsg.style.bottom = '5px';
        errorMsg.style.right = '5px';
        
        // Add to task element if available, otherwise to list item
        (taskElement || listItem).appendChild(errorMsg);
        
        // Remove after a few seconds
        setTimeout(() => {
            errorMsg.remove();
        }, 3000);
    }

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


function makeTasksDraggable() {
    // Get all columns
    const columns = document.querySelectorAll('.column');
    
    // Remove any existing dragover/drop event listeners by cloning only the event listeners we care about
    columns.forEach(column => {
        // Get the priority from the column id
        const columnPriority = column.id.split('-')[0];
        
        // Remove existing dragover/drop listeners by adding new ones
        column.removeEventListener('dragover', column._dragoverListener);
        column.removeEventListener('drop', column._dropListener);
        
        // Create and store the dragover listener
        column._dragoverListener = (e) => {
            e.preventDefault();
            
            // Calculate the position for better placement
            const dragging = document.querySelector('.dragging');
            if (!dragging) return;
            
            // Get all task elements that aren't being dragged
            const taskElements = [...column.querySelectorAll('.task:not(.dragging)')];
            
            // Find the task we're dragging over
            let closestTask = null;
            let closestOffset = Number.NEGATIVE_INFINITY;
            
            // Find the closest task based on mouse position
            const mouseY = e.clientY;
            
            taskElements.forEach(task => {
                const { top, height } = task.getBoundingClientRect();
                const offset = mouseY - (top + height / 2);
                
                if (offset < 0 && offset > closestOffset) {
                    closestOffset = offset;
                    closestTask = task;
                }
            });
            
            // Insert the dragged element at the appropriate position
            if (closestTask) {
                column.insertBefore(dragging, closestTask);
            } else {
                column.appendChild(dragging);
            }
        };
        
        // Create and store the drop listener
        column._dropListener = (e) => {
            e.preventDefault();
            const dragging = document.querySelector('.dragging');
            if (!dragging) return;

            dragging.classList.remove('dragging');
            
            // Update the task priority based on the column it was dropped in
            try {
                // Get the task and project references using IDs when possible
                const taskId = dragging.getAttribute('data-task-id');
                const taskName = dragging.querySelector('.task-title')?.textContent;
                const projectName = dragging.getAttribute('data-project-name');
                
                if (projectName && columnPriority && (taskId || taskName)) {
                    // Get projects from localStorage
                    let projects = safeLoadProjectsFromLocalStorage();
                    if (!projects) return;
                    
                    // Find the project
                    const project = projects.find(p => p && p.projectName === projectName);
                    if (!project) return;
                    
                    // Find the task in the project - prefer ID lookup but fall back to name
                    let task;
                    if (taskId) {
                        task = project.getTasks().find(t => t && t.id === taskId);
                    }
                    // If not found by ID or no ID available, try by name
                    if (!task && taskName) {
                        task = project.getTasks().find(t => t && t.name === taskName);
                    }
                    if (!task) return;
                    
                    // Update the task priority
                    task.setTaskPriority(columnPriority);
                    
                    // Update in localStorage
                    updateProjectInStorage(project);
                }
            } catch (error) {
                console.error('Error updating task priority after drag:', error);
            }
        };
        
        // Add the listeners
        column.addEventListener('dragover', column._dragoverListener);
        column.addEventListener('drop', column._dropListener);
    });

    // Process all tasks - don't clone them to preserve existing event listeners
    const tasks = document.querySelectorAll('.task');
    
    // Apply draggable properties to all tasks
    tasks.forEach(task => {
        // Make the task draggable
        task.draggable = true;
        
        // Remove existing drag listeners if they exist
        task.removeEventListener('dragstart', task._dragstartListener);
        task.removeEventListener('dragend', task._dragendListener);
        
        // Create and store the dragstart listener
        task._dragstartListener = () => {
            task.classList.add('dragging');
        };
        
        // Create and store the dragend listener
        task._dragendListener = () => {
            task.classList.remove('dragging');
        };
        
        // Add the listeners
        task.addEventListener('dragstart', task._dragstartListener);
        task.addEventListener('dragend', task._dragendListener);
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
        selectedProjectContent.style.flexDirection = 'row';
        selectedProjectContent.style.justifyContent = 'space-between';
        selectedProjectContent.style.gap = '1rem';
        selectedProjectContent.style.width = '100%';  // Add this line
        selectedProjectContent.style.padding = '1rem'; // Add this line for consistency
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