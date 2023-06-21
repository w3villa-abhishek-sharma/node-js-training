const sha256 = require("crypto-js/sha256");
const sumTwoNumbers = require("./modules/sumTwoNumbers");
const multiplyTwoNumbers= require("./modules/multiplyTwoNumbers");

const SECRET_KEY = "secret key here";

let number1 = 5;
let number2 = 4;
console.log(multiplyTwoNumbers(number1,number2));
console.log(sumTwoNumbers(number1,number2));

console.log("++++++++++++++++ External Module Use ++++++++++++++++");
console.log(sha256("Hello this is encoded message",SECRET_KEY).toString());