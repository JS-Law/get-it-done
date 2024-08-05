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
    constructor(name, dueDate, dateCreated, priority, description = '', notes = '', checkList = [], status){
        this.name = name;
        this.dueDate = dueDate;
        this.dateCreated = dateCreated;
        this.priority = priority;
        this.description = description;
        this.notes = notes;
        this.checkList = checkList;
        this.status = status;
    }
    
    addItemToCheckList(...itemsToAdd){
        this.checkList.push(...itemsToAdd);
    }
    
    removeItemFromCheckList(...itemsToRemove){
        itemsToRemove.forEach(item => {
            const index = this.checkList.indexOf(item);
            if (index > -1) {
                this.checkList.splice(index, 1);
            }
        });
    }
    
    setStatusComplete(){
        this.status = 'Complete';
    }
    
    setStatusInProgress(){
        this.status = 'In Progress';
    }

    setTaskPriority(taskPriority){
        this.priority = taskPriority;
    }

}

function displayTasks(project) {
    const projectContainer = document.getElementById('project-section');
    // projectContainer.innerHTML = ''; // Clear any existing content
    
    // Create project header
    const projectHeader = document.createElement('h2');
    projectHeader.textContent = `${project.projectName} (Due: ${project.dueDate}) - Status: ${project.status}`;
    
    // Create a container for tasks
    const taskList = document.createElement('div');
    taskList.classList.add('project');
    taskList.appendChild(projectHeader)

    // Loop through the tasks and create elements for each task
    project.getTasks().forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const taskHeader = document.createElement('div');
        taskHeader.classList.add('task-header');
        taskHeader.textContent = `${task.name} (Due: ${task.dueDate}) - Status: ${task.status}`;

        const taskDetails = document.createElement('div');
        taskDetails.innerHTML = `
            <p>Priority: ${task.priority}</p>
            <p>Description: ${task.description}</p>
            <p>Notes: ${task.notes}</p>
            <p>Date Created: ${task.dateCreated}</p>
            <p>Checklist: ${task.checkList.join(', ')}</p>
        `;

        taskElement.appendChild(taskHeader);
        taskElement.appendChild(taskDetails);
        taskList.appendChild(taskElement);
    });

    projectContainer.appendChild(taskList);
}


// Creating a new project and adding tasks
let testProject = new Project('Project 1', '2023-12-31');
let testProjectTwo = new Project('Project 1', '2023-12-31');

let testTask = new Task(
    'Finish the thing 1',
    getTimestamp(),
    getTimestamp(),
    'High',
    'Go to the place to do the thing, NOW',
    'Remember to do that thing',
    [
        'Go to place',
        'Do that thing', 
    ],
    'Not Started'
);

let testTaskTwo = new Task(
    'Finish the thing 2',
    getTimestamp(),
    getTimestamp(),
    'High',
    'Go to the place to do the thing, NOW',
    'Remember to do that thing',
    [
        'Go to place',
        'Do that thing', 
    ],
    'Not Started'
);

testProject.addNewTask(testTask);
testProject.addNewTask(testTaskTwo);
testTaskTwo.addItemToCheckList('something', 'else');





testTask.setStatusInProgress();
testTask.setStatusComplete();

testProject.setProjectInProgress()
testProject.setProjectComplete()

testTaskTwo.setTaskPriority('LOW')



export {
    Project,
    Task,
    getTimestamp,
    displayTasks,
}