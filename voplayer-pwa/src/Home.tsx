import './Styling.css';
//import * as React from 'react';
import { genUrl } from './modules/Authentication'

// const addSong = (song: string) => {
//   socket.emit('song', song)
//   console.log('Emmitted song: ', song)
// };

// const refreshPlaylist = () => {
//   socket.emit('refresh')
//   console.log('demanded a refresh')
// };

// const clearSongs = (number: number | false) => {
//   if (number !== false) {
//     socket.emit('clear', number)
//   } else {
//     socket.emit('clear', 'all')
//   }
// };

// const displaySongs = (playlist: any) => {
//   const playlistMap = playlist.map((song: any, index: any) => {
//     return <div key={index}>Pokkoe {index + 1}: {song}</div>
//   });
//   if (playlistMap.length !== 0) {
//     return (
//       <div className="Playlist">{playlistMap}</div>
//     )
//   } else return null
// };

async function authorize() {
  const state = JSON.stringify(Math.random())
  localStorage.setItem('state', state)
  return state
}

function Home() {
  return (
    <div className="App">
      <div className="Header">
        VOPLAYER
      </div>
      <div className="Button" onClick={() => authorize().then(state => window.location.href = genUrl(state))}>
          Ga loaden
      </div>
    </div>
  );
};

export default Home;
