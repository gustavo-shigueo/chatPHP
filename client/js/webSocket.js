const wshost = window.location.host.replace(/^(\d{4})/, '8080')

const conn = new WebSocket(`wss://${wshost}`)

const sendEvent = e => {
	conn.send(JSON.stringify(e))
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
		
		sendEvent({
			id: userId ?? 0,
			receiverId,
			text,
			action: 'message'
		})
	
		showMessage({ text: msgText.value, timeSent: new Date(), sender_id: userId })
		messagesContainer.scrollTop = messagesContainer.scrollHeight
		msgText.value = ''
	} catch (error) {}
}

const logoutEvent = () => {
	sendEvent({
		id: userId ?? 0,
		action: 'logout',
		url: `https://${host}/setOnlineStatus.php`,
	})
}

if (location.pathname !== '/register.html') {
	conn.addEventListener('open', async () => {
		const body = new FormData()
		body.append('id', userId)
		body.append('status', 1)
		await fetch(`https://${host}/setOnlineStatus.php`, {
			credentials: 'include',
			method: 'POST',
			body,
		})
		conn.send(JSON.stringify({ id: userId, action: 'login' }))
	})
}

conn.addEventListener('message', e => {
	const data = JSON.parse(e.data)
	console.log(data)

	if (['login', 'logout'].includes(data.action)) {
		if (document.querySelector('#logout')) {
			const userElem = document.querySelector(`[data-id="${data.id}"]`)
			userElem
				.querySelector('.contact-status')
				.classList.toggle('active', data.action === 'login')
			return
		}

		if (parseInt(location.search.split('=')[1]) !== parseInt(data.id)) return

		const onlineStatusElem = document.querySelector('.contact-info p')
		onlineStatusElem.innerText = data.action === 'login'
			? 'Online now'
			: 'Offline'
	}

	if (data.action === 'register' && document.querySelector('#logout')) {
		createContactElem(data)
	}

	if (data.action === 'message' && userId === data.receiverId) {
		if (document.querySelector('#message-text')) {
			showMessage({ ...data, timeSent: new Date() })
			messagesContainer.scrollTop = messagesContainer.scrollHeight
			return
		}

		document.querySelector(`[data-id="${data.id}"] p`).innerText = data.text
	}
})

if (document.querySelector('#logout')) {
	logoutBtn.addEventListener('click', () => {
		fetch(`https://${host}/logout.php`, {
			credentials: 'include',
			method: 'POST',
		}).then(() => {
			logoutEvent()
			conn.close()
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
