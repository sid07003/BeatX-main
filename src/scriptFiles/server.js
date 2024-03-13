const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors")

let dbinstance;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const { MongoClient } = require('mongodb');
MongoClient.connect("mongodb+srv://SiddharthSharma:siddharth@cluster0.gacgrpw.mongodb.net/")
    .then((client) => {
        dbinstance = client.db("beatx");
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });


app.get("/getBeatxData", (req, res) => {
    dbinstance.collection("beatx_playlists_data").find().toArray()
        .then((data) => {
            const artistPlaylists = data[0].playlist;
            const albums = data[1].playlist;

            dbinstance.collection("songs_data").find({ playlist: "Special" }).toArray()
                .then((specialSongs) => {
                    res.status(200).json({ "artistPlaylists": artistPlaylists, "albums": albums, "specialSongs": specialSongs });
                })
                .catch((err) => {
                    console.log("Error fetching special songs:", err);
                    res.status(500).json({ error: "An error occurred while fetching special songs" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while fetching data" });
        });
});

app.post("/signup",(req,res)=>{
    const user=req.body;
    console.log(user)

    if(user.password!==user.confirmPassword){
        console.log("hello");
        res.status(400).json({error:"passwords not matching"});
    }
    else{
        console.log("matching");
    }
})


app.listen(3001, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server Activated")
    }
})