const httpServer = require("http").createServer();
const ipAdress = 'localhost:3000'
const io = require("socket.io")(httpServer,{
    cors: {
	    origin: "http://" + ipAdress,
	    methods: ["GET", "POST"]
	}	
});
const port = 3050;
const data = {
    playlist: [],
}

io.on("connection", (socket) => {
    io.to(socket.id).emit('playlist', data)

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
	
});
httpServer.listen(port, () => console.log('Live on port: ', port))
