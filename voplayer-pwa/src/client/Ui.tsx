import * as React from 'react';
import '../Styling.css';
import { search } from '../modules/Playback';
import SongList from '../components/songList'

type SongType = {
    name: string,
    artist: string,
    album_cover: string,
    uri: string
};

// Deze niet verwijderen gaan we nog gebruiken
// socket.on("searchAuth", (token: string) => {
//     searchToken = token;
// });

export default function ClientUi({socket}: any) {
    const [queue, setQueue]: [Array<SongType>, Function] = React.useState([]);
    const [currentSong, setCurrentSong]: [any, Function] = React.useState('');
    const [searchInput, setSearchInput]: [string, Function] = React.useState('');
    const [searchData, setSearchData]: [Array<string>, Function] = React.useState([]);
    const [searchToken, setSearchToken]: [string, Function] = React.useState('');

    React.useEffect(() => {
        //Get in clients group
        socket.emit('group', 'client', socket.id)

        //Initial info
        const initialActions = () => {
            console.log('Joined clients')
            console.time('vo')
            socket.emit('searchAuth', 'refresh', socket.id)
            socket.emit('commands', 'currentSong')

        }
        socket.on('Joined clients', initialActions);

        //Eventuele shit
        socket.on('queueUpdate', (arg: Array<SongType>) => {
            setQueue(arg)
            console.log('Updated queue after request')
        });
        socket.on('currentUpdate', (arg: any) => {
            setCurrentSong(arg)
            console.log('Updated current after request')
        });
        socket.on('searchAuth', (arg: any) => {
            setSearchToken(arg)
            console.log('Er is een nieuw search token', arg)
        });

        //Disconnect bij unmount
        return () => {
            socket.disconnect()
        };
    }, [socket])
    
    React.useEffect(() => {
        console.log("Current updated: ", currentSong.name)
    }, [currentSong])

    function setSearch(event: any) {
        setSearchInput(event.target.value)
        let timer;
        clearTimeout(timer)

        if (event.target.value === '') {
            setSearchData([])
        } else if (event.keyCode === 13) {
            search(searchToken, event.target.value).then(data => setSearchData(data.data.tracks.items)).catch(err => console.log('error', err))
        } else {
            timer = setTimeout(() => {
                search(searchToken, event.target.value).then(data => setSearchData(data.data.tracks.items)).catch(err => console.log('error', err))
            }, 250);
        }
    }

    const returnURL = (url: string) => 'url(' + url + ')';
    
    return (
        <div className="Background" style={{backgroundImage: returnURL(currentSong.album_cover)}}>
            <div className="App">
                <div className="TopBar">
                    <input 
                        className="SearchBar" 
                        value={searchInput} 
                        placeholder="Search"
                        onChange={setSearch}
                    />
                </div>
                <div className="Wrapper">
                    <div className="Queue">
                        <SongList data={searchData}/>
                    </div>
                </div>
            </div>
        </div>
    )
}