// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) ?? [];
let nextId = JSON.parse(localStorage.getItem("nextId")) ?? 0;

// TODO: create a function to generate a unique task id
function generateTaskId() {
  // if nextId does not exist in localStorage, set it to 1
  if (nextId === 0){
    nextId=1;}else{
  // otherwise, increment it by 1
  nextId++;
    }
  // save nextId to localStorage
  localStorage.setItem('nextId', nextId);
  return nextId; // Return the new unique ID
}

// TODO: create a function to create a task card
function createTaskCard(task) {
  // create card elements
const taskCardEl=$('<div class="task card mb-3 p-3">');
const titleEl=$("<h3>").text(task.title);
const dueDateEl=$("<div>").text(task.dueDate);
const descriptionEl=$("<div>").text(task.description);

 const today = dayjs(dayjs().format('MM/DD/YYYY'), 'MM/DD/YYYY');
 const isDue = dayjs(task.dueDate, 'MM/DD/YYYY');

 taskCardEl.attr('data-id', task.id)

// set card background color based on due date
if (today.isAfter(isDue)) {
  taskCardEl.addClass('bg-danger'); // Overdue
} else if (today.isSame(isDue)) {
  taskCardEl.addClass('bg-warning text-light'); // Due today
} else if (isDue.diff(today, 'day') <= 1) {
  taskCardEl.addClass('bg-warning text-light'); // Nearing deadline (within 1 day)
}
  
  // append card elements
 // append card elements
 taskCardEl.append(titleEl, dueDateEl, descriptionEl, deleteBtn);

 // append to the appropriate column based on status
 $(`#${task.status}-cards`).append(taskCardEl);

 // add event listener for delete button
 deleteBtn.on('click', function() {
   handleDeleteTask(task.id); // Pass the task ID to the delete handler
 });
}

// TODO: create a function to render the task list and make cards draggable
function renderTaskList() {
    // empty existing task cards
$('.lane.card-body').empty();
  // loop through tasks and create task cards for each status
for (let task of taskList) {
  createTaskCard(task);
}
  
// make task cards draggable
      $( ".task.card" ).draggable({
    zIndex: 1,
    revert: "invalid", // Optional: revert back if not dropped in a valid lane
    start: function(event, ui)  {
      $(this).addClass("dragging"); // Optional: add a class for styling while dragging
    },
    stop: function(event, ui) {
      $(this).removeClass("dragging"); // Remove class after dragging
    }
      });
}

// TODO: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(event.target));
  
  console.log(data);
  
  generateTaskId();
  // create a new task object
  const task = {
  title: $("title").val().trim(),
  dueDate: $("dueDate").val().trim(),
  description: $("description").val().trim(),
  id: nextId,
  status: 'to-do',
  };

console.log('ADD', task);
  // add the new task to the taskList save and render
  
  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}



// TODO: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  // Remove the task from the taskList
  taskList = taskList.filter(task => task.id !== taskId);
  // Save the updated taskList to localStorage
  localStorage.setItem('tasks', JSON.stringify(taskList));
  // Re-render the task list
  renderTaskList();
}


// TODO: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  console.log(event);
  console.log(ui);
  // get the task id and new status from the event
$(this).find('.card-body > *').append($(ui.draggable));
  // update the task status of the dragged card
const id = $(ui.draggable).attr('data-id')

for (let task of taskList) {
  if (id==task.id) {
    console.log('FOUND', task);
    task.status = event.target.id;
  }
}
  // save and render
}

// TODO: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // render the task list
renderTaskList();
  // add event listener
$("#addForm").on("submit", handleAddTask);
  // make lanes droppable
  $( ".lane" ).droppable({
    drop: handleDrop,
    accept: ".task.card",
    activeClass: 'ui-state-highlight'
  });
  // make due date field a date picker
  $( function() {
    $( "#dueDate" ).datepicker();
  } );
});
