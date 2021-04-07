import * as React from 'react';
import '../Styling.css';
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

// socket.onAny((key, arg) => console.log("key:",key,"arg:", arg))

export default function ClientUi({socket}: any) {
    const [queue, setQueue]: [Array<SongType>, Function] = React.useState([]);
    const [current, setCurrent]: [any, Function] = React.useState('');

    React.useEffect(() => {
        socket.emit('group', 'client')
    }, [socket])

    socket.on('queueUpdate', (arg: Array<SongType>) => {
        setQueue(arg)
        console.log('Updated queue after request')
    });

    socket.on('currentUpdate', (arg: any) => {
        setCurrent(arg)
        console.log('Updated current after request')
    });
    
    React.useEffect(() => {
        console.log("Something updated: ", {
            queue: queue,
            current: current
        })
    }, [queue, current])
    
    return (
        <div className="App">
            <p>Current: {JSON.stringify(current)}</p>
            <p>Queue: {JSON.stringify(queue)}</p>
            <button onClick={() => {
                socket.emit('commands', 'updateQueue')
            }}>
                POG!
            </button>
        </div>
    )
}