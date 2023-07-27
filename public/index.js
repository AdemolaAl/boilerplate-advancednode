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