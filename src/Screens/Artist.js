import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../SCSS/Artist.scss";
import { context_music } from "../App.js";

export default function Artist(props) {
    const { artistData } = useParams();
    const [songsData, setSongsData] = useState([]);
    const [playlistData, setPlaylistData] = useState({});
    const { isAuthenticated, likedSongs, setLikedSongs, set_currently_playing_music, musicPlayer,
    setIsMusicClicked } = useContext(context_music);

    useEffect(() => {
        fetch("http://localhost:3001/getArtistData", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({ "playlistName": artistData }),
            withCredentials: true,
            credentials: 'include'
        })
            .then(data => data.json())
            .then((result) => {
                setSongsData(result.songs);
                setPlaylistData(result.playlistData)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const toggleLike = (songId) => {
        fetch("http://localhost:3001/addLikeSong", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({ "songId": songId }),
            withCredentials: true,
            credentials: 'include'
        })
            .then(res => res.json())
            .then((result) => {
                console.log("Successfully added to liked Songs")
                setLikedSongs([...likedSongs, songId]);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const set_current_music = (element) => {
        fetch("http://localhost:3001/setCurrentlyPlayingMusic", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({ "song": element }),
            withCredentials: true,
            credentials: 'include'
        })
            .then(res => res.json())
            .then((result) => {
                set_currently_playing_music(element);
                setIsMusicClicked(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div id="Artist"
         style={
          musicPlayer
            ?
            { height: "calc(100vh  - 70px)" }
            :
            { height: "100vh" }
        }
        >
            <div id="info">
                <div id="container">
                    <img src={playlistData.playlist_image} alt={playlistData.playlist_name} id="singer" />
                </div>
                <div id="details">
                    <div id="Name">{artistData}</div>
                    <div id="song_info">
                        <div>{songsData.length} Songs</div>
                        <div style={{ marginLeft: "20px" }}>*</div>
                        <div style={{ marginLeft: "20px" }}>40 Minutes</div>
                    </div>
                    <div id="play_all">
                        <div>
                            <i className="fa-solid fa-play"></i>
                        </div>
                        <div style={{ paddingLeft: "8px" }}>Play All</div>
                    </div>
                </div>
            </div>

            <div id="playlist">
                <div id="title">
                    <div id="blank"></div>
                    <div id="title_name">Name</div>
                    <div id="title_duration">Duration</div>
                    <div id="title_likes"></div>
                </div>

                <div id="body" style={{ width: "95%" }}>
                    {songsData.map((element, index) => {
                        return (
                            <div
                                id="songs"
                            >
                                <div id="blank" onClick={()=>{set_current_music(element)}}>
                                    <img
                                        src={element.song_imagepath}
                                        alt={element.song_name}
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                            borderRadius: "5px",
                                        }}
                                    ></img>
                                </div>

                                <div
                                    id="body_name"
                                    onClick={()=>{set_current_music(element)}}
                                >
                                    <div>
                                        {element.song_name}
                                    </div>
                                </div>

                                <div id="body_duration" onClick={()=>{set_current_music(element)}}>{element.song_duration}</div>
                                <div id="title_likes">
                                    {
                                        likedSongs.includes(element._id)
                                            ?
                                            <i className="fa-solid fa-heart" style={{ color: "#ffffff" }} onClick={() => {
                                                toggleLike(element._id);
                                            }}></i>
                                            :
                                            <i className="fa-regular fa-heart" style={{ color: "#ffffff" }} onClick={() => {
                                                toggleLike(element._id);
                                            }}></i>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
}
