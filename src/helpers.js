// Project Classes

class Project {
    constructor(tasks, name, dueDate){
        this.tasks = tasks;
        this.name = name;
        this.dueDate = dueDate;
    }

    createNewProject(){

    }

    removeExistingProject(){

    }

    completeProject(){

    }
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

