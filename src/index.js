// import './styles.css'

// Project Classes

class Project {
    #tasks; // Private field

    constructor(projectName, dueDate){
        this.#tasks = [];
        this.projectName = projectName;
        this.dueDate = dueDate;
    }

    addNewTask(taskObject){
        this.#tasks.push(taskObject);
    }

    getTasks() {
        return [...this.#tasks]; // Return a copy to prevent external modifications
    }

    removeTask(taskToRemove){
        this.#tasks.pop(taskToRemove)
    }

    completeProject(){
        // Implement project completion logic
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
        this.checkList.push(...itemsToAdd)
    }
    removeItemFromCheckList(...itemsToRemove){
        this,this.checkList.pop(...itemsToRemove)
    }
    setStatusComplete(){
        this.status = 'Complete';
    }
    setStatusInProgress(){
        this.status = 'In Progress';
    }
}

// Creating a new project and adding tasks
let testProject = new Project('Project 1', '2023-12-31');

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
    ]

);

testProject.addNewTask(testTask);
testProject.addNewTask(testTaskTwo)


testTaskTwo.addItemToCheckList('something', 'else')

console.log(testProject, testProject.getTasks())

testProject.removeTask(testTask)
console.log(testProject, testProject.getTasks())
testTaskTwo.setStatusComplete()
testTask.setStatusInProgress()
console.log(testProject, testProject.getTasks())