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

To do - Task            -- Initialization

To do - Task            -- View

To do - Task            -- Addition

To do - Task            -- Removal


**STORAGE**

Task                    -- Store 

Task                    -- Retrieve 

Task                    -- Display

Project                 -- Store

Project                 -- Retrieve

Project                 -- Display
