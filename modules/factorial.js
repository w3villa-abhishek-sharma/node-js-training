const calculateFactorial = (number)=>{
    try {
        let n = Number(number);
        if(n==1){
            return 1;
        }
        return calculateFactorial(n-1) * n;
    } catch (error) {
        return error
    }
}

module.exports = calculateFactorial;