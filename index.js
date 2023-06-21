const fs = require("fs")

function createNewFile() {
    fs.readFile("./first.txt", "utf-8", (err, data) => {
        console.log(data);
        fs.writeFile("./second.txt", data, () => {
            console.log("DONE")
        });
    })
}

createNewFile();