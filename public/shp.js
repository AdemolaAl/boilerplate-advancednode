const elements = document.getElementsByClassName('name1');
const price = document.getElementsByClassName('price')

Array.from(elements).forEach(element => {
  const url = element.innerText;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      // Use the fetched data in your code
      element.innerText = data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

Array.from(price).forEach(price => {
  const url = price.innerText;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      // Use the fetched data in your code
      price.innerText = data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
