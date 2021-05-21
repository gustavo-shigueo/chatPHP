const host = window.location.host.replace(/^(\d{4})/, '3000')
const inputGroups = document.querySelectorAll('.input-group')
const emailInput = document.querySelector('#email')
const form = document.querySelector('form')
const eyeBtns = document.querySelectorAll('i.fas.fa-eye, i.fas.fa-eye-slash')

// ? Helper functions and callbacks

const handleEyeBtn = e => {
	const eye = e.target
	const input = eye.parentElement.querySelector('input')
	eye.classList.toggle('fa-eye')
	eye.classList.toggle('fa-eye-slash')

	const currentType = input.getAttribute('type')
	const typeToSet = currentType === 'password' ? 'text' : 'password'

	input.setAttribute('type', typeToSet)
}

const addEyeBtnHandler = eye => eye.addEventListener('click', handleEyeBtn)

const validateEmail = () => {
	const inputGroup = emailInput.parentElement
	const regex =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (emailInput.value && !emailInput.value.match(regex)) {
		inputGroup.classList.add('invalid')
		inputGroup.querySelector('small').innerText = 'E-mail must be valid'
	} else if (emailInput.value.trim() !== '') {
		inputGroup.classList.remove('invalid')
	}
}

const checkForShortInput = input => {
	const ig = input.id.includes('password')
		? input.parentElement.parentElement
		: input.parentElement

	if (input.value.trim().length < 6) {
		const msg = input.value.trim()
			? 'This field must be at least 6 characters long'
			: 'This is field required'
		ig.classList.add('invalid')
		ig.querySelector('small').innerText = msg
	} else if (input.id !== 'email' && !input.id.includes('password')) {
		ig.classList.remove('invalid')
	} else if (input.id === 'email') {
		ig.classList.remove('invalid')
		validateEmail()
	} else {
		ig.classList.remove('invalid')
		checkPasswords()
	}
}

const passwordsAreEqual = () => {
	const password = document.querySelector('#password').value
	const confirmPassword = document.querySelector('#confirm_password').value
	return password === confirmPassword && password.trim() !== ''
}

const checkPasswords = () => {
	const password = document.querySelector('#password')
	const confirmPassword = document.querySelector('#confirm_password')
	const passIg = password.parentElement.parentElement

	if (!confirmPassword) return

	const confPassIg = confirmPassword.parentElement.parentElement

	if (!password.value || !confirmPassword.value) return

	if (passwordsAreEqual()) {
		passIg.classList.remove('invalid')
		confPassIg.classList.remove('invalid')
		return
	}

	passIg.classList.add('invalid')
	passIg.querySelector('small').innerText = 'Passwords must match'

	confPassIg.classList.add('invalid')
	confPassIg.querySelector('small').innerText = 'Passwords must match'
}

const validateInputGroup = ig => {
	const input = ig.querySelector('input')

	input.addEventListener('input', () => checkForShortInput(input))

	if (input.id === 'password' || input.id === 'confirm_password') {
		input.addEventListener('input', () => checkPasswords())
	}
}

const submitForm = async e => {
	e.preventDefault()

	let validForm = true

	inputGroups.forEach(ig => {
		const input = ig.querySelector('input')
		checkForShortInput(input)
	})

	checkPasswords()
	validateEmail()

	inputGroups.forEach(ig => {
		if (ig.classList.contains('invalid')) validForm = false
	})

	if (!validForm) return

	const values = new FormData()
	const register = {}
	const inputs = form.querySelectorAll('input')

	inputs.forEach(i => {
		values.append(i.getAttribute('name'), i.value)
		if (form.getAttribute('action') === 'register' && !i.name.match(/password|email/)) {
			register[i.getAttribute('name')] = i.value
		}
	})

	const URL = `https://${host}/${form.getAttribute('action')}.php`

	const res = await fetch(URL, {
		credentials: 'include',
		body: values,
		method: 'POST',
	})
	const data = form.getAttribute('action') === 'register' ? await res.json() : {}

	const errorElem = document.querySelector('.error-msg')
	if (errorElem && res.status >= 400) {
		errorElem.innerText = data.error ?? 'Invalid credentials'
		return errorElem.classList.add('active')
	}

	if (form.getAttribute('action') === 'register') {
		conn.send(JSON.stringify({action: 'register', id: parseInt(data.id), ...register}))
	}

	location.href = form.getAttribute('action') === 'login' ? '/' : '/login.html'
}

// ? EventListeners and function calls

inputGroups.forEach(validateInputGroup)
emailInput.addEventListener('input', validateEmail)
eyeBtns.forEach(addEyeBtnHandler)

form.addEventListener('submit', submitForm)
