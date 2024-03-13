import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../SCSS/Artist.scss";
import { context_music } from "../App.js";

export default function Artist(props) {
    const { artistData } = useParams();
    const [songsData, setSongsData] = useState([]);
    const [playlistData,setPlaylistData]=useState({});

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

    return (
        <div id="Artist"
        //  style={
        //   musicPlayer
        //     ?
        //     { height: "calc(100vh  - 70px)" }
        //     :
        //     { height: "100vh" }
        // }
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
                                <div id="blank">
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
                                >
                                    <div>
                                        {element.song_name}
                                    </div>
                                </div>

                                <div id="body_duration">{element.song_duration}</div>
                                <div id="title_likes">
                                    <i className="fa-regular fa-heart" style={{ color: "#ffffff" }}></i>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
}
