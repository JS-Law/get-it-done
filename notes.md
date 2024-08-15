# Project Notes

- Project type: To do list

**Functionality**
- View all projects.
- View all todos in each project (probably just the title and duedate… perhaps changing color for different priorities).
- Expand a single todo to see/edit its details.
- Delete a todo.



# Abstraction

**What is it?**

An application that displays user entered tasks in a grid that can be arranged by the user by prioriity.

## Further abstraction

### TASK Class
**Properties:**
- Date/Time
- TaskName
- TaskDescription
- TaskPriority

**What is it doing?**
- Create task via constructor

**Potential decoupling**

- Task Adder
  - Push task to list  ***ABSTRACT***
- Task Destroyer
  - Pop task from list ***ABSTRACT***


### UI Generation/Manipulation
**What is it doing?**
- Updating DOM         ***ABSTRACT***
- Creating DOM Element ***ABSTRACT***
- Removing DOM Element ***ABSTRACT***

### Storage
**What is it doing?**
- Storing Task data    ***ABSTRACT***
- Removing Task data   ***ABSTRACT***



# Objects to abstract further
---

**ELEMENTS**

Project                 -- Initialization

Project                 -- View

Project                 -- Addition

Project                 -- Removal

- What properties should a project have?
  1. Tasks
  2. Name
  3. Due Date
  4. 



To do - Task            -- Initialization

To do - Task            -- View

To do - Task            -- Addition

To do - Task            -- Removal

- What properties does a task have?
  1. Name
  2. Due Date
  3. Date Created
  4. Priority
  5. Description
  6. Notes
  7. Checklist

**STORAGE**

Task                    -- Store 

Task                    -- Retrieve 

Task                    -- Display

Project                 -- Store

Project                 -- Retrieve

Project                 -- Display





**FOR TOMORROW**
- Create the ToDo list in the console first to ensure the logic is sound.
- LOG EVERYTHING TO CONSOLE AND THEN REPLACE THE LOGS WITH THE DOM MANIPULATION
- REMEMBER TO LOG ONLY PART OF THE OBJECT IF ITS RELEVANT
- You may need to prompt for user input but thats okay, write a class for it!
- I think I forgot how to request input in JavaScript lmao


**QUESTIONS**
- How will the Project get the tasks??????
- What does that pipeline look like???




# 08/13
1. Add project
2. Tab is added to the page
3. Within tab there are three columns.
4. High, Medium, Low priority.
5. Need to account for NOT STARTED.. Where do those go??
6. I also like the idea of a Pomodoro being implemented as well.
7. Going overboard with this but I need to learn and grow.
8. Progress is slow though.


#  08/14
Alright so I have the functionality that I need to add a new project to the tablist

NOW what I need to is rename the function to better describe what it is which is AddProjectToTabList

After renaming it, I can create another function that runs when the li is an `.active` class. This might be hard, idk but it seems like it can be doable solo.

Essentially....
```
if (class .active){
  show content
} else {
  dont show content
}
```