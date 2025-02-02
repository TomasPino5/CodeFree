function getRandomObjects(value) {
    let filterValue = value.filter(element => element.category == 'Javascript' || element.category == 'Node.js' || element.category == 'React' || element.category == 'Express' || element.category == 'Next.js' || element.category == 'Vue.js')
    for (let i = filterValue.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [filterValue[i], filterValue[randomIndex]] = [filterValue[randomIndex], filterValue[i]];
    }
    return filterValue
}

function renderedCards(value, index) {
    document.getElementById('videoCardsContainer').innerHTML = '';

    let slicedValue;
    if (index == 1) {
        slicedValue = value.slice(0, 25);
    } else if (index == 2) {
        slicedValue = value.slice(25, 50); 
    } else {
        slicedValue = value.slice(0, 25);
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

function renderByLanguage(value, language) {
    document.getElementById('videoCardsContainer').innerHTML = ''
    value.forEach(element => {
        if (element.language == language) {
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
        }
    });
}

let loadCourses = () => {
    fetch('../data/videos.json')
    .then(response => response.json())
    .then(value => {

        let responseVideos = getRandomObjects(value);
    
        let languages = document.querySelectorAll(".language");

        let activeLanguage = null;
        let activeSort = null;

        let updateLanguageFilter = (language) => {
            if (activeLanguage == language) {
                activeLanguage = null;
                document.getElementById(language).classList.remove('btnActive');
                document.getElementById(language).textContent = language
                document.getElementById('nav-pagination').classList.remove('disabled0');
            } else {
                if (activeLanguage) {
                    document.getElementById(activeLanguage).textContent = activeLanguage
                }
                languages.forEach(lang => lang.classList.remove('btnActive'));
                activeLanguage = language;
                document.getElementById(language).classList.add('btnActive');
                document.getElementById(language).innerHTML = `${language} <i class="fa-solid fa-xmark"></i>`
            }
        };

        const applyFilters = () => {
            let filteredVideos = responseVideos;

            if (activeLanguage) {
                filteredVideos = filteredVideos.filter(video => video.language == activeLanguage);
                document.getElementById('nav-pagination').classList.add('disabled0');
                actualIndex = 1
                handlePagination(actualIndex)
                updateActive(actualIndex);
                btnController()
            }

            if (activeSort == 'views') {
                filteredVideos = filteredVideos.sort((a, b) => b.views - a.views);
                actualIndex = 1
                handlePagination(actualIndex)
                updateActive(actualIndex);
                btnController()
            } else if (activeSort == 'duration') {
                filteredVideos = filteredVideos.sort((a, b) => b.duration - a.duration);
                actualIndex = 1
                handlePagination(actualIndex)
                updateActive(actualIndex);
                btnController()
            }

            if (activeSort == null && activeLanguage == null) {
                filteredVideos = getRandomObjects(value);
                actualIndex = 1
                handlePagination(actualIndex)
                updateActive(actualIndex);
                btnController()
            } else if (activeSort == null && activeLanguage) {
                filteredVideos = getRandomObjects(filteredVideos);
            }

            renderedCards(filteredVideos, 1);
        };

        languages.forEach(language => {
            language.addEventListener("click", () => {
                updateLanguageFilter(language.id);
                applyFilters();
            });
        });

        document.getElementById('views').addEventListener('click', () => {
            if (activeSort == 'views') {
                activeSort = null;
                document.getElementById('views').classList.remove('btnActive');
                document.getElementById('views').innerHTML = 'Visualizaciones'
            } else {
                document.getElementById('duration').classList.remove('btnActive');
                document.getElementById('views').classList.add('btnActive');
                activeSort = 'views';
                document.getElementById('views').innerHTML = 'Visualizaciones <i class="fa-solid fa-xmark"></i>'
                document.getElementById('duration').innerHTML = 'Duracion'
            }
            applyFilters();
        });

        document.getElementById('duration').addEventListener('click', () => {
            if (activeSort == 'duration') {
                activeSort = null;
                document.getElementById('duration').classList.remove('btnActive');
                document.getElementById('duration').innerHTML = 'Duracion'
            } else {
                document.getElementById('views').classList.remove('btnActive');
                document.getElementById('duration').classList.add('btnActive');
                activeSort = 'duration';
                document.getElementById('duration').innerHTML = 'Duracion <i class="fa-solid fa-xmark"></i>'
                document.getElementById('views').innerHTML = 'Visualizaciones'
            }
            applyFilters();
        });
 
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
                if(idx > 0 && idx < 3) {
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
                
            if (actualIndex == 2) {
                    document.getElementById('finish').classList.add('disabled');
            } else {
                document.getElementById('finish').classList.remove('disabled');
            }
        }
        
        let handlePagination = (actualIndex) => {
            switch (actualIndex) {
                case 1: 
                renderedCards(responseVideos, 1)
                break;
                case 2: 
                renderedCards(responseVideos, 2)
                break;
                default: console.log("Lo siento, ocurrio un error al reenderizar los videos")
            } 
        }
        
        handlePagination(actualIndex)
    })
}
loadCourses()