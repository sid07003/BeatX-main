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

const { MongoClient, ObjectId } = require('mongodb');
MongoClient.connect("mongodb+srv://SiddharthSharma:siddharth@cluster0.gacgrpw.mongodb.net/")
    .then((client) => {
        dbinstance = client.db("beatx");
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });


// --------------------------------- Token Verification middleware --------------------------------------

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        console.log("unauthorized")
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.userId = new ObjectId(decoded.id);
        next();
    });
};


// ---------------------------------- Authentication End Points ------------------------------------------
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

            const accessToken = jwt.sign({ id: result._id, email: result.email }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 * 1000 });

            res.cookie("access_token", accessToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                path: "/"
            });
            res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("access_token", { path: "/" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
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

// ------------------------------------------ retrieve beatx data -------------------------------------
app.get("/getBeatxData", (req, res) => {
    const token = req.cookies.access_token;

    let isAuthenticated = false;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
                isAuthenticated = true;
                const userId = new ObjectId(decoded.id);
                dbinstance.collection("user_data").findOne({ _id: userId })
                    .then((result) => {
                        fetchBeatxData(isAuthenticated, res, result);
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "An error occurred while fetching data" });
                    });
            } else {
                console.log(err);
                fetchBeatxData(isAuthenticated, res);
            }
        });
    } else {
        fetchBeatxData(isAuthenticated, res);
    }
});

function fetchBeatxData(isAuthenticated, res, userData = {}, lastPlayedMusic = {}) {
    dbinstance.collection("beatx_playlists_data").find().toArray()
        .then((data) => {
            const artistPlaylists = data[0].playlist;
            const albums = data[1].playlist;

            dbinstance.collection("songs_data").find({ playlist: "Special" }).toArray()
                .then((specialSongs) => {
                    res.status(200).json({
                        artistPlaylists: artistPlaylists,
                        albums: albums,
                        specialSongs: specialSongs,
                        isAuthenticated: isAuthenticated,
                        likedSongs: isAuthenticated ? userData.likedSongs || [] : [],
                        lastPlayedMusic: isAuthenticated ? userData.lastPlayedMusic || {} : {},
                    });
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
}


// ----------------------------------------- retrieve artist data ----------------------------------------------- 
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

// --------------------------------------- Handling songs like/unlike ---------------------------
app.post("/addLikeSong", verifyToken, (req, res) => {
    const songId = new ObjectId(req.body.songId);
    const userId = req.userId;

    dbinstance.collection("user_data").updateOne(
        { _id: userId },
        { $addToSet: { likedSongs: songId } },
    )
        .then(() => {
            res.status(200).json({ success: true });
        })
        .catch(() => {
            res.status(500).json({ error: "Internal Server Error" });
        });
});

// -------------------------------------- set currently palying music -------------------------------
app.post("/setCurrentlyPlayingMusic", verifyToken, (req, res) => {
    const song = req.body.song;
    const userId = new ObjectId(req.userId);

    dbinstance.collection("user_data").updateOne(
        { _id: userId },
        { $set: { lastPlayedMusic: song } }
    )
        .then(result => {
            res.status(200).json({ success: true, message: "Currently playing music set successfully" });
        })
        .catch(error => {
            console.error("Error setting currently playing music:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

// ---------------------------------------------- Next Song --------------------------------------------

app.post("/nextSong", (req, res) => {
    const song = req.body.song;
    let nextIndex = song.index + 1;
    dbinstance.collection("songs_data").findOne({ index: nextIndex })
        .then((data) => {
            if (!data) {
                dbinstance.collection("songs_data").findOne({ index: 0 })
                    .then((result) => {
                        res.status(200).json({ nextSong: result });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "Internal Server Error" });
                    })
            }
            else {
                res.status(200).json({ nextSong: data });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal Server Error" });
        })
})

// ------------------------------------------------- prevous song -----------------------------

app.post("/prevSong", (req, res) => {
    const song = req.body.song;
    let prevIndex = song.index - 1;
    dbinstance.collection("songs_data").findOne({ index: prevIndex })
        .then((data) => {
            if (!data) {
                dbinstance.collection("songs_data").find({}).toArray()
                    .then((response) => {
                        dbinstance.collection("songs_data").findOne({ index: response.length - 1 })
                            .then((result) => {
                                res.status(200).json({ prevSong: result });
                            })
                            .catch((err) => {
                                res.status(500).json({ error: "Internal Server Error" });
                            })
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "Internal Server Error" });
                    })
            }
            else {
                res.status(200).json({ prevSong: data });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal Server Error" });
        })
})

// --------------------------------------------------------------------------------------------------

app.listen(3001, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server Activated")
    }
})