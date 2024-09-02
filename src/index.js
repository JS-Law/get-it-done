import { Project } from "./helpers";
import { Task } from "./helpers";
import { displayTasks } from "./helpers";
import { ElementCreator } from "./DOMLoader";
import { ElementAppender } from "./DOMLoader";
import './styles.css';
import 'material-icons/iconfont/material-icons.css';
import { getTimestamp } from "./helpers";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export {
    saveProjectsToLocalStorage,
    loadProjectsFromLocalStorage
}
// import { Project, Task, displayTasks, getTimestamp } from "./helpers";
// import flatpickr from "flatpickr";
// import "flatpickr/dist/flatpickr.min.css";

// Function to save projects to localStorage
function saveProjectsToLocalStorage(projects) {
    const projectsData = projects.map(project => ({
        projectName: project.projectName,
        dueDate: project.dueDate,
        status: project.status,
        tasks: project.getTasks().map(task => ({
            name: task.name,
            dueDate: task.dueDate,
            dateCreated: task.dateCreated,
            priority: task.priority,
            description: task.description,
            notes: task.notes,
            checkList: task.checkList,  // Already has subtask data
            status: task.status
        }))
    }));

    localStorage.setItem('projects', JSON.stringify(projectsData));
}



// Function to load projects from localStorage
function loadProjectsFromLocalStorage() {
    const projectsData = JSON.parse(localStorage.getItem('projects')) || [];
    const projects = projectsData.map(projectData => {
        const project = new Project(projectData.projectName, projectData.dueDate, projectData.status);
        projectData.tasks.forEach(taskData => {
            const task = new Task(
                taskData.name,
                taskData.dueDate,
                taskData.dateCreated,
                taskData.priority,
                taskData.description,
                taskData.notes,
                taskData.checkList.map(item => item.name),
                taskData.status
            );
            project.addNewTask(task);
        });
        return project;
    });
    return projects;
}


document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.querySelector('#main-content');
    contentContainer.style.display = 'grid';
    contentContainer.style.width = '100vw';
    contentContainer.style.height = '100vh';
    contentContainer.style.gridTemplateColumns = '200px 1fr';
    contentContainer.style.gridTemplateRows = '1fr';

    let sideBar = document.querySelector('#side-bar');
    sideBar.style.display = 'grid';
    sideBar.style.gridTemplateRows = 'repeat(12, 1fr)';
    sideBar.style.gridTemplateColumns = '1fr';
    
    let projectSection = document.querySelector('#project-section');
    projectSection.style.display = 'flex';

    const addProjectButton = document.getElementById('add-project-button');
    const projectFormContainer = document.getElementById('project-form-container');
    const projectForm = document.getElementById('project-form');
    const projectDueDateInput = document.getElementById('project-due-date');

    flatpickr(projectDueDateInput, {
        dateFormat: 'M-d-Y',
    });

    let projects = loadProjectsFromLocalStorage();

    // Function to add a new project and save to localStorage
    function addNewProject(projectName, dueDate) {
        const newProject = new Project(projectName, dueDate);
        projects.push(newProject);
        displayTasks(newProject);
        saveProjectsToLocalStorage(projects); // Save to localStorage
    }

    addProjectButton.addEventListener('click', () => {
        projectFormContainer.classList.toggle('hidden');
    });

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const projectName = document.getElementById('project-name').value;
        const dueDate = projectDueDateInput.value;

        if (projectName && dueDate) {
            addNewProject(projectName, dueDate);
            projectForm.reset();
            projectFormContainer.classList.add('hidden');
        }
    });

    // Display projects from localStorage on load
    if (projects.length > 0) {
        projects.forEach(project => displayTasks(project));
        switchToProjectTab(projects[0]); // Show the first project by default
    } else {
        // Example projects and tasks for demonstration (if localStorage is empty)
        // let testProject = new Project('Plant Garden', 'Dec 10th, 2024');
        // let testProjectTwo = new Project('Finish Todo List', 'Dec 10th, 2024');

        // let testTask = new Task(
        //     'Get dirt',
        //     getTimestamp(),
        //     getTimestamp(),
        //     'High',
        //     'Go to the place to do the thing, NOW',
        //     'Remember to do that thing',
        //     ['Go to place', 'Do that thing'],
        //     'Not Started'
        // );

        // let testTaskTwo = new Task(
        //     'Finish the thing 2',
        //     getTimestamp(),
        //     getTimestamp(),
        //     'Low',
        //     'Go to the place to do the thing, NOW',
        //     'Remember to do that thing',
        //     ['Go to place', 'Do that thing'],
        //     'Not Started'
        // );

        // testProject.addNewTask(testTask);
        // testProject.addNewTask(testTaskTwo);

        // testProjectTwo.addNewTask(testTaskTwo);
        // testProjectTwo.addNewTask(testTask);

        // projects.push(testProject, testProjectTwo);
        // saveProjectsToLocalStorage(projects);

        // // Display the projects initially
        // displayTasks(testProject);
        // displayTasks(testProjectTwo);

        // Set the first project as the default active project tab
        // switchToProjectTab(testProject);
    }
});





// Function to switch between project tabs
function switchToProjectTab(project) {
    // Hide all project contents
    const allProjectContents = document.querySelectorAll('.project-content');
    allProjectContents.forEach(content => {
        content.style.display = 'none';
    });

    // Log the project name and the ID we're trying to select
    console.log(`Switching to project tab: ${project.projectName}`);
    console.log(`Looking for element with ID: content-${project.projectName.replace(/\s+/g, '_')}`);

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




// let testProject = new Project('Plant Garden', 'Dec 10th, 2024');
// let testProjectTwo = new Project('Finish Todo List', 'Dec 10th, 2024');

// let testTask = new Task(
//     'Get dirt',
//     getTimestamp(),
//     getTimestamp(),
//     'low',
//     'Go to the place to do the thing, NOW',
//     'Remember to do that thing',
//     [
//         'Go to place',
//         'Do that thing', 
//     ],
//     'Not Started'
// );

// let testTaskTwo = new Task(
//     'Finish the thing',
//     getTimestamp(),
//     getTimestamp(),
//     'medium',
//     'Go to the place to do the thing, NOW',
//     'Remember to do that thing',
//     [
//         'Go to place',
//         'Do that thing', 
//     ],
//     'Not Started'
// );
// let testTaskThree = new Task(
//     'Finish the thing AGAIN',
//     getTimestamp(),
//     getTimestamp(),
//     'high',
//     'Go to the place to do the thing, NOW',
//     'Remember to do that thing',
//     [
//         'Go to place',
//         'Do that thing', 
//     ],
//     'Not Started'
// );
// let testTaskFour = new Task(
//     'Go back to the place',
//     getTimestamp(),
//     getTimestamp(),
//     'high',
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


// testProjectTwo.addNewTask(testTaskThree)
// testProjectTwo.addNewTask(testTaskFour)


// testTaskTwo.addItemToCheckList('something', 'else');
// displayTasks(testProjectTwo)
// displayTasks(testProject)
// displayTasks(testProject)
// displayTasks(testProject)