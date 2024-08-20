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
    // Locate the project tab or create it if it doesn't exist
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

        // Add click event to switch tabs and show relevant tasks
        projectTabTitleLink.addEventListener('click', () => {
            switchToProjectTab(project);
        });
    }

    // Create the content container for tasks if it doesn't exist
    let projectContent = document.querySelector(`#content-${project.projectName}`);
    if (!projectContent) {
        projectContent = document.createElement('div');
        projectContent.id = `content-${project.projectName.replace(/\s+/g, '_')}`;
        projectContent.classList.add('project-content');
        projectContent.style.width = '100%'
        projectContent.style.alignContent = 'space-between';
        projectContent.style.justifyContent = 'space-between';
        const projectSection = document.querySelector('#project-section');
        projectSection.appendChild(projectContent);
        // projectSection.style.width = '100%'
    }

    // Clear previous content
    projectContent.innerHTML = '';

    // Create columns for High, Medium, Low priorities
    const highPriorityColumn = document.createElement('div');
    highPriorityColumn.classList.add('column');
    highPriorityColumn.id = 'high-priority-column';
    highPriorityColumn.textContent = 'High Priority';
    highPriorityColumn.style.width = '33.3%'

    
    const mediumPriorityColumn = document.createElement('div');
    mediumPriorityColumn.classList.add('column');
    mediumPriorityColumn.id = 'medium-priority-column';
    mediumPriorityColumn.textContent = 'Medium Priority';
    mediumPriorityColumn.style.width = '33.3%'
    
    const lowPriorityColumn = document.createElement('div');
    lowPriorityColumn.classList.add('column');
    lowPriorityColumn.id = 'low-priority-column';
    lowPriorityColumn.textContent = 'Low Priority';
    lowPriorityColumn.style.width = '33.3%'
    

    projectContent.appendChild(highPriorityColumn);
    projectContent.appendChild(mediumPriorityColumn);
    projectContent.appendChild(lowPriorityColumn);

    // Add tasks to the appropriate column based on priority
    project.getTasks().forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        
        const taskTitleElement = document.createElement('h3');
        taskTitleElement.textContent = task.name;
        taskTitleElement.classList.add('task-title');

        taskElement.appendChild(taskTitleElement);
        
        const checklist = document.createElement('ul');
        checklist.classList.add('checklist');

        task.checkList.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'subchecklist';
        
            // Create the container for the checkbox
            const container = document.createElement('div');
            container.className = 'container';
        
            // Create the checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `cbx-${task.name}-${index}`;  // Unique ID for each checkbox
            checkbox.style.display = 'none';  // Hide the default checkbox
        
            // Create the label and SVG for the styled checkbox
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
        
            // Append SVG elements to the label
            svg.appendChild(path);
            svg.appendChild(polyline);
            label.appendChild(svg);
        
            // Append the checkbox and label to the container
            container.appendChild(checkbox);
            container.appendChild(label);
        
            // Append the container (checkbox) to the list item
            listItem.appendChild(container);
        
            // Create a separate span for the task content (item)
            const taskContent = document.createElement('span');
            taskContent.textContent = item;  // Set the task content here
            listItem.appendChild(taskContent);
        
            // Add event listener for the checkbox
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    listItem.classList.add('completed');  // Cross out the item
                    setTimeout(() => {
                        listItem.style.display = 'none';  // Hide the item after the fade-out
                        task.removeItemFromCheckList(item);
                    }, 1000);  // Adjust the timeout to match the fade-out duration
                }
            });
        
            // Finally, append the list item to the checklist
            checklist.appendChild(listItem);
        });
        

        taskElement.appendChild(checklist)
        switch (task.priority) {
            case 'High':
                highPriorityColumn.appendChild(taskElement);
                break;
            case 'Medium':
                mediumPriorityColumn.appendChild(taskElement);
                break;
            case 'Low':
                lowPriorityColumn.appendChild(taskElement);
                break;
            default:
                lowPriorityColumn.appendChild(taskElement);
                break;
        }
    });

    makeTasksDraggable();
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
                console.error("No element with class 'dragging' found"); // Line 189
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
    console.log(`Switching to project tab: ${project.projectName}`);
    console.log(`Looking for element with ID: content-${project.projectName}`);

    // Show the selected project content
    const selectedProjectContent = document.querySelector(`#content-${project.projectName.replace(/\s+/g, '_')}`);

    console.log('Selected project content:', selectedProjectContent); // Log the element found

    if (selectedProjectContent) {
        selectedProjectContent.style.display = 'flex';
    } else {
        console.error(`No element found with ID: content-${project.projectName}`);
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





// // Creating a new project and adding tasks
// let testProject = new Project('Project 1', '2023-12-31');
// let testProjectTwo = new Project('Project 1', '2023-12-31');

// let testTask = new Task(
//     'Finish the thing 1',
//     getTimestamp(),
//     getTimestamp(),
//     'High',
//     'Go to the place to do the thing, NOW',
//     'Remember to do that thing',
//     [
//         'Go to place',
//         'Do that thing', 
//     ],
//     'Not Started'
// );

// let testTaskTwo = new Task(
//     'Finish the thing 2',
//     getTimestamp(),
//     getTimestamp(),
//     'High',
//     'Go to the place to do the thing, NOW',
//     'Remember to do that thing',
//     [
//         'Go to place',
//         'Do that thing', 
//     ],
//     'Not Started'
// );

// testProject.addNewTask(testTask);
// testProject.addNewTask(testTaskTwo);
// testTaskTwo.addItemToCheckList('something', 'else');





// testTask.setStatusInProgress();
// testTask.setStatusComplete();

// testProject.setProjectInProgress()
// testProject.setProjectComplete()

// testTaskTwo.setTaskPriority('LOW')



export {
    Project,
    Task,
    getTimestamp,
    displayTasks,
}