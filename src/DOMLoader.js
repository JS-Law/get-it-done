class ElementCreator {
    
    /**
    * @param {string} type - The type of the HTML element to create.
    * @param {Object} attributes - The attributes to set on the element.
    * @param {...(string|Node)} children - The children to append to the element.
    */

    constructor(type, attributes = {}, ...children) {
        if (typeof type !== 'string' || !type) {
            throw new Error('Invalid element type.');
        }
        this.type = type;
        this.attributes = attributes;
        this.children = children;
    }

    /**
    * Creates and returns the HTML element.
    * @returns {HTMLElement} The created HTML element.
    */
    
    createElement() {
        const element = document.createElement(this.type);
        for (let key in this.attributes) {
            if (this.attributes.hasOwnProperty(key)) {
                element.setAttribute(key, this.attributes[key]);
            }
        }
        for (let child of this.children) {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            } else {
                throw new Error('Invalid child element.');
            }
        }
        return element;
    }
}

// -----Usage-----
// const creator = new ElementCreator('button', { id: 'home-button', class: 'btn' }, 'Home');
// const homeButton = creator.createElement();

// -----------------ELEMENT APPENDER-----------------
class ElementAppender {
    
    /**
    * @param {Node} parent - The parent element to append to.
    * @param {...Node} elements - The elements to append.
    */
    
    constructor(parent, ...elements) {
        if (!(parent instanceof Node)) {
            throw new Error('Parent must be a valid DOM node.');
        }
        this.parent = parent;
        this.elements = elements;
    }
    
    /**
    * Appends the elements to the parent element.
    */
    
    appendElements() {
        for (let element of this.elements) {
            if (element instanceof Node) {
                this.parent.appendChild(element);
            } else {
                throw new Error('All elements must be valid DOM nodes.');
            }
        }
    }
}


// -----------------IMAGE IMPORTER-----------------
class ImageImporter {
    
    /**
    * @param {string} newImage - The source URL of the new image.
    * @param {string} selector - The id for the new image element.
    */
    
    constructor(newImage, selector) {
        if (typeof newImage !== 'string' || !newImage) {
            throw new Error('Invalid image source.');
        }
        this.newImage = newImage;
    }

    /**
    * Creates and returns an image element.
    * @returns {HTMLImageElement} The created image element.
    */
    
    importImage() {
        const imageCreator = new ElementCreator('img', { src: this.newImage, id: this.selector });
        return imageCreator.createElement();
    }
}

// -----Usage-----
// const newImageImporter = new ImageImporter('path/to/image.jpg', 'unique-image-id');
// const imageElement = newImageImporter.importImage();
// document.body.appendChild(imageElement);



// --------------EXPORTS--------------

export {
    ElementCreator,
    ElementAppender,
    ImageImporter
};