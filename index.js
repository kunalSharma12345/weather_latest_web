const fs = require('fs');
const http = require('http');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

// reading file once..

    const replaceVal = (tempVal,originalVal) => {

        let temperature = tempVal.replace("{%tempval%}", originalVal.main.temp);
        temperature = temperature.replace("{%tempmin%}", originalVal.main.temp_min);
        temperature = temperature.replace("{%tempmax%}", originalVal.main.temp_max);
        temperature = temperature.replace("{%location%}", originalVal.name);
        temperature = temperature.replace("{%country%}", originalVal.sys.country);
        temperature = temperature.replace("{%tempstatus%}", originalVal.weather[0].main);

        return temperature;
    
    }

const server  = http.createServer((req,res) => {

        if (req.url == "/") {
            requests("http://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=a612978f2478edee3a4c8597ff1a119f")
            .on("data", (chunk) => {

                const objdata = JSON.parse(chunk);
                const arrData = [objdata];

                    // console.log(arrData[0].main.temp);
       // we are taking our data in array form ,
       //dealing with multiple array we use array.map function..
       
       const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join(""); 
       
       //we are getting data return by map method in array form so we need to get convert it into string by using join("")..
               
       res.write(realTimeData);
    //  console.log(realTimeData);
            })
            .on("end", (err) => {
                    if (err) return console.log("ERROR!!", err);
                    // console.log("end");
                    res.end(); // when no more data to be read..
            });
        }

});

server.listen(8000,"127.0.0.1",() => {
    console.log("listening to the port 8000");
});