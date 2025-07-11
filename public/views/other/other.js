window.addEventListener("load", function () {
    let loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
});

function getRandomObjects(value) {
    let filterValue = value.filter(element => element.category == 'Bash/Shell' || element.category == 'C#' || element.category == 'ASP.NET CORE' || element.category == 'ASP.NET' || element.category == 'Amazon Web Services' || element.category == 'Docker')
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

    document.addEventListener("click", () => {
        setTimeout(async () => {
            if (localStorage.getItem("language") == "en") {
                let elements = document.querySelectorAll(".traducible");
                let texts = Array.from(elements).map(el => el.innerText);
                
                let translatedTexts = await Promise.all(
                    texts.map(text => translateText(text, 'en'))
                );
                
                elements.forEach((el, index) => {
                    el.innerText = translatedTexts[index];
                });
    
                localStorage.setItem("language", "en");
            }
        }, 15);
    });

    let customDictionary = {
        'Ingles': 'English',
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
        "Idioma": "Language"
    };
    
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
                    <p class="card-text first traducible">${element.language}</p>
                    <p class="card-text">${element.channel}</p>
                    <p class="card-text traducible">${element.views}M Vistas - ${element.duration}${element.duration > 1 ? ' Horas' : ' Hora'}</p>
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

        document.getElementById('searchForm').addEventListener('submit', (event) => {
            event.preventDefault();
        
            let searchTerm = document.getElementById('inputSearch').value.trim();
        
            if (searchTerm) {
                window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
            }
        });
    
        let languages = document.querySelectorAll(".language");
        let activeLanguage = null;
        let activeSort = null

        let translations = {
            "Ingles": { es: "Ingles", en: "English" },
            "Hindi": { es: "Hindi", en: "Hindi" },
            "Español": { es: "Español", en: "Spanish" },
            "Indonesio": { es: "Indonesio", en: "Indonesian" },
            "Portugues": { es: "Portugues", en: "Portuguese" },
            "Tamil": { es: "Tamil", en: "Tamil" },
            "Aleman": { es: "Aleman", en: "German" },
            "Frances": { es: "Frances", en: "French" },
        };
        
        let updateLanguageFilter = (language) => {
            let currentLanguage = localStorage.getItem("language")
            let button = document.querySelector(`[data-language='${language}']`);
            if (!button) return;
        
            if (activeLanguage == language) {
                activeLanguage = null;
                button.classList.remove('btnActive');
                button.textContent = translations[language][currentLanguage];
            } else {
                if (activeLanguage) {
                    let prevButton = document.querySelector(`[data-language='${activeLanguage}']`);
                    if (prevButton) prevButton.textContent = translations[activeLanguage][currentLanguage];
                }
                languages.forEach(lang => lang.classList.remove('btnActive'));
                activeLanguage = language;
                button.classList.add('btnActive');
                setTimeout(() => {
                    button.innerHTML = `${translations[language][currentLanguage]} <i class="fa-solid fa-xmark"></i>`;
                }, 20)
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
                updateLanguageFilter(language.dataset.language);
                applyFilters();
            });
        });

        document.getElementById('views').addEventListener('click', () => {
            if (activeSort == 'views') {
                activeSort = null;
                document.getElementById('views').classList.remove('btnActive'); 
                localStorage.getItem("language") == "en" ? document.getElementById('views').innerHTML = 'Visualizations' : document.getElementById('views').innerHTML = 'Visualizaciones'
            } else {
                document.getElementById('duration').classList.remove('btnActive');
                document.getElementById('views').classList.add('btnActive');
                activeSort = 'views';
                if (localStorage.getItem("language") == "en") {
                    document.getElementById('views').innerHTML = `Visualizations <i class="fa-solid fa-xmark"></i>`
                    document.getElementById('duration').innerHTML = `Duration`
                } else {
                    document.getElementById('views').innerHTML = `Visualizaciones <i class="fa-solid fa-xmark"></i>`
                    document.getElementById('duration').innerHTML = `Duracion`
                }
            }
            applyFilters();
        });

        document.getElementById('duration').addEventListener('click', () => {
            if (activeSort == 'duration') {
                activeSort = null;
                document.getElementById('duration').classList.remove('btnActive');
                localStorage.getItem("language") == "en" ? document.getElementById('duration').innerHTML = 'Duration' : document.getElementById('duration').innerHTML = 'Duracion'
            } else {
                document.getElementById('views').classList.remove('btnActive');
                document.getElementById('duration').classList.add('btnActive');
                activeSort = 'duration';
                if (localStorage.getItem("language") == "en") {
                    document.getElementById('duration').innerHTML = `Duration <i class="fa-solid fa-xmark"></i>`
                    document.getElementById('views').innerHTML = `Visualizations`
                } else {
                    document.getElementById('duration').innerHTML = `Duracion <i class="fa-solid fa-xmark"></i>`
                    document.getElementById('views').innerHTML = `Visualizaciones`
                }
            }
            applyFilters();
        });

        renderedCards(responseVideos);
    });
};
loadCourses()

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
                document.getElementById('views').innerHTML = 'Visualizations'
                document.getElementById('duration').innerHTML = 'Duration'
    
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
        "Idioma": "Language"
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
            document.getElementById('views').innerHTML = 'Visualizations'
            document.getElementById('duration').innerHTML = 'Duration'
    
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
            document.getElementById('views').innerHTML = 'Visualizaciones'
            document.getElementById('duration').innerHTML = 'Duracion'

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