function getRandomObjects(value, count) {
    for (let i = value.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [value[i], value[randomIndex]] = [value[randomIndex], value[i]];
    }
    return value.slice(0, count);
}

let loadCourses = () => {
    fetch('../data/videos.json')
    .then(response => response.json())
    .then(value => {
        let responseVideos = getRandomObjects(value, 20)
        responseVideos.forEach(element => {
            document.getElementById('videoCardsContainer').innerHTML += `
                <a class="cardVideos" style="width: 10rem; text-decoration: none" href="${element.link}" target="_blank">
                    <img src="${element.thumbnail}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text first">${element.language}</p>
                        <p class="card-text">${element.channel}</p>
                        <p class="card-text">${element.views}M Vistas - ${element.duration}${element.duration > 1 ? ' Horas' : ' Hora'}</p>
                        ${element.languageIcon.map(icon => `<img class="img-language" src="${icon}" alt="">`).join(' ')}
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



let movingIndex = () => {
    let pageLinks = document.querySelectorAll(".page-link")

    let previous = document.getElementById('previous')
    let next = document.getElementById('next')

    let index = 1
    let actualIndex = 1

    document.getElementById('start').classList.add('disabled')

    const updateActive = (newIndex) => {
        pageLinks[index].classList.remove("active");
        index = newIndex;
        pageLinks[index].classList.add("active");
    };

    updateActive(index);


    pageLinks.forEach((link, idx) => {
        link.addEventListener("click", () => {
            if(idx > 0 && idx < 7) {
                updateActive(idx);
                actualIndex = idx
                btnController()
            }
        });
    });

    previous.addEventListener("click", () => {
        if (index > 2) {
            updateActive(index - 1)
            actualIndex--
            btnController()
        } else if(index == 2) {
            updateActive(index - 1)
            actualIndex--
            btnController()
        }
    })

    next.addEventListener("click", () => {
        if (index < pageLinks.length - 3) {
            updateActive(index + 1);
            actualIndex++
            btnController()
        } else if(index == pageLinks.length - 3) {
            updateActive(index + 1);
            actualIndex++
            btnController()
        }
    });

    let btnController = () => {
        if (actualIndex == 1) {
            document.getElementById('start').classList.add('disabled');
        } else {
            document.getElementById('start').classList.remove('disabled');
        }
    
        if (actualIndex == 6) {
            document.getElementById('finish').classList.add('disabled');
        } else {
            document.getElementById('finish').classList.remove('disabled');
        }
    }
}
movingIndex()