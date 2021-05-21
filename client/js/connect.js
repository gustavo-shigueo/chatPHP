const host = window.location.host.replace(/^(\d{4})/, '3000')
const contactsContainer = document.querySelector('.contacts-container')
const messagesContainer = document.querySelector('.messages-container')
const search = document.querySelector('#search')
const logoutBtn = document.querySelector('#logout')
let userId

const checkLogin = async () => {
	const URL = `https://${host}/checkLogin.php`
	const res = await fetch(URL, { credentials: 'include' })
	return res.json()
}

const getUsers = async id => {
	const URL = `https://${window.location.host.replace(/^(\d{4})/, '3000')}/listUsers.php`
	const body = new FormData()
	body.append('id', id)
	const res = await fetch(URL, { method: 'POST', body })
	return res.json()
}

const createContactElem = user => {
	const contact = document.createElement('div')
	const contactImg = document.createElement('div')
	const contactInfo = document.createElement('div')
	const online = document.createElement('div')

	const name = document.createElement('h2')
	const message = document.createElement('p')

	contact.dataset.id = user.id

	contact.classList.add('contact')
	contactImg.classList.add('contact-img')
	contactInfo.classList.add('contact-info')
	online.classList.add('contact-status')

	name.innerText = user.name
	message.innerHTML = user.message ?? 'No messages'
	contactImg.style = `--url: url('https://${host}/images/${
		user.image ?? 'foto.jpg'
	}')`
	if (parseInt(user.online_status)) online.classList.add('active')

	contactInfo.appendChild(name)
	contactInfo.appendChild(message)
	contactInfo.appendChild(online)

	contact.appendChild(contactImg)
	contact.appendChild(contactInfo)

	contactsContainer.appendChild(contact)
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

const main = async () => {
	const checkResult = await checkLogin()
	userId = checkResult.id
	if (checkResult.error) return (location.href = '/login.html')
	if (search) {
		const users = await getUsers(checkResult.id)
		users.forEach(createContactElem)
		search.addEventListener('input', handleSearch)
	}
	if (messagesContainer && location.search.match(/^\?receiver_id=\d{0,}$/)) {
		console.log('messages')

	}
}

main()
