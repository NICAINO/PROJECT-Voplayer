import * as React from 'react';
import { parseUrl } from './modules/Authentication'
import { addToQueue, search } from './modules/Playback'
import { io } from "socket.io-client";

import './Styling.css';
import Song from './components/song'

const ipAdress = 'localhost:3050'
const socket = io('http://' + ipAdress)
let searchToken: string = ''

socket.on("searchAuth", (token: string) => {
  searchToken = token;
});

const listSearch = (data: any) => {
    //ik weet dat dit op een betere manier kan maar dit werkte dus vond het wel ff prima
    if (data.tracks) {
        console.log(data.tracks.items)
        return data.tracks.items.map((song: any, index: number) => <Song
        src={song.album.images[2].url}
        song={song.name}
        artist={song.artists[0].name}
        />)
    }
}

export default function Ui(props: any) {
    const [token, setToken]: [string, Function] = React.useState('');
    const [searchInput, setSearchInput]: [string, Function] = React.useState('')
    const [searchData, setSearchData]: [Object, Function] = React.useState({})

    React.useEffect(() => {
        if (parseUrl(window.location.href, localStorage.getItem('state')) !== null) {
            setToken(parseUrl(window.location.href, localStorage.getItem('state')));
            window.history.replaceState({}, document.title, "/Ui");
        }
    }, [token]);

    React.useEffect(() => {
        console.log('kkzooi', searchData)
    }, [searchData])

    return (
        <div className="App">
            <div className="Button" onClick={() => addToQueue(token, 'spotify:track:5sbooPcNgIE22DwO0VNGUJ').then(res => console.log(res))}>
                POPSTARS
            </div>
            <div className="Button" onClick={() => {socket.emit('searchAuth', 'new')}}>
                Refresh token
            </div>
            <input value={searchInput} onChange={(event) => {
                setSearchInput(event.target.value);
                }}/>
            <div className="Button" onClick={() => {
                search(searchToken, searchInput).then(data => setSearchData(data.data)
                )}}>
                Submit
            </div>
            {listSearch(searchData)}
        </div>
    )
}