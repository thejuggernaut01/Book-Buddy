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

function handleLogin() {
  // Change button text to spinner SVG
  document.getElementById("loginButton").innerHTML =
    '<span class="loader"></span>';

  // Submit the form after changing the button text
  document.getElementById("loginForm").submit();
}

function handleSignup() {
  // Change button text to spinner SVG
  document.getElementById("signupButton").innerHTML =
    '<span class="loader"></span>';

  // Submit the form after changing the button text
  document.getElementById("signupForm").submit();
}

function handleAddBook() {
  // Change button text to spinner SVG
  document.getElementById("addBookButton").innerHTML =
    '<span class="loader"></span>';

  // Submit the form after changing the button text
  document.getElementById("addBookForm").submit();
}

function handleReset() {
  // Change button text to spinner SVG
  document.getElementById("resetButton").innerHTML =
    '<span class="loader"></span>';

  // Submit the form after changing the button text
  document.getElementById("resetForm").submit();
}

function handleNewPW() {
  // Change button text to spinner SVG
  document.getElementById("newPWButton").innerHTML =
    '<span class="loader"></span>';

  // Submit the form after changing the button text
  document.getElementById("newPWForm").submit();
}
