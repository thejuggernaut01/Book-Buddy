const deleteBookHandler = (btn) => {
  const bookId = btn.parentNode.querySelector("[name=bookId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const parentElement = btn.closest("article");

  fetch("/user/my-books/" + bookId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      parentElement.parentNode.removeChild(parentElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

const favoriteBtn = (btn) => {
  const bookId = btn.parentNode.querySelector("[name=bookId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  if (btn.style.stroke === "") {
    btn.style.stroke = "red";
    btn.style.fill = "red";

    fetch("/user/favorite/" + bookId, {
      method: "POST",
      headers: {
        "csrf-token": csrf,
      },
    })
      .then((result) => {})
      .catch((err) => console.log(err.message));
  } else {
    btn.style.stroke = "";
    btn.style.fill = "none";
  }
};

const deleteFavorite = (btn) => {
  const bookId = btn.parentElement.querySelector("[name=bookId]").value;
  const csrf = btn.parentElement.querySelector("[name=_csrf]").value;
  const parentElement = btn.closest("article");

  fetch("/user/favorite/" + bookId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      parentElement.parentNode.removeChild(parentElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

// reveal password
function showPW(button) {
  const password = document.querySelector("[name=password]");
  const hidePW = document.getElementById("hidePW");

  if (password.type === "password") {
    password.type = "text";
    button.style.display = "none";
    hidePW.style.display = "block";
  }
}

// hide password
function hidePW(button) {
  const password = document.querySelector("[name=password]");
  const showPW = document.getElementById("showPW");

  if (password.type === "text") {
    button.style.display = "none";
    showPW.style.display = "block";
    password.type = "password";
  }
}
