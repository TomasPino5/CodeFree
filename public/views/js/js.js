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
            <a class="cardVideos" style="text-decoration: none" href="${element.link}" target="_blank">
                <img src="${element.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${element.title}</h5>
                    <p class="card-text first traducible">${element.language}</p>
                    <p class="card-text">${element.channel}</p>
                    <p class="card-text traducible">${element.views}M Vistas - ${element.duration}${element.duration > 1 ? ' Horas' : ' Hora'}</p>
                    ${element.languageIcon.map(icon => `<img class="img-language" src="${icon}" alt="">`).join(' ')}
                </div>
            </a>`;
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
                document.getElementById('nav-pagination').classList.remove('disabled0');
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
                }, 200)
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
            if (index >= 2) {
                updateActive(index - 1)
                actualIndex--
                btnController()
                handlePagination(actualIndex)
            }
        })
            
        next.addEventListener("click", () => {
            if (index <= pageLinks.length - 3) {
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
        }, 1500);
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
    });
}
translate()