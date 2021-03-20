const express = require("express");
const app = express();
const request = require("request");
const fs = require("fs");

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.set('views', './public/views');

app.get("/", (req, res) => {
    let status = req.query.notif;

    let option = {
        url: "http://localhost:3000/api/data",
        method: "GET",
    }
    request(option, (error, response, body) => {
        if (error) {
            res.send("Error data list is not available")
        } else {
            let currentData = JSON.parse(body);
            res.render("crud", {
                data: currentData,
                notif_success: status
            });
        }
    })
})

app.post("/", (req, res) => {
    dataID = Number(req.query.dataID)
    let data = JSON.parse(fs.readFileSync(__dirname + "/json/data.json"));
    data.splice(dataID, 1)
    dataJSON = JSON.stringify(data, null, 4)
    fs.writeFileSync(__dirname + "/json/data.json", dataJSON);
    res.redirect("/?notif=suksesdelete")
})

app.get("/add", (req, res) => {
    res.render("add")
})

app.post("/add", (req, res) => {
    let data = JSON.parse(fs.readFileSync(__dirname + "/json/data.json"))
    let newData = {
        id: data.length + 1,
        nama: req.body.nama,
        hoby: req.body.hoby
    }

    data.push(newData);
    dataJSON = JSON.stringify(data, null, 4)
    fs.writeFileSync(__dirname + "/json/data.json", dataJSON);
    res.redirect("/?notif=suksesupdate")
})


app.get("/edit", (req, res) => {
    let dataID = req.query.dataID
    res.render("edit", {
        dataID: dataID
    })
})

app.post("/edit", (req, res) => {
    dataID = Number(req.query.dataID)
    let data = JSON.parse(fs.readFileSync(__dirname + "/json/data.json"))
    let newData = {
        id: dataID,
        nama: req.body.nama,
        hoby: req.body.hoby
    }
    data[dataID - 1] = newData
    dataJSON = JSON.stringify(data, null, 4)
    fs.writeFileSync(__dirname + "/json/data.json", dataJSON);
    res.redirect("/?notif=suksesedit")
})



app.get("/api/data", (req, res) => {
    res.sendFile(__dirname + "/json/data.json")
})


app.listen(3000, () => {
    console.log("server is running at port 3000");
})