const wshost = window.location.host.replace(/^(\d{4})/, '8080')

const conn = new WebSocket(`wss://${wshost}`)

const sendEvent = e => {
	conn.send(JSON.stringify(e))
}

const logoutEvent = () => {
	sendEvent({
		id: userId,
		action: 'logout',
		url: `https://${host}/setOnlineStatus.php`,
	})
}

conn.addEventListener('open', async () => {
	const body = new FormData()
	body.append('id', userId)
	body.append('status', 1)
	await fetch(`https://${host}/setOnlineStatus.php`, {
		method: 'POST',
		body,
	})
	conn.send(JSON.stringify({ id: userId, action: 'login' }))
})

conn.addEventListener('message', e => {
	const data = JSON.parse(e.data)

	if (['login', 'logout'].includes(data.action)) {
		const userElem = document.querySelector(`[data-id="${data.id}"]`)
		userElem
			.querySelector('.contact-status')
			.classList.toggle('active', data.action === 'login')
	}
})

if (logoutBtn) {
	logoutBtn.addEventListener('click', () => {
		fetch(`https://${host}/logout.php`, {
			credentials: 'include',
			method: 'POST',
		}).then(() => {
			logoutEvent()
			conn.close()
		})
		location.href = '/login.html'
	})
}

window.addEventListener('beforeunload', async () => {
	logoutEvent()
	return ','
})
