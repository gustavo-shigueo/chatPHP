const host = window.location.host.replace(/^(\d{4})/, '3000')
const URL = `https://${host}/checkLogin.php`

// If you are serving the api locally with the root of this project on your
// htdocs or wamp64/www
// const URL = `http://localhost/chatTest/api/${form.getAttribute('action')}.php`
const sendReq = async () => {
  const response = await fetch(URL)
  console.log(await response.text())
}

sendReq()
