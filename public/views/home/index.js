function getRandomObjects(value) {
    for (let i = value.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [value[i], value[randomIndex]] = [value[randomIndex], value[i]];
    }
    return value
}

let loadCourses = () => {
    fetch('../data/videos.json')
    .then(response => response.json())
    .then(value => {
        let responseVideos = getRandomObjects(value)
 
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
                if(idx > 0 && idx < 6) {
                    updateActive(idx);
                    actualIndex = idx
                    btnController()
                    handlePagination(actualIndex)
                }
            });
        });
            
        previous.addEventListener("click", () => {
            if (index > 2) {
                updateActive(index - 1)
                actualIndex--
                btnController()
                handlePagination(actualIndex)
            } else if(index == 2) {
            updateActive(index - 1)
                actualIndex--
                btnController()
                handlePagination(actualIndex)
            }
        })
            
        next.addEventListener("click", () => {
            if (index < pageLinks.length - 3) {
                updateActive(index + 1);
                actualIndex++
                btnController()
                handlePagination(actualIndex)
            } else if(index == pageLinks.length - 3) {
                updateActive(index + 1);
                actualIndex++
                btnController()
                handlePagination(actualIndex)
            }
        });
            
        let btnController = () => {
            if (actualIndex == 1) {
                document.getElementById('start').classList.add('disabled');
            } else {
                document.getElementById('start').classList.remove('disabled');
            }
                
            if (actualIndex == 5) {
                    document.getElementById('finish').classList.add('disabled');
            } else {
                document.getElementById('finish').classList.remove('disabled');
            }
        }

        let renderVideos = (videos) => {
            videos.forEach(element => {
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
        }
        
        let handlePagination = (actualIndex) => {
            switch (actualIndex) {
                case 1: 
                document.getElementById('videoCardsContainer').innerHTML = ''
                renderVideos(responseVideos.slice(0, 25))
                    break;
                case 2: 
                document.getElementById('videoCardsContainer').innerHTML = ''
                renderVideos(responseVideos.slice(25, 50))
                    break;
                case 3: 
                document.getElementById('videoCardsContainer').innerHTML = ''
                renderVideos(responseVideos.slice(50, 75))
                    break;
                case 4: 
                document.getElementById('videoCardsContainer').innerHTML = ''
                renderVideos(responseVideos.slice(75, 100))
                    break;
                case 5: 
                document.getElementById('videoCardsContainer').innerHTML = ''
                renderVideos(responseVideos.slice(100, 126))
                    break;
                default: console.log("Lo siento, ocurrio un error al reenderizar los videos")
            } 
        }

        handlePagination(actualIndex)
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