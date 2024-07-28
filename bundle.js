/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOMLoader.js":
/*!**************************!*\
  !*** ./src/DOMLoader.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ElementAppender: () => (/* binding */ ElementAppender),\n/* harmony export */   ElementCreator: () => (/* binding */ ElementCreator),\n/* harmony export */   ImageImporter: () => (/* binding */ ImageImporter)\n/* harmony export */ });\nclass ElementCreator {\n    \n    /**\n    * @param {string} type - The type of the HTML element to create.\n    * @param {Object} attributes - The attributes to set on the element.\n    * @param {...(string|Node)} children - The children to append to the element.\n    */\n\n    constructor(type, attributes = {}, ...children) {\n        if (typeof type !== 'string' || !type) {\n            throw new Error('Invalid element type.');\n        }\n        this.type = type;\n        this.attributes = attributes;\n        this.children = children;\n    }\n\n    /**\n    * Creates and returns the HTML element.\n    * @returns {HTMLElement} The created HTML element.\n    */\n    \n    createElement() {\n        const element = document.createElement(this.type);\n        for (let key in this.attributes) {\n            if (this.attributes.hasOwnProperty(key)) {\n                element.setAttribute(key, this.attributes[key]);\n            }\n        }\n        for (let child of this.children) {\n            if (typeof child === 'string') {\n                element.appendChild(document.createTextNode(child));\n            } else if (child instanceof Node) {\n                element.appendChild(child);\n            } else {\n                throw new Error('Invalid child element.');\n            }\n        }\n        return element;\n    }\n}\n\n// -----Usage-----\n// const creator = new ElementCreator('button', { id: 'home-button', class: 'btn' }, 'Home');\n// const homeButton = creator.createElement();\n\n// -----------------ELEMENT APPENDER-----------------\nclass ElementAppender {\n    \n    /**\n    * @param {Node} parent - The parent element to append to.\n    * @param {...Node} elements - The elements to append.\n    */\n    \n    constructor(parent, ...elements) {\n        if (!(parent instanceof Node)) {\n            throw new Error('Parent must be a valid DOM node.');\n        }\n        this.parent = parent;\n        this.elements = elements;\n    }\n    \n    /**\n    * Appends the elements to the parent element.\n    */\n    \n    appendElements() {\n        for (let element of this.elements) {\n            if (element instanceof Node) {\n                this.parent.appendChild(element);\n            } else {\n                throw new Error('All elements must be valid DOM nodes.');\n            }\n        }\n    }\n}\n\n// -----Usage-----\n// const appender = new ElementAppender(parentElement, childElement1, childElement2);\n// appender.appendElements();\n\n// -----------------IMAGE IMPORTER-----------------\nclass ImageImporter {\n    \n    /**\n    * @param {string} newImage - The source URL of the new image.\n    * @param {string} selector - The id for the new image element.\n    */\n    \n    constructor(newImage, selector) {\n        if (typeof newImage !== 'string' || !newImage) {\n            throw new Error('Invalid image source.');\n        }\n        this.newImage = newImage;\n    }\n\n    /**\n    * Creates and returns an image element.\n    * @returns {HTMLImageElement} The created image element.\n    */\n    \n    importImage() {\n        const imageCreator = new ElementCreator('img', { src: this.newImage, id: this.selector });\n        return imageCreator.createElement();\n    }\n}\n\n// -----Usage-----\n// const newImageImporter = new ImageImporter('path/to/image.jpg', 'unique-image-id');\n// const imageElement = newImageImporter.importImage();\n// document.body.appendChild(imageElement);\n\n\n\n// --------------EXPORTS--------------\n\n\n\n//# sourceURL=webpack://get-it-done/./src/DOMLoader.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Project: () => (/* binding */ Project),\n/* harmony export */   Task: () => (/* binding */ Task),\n/* harmony export */   getTimestamp: () => (/* binding */ getTimestamp)\n/* harmony export */ });\nclass Project {\n    #tasks; // Private field\n\n    constructor(projectName, dueDate, status = 'Not Started'){\n        this.#tasks = [];\n        this.projectName = projectName;\n        this.dueDate = dueDate;\n        this.status = status\n    }\n\n    addNewTask(taskObject){\n        this.#tasks.push(taskObject);\n    }\n\n    getTasks() {\n        return [...this.#tasks]; // Return a copy to prevent external modifications\n    }\n\n    removeTask(taskToRemove){\n        this.#tasks = this.#tasks.filter(task => task !== taskToRemove);\n    }\n    setProjectInProgress(){\n        this.status = 'In Progress'\n    }\n\n    setProjectComplete(){\n        this.status = 'Complete'\n    }\n\n}\n\nfunction getUserInput(promptText){\n    try {\n        let userInput = prompt(promptText);\n        return userInput;\n    } catch (error) {\n        console.error('Prompt not defined');\n        return 'Error';\n    }\n}\n\nfunction getTimestamp() {\n    const now = new Date();\n    const year = now.getFullYear();\n    const month = String(now.getMonth() + 1).padStart(2, '0');\n    const day = String(now.getDate()).padStart(2, '0');\n    let hours = now.getHours();\n    const minutes = String(now.getMinutes()).padStart(2, '0');\n    const ampm = hours >= 12 ? 'PM' : 'AM';\n\n    hours = hours % 12;\n    hours = hours ? hours : 12; // the hour '0' should be '12'\n    hours = String(hours).padStart(2, '0');\n\n    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;\n}\n\nclass Task {\n    constructor(name, dueDate, dateCreated, priority, description = '', notes = '', checkList = [], status){\n        this.name = name;\n        this.dueDate = dueDate;\n        this.dateCreated = dateCreated;\n        this.priority = priority;\n        this.description = description;\n        this.notes = notes;\n        this.checkList = checkList;\n        this.status = status;\n    }\n    \n    addItemToCheckList(...itemsToAdd){\n        this.checkList.push(...itemsToAdd);\n    }\n    \n    removeItemFromCheckList(...itemsToRemove){\n        itemsToRemove.forEach(item => {\n            const index = this.checkList.indexOf(item);\n            if (index > -1) {\n                this.checkList.splice(index, 1);\n            }\n        });\n    }\n    \n    setStatusComplete(){\n        this.status = 'Complete';\n    }\n    \n    setStatusInProgress(){\n        this.status = 'In Progress';\n    }\n\n    setTaskPriority(taskPriority){\n        this.priority = taskPriority;\n    }\n\n}\n\n// Creating a new project and adding tasks\nlet testProject = new Project('Project 1', '2023-12-31');\n\nlet testTask = new Task(\n    'Finish the thing 1',\n    getTimestamp(),\n    getTimestamp(),\n    'High',\n    'Go to the place to do the thing, NOW',\n    'Remember to do that thing',\n    [\n        'Go to place',\n        'Do that thing', \n    ],\n    'Not Started'\n);\n\nlet testTaskTwo = new Task(\n    'Finish the thing 2',\n    getTimestamp(),\n    getTimestamp(),\n    'High',\n    'Go to the place to do the thing, NOW',\n    'Remember to do that thing',\n    [\n        'Go to place',\n        'Do that thing', \n    ],\n    'Not Started'\n);\n\ntestProject.addNewTask(testTask);\ntestProject.addNewTask(testTaskTwo);\n\ntestTaskTwo.addItemToCheckList('something', 'else');\n\nconsole.log(testProject, testProject.getTasks());\n\ntestProject.removeTask(testTask);\n\nconsole.log(testProject, testProject.getTasks());\n\ntestTask.setStatusInProgress();\ntestTask.setStatusComplete();\n\ntestProject.setProjectInProgress()\ntestProject.setProjectComplete()\n\ntestTaskTwo.setTaskPriority('LOW')\nconsole.log(testProject, testProject.getTasks());\n\n\n\n\n//# sourceURL=webpack://get-it-done/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony import */ var _DOMLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMLoader */ \"./src/DOMLoader.js\");\n\n\n\n\n\n\n//# sourceURL=webpack://get-it-done/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;