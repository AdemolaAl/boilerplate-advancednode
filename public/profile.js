const btn = document.getElementsByClassName('div');
const profile = document.getElementsByClassName('second-display')

function clear() {
    for (var i = 0; i < btn.length; i++) {
        var item = btn[i];
        item.style.backgroundColor = '';

    }

    for (var i = 0; i < profile.length; i++) {
        var item = profile[i];
        item.style.display = 'none';

    }
}
 
function handleprofile(item) {
    this.clear();
    document.getElementById('profile').style.display = 'block';
    item.style.backgroundColor = 'rgb(224, 224, 224)';
    slideout()
}
function handlebilling(item) {
    this.clear();
    document.getElementById('billing').style.display = 'block';
    item.style.backgroundColor = 'rgb(224, 224, 224)';
    slideout()
}
function handleorder(item) {
    this.clear();
    document.getElementById('order').style.display = 'block';
    item.style.backgroundColor = 'rgb(224, 224, 224)';
    slideout()
}

handleprofile(document.getElementsByClassName('div')[0])


function hidePopup() {
    const popupOverlay = document.querySelector('.popup');
    popupOverlay.style.top = '-130px';
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const messagePopup = document.querySelector('.popup');
  
    // Show the popup when the page loads
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
  
  function displayFileName() {
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');

    if (fileInput.files.length > 0) {
      fileName.textContent = fileInput.files[0].name;
    } else {
      fileName.textContent = '';
    }
  }

  function slideout(){
    document.getElementsByClassName('slidein')[0].style.right  = '-100%';
    window.removeEventListener('scroll', slideout);
  }
  
  function slidein(){
    document.getElementsByClassName('slidein')[0].style.right  = '0';
  
    window.addEventListener('scroll', slideout);
  
  }
  