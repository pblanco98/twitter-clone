const express = require("express");
const cors = require("cors");
const monk = require("monk");


const app = express();

const db = monk("localhost/woofster"); 
const woofs = db.get('woofs');

app.use(cors());
app.use(express.json())

app.get('/', (request,response) => {
     response.json({
         message: "Woof! "
     })
 })

 app.get('/woofs', (req, res) => {
    woofs
    .find()
    .then(woofs => {
        res.json(woofs);
    });
 })

function isValidWoof(woof) {
    return woof.name && woof.name.toString().trim() !== "" &&
    woof.content && woof.content.toString().trim() !== ""
}



app.post('/woofs', (req, res) => {
    if (isValidWoof(req.body)) {
        //insert to db...
        const woof = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };

        woofs
            .insert(woof)
            .then(createdWoof => {
                res.status(200);
                res.json(createdWoof);
            })
            .catch(err => console.log(err))
            
    } else{
        res.status(422);
        res.json({
            message: "Hey! Name and Content are required!"
        });
    }
});

app.listen(5000, () => {
    console.log("Listening on http://localhost:5000")
});