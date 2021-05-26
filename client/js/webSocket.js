const wshost = window.location.host.replace(/^(\d{4})/, '8080')

const socket = io(`wss://${wshost}`)

const sendEvent = (event, data) => {
	socket.emit(event, data)
}

const sendMessage = async () => {
	try {
		if (msgText.value.trim() === '') return

		const text = msgText.value
		const receiverId = parseInt(location.search.split('=')[1]) ?? 0
		const body = new FormData()

		body.append('id', userId)
		body.append('receiver_id', receiverId)
		body.append('text', text)

		await fetch(`https://${host}/addMessage.php`, {
			method: 'POST',
			body,
		})

		sendEvent('msg', {
			id: userId ?? 0,
			receiverId,
			text,
		})

		showMessage({
			text: msgText.value,
			timeSent: new Date(),
			sender_id: userId,
		})
		messagesContainer.scrollTop = messagesContainer.scrollHeight
		msgText.value = ''
	} catch (error) {}
}

const logoutEvent = () => {
	socket.emit('logout', {
		id: userId ?? 0,
		url: `https://${host}/setOnlineStatus.php`,
	})
}

const handleLoginAndLogout = (isLogin, { id }) => {
	console.log(id)
	if (document.querySelector('#logout') && id !== userId) {
		const userElem = document.querySelector(`[data-id="${id}"]`)
		const statusElem = userElem.querySelector('.contact-status')
		return statusElem.classList.toggle('active', isLogin)
	}

	if (parseInt(location.search.split('=')[1]) !== parseInt(id)) return
	const onlineStatusElem = document.querySelector('.contact-info p')

	onlineStatusElem.innerText = isLogin ? 'Online now' : 'Offline'
}

if (location.pathname !== '/register.html') {
	socket.on('connect', async () => {
		const body = new FormData()
		body.append('id', userId)
		body.append('status', 1)
		await fetch(`https://${host}/setOnlineStatus.php`, {
			credentials: 'include',
			method: 'POST',
			body,
		})
		socket.emit('login', { id: userId })
	})
}

socket.on('login', data => handleLoginAndLogout(true, data))

socket.on('logout', data => handleLoginAndLogout(false, data))

socket.on('register', data => {
	if (document.querySelector('#logout')) createContactElem(data)
})

socket.on('msg', data => {
	if (userId !== data.receiverId) return

	if (document.querySelector('#message-text')) {
		showMessage({ ...data, timeSent: new Date() })
		messagesContainer.scrollTop = messagesContainer.scrollHeight
		return
	}

	document.querySelector(`[data-id="${data.id}"] p`).innerText = data.text
})

if (document.querySelector('#logout')) {
	logoutBtn.addEventListener('click', () => {
		fetch(`https://${host}/logout.php`, {
			credentials: 'include',
			method: 'POST',
		}).then(() => {
			logoutEvent()
			socket.disconnect()
			location.href = '/login.html'
		})
	})

	window.addEventListener('beforeunload', async () => {
		logoutEvent()
		return ''
	})
}

if (document.querySelector('#message-text')) {
	messagesContainer.scrollTop = messagesContainer.scrollHeight
	sendBtn.addEventListener('click', sendMessage)
	window.addEventListener('keyup', e => {
		if (e.key === 'Enter') sendMessage()
	})
}

socket.onAny(console.log)
