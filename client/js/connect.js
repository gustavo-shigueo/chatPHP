const host = window.location.host.replace(/^(\d{4})/, '3000')
const contactsContainer = document.querySelector('.contacts-container')
const messagesContainer = document.querySelector('.messages-container')
const search = document.querySelector('#search')
const logoutBtn = document.querySelector('#logout')
const sendBtn = document.querySelector('#send')
const msgText = document.querySelector('#message-text')
let userId

const checkLogin = async () => {
	const URL = `https://${host}/checkLogin.php`
	const res = await fetch(URL, { credentials: 'include' })
	return res.json()
}

const getUsers = async id => {
	const URL = `https://${window.location.host.replace(
		/^(\d{4})/,
		'3000'
	)}/listUsers.php`
	const body = new FormData()
	body.append('id', id)
	const res = await fetch(URL, { method: 'POST', body })
	return res.json()
}

const createContactElem = user => {
	const contact = document.createElement('a')
	const contactImg = document.createElement('div')
	const contactInfo = document.createElement('div')
	const online = document.createElement('div')

	const name = document.createElement('h2')
	const message = document.createElement('p')

	contact.dataset.id = user.user_id

	contact.classList.add('contact')
	contactImg.classList.add('contact-img')
	contactInfo.classList.add('contact-info')
	online.classList.add('contact-status')

	name.innerText = user.name
	message.innerHTML = user.lastMsg ?? 'No messages'
	contactImg.style = `--url: url('https://${host}/${
		user.imagePath ?? 'foto.jpg'
	}')`
	if (parseInt(user.online_status)) online.classList.add('active')

	contactInfo.appendChild(name)
	contactInfo.appendChild(message)
	contactInfo.appendChild(online)

	contact.appendChild(contactImg)
	contact.appendChild(contactInfo)

	contactsContainer.appendChild(contact)

	contact.setAttribute('href', `./chat.html?receiver_id=${user.user_id}`)
}

const hideContact = contact => {
	const name = contact.querySelector('h2').innerText.toLocaleLowerCase()
	if (!name.includes(search.value.toLocaleLowerCase())) {
		return (contact.style.display = 'none')
	}
	contact.style.display = 'flex'
}

const handleSearch = () => {
	const contacts = contactsContainer.querySelectorAll('.contact')
	contacts.forEach(hideContact)
}

const getMessages = async (id, receiver_id) => {
	const body = new FormData()
	body.append('id', id)
	body.append('receiver_id', receiver_id)
	const response = await fetch(`https://${host}/getMessages.php`, {
		method: 'POST',
		body,
	})
	return response.json()
}

const showMessage = msg => {
	const message = document.createElement('div')
	const time = document.createElement('span')

	message.classList.add('message')
	message.classList.toggle('sent', msg.sender_id === userId)
	message.innerText = msg.text

	time.classList.add('timestamp')
	time.innerText = new Date(msg.timeSent).toLocaleString().slice(0, -3)

	message.appendChild(time)

	messagesContainer.appendChild(message)
}

const main = async () => {
	const checkResult = await checkLogin()
	userId = checkResult.id
	if (checkResult.error) return (location.href = '/login.html')
	if (search) {
		const users = await getUsers(checkResult.id)
		console.log(users)
		users.forEach(createContactElem)
		search.addEventListener('input', handleSearch)
	}
	if (messagesContainer) {
		if (!location.search.match(/^\?receiver_id=\d{1,}$/)) {
			return (location.href = '/')
		}
		const receiver_id = parseInt(location.search.split('=')[1])
		const { receiver, messages } = await getMessages(userId, receiver_id)
		document.querySelector('.contact-info h1').innerText = receiver.name
		document.querySelector('.contact-info p').innerText = receiver.online_status
			? 'Online now'
			: 'Offline'
		document.querySelector(
			'.contact-img'
		).style = `--url: url('https://${host}/${
			receiver.imagePath ?? 'foto.jpg'
		}')`
		if (messages.length > 0) messages.forEach(showMessage)
		messagesContainer.scrollTop = messagesContainer.scrollHeight
	}
}

main()
