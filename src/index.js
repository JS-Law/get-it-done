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
    // sideBar.style.gridColumnStart = '1'
    // sideBar.style.gridColumnEnd = '4'
    // sideBar.style.gridRowStart = '1'
    // sideBar.style.gridRowEnd = '11'

    
    let projectSection = new ElementCreator('section', {id : 'project-section'}).createElement()
    // projectSection.style.gridColumnStart = '4'
    // projectSection.style.gridColumnEnd = '15'
    // projectSection.style.gridRowStart = '1'
    // projectSection.style.gridRowEnd = '10'
    new ElementAppender(contentContainer, sideBar, projectSection).appendElements()


})
