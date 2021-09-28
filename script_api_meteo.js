
document.querySelector('#cp').addEventListener('input', function() {
    if(this.value.length == 5) {
        let urlCommune = `https://geo.api.gouv.fr/communes?&codePostal=${this.value}&fields=code,nom,
        codesPostaux,long,lat;codeRegion,population&format=json&geometry=contour&lat&lon`;

        fetch(urlCommune).then((response) => 
            response.json().then((data) => {
                let ada = [];
                
                for(let j=0; j < data.length; j++) {
                    ada[j] = data[j].nom;
                }

                // Affichage du résultat de l'input code postal sous forme de liste
                let affichage = '<ul>';
                for(let ville of data) {
                    affichage += `<li><strong>${ville.nom} (${ville.code})</strong> - 
                    ${ville.population} habitants;</li>`;
                    document.querySelector('#infosVilles').innerHTML = affichage;
                }

                // Modification de l'élément de la liste au clic de celui-ci
                let aka = [...document.querySelectorAll('li')];

                for(let i = 0; i<aka.length; i++){
                    aka[i].addEventListener('click', function() {
                        this.innerHTML = `<strong>${ada[i]}</strong>&nbsp;&nbsp;<i class="fas fa-check"></i>`;
                        
                        // Affichage des données météo dans le container de droite liées à la ville sélectionnée dans la liste
                        const titleCard = document.querySelector('.card-title');
                        titleCard.innerHTML = `${ada[i]}`;

                        // Appel de l'API meteo weather
                        let urlCityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${ada[i]}&units=metric&appid=e2932b411693fa45bd1ebc3c7c212901&lang=fr`;
                        fetch(urlCityWeather).then( (response) => 
                            response.json().then((data) => {
                                // Gestion du DOM des données météo
                                document.querySelector('#container').classList.add('bg-light');
                                data.wind.speed = (data.wind.speed * 3.6).toPrecision(4);
                                
                                const datasMeteo1 = document.querySelector('#datasMeteo1');
                                datasMeteo1.innerHTML = `<i class="fas fa-thermometer-half"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Actuelle : ${data.main.temp}°C<br>`;
                                
                                const datasMeteo2 = document.querySelector('#datasMeteo2');
                                datasMeteo2.innerHTML = `<i class="fas fa-thermometer"></i>&nbsp;&nbsp;Ressentie: ${data.main.feels_like}°C<br>`;

                                const datasMeteo3 = document.querySelector('#datasMeteo3');
                                datasMeteo3.innerHTML = `<i class="fas fa-compress-alt"></i>&nbsp;&nbsp;Pression : ${data.main.pressure} hPa<br>`;

                                const datasMeteo4 = document.querySelector('#datasMeteo4');
                                datasMeteo4.innerHTML = `<i class="fas fa-tint"></i>&nbsp;&nbsp;&nbsp;Humidité : ${data.main.humidity}%<br>`;

                                // Gestion du DOM du bouton et de la recherche Wikipedia de la ville sélectionnée
                                const btnContent = document.querySelector('#searchButton');
                                btnContent.classList.add('btn');
                                btnContent.classList.add('btn-primary');
                                btnContent.innerHTML = `<a href="http://www.google.fr/search?q=${ada[i].toLowerCase()}" 
                                target="_blank" title="Recherche Wikipedia">Informations sur ${ada[i]}</a>`;
                            })) 
                    })
                }
            })
        ).catch(err => {
            console.log('Erreur : '+err)
            document.querySelector('#infosVilles').innerHTML = `Erreur : ${err}`;
        });
    }
});

