import './styles.css'

// Project Classes

class Project {
    constructor(tasks, projectName, dueDate){
        this.tasks = [];
        this.projectName = projectName;
        this.dueDate = dueDate;
    }

    addNewTask(taskObject){
        
        this.tasks.push(taskObject);
    }

    removeExistingProject(){

    }

    completeProject(){

    }
    
    
    
}

function getUserInput(promptText){
    try {
        let userInput = prompt(promptText)
        return userInput
    } catch (error) {
        error = 'Prompt not defined'
        return error
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
    constructor(name, dueDate, dateCreated, priority, description, notes, checkList){
        this.name = name;
        this.dueDate = dueDate;
        this.dateCreated = dateCreated;
        this.priority = priority;
        this.description = description;
        this.notes = notes;
        this.checkList = checkList;
    }

    removeTask(taskToRemove){

    }

    completeTask(taskToComplete){

    }
}

let testProject = new Project();
let testTask = new Task(
    getUserInput('Enter new task : '),
    getTimestamp(),
    getTimestamp(),
    'High'

);



testProject.addNewTask("some task")
testProject.addNewTask("some task")
testProject.addNewTask("another task")

console.log(testTask)

