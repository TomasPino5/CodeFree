window.addEventListener("load", function () {
    let loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
});

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
        <a class="cardVideos" style="text-decoration: none" href="${element.link}" target="_blank">
            <img src="${element.thumbnail}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text first traducible">${element.language}</p>
                <p class="card-text">${element.channel}</p>
                <p class="card-text traducible">${element.views}M Vistas - ${element.duration}${element.duration > 1 ? ' Horas' : ' Hora'}</p>
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
                    let titleMatch = video.title.trim().toLowerCase().includes(queryParam);
                    let channelMatch = video.channel.trim().toLowerCase().includes(queryParam);
                    return titleMatch || channelMatch;
                });
            
                if (filteredVideos.length > 0) {
                    localStorage.getItem("language") == 'es' ? document.getElementById('resultQuery').innerHTML = ` "${urlParams.get('query')}"` : document.getElementById('resultQuery').innerHTML = ` "${urlParams.get('query')}"`;
                    renderedCards(filteredVideos);
                } else {
                    localStorage.getItem("language") == 'es' ? document.getElementById('spanSearch').innerHTML = 'Lo sentimos, no se ha encontrado ningún video' : document.getElementById('spanSearch').innerHTML = 'Sorry, no video found.'
                }
            }

            document.getElementById('inputSearch').value = queryParam;

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

let translate = () => {
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(async () => {
            if (localStorage.getItem("language") == "en") {
                document.getElementById("language").src = "../../img/english.png";
                let elements = document.querySelectorAll(".traducible");
                let texts = Array.from(elements).map(el => el.innerText);
                
                let translatedTexts = await Promise.all(
                    texts.map(text => translateText(text, 'en'))
                );
                
                elements.forEach((el, index) => {
                    el.innerText = translatedTexts[index];
                });
            
                document.getElementById('inputSearch').placeholder = 'Search for a video...';
    
                localStorage.setItem("language", "en");
                isTranslated = true;
            }
        }, 500);
    });

    let customDictionary = {
        "Ingles": "English",
        "Español": "Spanish",
        "Frances": "French",
        "Portugues": "Portuguese",
        "Aleman": "German",
        "Indonesio": "Indonesian",
        "Hindi": "Hindi",
        "Tamil": "Tamil",
        "Videos populares": "Popular videos",
        "Aprende todas estas tecnologias y muchas mas!": "Learn all these technologies and more!",
        "Vistas": "Views",
        "Horas": "Hours",
        "Hora": "Hour",
        "Anterior": "Previous",
        "Siguiente": "Next",
        "Buscar": "Search",
        "Categorias": "Categories",
        "© CodeFree. Todos los derechos reservados.": "© CodeFree. All rights reserved.",
        "Otros lenguajes": "Other languages",
        "Visualizaciones": "Visualizations",
        "Duracion": "Duration",
        "Idioma": "Language",
        "Resultados encontrados para": "Results found for",
        "Lo sentimos, no se ha encontrado ningún video": "Sorry, no video found"
    };
    
    let invertedDictionary = Object.fromEntries(
        Object.entries(customDictionary).map(([key, value]) => [value, key])
    );
    
    async function translateText(text, lang) {
        if (lang == 'en') {
            if (customDictionary[text]) {
                return customDictionary[text];
            }
            let translatedText = text.split(" ").map(word => {
                return customDictionary[word] || word;
            }).join(" ");
            return translatedText;
        } else {
            if (invertedDictionary[text]) {
                return invertedDictionary[text];
            }
            let translatedText = text.split(" ").map(word => {
                return invertedDictionary[word] || word;
            }).join(" ");
            return translatedText;
        }
    }
    
    let isTranslated = localStorage.getItem("language") == "en";

    let count = 0;
    
    document.getElementById("translateBtn").addEventListener("click", async () => {
        if (!isTranslated) {
            document.getElementById("language").src = "../../img/english.png"
            let elements = document.querySelectorAll(".traducible");
            let texts = Array.from(elements).map(el => el.innerText);
            
            let translatedTexts = await Promise.all(
                texts.map(text => translateText(text, 'en'))
            );
            
            elements.forEach((el, index) => {
                el.innerText = translatedTexts[index];
            });
        
            document.getElementById('inputSearch').placeholder = 'Search for a video...'

            localStorage.setItem("language", "en");
            isTranslated = true
        } else {
            document.getElementById("language").src = "../../img/es.png"     
            let elements = document.querySelectorAll(".traducible");
            let texts = Array.from(elements).map(el => el.innerText);
            
            let translatedTexts = await Promise.all(
                texts.map(text => translateText(text, 'es'))
            );
            
            elements.forEach((el, index) => {
                el.innerText = translatedTexts[index];
            });
    
            document.getElementById('inputSearch').placeholder = 'Busca un video...'

            localStorage.setItem("language", "es");
            isTranslated = false
        }
        if (count == 0) {
            let loader = document.getElementById("loader");
            loader.style.display = "flex";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        }
        count++;
    });
}
translate()