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
    
    new ElementAppender(contentContainer, sideBar, projectSection).appendElements();

    const addProjectButton = document.getElementById('add-project-button');
    const projectFormContainer = document.getElementById('project-form-container');
    const projectForm = document.getElementById('project-form');
    const projectDueDateInput = document.getElementById('project-due-date');

    flatpickr(projectDueDateInput, {
        dateFormat: 'M-d-Y',
    });

    addProjectButton.addEventListener('click', () => {
        projectFormContainer.classList.toggle('hidden');
    });

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const projectName = document.getElementById('project-name').value;
        const dueDate = projectDueDateInput.value;

        if (projectName && dueDate) {
            const newProject = new Project(projectName, dueDate);
            displayTasks(newProject);
            projectForm.reset();
            projectFormContainer.classList.add('hidden');
        }
    });
});


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


// testProjectTwo.addNewTask(testTaskTwo)
// testProjectTwo.addNewTask(testTask)


// testTaskTwo.addItemToCheckList('something', 'else');
// displayTasks(testProjectTwo)
// displayTasks(testProject)
// displayTasks(testProject)
// displayTasks(testProject)