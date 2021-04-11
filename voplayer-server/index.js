const httpServer = require("http").createServer();
const ipAdress = 'localhost:3000'
const io = require("socket.io")(httpServer,{
    cors: {
	    origin: "http://" + ipAdress,
	    methods: ["GET", "POST"]
	}	
});
const axios = require('axios')
const auth = require('./auth').auth
const port = 3050;
let searchToken = '';

const hourlyRefresh = async() => {() => {
    setInterval(axios({
        url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials',
        method: 'post',
        headers: {
            Authorization: 'Basic ' + Buffer.from(auth.client_id + ':' + auth.client_secret).toString('base64')
        }
    }).then(res => res.data.access_token).then(data => searchToken = data).then(console.log('Refreshed: '))
    , 1000 * 60 * 59)}
}

hourlyRefresh()

io.on("connection", (socket) => {
    io.to(socket.id).emit('searchAuth', searchToken)

    socket.on('group', (arg) => {
        if (arg === 'host') {
            socket.join('host')
            io.to('host').emit('Joined as host')
            console.log('User: ', socket.id, 'joined as Host')
        } else if (arg === 'client') {
            socket.join('clients')
            io.to(socket.id).emit('Joined clients')
            console.log('User: ', socket.id, 'joined as Client')
        }
    });

    socket.on('current', (arg, data) => {
        if (arg === 'update') {
            console.log('Nieuwe song')
            io.to('clients').emit('currentUpdate', data)
        }
    });

    socket.on('queue', (arg,  queue) => {
        if (arg === 'update') {
            console.log('Nieuwe queue')
            io.to('clients').emit('queueUpdate', queue)
        }
    });

    socket.on('commands', arg => {
        switch (arg) {
            case 'updateQueue': 
                io.to('host').emit('commands', 'updateQueue')
                break
            case 'currentSong':
                console.log('Ik ga de currentSong vragen')
                io.to('host').emit('commands', 'currentSong')
                break
            default:
        }
    });

    //SOCKET ID FUNCTIONS

    socket.on('searchAuth', (arg, id) => {
        if (arg === 'refresh') {
            console.log('Er is een token gestuurd naar', id)
            io.to(id).emit('searchAuth', searchToken)
        } else if (arg === 'new') {
            console.log('generate new token')
            axios({
                url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials',
                method: 'post',
                headers: {
                    Authorization: 'Basic ' + Buffer.from(auth.client_id + ':' + auth.client_secret).toString('base64')
                }
            }).then(res => res.data.access_token).then(data => searchToken = data)
            io.emit('searchAuth', searchToken)
        }
    });
    console.log(io.allSockets())
});

httpServer.listen(port, () => console.log('Live on port: ', port))
