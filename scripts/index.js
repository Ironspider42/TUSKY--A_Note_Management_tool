const state = {
  tasklist: [],
};

// DOM - document object
const taskContent = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContent = ({ id, title, description, type, url }) => `
  <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
      <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
        <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
          <i class='fas fa-pencil-alt' name=${id}></i>
        </button>
        <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
          <i class='fas fa-trash-alt' name=${id}></i>
        </button>
      </div>
      <div class='card-body'>
        ${
          url
            ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
            : `
      <img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
      `
        }
        <h4 class='task__card__title'>${title}</h4>
        <p class='description trim-3-lines text-muted' data-gram_editor='false'>
          ${description}
        </p>
        <div class='tags text-white d-flex flex-wrap'>
          <span class='badge bg-primary m-1'>${type}</span>
        </div>
      </div>
      <div class='card-footer'>
        <button 
        type='button' 
        class='btn btn-outline-primary float-right' 
        data-bs-toggle='modal'
        data-bs-target='#showTask'
        id=${id}
        onclick='openTask.apply(this, arguments)'
        >
          Open Task
        </button>
      </div>
    </div>
  </div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
  return `
  <div id=${id}>
  ${
    url
      ? `
      <img width='100%' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3' />
    `
      : `
    <img width='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
    `
  }
  <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
  <h2 class='my-3'>${title}</h2>
  <p class='lead'>
    ${description}
  </p>
  </div>
    `;
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.tasklist,
    })
  );
};

const LoadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.tasks);

  if (localStorageCopy) state.tasklist = localStorageCopy.tasks;

  state.tasklist.map((cardData) => {
    taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageURL").value,
    title: document.getElementById("texttitle").value,
    description: document.getElementById("description").value,
    type: document.getElementById("types").value,
  };

  if (input.title === "" || input.description === "" || input.title === "")
    return alert("Please fill all the fields");

  taskContent.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input, // ... it sprad the data inside the object
      id,
    })
  );

  state.tasklist.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.tasklist.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

const deleteTask = (e) => {
  if(!e)  e = window.event;
  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  console.log(type);
  const removeTask = state.tasklist.filter(({id}) => id !== targetId);
  state.tasklist = removeTask;

  updateLocalStorage();
  if(type === "BUTTON"){
    return e.target.parentNode.parentNode.parentNode.remveChild(
      e.target.parentNode.parentNode
    );
  }

  return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode
  );
};

const editTask = (e) => {
  if(!e) e = windows.event;

  const targetId = e.target.id;
  const type = e.target.type;

  let parentNode;
  let tasktitle;
  let taskdescription;
  let tasktype;
  let submitbutton;

  if(type === "button") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  console.log(parentNode);
  tasktitle = parentNode.childNodes[3].childNodes[3];
  taskdescription = parentNode.childNodes[3].childNodes[5];
  tasktype = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitbutton = parentNode.childNodes[5].childNodes[1];

  tasktitle.setAttribute("contenteditable", "true");
  taskdescription.setAttribute("contenteditable", "true");
  tasktype.setAttribute("contenteditable", "true");

  submitbutton.setAttribute('onclick', "saveEdit.apply(this, arguments)");
  submitbutton.removeAttribute("data-bs-toggle");
  submitbutton.removeAttribute("data-bs-target");
  submitbutton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
  if(!e) e = window.event;

  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;


  const tasktitle = parentNode.childNodes[3].childNodes[3];
  const taskdescription = parentNode.childNodes[3].childNodes[5];
  const tasktype = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitbutton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    tasktitle: tasktitle.innerHTML,
    taskdescription: taskdescription.innerHTML,
    tasktype: tasktype.innerHTML,
  };

  let stateCopy = state.tasklist;

  stateCopy = stateCopy.map((task) => 
    (task.id === targetId 
      ? {
        id: task.id,
        title: updateData.tasktitle,
        description: updateData.taskdescription,
        type: updateData.tasktype,
        url: task.url,
      }
      : task
      ));

      state.tasklist = stateCopy;
      updateLocalStorage();

      tasktitle.setAttribute("contenteditable", "false");
      taskdescription.setAttribute("contenteditable", "false");
      tasktype.setAttribute("contenteditable", "false");

      submitbutton.setAttribute("onclick", "openTask.apply(this, arguments)");
      submitbutton.setAttribute("data-bs-toggle", "modal");
      submitbutton.setAttribute("data-bs-target", "#showTask");
      submitbutton.innerHTML = "Open Task";
};

const searchTask = (e) => {
  if(!e) e = window.event;

  while(taskContent.firstChild) {
    taskContent.removeChild(taskContent.firstChild);
  }

  const resultdata = state.tasklist.filter(({title}) => {
    return title.toLowerCase().includes(e.target.value);

  });

  resultdata.map((cardData) => {
    taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};