function getRandomObjects(value) {
    let filterValue = value.filter(element => element.category == 'HTML/CSS' || element.category == 'HTML' || element.category == 'CSS')
    for (let i = filterValue.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [filterValue[i], filterValue[randomIndex]] = [filterValue[randomIndex], filterValue[i]];
    }
    return filterValue
}

function renderedCards(value) {
    document.getElementById('videoCardsContainer').innerHTML = ''
    value.forEach(element => {
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
            }

            if (activeSort == 'views') {
                filteredVideos = filteredVideos.sort((a, b) => b.views - a.views);
            } else if (activeSort == 'duration') {
                filteredVideos = filteredVideos.sort((a, b) => b.duration - a.duration);
            }

            if (activeSort == null && activeLanguage == null) {
                filteredVideos = getRandomObjects(value);
            } else if (activeSort == null && activeLanguage) {
                filteredVideos = getRandomObjects(filteredVideos);
            }
            
            renderedCards(filteredVideos);
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

        renderedCards(responseVideos);
    });
};
loadCourses()