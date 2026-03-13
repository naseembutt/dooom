const draggable_list = document.getElementById("draggable-list");
const check = document.getElementById("check");

const richestPeople = [
  "Elon Musk", "Larry Page", "Sergey Brin", "Jeff Bezos", "Mark Zuckerberg",
  "Larry Ellison", "Jensen Huang", "Bernard Arnault", "Rob Walton", "Warren Buffett"
];

const listItems = [];
let dragStartIndex;

createList();

function createList() {
  [...richestPeople]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach((person, index) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("data-index", index);
      listItem.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="draggable" draggable="true">
          <p class="person-name">${person}</p>
          <i class="fas fa-grip-lines"></i>
        </div>
      `;
      listItems.push(listItem);
      draggable_list.appendChild(listItem);
    });

  addDragEventListeners();
}

function dragStart() {
  dragStartIndex = +this.closest("li").getAttribute("data-index");
}

function dragOver(e) {
  e.preventDefault(); 
}

function dragEnter() {
  this.classList.add("over");
}

function dragLeave() {
  this.classList.remove("over");
}

function dragDrop() {
  const dragEndIndex = +this.closest("li").getAttribute("data-index");
  // Only swap if indices are different
  if (dragStartIndex !== dragEndIndex) {
    swapItems(dragStartIndex, dragEndIndex);
  }
  this.classList.remove("over");
}

// SWAP LOGIC: Direct Swap using temporary placeholder
function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex];
  const itemTwo = listItems[toIndex];
  const parent = itemOne.parentNode;

  // Use a temporary element to hold the spot during the swap
  const temp = document.createElement("li");
  parent.replaceChild(temp, itemOne);
  parent.replaceChild(itemOne, itemTwo);
  parent.replaceChild(itemTwo, temp);

  // Update the array to keep indices synced
  listItems[fromIndex] = itemTwo;
  listItems[toIndex] = itemOne;
}

function addDragEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll("#draggable-list li");

  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

function checkOrder() {
  listItems.forEach((listItem, index) => {
    const personName = listItem.querySelector(".person-name").innerText.trim();
    if (personName !== richestPeople[index]) {
      listItem.classList.add("wrong");
    } else {
      listItem.classList.remove("wrong");
      listItem.classList.add("right");
    }
  });
}

check.addEventListener("click", checkOrder);