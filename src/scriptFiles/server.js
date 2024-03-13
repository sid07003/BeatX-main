require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

let dbinstance;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());

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
    let isAuthenticated;
    const token = req.cookies.access_token;

    if (!token) {
        isAuthenticated = false;
    }
    else {
        isAuthenticated = true;
    }

    dbinstance.collection("beatx_playlists_data").find().toArray()
        .then((data) => {
            const artistPlaylists = data[0].playlist;
            const albums = data[1].playlist;

            dbinstance.collection("songs_data").find({ playlist: "Special" }).toArray()
                .then((specialSongs) => {
                    res.status(200).json({ "artistPlaylists": artistPlaylists, "albums": albums, "specialSongs": specialSongs, "isAuthenticated": isAuthenticated });
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

app.post("/login", async (req, res) => {
    try {
        const loginData = req.body;

        const result = await dbinstance.collection("user_data").findOne({ email: loginData.email });

        if (!result) {
            console.log("reached2")
            return res.status(400).json({ error: "User Not found" });
        }

        bcrypt.compare(loginData.password, result.password, (err, response) => {
            if (err || !response) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const accessToken = jwt.sign({ id: result._id, email: result.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie("access_token", accessToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                path: "/"
            });
            // console.log(accessToken)
            console.log("reached")
            res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/getArtistData", (req, res) => {
    dbinstance.collection("beatx_playlists_data").findOne({ "playlist.playlist_name": req.body.playlistName }, { "playlist.$": 1 })
        .then((data) => {
            const reqData = data.playlist.find(playlist => playlist.playlist_name === req.body.playlistName);
            dbinstance.collection("songs_data").find({ playlist: req.body.playlistName }).toArray()
                .then((result) => {
                    res.status(200).json({ songs: result, playlistData: reqData });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: "Internal Server Error" });
                })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        })
})

app.post("/signup", (req, res) => {
    const user = req.body;

    if (user.password !== user.confirmPassword) {
        console.log("hello");
        res.status(400).json({ error: "passwords not matching" });
    }
    else {
        bcrypt.hash(user.password, 2, (err, hash) => {
            const userInfo = {
                "email": user.email,
                "password": hash,
                "likedSongs": [],
                "lastPlayedMusic": {},
                "playlists": []
            }

            dbinstance.collection("user_data").insertOne(userInfo)
                .then((result) => {
                    res.status(200).json({ "message": "User created successfully" });
                })
                .catch((err) => {
                    res.status(500).json({ error: "Internal Server Error" });
                })
        })
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