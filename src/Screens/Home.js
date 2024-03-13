import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../SCSS/Home.scss";


export default function Home() {
    const [artistPlaylists, setArtistPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [specialSongs, setSpecalSongs] = useState([]);


    useEffect(() => {
        fetch("http://localhost:3001/getBeatxData", {
            "method": "GET",
            "headers": {
                "content-type": "application/json"
            }
        })
            .then(data => data.json())
            .then((result) => {
                setArtistPlaylists(result.artistPlaylists);
                setAlbums(result.albums);
                setSpecalSongs(result.specialSongs);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    const rightSrl = () => {
        let element = document.querySelector("#artists");
        element.scrollLeft += element.offsetWidth;
    };

    const leftSrl = () => {
        let element = document.querySelector("#artists");
        element.scrollLeft -= element.offsetWidth;
    };

    const rightSrl2 = () => {
        let element = document.querySelector("#trendingSongs");
        element.scrollLeft += element.offsetWidth;
    };

    const leftSrl2 = () => {
        let element = document.querySelector("#trendingSongs");
        element.scrollLeft -= element.offsetWidth;
    };

    return (
        <div id="home">
            <nav>
                <div>
                    {/* <Link to="/SearchSongs">
          <input
            type="text"
            className="searchbar"
            placeholder="Search"
            onMouseEnter={() => {
              let searchbar = document.querySelector(".searchbar");
              searchbar.style.border = "2px solid rgb(56, 221, 78)";
            }}
            onMouseLeave={() => {
              let searchbar = document.querySelector(".searchbar");
              searchbar.style.border = "2px solid white";
            }}
          />
          </Link> */}

                    <div to="/SearchSongs">
                        <input
                            type="text"
                            className="searchbar"
                            placeholder="Search"
                            onMouseEnter={() => {
                                let searchbar = document.querySelector(".searchbar");
                                searchbar.style.border = "2px solid rgb(56, 221, 78)";
                            }}
                            onMouseLeave={() => {
                                let searchbar = document.querySelector(".searchbar");
                                searchbar.style.border = "2px solid white";
                            }}
                        />
                    </div>
                </div>
                <Link to={"/Login"} className="profile">
                    <i
                        className="fa-solid fa-user"
                        style={{ color: "#ffffff", fontSize: "25px", padding: "10px" }}
                    ></i>
                    {/* <i
                        className="fa-solid fa-right-from-bracket"
                        style={{ color: "#ffffff", fontSize: "25px", padding: "10px" }}
                    ></i> */}
                </Link>
            </nav>
            <div id="popularArtists">
                <div id="popular">Popular Artists</div>
                <div id="sideScroll">
                    <div id="leftscroll" onClick={leftSrl}>
                        <i
                            className="fa-solid fa-angles-left"
                            style={{ color: "#ffffff", fontSize: "35px" }}
                        ></i>
                    </div>
                    <div id="artists">
                        {artistPlaylists.map((element) => {
                            return (
                                // <Link to={`/artist/:${element.Id}`} style={{textDecoration:"none"}}>
                                //   <div style={{ cursor: "pointer" }}>
                                //     <img src={element.playlist_image} alt={element.playlist_name} id="artist" />
                                //     <p style={{ paddingTop: "5px" }}>{element.playlist_name}</p>
                                //   </div>
                                // </Link>
                                <div style={{ textDecoration: "none" }}>
                                    <div style={{ cursor: "pointer" }}>
                                        <img src={element.playlist_image} alt={element.playlist_name} id="artist" />
                                        <p style={{ paddingTop: "5px" }}>{element.playlist_name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div id="rightscroll" onClick={rightSrl}>
                        <i
                            className="fa-solid fa-angles-right"
                            style={{ color: "#ffffff", fontSize: "35px" }}
                        ></i>
                    </div>
                </div>
            </div>
            <div id="popularArtists">
                <div id="popular">Trending Songs</div>
                <div id="sideScroll">
                    <div id="leftscroll" onClick={leftSrl2}>
                        <i
                            className="fa-solid fa-angles-left"
                            style={{ color: "#ffffff", fontSize: "35px" }}
                        ></i>
                    </div>
                    <div id="trendingSongs">
                        {specialSongs.map((element) => {
                            return (
                                // <Link to={`/artist/:${element.Id}`} style={{textDecoration:"none"}}>
                                //   <div style={{ cursor: "pointer" }}>
                                //     <img src={element.playlist_image} alt={element.playlist_name} id="artist" />
                                //     <p style={{ paddingTop: "5px" }}>{element.playlist_name}</p>
                                //   </div>
                                // </Link>
                                <div style={{ textDecoration: "none" }}>
                                    <div style={{ cursor: "pointer" }}>
                                        <img src={element.song_imagepath} alt={element.song_name} id="trending" />
                                        <p style={{ paddingTop: "5px" }}>{element.song_name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div id="rightscroll" onClick={rightSrl2}>
                        <i
                            className="fa-solid fa-angles-right"
                            style={{ color: "#ffffff", fontSize: "35px" }}
                        ></i>
                    </div>
                </div>
            </div>
            <div id="albums">
                <div id="popular">Popular Playlists</div>
                <div id="album_playlists">
                    {albums.map((element) => {
                        return (
                            <div style={{ textDecoration: "none", cursor: "pointer" }} id="album_playlist">
                                <img src={element.playlist_image} alt={element.playlist_name} id="playlist_image" />
                                <p style={{ paddingTop: "5px" }}>{element.playlist_name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}