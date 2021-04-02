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
const data = {
    playlist: [],
}
let searchToken = '';

axios({
    url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials',
    method: 'post',
    headers: {
        Authorization: 'Basic ' + Buffer.from(auth.client_id + ':' + auth.client_secret).toString('base64')
    }
}).then(res => res.data.access_token).then(data => searchToken = data)

io.on("connection", (socket) => {
    io.to(socket.id).emit('playlist', data)
    io.to(socket.id).emit('searchAuth', searchToken)

    socket.on('searchAuth', (arg) => {
        if (arg === 'refresh') {
            io.to(socket.id).emit('searchAuth', searchToken)
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

    socket.on('clear', (arg) => {
        if (arg === 'all') {
            data.playlist = []
        } else {
            for(let i = 0; i < arg; i++)
                data.playlist.splice(data.playlist.length-1)
        }
        io.emit('playlist', data)
    });

    socket.on('refresh', () => {
        console.log(socket.id, ' demanded a refresh')
        io.to(socket.id).emit('playlist', data)
    });

	socket.on('song', (arg) => {
		let song = arg
		data.playlist.push(song)
		io.emit('playlist', data)
	});
	
	console.log('Users: ', socket.rooms)
    console.log(searchToken)
	
});
httpServer.listen(port, () => console.log('Live on port: ', port))
