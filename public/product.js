




// Get the dropdown element
const dropdown = document.getElementById('myDropdown');

// Add event listener for change event
dropdown.addEventListener('change', function() {
  // Get the selected option
  const selectedOption = dropdown.options[dropdown.selectedIndex].value;

  // Perform desired actions with the selected option
  console.log('Selected option:', selectedOption);
});


var objects = [
    {picture:'pictures/headphone.jpg', price:'₦15,000', name:'Headphones'},
    {picture:'pictures/bag.jpg', price:'₦7,000', name:'School Bag'},
    {picture:'pictures/cosmetics.jpg' , price:'₦20,000', name:'Cosmetics'},
    {picture:'pictures/camera.jpg' , price:'₦700,000', name:'Camera'},
    {picture:'pictures/bottle.jpg' , price:'₦1,000', name:'Bottle'},
    {picture:'pictures/paper-bag.jpg' , price:'₦1,000', name:'Paper Bag'},
    {picture:'pictures/mp.jpg' , price:'₦8,000', name:'Music Player'},
    {picture:'pictures/shoe.jpg' , price:'₦20,000', name:'Nike'},
    {picture:'pictures/stool.jpg' , price:'₦10,000', name:'Chair'},
    {picture:'pictures/watches.jpg' , price:'₦10,000', name:'Watch'},
    {picture:'pictures/watches1.jpg' , price:'₦15,000', name:'Watches'},
    {picture:'pictures/alex-haigh-fEt6Wd4t4j0-unsplash.jpg' , price:'₦20,000', name:'Tee Shirt'},

]

