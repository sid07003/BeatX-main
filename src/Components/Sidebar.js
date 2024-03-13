import React from "react";
import "../SCSS/Sidebar.scss";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="logo">
                <div style={{ margin: "5px" }}>
                <i className="fa-solid fa-music" style={{ color: "#ffffff",  fontSize: "35px" }}  id="beatxLogo"></i>
                </div>
                <div className="homeText" style={{ color: "#ffffff", fontSize: "25px" }}><b><i>BEATX</i></b></div>
            </div>
            <div className="home">
                <div style={{ margin: "10px" }}>
                    <i className="fa-solid fa-house" style={{ color: "#ffffff" }}></i>
                </div>
                <div className="homeText">Home</div>
            </div>
            <div className="search" >
                <div style={{ margin: "10px" }}>
                    <i
                        className="fa-solid fa-magnifying-glass"
                        style={{ color: "#ffffff" }}
                    ></i>
                </div>
                <div style={{ margin: "5px", color: "white" }}>Search</div>
            </div>
            <div className="library">
                <div className="heading">
                    <div style={{ margin: "5px" }}>
                        <i className="fa-solid fa-bars" style={{ color: "#ffffff" }}></i>
                    </div>
                    <div style={{ margin: "10px" }}>Library</div>
                </div>
                {/* --------------------------------------------------------------------------------------- */}
                <ul className="content">
                    <div style={{ textDecoration: "none" }}>
                        <li className="liked">
                            <div style={{ margin: "5px" }} >
                                <i className="fa-solid fa-heart" style={{ color: "#ffffff" }}></i>
                            </div>
                            <div style={{ margin: "5px" }} >Liked Songs</div>
                        </li>
                    </div>
                    {/* --------------------------------------------------------------------------------------- */}
                    <li className="liked">
                        <div style={{ margin: "5px" }} >
                            <i className="fas fa-history" style={{ color: "#ffffff" }}></i>
                        </div>
                        <div
                            style={{
                                margin: "5px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            Recent Songs
                        </div>
                    </li>
                    {/* --------------------------------------------------------------------------------------- */}
                    {/* <li className="playlist">
            <div to="myPlaylist" style={{ textDecoration: "none", display: "flex" }} id="playlist_element">
              <div style={{ margin: "5px" }} >
                <i className="fa-solid fa-list" style={{ color: "#ffffff" }}></i>
              </div>
              <div style={{ margin: "5px" }} >My Playlists</div>
            </div>
            <div style={{
              color: "rgb(255, 255, 255, 0.7)", marginLeft: "10px",height:"100px",overflowY:"scroll"
            }}>
              <ul>
                {playlist_array.length > 0
                  ?
                  playlist_array.map((element) => {
                    return (
                      <li style={{ height: "20px", width: "80px" }}>
                        <div to={`/:${element.Name}`} id="playlist_names">
                          <div style={{color: "rgb(255, 255, 255, 0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{element.Name}</div></div>
                      </li>
                    )
                  })
                  :
                  <div></div>
                }
              </ul>
            </div>
          </li> */}
                </ul>
            </div>
        </div>
    );
}
