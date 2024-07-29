import { Project } from "./helpers";
import { Task } from "./helpers";
import { ElementCreator } from "./DOMLoader";
import { ElementAppender } from "./DOMLoader";
import './styles.css';
import 'material-icons/iconfont/material-icons.css';



document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.querySelector('#main-content');
    contentContainer.style.display = 'grid';
    contentContainer.style.width = '100vw'
    contentContainer.style.height = '100vh'
    contentContainer.style.gridTemplateColumns = '200px 1fr'
    contentContainer.style.gridTemplateRows = '1fr'


    let sideBar = new ElementCreator('section', {id: 'sidebar'}).createElement()
    sideBar.style.display = 'grid'
    sideBar.style.gridTemplateRows = 'repeat(12, 1fr)'
    sideBar.style.gridTemplateColumns = '1fr'
    sideBar.style.border = 'black 2px solid'
    
    
    let projectSection = new ElementCreator('section', {id : 'project-section'}).createElement()
    projectSection.style.display = 'grid'
    projectSection.style.gridTemplateRows = 'repeat(12, 1fr)'
    projectSection.style.gridTemplateColumns = 'repeat(12, 1fr)'
    projectSection.style.border = 'black 2px solid'
    

    new ElementAppender(contentContainer, sideBar, projectSection).appendElements()


})
