let d =new Date();
document.querySelector('#infosDate').innerHTML = d.getHours()+":"+d.getMinutes();

// Création du graphique de données météo
const datasCity = document.querySelector('#datasCity');
datasCity.classList.add('opacityGraph');
const ctx = datasCity.getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    height: 300,
    data: {
        datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 0
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            title: {
                display: true,
                text: '',
                align: 'center',
                color: 'black',
                font: {
                    size: 20
                }
            },
            legend: {
                display: false
            }
        }
    }
});
datasCity.style.display = 'hidden';

document.querySelector('#cp').addEventListener('input', function() {
    if(this.value.length == 5) {
        let urlCommune = `https://geo.api.gouv.fr/communes?&codePostal=${this.value}&fields=code,nom,
        codesPostaux,long,lat;codeRegion,population&format=json&geometry=contour&lat&lon`;
        //console.log(urlCommune);
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
                        document.querySelector('#datasCity').innerHTML = "";
                        //document.createElement('canvas');

                        this.innerHTML = `<strong>${ada[i]}</strong>&nbsp;&nbsp;<i class="fas fa-check"></i>`;
                        this.style.backgroundColor="lightgrey";
                        // Affichage des données météo dans le container de droite liées à la ville sélectionnée dans la liste
                        const titleCard = document.querySelector('.card-title');
                        titleCard.innerHTML = `${ada[i]}`;
                        
                        // Appel de l'API meteo weather
                        let urlCityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${ada[i]}&units=metric&appid=e2932b411693fa45bd1ebc3c7c212901&lang=fr`;
                        fetch(urlCityWeather).then( (response) => 
                            response.json().then((data) => {
                                console.log(data);
                                // Gestion du DOM des données météo

                                chart.options.plugins.title.text = "Prévision sur 7 jours";
                                
                                document.querySelector('#container').classList.add('bg-light');
                                data.wind.speed = (data.wind.speed * 3.6).toPrecision(4);
                                
                                const datasMeteo1 = document.querySelector('#datasMeteo1');
                                datasMeteo1.innerHTML = `<i class="fas fa-thermometer-half"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Actuelle<br>${data.main.temp}°C<br>`;
                                
                                const datasMeteo2 = document.querySelector('#datasMeteo2');
                                datasMeteo2.innerHTML = `${(data.weather[0].description).charAt(0).toUpperCase()}${data.weather[0].description.substr(1)}<br>`;

                                const datasMeteo3 = document.querySelector('#datasMeteo3');
                                datasMeteo3.innerHTML = `<i class="fas fa-compress-alt"></i>&nbsp;&nbsp;Pression<br>${data.main.pressure} hPa<br>`;

                                const datasMeteo4 = document.querySelector('#datasMeteo4');
                                datasMeteo4.innerHTML = `<i class="fas fa-tint"></i>&nbsp;&nbsp;&nbsp;Humidité<br>${data.main.humidity}%<br>`;

                                console.log('Latitude : '+data.coord.lat);
                                console.log('Longitude : '+data.coord.lon);

                                // Gestion du DOM du bouton et de la recherche Wikipedia de la ville sélectionnée
                                const btnContent = document.querySelector('#searchButton');
                                btnContent.classList.add('btn');
                                btnContent.classList.add('btn-primary');
                                btnContent.innerHTML = `<a href="http://www.google.fr/search?q=${ada[i].toLowerCase()}" 
                                target="_blank" title="Recherche Wikipedia">Informations sur ${ada[i]}</a>`;

                                let lat = data.coord.lat;
                                let lon = data.coord.lon;

                                let tabDatasWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely&units=metric&appid=e2932b411693fa45bd1ebc3c7c212901&lang=fr`;
                                fetch(tabDatasWeather).then( (response) => {
                                    response.json().then((datas) => {
                                        console.log(datas.daily);

                                        // Mise à jour du canvas et des données de température du graphique avec tempo
                                        setTimeout(function() {  
                                            function updateChart() {
                                                datasCity.classList.remove('opacityGraph');
                                                chart.type = 'line';
                                                chart.data.labels = ['J+1', 'J+2', 'J+3', 'J+4', 'J+5', 'J+6', 'J+7'];
                                                chart.data.datasets[0].data = [datas.daily[0].temp.day, datas.daily[1].temp.day, datas.daily[2].temp.day, datas.daily[3].temp.day, datas.daily[4].temp.day, datas.daily[5].temp.day, datas.daily[6].temp.day, datas.daily[7].temp.day];
                                                chart.data.datasets[0].backgroundColor = ['rgba(255, 99, 132, 0.2)',
                                                                                        'rgba(54, 162, 235, 0.2)',
                                                                                        'rgba(255, 206, 86, 0.2)',
                                                                                        'rgba(75, 192, 192, 0.2)',
                                                                                        'rgba(153, 102, 255, 0.2)',
                                                                                        'rgba(255, 159, 64, 0.2)',
                                                                                        'rgba(255, 99, 132, 0.2)'
                                                                                        ];
                                                chart.data.datasets[0].borderColor   =   ['rgba(255, 99, 132, 1)',
                                                                                        'rgba(54, 162, 235, 1)',
                                                                                        'rgba(255, 206, 86, 1)',
                                                                                        'rgba(75, 192, 192, 1)',
                                                                                        'rgba(153, 102, 255, 1)',
                                                                                        'rgba(255, 159, 64, 1)',
                                                                                        'rgba(255, 99, 132, 1)'
                                                                                        ];
                                                chart.data.datasets[0].borderWidth = 2;
                                                chart.update();
                                            }
                                            updateChart();
                                        }, 400);
                                    })
                                })
                            })
                        ).catch(err => {
                            console.log('Erreur API météo : '+err);
                            document.querySelector('#container').innerHTML = `Erreur : ${err}`;
                        }); 
                    })
                }
            })
        ).catch(err => {
            console.log('Erreur : '+err)
            document.querySelector('#infosVilles').innerHTML = `Erreur : ${err}`;
        });
    }
});

