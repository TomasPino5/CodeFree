function getRandomObjects(value) {
    for (let i = value.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [value[i], value[randomIndex]] = [value[randomIndex], value[i]];
    }
    return value
}

function renderedCards(value, index) {
    document.getElementById('videoCardsContainer').innerHTML = '';

    let slicedValue;
    if (index == 1) {
        slicedValue = value.slice(0, 25);
    } else if (index == 2) {
        slicedValue = value.slice(25, 50); 
    } else if (index == 3) {
        slicedValue = value.slice(50, 75); 
    } else if (index == 4) {
        slicedValue = value.slice(75, 100); 
    } else if (index == 5) {
        slicedValue = value.slice(100, 125); 
    } else if (index == 100) {
        slicedValue = value.slice(0, 125); 
    }

    slicedValue.forEach(element => {
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
            </a>`;
    });
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

        //search
        //crear una nueva ruta para el search, en caso de que el input este vacio que vuelva a la ruta inicio
       // document.getElementById('searchForm').addEventListener('submit', (event) => {
          //  event.preventDefault()

           // let searchTerm = document.getElementById('inputSearch').value.trim().toLowerCase();
                
          //  let filteredVideos = responseVideos.filter((video) => {
          //      if (video.title) {
           //         return video.title.trim().toLowerCase().includes(searchTerm);
           //     }
            //        return false
           // });
           // document.getElementById('nav-pagination').classList.add('disabled0');
    //
           // if (filteredVideos.length > 0) {        
           //     renderedCards(filteredVideos, 100)
           // } else {
            //    document.getElementById('videoCardsContainer').innerHTML = '<h1>Lo sentimos, no se ha encontrado ningun video</h1>'
           // }
        //});

        document.getElementById('searchForm').addEventListener('submit', (event) => {
            event.preventDefault();
        
            let searchTerm = document.getElementById('inputSearch').value.trim();
        
            if (searchTerm) {
                window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
            }
        });
        
        
        let handlePagination = (actualIndex) => {
            switch (actualIndex) {
                case 1: 
                renderedCards(responseVideos, 1)
                    break;
                case 2: 
                renderedCards(responseVideos, 2)
                    break;
                case 3: 
                renderedCards(responseVideos, 3)
                    break;
                case 4: 
                renderedCards(responseVideos, 4)
                    break;
                case 5: 
                renderedCards(responseVideos, 5)
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