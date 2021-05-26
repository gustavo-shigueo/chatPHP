const httpServer = require('http').createServer()
const fetch = require('node-fetch')
const io = require('socket.io')(httpServer, {
	cors: {
		origin: 'https://8081-jade-porpoise-eyatc8sy.ws-us07.gitpod.io',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', socket => {
	// handle the event sent with socket.emit()
	socket.on('login', ({ id }) => {
		if (id == null || id === 0) return
		socket.join(id)
		socket.broadcast.emit('login', { id })
	})

	socket.on('logout', async ({ id, url }) => {
		const body = { status: false, id }
		socket.broadcast.emit('logout', { id })
		try {
			await fetch(url, { method: 'POST', body })
		} catch (error) {
			console.log(error)
		}
	})

	socket.on('register', data => socket.broadcast.emit('reegister', data))

	socket.on('msg', data => socket.to(data.receiverId).emit('msg', data))

	socket.onAny(console.log)
})

httpServer.listen(8080)