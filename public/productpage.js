var objects = [

    {
      picture:'pictures/headphone.jpg',
    price:'₦15,000', name:'Headphones',
    rating:"4.0", availableColors:['black'],
    description:"The Basic tee is an honest new take on a classic. The tee uses super soft, pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally, with a special dye technique that gives each tee it's own look.<br><br>  Looking to stock your closet? The Basic tee also co mes in a 3-pack or 5-pack at a bundle discount.",
    reviews:[{name:'Jackie H', rating:'3.2', date:'April 6, 2021' , header:"Can't say enough good things", text:"After a quick chat with customer support, I had a good feeling about this shirt and ordered three of them. Less than 48 hours later, my delivery arrived. I haven't worn anything else since that day! These shirts are so comfortable, yet look classy enough that I can wear them at work or even some formal events. Winning!"}]
    },
  
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
  

  
  
  
  const divItems = document.getElementsByClassName('size-brick');
  function clear(){
      for(var i=0; i < divItems.length; i++) {
          var item = divItems[i];
          item.style.backgroundColor = 'white';
          item.style.color = 'rgb(105, 105, 105)'
          
      }
  }
  function handleprofile(item){
      this.clear();
      item.style.color = 'white'
      item.style.backgroundColor = '#4F46E5';
      
      let size = item.innerHTML;
      document.getElementById('textform').value = size;
      console.log(document.getElementById('textform').value)
  }
  handleprofile(divItems[0]);
  
  
  
  
  const color  =  document.getElementsByClassName('color-cvr')
  
  function clear1(){
      for(var i=0; i < color.length; i++) {
          var item = color[i];
          item.style.border = '';
          
      }
  }
  
  
  function handleColor(item){
      let color = item.getElementsByClassName('color-cir')[0].style.backgroundColor;
      this.clear1();
      item.style.border = `2px solid ${color}`;
      document.getElementById('colorform').value = color;
      console.log(color)
  }
  
  handleColor(color[0])
  
  
  // Get the rating value from your data or backend
  // Get the rating value from your data or backend
  function start(rating){ // Replace with your actual review score
  
  // Calculate the number of full stars and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  // Get all the star elements
  const stars = document.querySelectorAll('.star-rating .star');
  
  // Add "full" or "half" class to the appropriate number of stars
  for (let i = 0; i < stars.length; i++) {
    if (i < fullStars) {
      stars[i].innerHTML = `<img src="/pictures/star-solid.svg">`;
    } else if (hasHalfStar && i === fullStars) {
      stars[i].innerHTML = `<img src="/pictures/star-half-stroke-solid.svg" class='half'>`;
    } else {
      stars[i].classList.remove('full');
      stars[i].classList.remove('half');
      stars[i].innerHTML = `<img src="/pictures/star-regular.svg">`;;
    }
  }
  }
  
  start(5);
  
  