/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("// import './styles.css'\n\n// Project Classes\n\nclass Project {\n    #tasks; // Private field\n\n    constructor(projectName, dueDate){\n        this.#tasks = [];\n        this.projectName = projectName;\n        this.dueDate = dueDate;\n    }\n\n    addNewTask(taskObject){\n        this.#tasks.push(taskObject);\n    }\n\n    getTasks() {\n        return [...this.#tasks]; // Return a copy to prevent external modifications\n    }\n\n    removeTask(taskToRemove){\n        this.#tasks.pop(taskToRemove)\n    }\n\n    completeProject(){\n        // Implement project completion logic\n    }\n}\n\nfunction getUserInput(promptText){\n    try {\n        let userInput = prompt(promptText);\n        return userInput;\n    } catch (error) {\n        console.error('Prompt not defined');\n        return 'Error';\n    }\n}\n\nfunction getTimestamp() {\n    const now = new Date();\n    const year = now.getFullYear();\n    const month = String(now.getMonth() + 1).padStart(2, '0');\n    const day = String(now.getDate()).padStart(2, '0');\n    let hours = now.getHours();\n    const minutes = String(now.getMinutes()).padStart(2, '0');\n    const ampm = hours >= 12 ? 'PM' : 'AM';\n\n    hours = hours % 12;\n    hours = hours ? hours : 12; // the hour '0' should be '12'\n    hours = String(hours).padStart(2, '0');\n\n    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;\n}\n\n\n\nclass Task {\n    constructor(name, dueDate, dateCreated, priority, description = '', notes = '', checkList = [], status){\n        this.name = name;\n        this.dueDate = dueDate;\n        this.dateCreated = dateCreated;\n        this.priority = priority;\n        this.description = description;\n        this.notes = notes;\n        this.checkList = checkList;\n        this.status = status;\n    }\n    addItemToCheckList(...itemsToAdd){\n        this.checkList.push(...itemsToAdd)\n    }\n    removeItemFromCheckList(...itemsToRemove){\n        this,this.checkList.pop(...itemsToRemove)\n    }\n    setStatusComplete(){\n        this.status = 'Complete';\n    }\n    setStatusInProgress(){\n        this.status = 'In Progress';\n    }\n}\n\n// Creating a new project and adding tasks\nlet testProject = new Project('Project 1', '2023-12-31');\n\nlet testTask = new Task(\n    'Finish the thing 1',\n    getTimestamp(),\n    getTimestamp(),\n    'High',\n    'Go to the place to do the thing, NOW',\n    'Remember to do that thing',\n    [\n        'Go to place',\n        'Do that thing', \n    ],\n    'Not Started'\n\n);\nlet testTaskTwo = new Task(\n    'Finish the thing 2',\n    getTimestamp(),\n    getTimestamp(),\n    'High',\n    'Go to the place to do the thing, NOW',\n    'Remember to do that thing',\n    [\n        'Go to place',\n        'Do that thing', \n    ]\n\n);\n\ntestProject.addNewTask(testTask);\ntestProject.addNewTask(testTaskTwo)\n\n\ntestTaskTwo.addItemToCheckList('something', 'else')\n\nconsole.log(testProject, testProject.getTasks())\n\ntestProject.removeTask(testTask)\nconsole.log(testProject, testProject.getTasks())\ntestTaskTwo.setStatusComplete()\ntestTask.setStatusInProgress()\nconsole.log(testProject, testProject.getTasks())\n\n//# sourceURL=webpack://get-it-done/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;