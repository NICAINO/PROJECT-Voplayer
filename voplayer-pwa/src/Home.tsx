import './Styling.css';
import * as React from 'react';
import { io } from "socket.io-client";
import { NavLink } from 'react-router-dom';

const ipAdress = 'localhost:3050'
const socket = io('http://' + ipAdress)

type Data = {
  playlist: Array<string>
};

const addSong = (song: string) => {
  socket.emit('song', song)
  console.log('Emmitted song: ', song)
};

const refreshPlaylist = () => {
  socket.emit('refresh')
  console.log('demanded a refresh')
};

const clearSongs = (number: number | false) => {
  if (number !== false) {
    socket.emit('clear', number)
  } else {
    socket.emit('clear', 'all')
  }
};

const displaySongs = (playlist: any) => {
  const playlistMap = playlist.map((song: any, index: any) => {
    return <div key={index}>Pokkoe {index + 1}: {song}</div>
  });
  if (playlistMap.length !== 0) {
    return (
      <div className="Playlist">{playlistMap}</div>
    )
  } else return null
};



function Home (props: any) {
  const [data, setData]: [any, Function] = React.useState({playlist: []});
  const [song, setSong]: [string, Function] = React.useState('');

  React.useEffect(() => {
    socket.on("playlist", (data: Data) => {
      setData(data)
      console.log("Received: ", data)
    });
  }) //is dependecy array ofzo

  return (
    <div className="App">
      <div className="Header">
        VOPLAYER
      </div>
      <input value={song} onChange={(event) => {setSong(event.target.value)}}/>
      <NavLink className="Button" to={{pathname: "/Loading"}}>
          Ga loaden
      </NavLink>
      <div className = "Button" onClick={() => {addSong(song); setSong('')}}>
        Voeg je pokkoe toe! ;-)
      </div>
      <div className="Button" onClick={() => {refreshPlaylist()}}>
        Refresh
      </div>
      <div className="Button" onClick={() => {clearSongs(false)}}>
        clear
      </div>
      {displaySongs(data.playlist)}
    </div>
  );
};

export default Home;
