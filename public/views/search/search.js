function getRandomObjects(value) {
    for (let i = value.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [value[i], value[randomIndex]] = [value[randomIndex], value[i]];
    }
    return value
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

let loadCourses = () => {
    fetch('../data/videos.json')
        .then(response => response.json())
        .then(value => {

            let responseVideos = getRandomObjects(value);

            let urlParams = new URLSearchParams(window.location.search);
            let queryParam = urlParams.get('query') ? urlParams.get('query').trim().toLowerCase() : '';

            if (queryParam) {
                let filteredVideos = responseVideos.filter((video) => {
                    if (video.title) {
                        return video.title.trim().toLowerCase().includes(queryParam);
                    }
                    return false;
                });
            
                if (filteredVideos.length > 0) {
                    renderedCards(filteredVideos);
                } else {
                    document.getElementById('videoCardsContainer').innerHTML = '<h1>Lo sentimos, no se ha encontrado ningún video</h1>';
                }

                document.getElementById('inputSearch').value = queryParam;
            }

            document.getElementById('inputSearch').addEventListener('input', (event) => {
                let value = event.target.value
                if (!value) {
                    window.location.href = '/';
                }
            });

            document.getElementById('searchForm').addEventListener('submit', (event) => {
                event.preventDefault();
            
                let searchTerm = document.getElementById('inputSearch').value.trim();
            
                if (searchTerm) {
                    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
                }
            });
        });
};

loadCourses();