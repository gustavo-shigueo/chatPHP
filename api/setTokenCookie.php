<?php
  function setTokenCookie($token) {
    setcookie('at', $token, time() + 60 * 60 * 24 * 7, "/", "", false, true);
  }