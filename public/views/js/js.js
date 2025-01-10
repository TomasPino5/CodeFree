let loadCourses = () => {
    fetch('../data/videos.json')
    .then(response => response.json())
    .then(value => {
        value.forEach(element => {
            if (element.category == 'Javascript' || element.category == 'Node.js' || element.category == 'React' || element.category == 'Next.js' || element.category == 'Express' || element.category == 'Vue.js') {
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
    })
}
loadCourses()