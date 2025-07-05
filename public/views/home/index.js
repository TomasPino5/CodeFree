function getRandomObjects(value) {
    for (let i = value.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [value[i], value[randomIndex]] = [value[randomIndex], value[i]];
    }
    return value
}

function renderedCards(value, index) {
    document.getElementById('videoCardsContainer').innerHTML = '';

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

                carrousel("en");
    
                localStorage.setItem("language", "en");
            }
        }, 15);
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
        "Vistas": "Views",
        "Horas": "Hours",
        "Hora": "Hour",
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
        }
    }

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
            updateActive(index - 1)
            actualIndex--
            btnController()
            handlePagination(actualIndex)
        })
            
        next.addEventListener("click", () => {
            updateActive(index + 1);
            actualIndex++
            btnController()
            handlePagination(actualIndex)
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
  
let carouselInterval;
let carouselIndex = 0;

let carrousel = (lang) => {
    let img1 = document.getElementById('img1').innerHTML = `<img src="" alt="" class="carrousel-container-div-img"></img>`;
    let img2 = document.getElementById('img2').innerHTML = `<img src="" alt="" class="carrousel-container-div-img"></img>`;
    let img3 = document.getElementById('img3').innerHTML = `<img src="" alt="" class="carrousel-container-div-img"></img>`;
    if (lang == "en") {
        img1 = document.getElementById('img1').innerHTML = `<img src="../img/carrousel1en.jpg" alt="" class="carrousel-container-div-img" oncontextmenu="return false;" draggable="false"></img>`
        img2 = document.getElementById('img2').innerHTML = `<img src="../img/carrousel2en.jpg" alt="" class="carrousel-container-div-img" oncontextmenu="return false;" draggable="false"></img>`
        img3 = document.getElementById('img3').innerHTML = `<img src="../img/carrousel3en.jpg" alt="" class="carrousel-container-div-img" oncontextmenu="return false;" draggable="false"></img>`
    } else {
        img1 = document.getElementById('img1').innerHTML = `<img src="../img/carrousel1.jpg" alt="" class="carrousel-container-div-img" oncontextmenu="return false;" draggable="false"></img>`
        img2 = document.getElementById('img2').innerHTML = `<img src="../img/carrousel2.jpg" alt="" class="carrousel-container-div-img" oncontextmenu="return false;" draggable="false"></img>`
        img3 = document.getElementById('img3').innerHTML = `<img src="../img/carrousel3.jpg" alt="" class="carrousel-container-div-img" oncontextmenu="return false;" draggable="false"></img>`
    }
    let images = [document.getElementById('img1'), document.getElementById('img2'), document.getElementById('img3')];

    images.forEach(image => image.classList.remove('active'));
    images[carouselIndex].classList.add('active');

    clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        images.forEach(image => image.classList.remove('active'));
        carouselIndex = (carouselIndex + 1) % images.length;
        images[carouselIndex].classList.add('active');
    }, 6000);

    let leftButton = document.getElementById('btnPrevious');
    let rightButton = document.getElementById('btnNext');

    leftButton.onclick = () => {
        images.forEach(image => image.classList.remove('active'));
        carouselIndex = (carouselIndex - 1 + images.length) % images.length;
        images[carouselIndex].classList.add('active');
    };

    rightButton.onclick = () => {
        images.forEach(image => image.classList.remove('active'));
        carouselIndex = (carouselIndex + 1) % images.length;
        images[carouselIndex].classList.add('active');
    };
}
carrousel()

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

                carrousel("en");
    
                localStorage.setItem("language", "en");
                isTranslated = true;
            }
        }, 100);
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
        "Otros lenguajes": "Other languages"
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

            carrousel("en");

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

            carrousel("es");

            localStorage.setItem("language", "es");
            isTranslated = false
        }
    });
}
translate()