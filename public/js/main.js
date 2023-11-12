const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");

const dropContainer = document.getElementById("dropContainer");
const uploadFile = document.getElementById("uploadFile");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);

// dragover and dragenter events need to have 'preventDefault' called
// in order for the 'drop' event to register.
// dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
//   evt.preventDefault();
// };

// dropContainer.ondrop = function (evt) {
//   evt.preventDefault();
//   // pretty simple -- but not for IE :(
//   uploadFile.files = evt.dataTransfer.files;

//   // If you want to use some of the dropped files
//   const dT = new DataTransfer();
//   dT.items.add(evt.dataTransfer.files[0]);
//   dT.items.add(evt.dataTransfer.files[3]);
//   uploadFile.files = dT.files;
// };
