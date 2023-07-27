function displayFileName() {
  const fileInput = document.getElementById('file-input');
  const fileName = document.getElementById('file-name');

  if (fileInput.files.length > 0) {
    fileName.textContent = fileInput.files[0].name;
  } else {
    fileName.textContent = '';
  }
}
function hidePopup() {
  const popupOverlay = document.querySelector('.popup');
  popupOverlay.style.top = '-130px';
  
}

document.addEventListener('DOMContentLoaded', function () {
  const messagePopup = document.querySelector('.popup');

  // Show the popup when the page loads
  // Delayed execution of the function by 2 seconds
  setTimeout(() => {
    if (document.querySelector('.popup')) {
      document.querySelector('.popup').style.top = '50px';
    }
  }, 500); 

  // Set the timeout duration in milliseconds (e.g., 5000ms for 5 seconds)
  const timeoutDuration = 3000;

  // Hide the popup after the specified timeout duration
  setTimeout(hidePopup, timeoutDuration);
});

function isPasswordValid(password) {
  const minLength = 8;
  const maxLength = 20;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const digitRegex = /\d/;

  if (password.length < minLength || password.length > maxLength) {
    return 'Password must be 8 characters or more';
  }

  if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password)) {
    return 'Password must contain both uppercase and lowercase letters';
  }

  if (!digitRegex.test(password)) {
    return 'Password must contain at least one numeric digit';
  }


  return 'Password is valid';
}

function buttonDown(inputField) {
  const validationMessage = isPasswordValid(inputField.value);
  document.getElementById('pass').textContent = validationMessage;

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmpassword').value;

  if (validationMessage === 'Password is valid') {
    document.getElementById('pass').style.color = 'green';}
    else{
      document.getElementById('pass').style.color = 'red';
    }

  if (password !== confirmPassword) {
    document.getElementById('pass1').textContent = 'Password does not match';
    document.getElementById('btn').disabled = true;
  } else {
    document.getElementById('pass1').textContent = '';

    if (validationMessage === 'Password is valid') {
      document.getElementById('pass').style.color = 'green';
      document.getElementById('btn').disabled = false;
    } else {
      document.getElementById('pass').style.color = 'red';
      document.getElementById('btn').disabled = true;
    }
  }
}


