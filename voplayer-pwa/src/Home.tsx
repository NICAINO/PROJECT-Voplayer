import './Home.css';
import * as React from 'react';
import { io } from "socket.io-client";
const ipAdress = '192.168.2.13:3050'
const socket = io('http://' + ipAdress)

type Data = {
  playlist: Array<string>
}

const addSong = (song: any) => {
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
}

const displaySongs = (playlist: any) => {
  const playlistMap = playlist.map((song: any, index: any) => {
    return <div key={index}>{song}</div>
  })
  return (
    <ul>{playlistMap}</ul>
  )
}

function Home () {
  const [data, setData]: any = React.useState({playlist: []});

  React.useEffect(() => {
    socket.on("playlist", (data: Data) => {
      setData(data)
      console.log("Received: ", data)
    })
  }, []) //is dependecy array ofzo

  return (
    <div className="App">
      <div className="Header">
          Vo
      </div>
      {displaySongs(data.playlist)}
      <div className = "button" onClick={() => {addSong('Madison beer')}}>
        add VOMB
      </div>
      <div className="Button" onClick={() => {refreshPlaylist()}}>
        Refresh
      </div>
      <div className="Button" onClick={() => {clearSongs(false)}}>
        clear
      </div>
    </div>
  );
};

export default Home;
