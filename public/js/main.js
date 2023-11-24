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

function displayFileName(input) {
  const selectedFileNameElement = document.getElementById("selectedFileName");
  const fileName = input?.files[0].name;
  selectedFileNameElement.innerText = `${fileName}`;
}
