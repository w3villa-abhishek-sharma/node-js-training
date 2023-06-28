// Exercise 1 of Event Emitter
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.addListener("start",()=>{
    console.log("Hello World!");
}) 
setTimeout(()=>{  // Event emit in 1 second
    eventEmitter.emit("start")
},1000)



// Exercise 2 
function handleCallBack(callback){
    setTimeout(()=>{
        callback();
    },1000)
}
handleCallBack(()=>{
    console.log("This Call Back Call after  second.");
})


// Exercise 3
function addTwoNumber(num1,num2,callback){
    let result = num1 + num2;
    callback(result);
}
addTwoNumber(2,5,(result)=>{
    console.log(`Sum is = ${result}`)
})