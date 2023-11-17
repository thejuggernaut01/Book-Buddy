const deleteBookHandler = (btn) => {
  const bookId = btn.parentNode.querySelector("[name=bookId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const parentElement = btn.closest("article");
  console.log(parentElement);

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
