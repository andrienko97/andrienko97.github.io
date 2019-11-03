const controlSearch = window.document.querySelector('#list-control-search');
const controlStatus = window.document.querySelector('#list-control-status');
const controlPriority = window.document.querySelector('#list-control-priority');
const createBtn = window.document.querySelector('#list-control-create-btn');
const cancelBtn = window.document.querySelector('#create-edit-cancel');
const modalOverlay = window.document.querySelector('.modal-overlay');
const itemList = window.document.querySelector('.item-list');
const titleInput = window.document.querySelector('#create-edit-title-input');
const descriptionInput = window.document.querySelector('#create-edit-description-input');
const priorityInput = window.document.querySelector('#create-edit-priority-select');
const idInput = window.document.querySelector('#id');
const saveBtn = window.document.querySelector('#create-edit-save');

var todoList = [];

(function () {
    renderItems()
})();


function getItems() {
    var items = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        items.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    return items;
}

function getItemById(id) {
    const item = JSON.parse(localStorage.getItem(id));
    return item;
}

function getItemByTitle(title){
    let items = getItems();
    items = items.filter(x => x.title.includes(title));
    renderItems(items)
}

function getItemByStatus(status){
    let items = getItems();
    if(status !== "0"){
        switch(status) {
            case 'false': 
              status = false
              break
            case 'true':
            status = true
              break
          }
    items = items.filter(x => x.completed == status);
    }
    renderItems(items)
}
function getItemByPriority(priority){
    let items = getItems();
    if(priority !== "0"){
    items = items.filter(x => x.priority == priority);
    }
    renderItems(items)
}

function addItem(item) {
    localStorage.setItem(item.id, JSON.stringify(item));
}

function renderItems(items) {
    itemList.innerHTML = '';
    const renderedItems = items ? items : getItems();
    renderedItems.forEach(item => {
        renderItem(item)
    });
}

function deleteItem(id) {
    localStorage.removeItem(id);
    renderItems()
}

function editItem(id) {
    setModalState(id);
    toggleModal();
}

function finishItem(id) {
    const item = getItemById(id);
    item.completed = true;
    addItem(item);
}

function getNewId() {
    const items = getItems();
    const ids = items.map(x => x.id);
    const lastId = ids.length ? Math.max.apply(null, ids) : 0;
    const newId = lastId + 1;
    return newId;
}

controlSearch.addEventListener('keyup', (e) =>{
    getItemByTitle(e.target.value);
})

controlStatus.addEventListener('change', (e) =>{
    getItemByStatus(e.target.value)
})
controlPriority.addEventListener('change', (e) => {
    getItemByPriority(e.target.value)
})

saveBtn.addEventListener('click', () => {
    const item = {};
    item.id = idInput.value;
    item.title = titleInput.value;
    item.description = descriptionInput.value;
    item.priority = priorityInput.value;
    item.completed = false;
    addItem(item);
    toggleModal();
    renderItems();
});


function renderItem(item) {
    const itemContainer = document.createElement('div')
    itemContainer.className = item.completed ? "item item-completed" : "item";
    const hiddenId = document.createElement('input');
    hiddenId.setAttribute('type', 'hidden');
    hiddenId.value = item.id;
    const itemTitle = document.createElement('div');
    itemTitle.className = "item-field"
    const itemTitleCaption = document.createElement('div')
    itemTitleCaption.appendChild(document.createTextNode("Title:"));

    const itemTitleValue = document.createElement('div')
    itemTitleValue.appendChild(document.createTextNode(item.title));

    itemTitle.append(
        itemTitleCaption,
        itemTitleValue
    );

    const itemDescription = document.createElement('div');
    itemDescription.className = "item-field"
    const itemDescriptionCaption = document.createElement('div')
    itemDescriptionCaption.appendChild(document.createTextNode("Description:"));

    const itemDescriptionValue = document.createElement('div')
    itemDescriptionValue.appendChild(document.createTextNode(item.description));
    itemDescriptionValue.className = "item-description"
    itemDescription.append(
        itemDescriptionCaption,
        itemDescriptionValue
    );

    const itemPriority = document.createElement('div');
    itemPriority.className = "item-field"
    const itemPriorityCaption = document.createElement('div')
    itemPriorityCaption.appendChild(document.createTextNode("Priority:"));

    const itemPriorityValue = document.createElement('div')
    itemPriorityValue.className = "priority";
    itemPriorityValue.appendChild(document.createTextNode(item.priority));

    itemPriority.append(
        itemPriorityCaption,
        itemPriorityValue
    );

    const itemBtns = document.createElement('div')

    const itemDeleteBtn = document.createElement('button');
    itemDeleteBtn.textContent = "Delete";
    itemDeleteBtn.addEventListener('click', () => deleteItem(item.id));

    const itemEditBtn = document.createElement('button');
    itemEditBtn.textContent = "Edit";
    itemEditBtn.addEventListener('click', () => editItem(item.id));

    const itemDoneBtn = document.createElement('button');
    itemDoneBtn.textContent = "Done";
    itemDoneBtn.addEventListener('click', () => finishItem(item.id));


    itemBtns.append( itemDoneBtn, itemEditBtn, itemDeleteBtn);
    itemBtns.className = "item-btns";

    itemContainer.append(
        itemTitle,
        itemDescription,
        itemPriority,
        itemBtns
    );
    itemList.appendChild(itemContainer)
};

function setModalState(id) {
    if (id) {
        const item = getItemById(id);
        idInput.value = item.id;
        titleInput.value = item.title;
        descriptionInput.value = item.description;
        priorityInput.value = item.priority;
    }
    else {
        idInput.value = getNewId();
        titleInput.value = '';
        descriptionInput.value = '';
        priorityInput.value = '';
    }
}

const toggleModal = () => {
    const modalOverlay = window.document.querySelector('.modal-overlay');
    modalOverlay.classList.toggle('show-modal');
}

createBtn.addEventListener('click', () => {
    setModalState();
    toggleModal();
});

cancelBtn.addEventListener('click', () => {
    toggleModal();
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target.classList[0] === 'modal-overlay') {
        toggleModal();
    }
});