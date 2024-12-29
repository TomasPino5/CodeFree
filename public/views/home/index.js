let loadCourses = () => {
    fetch('../data/videos.json')
    .then(response => response.json())
    .then(value => {
        let limitedVideos = value.slice(0, 25);
        limitedVideos.forEach(element => {
            document.getElementById('videoCardsContainer').innerHTML += `
                <a class="cardVideos" style="width: 10rem; text-decoration: none" href="${element.link}" target="_blank">
                    <img src="${element.thumbnail}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text first">${element.language}</p>
                        <p class="card-text">${element.channel}</p>
                        <p class="card-text">${element.views}M Vistas - ${element.duration}${element.duration > 1 ? ' Horas' : ' Hora'}</p>
                        <img class="img-language" src="${element.languageIcon}" />
                        ${element.category == "HTML/CSS" ? '<img class="img-language" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" />' : ''}
                    </div>
                </a>`
        });
    })
}
loadCourses()


let carrousel = () => {
    let imgOne = document.getElementById('img1')
    let imgTwo = document.getElementById('img2')
    let imgThree = document.getElementById('img3')
    let images = [imgOne, imgTwo, imgThree]
    
    let index = 0;

    images[0].classList.add('active');

    setInterval(() => {
        images.forEach(image => image.classList.remove('active'));
        images[index].classList.add('active');
        index = (index + 1) % images.length;
    }, 8000)

    let leftButton = document.getElementById('btnPrevious')
    let rightButton = document.getElementById('btnNext')

    leftButton.addEventListener('click', () => {
        index = (index - 1 + images.length) % images.length;
        images.forEach(image => image.classList.remove('active'));
        images[index].classList.add('active');
    })

    rightButton.addEventListener('click', () => {
        index = (index + 1) % images.length;
        images.forEach(image => image.classList.remove('active'));
        images[index].classList.add('active');
    })
}
carrousel()