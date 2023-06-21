const multiplyTwoNumbers = (number1,number2)=>{
    try {
        return Number(number1) * Number(number2);
    } catch (error) {
        return error
    }
}

module.exports = multiplyTwoNumbers;