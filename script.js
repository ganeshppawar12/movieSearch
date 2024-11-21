
const imageContainer = document.getElementById('imageContainer');

function loadImages() {
  for (let i = 0; i < 10; i++) {
    const img = document.createElement('img');
    
    img.src = `https://picsum.photos/300/200?random=${Math.random()}`;
    img.alt = 'Random Image';
    imageContainer.appendChild(img);
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadImages();
  }
}


loadImages();


window.addEventListener('scroll', handleScroll);
