const { getDB } = require("../utils/database");

class User {
  constructor(firstName, lastName, email, password, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.age = age;
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }
}

module.exports = User;
