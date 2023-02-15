let d =new Date();
document.querySelector('#infosDate').innerHTML = d.getHours()+":"+d.getMinutes();

// Chart meteo data creation
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

// Apply interaction in #cp by input event : fetch geo.api.gouv.fr by CP and return data response
document.querySelector('#cp').addEventListener('input', function() {
    if(this.value.length == 5) {
        let urlCommune = `https://geo.api.gouv.fr/communes?&codePostal=${this.value}&fields=code,nom,
        codesPostaux,long,lat;codeRegion,population&format=json&geometry=contour&lat&lon`;

        // API call from api.gouv.fr
        fetch(urlCommune).then((response) => 
            response.json().then((data) => {
                let ada = [];
                
                // 
                for(let j=0; j < data.length; j++) {
                    ada[j] = data[j].nom;
                }

                // Displays result(s) from CP input by as a list
                let affichage = '';
                for(let ville of data) {
                    affichage += `<div class='dropdown-item'><strong>${ville.nom} (${ville.code})</strong> - 
                    ${ville.population} habitants</div>`;
                    document.querySelector('#infosVilles').innerHTML = affichage;
                }

                // Modification de l'élément de la liste au clic de celui-ci
                let aka = [...document.querySelectorAll('.dropdown-item')];

                for(let i = 0; i < aka.length; i++){
                    aka[i].addEventListener('click', function() {
                        // First clean the #datasCity id DOM
                        document.querySelector('#datasCity').innerHTML = "";

                        // Change appearance from the item selected inside the list (to perform in future update)
                        this.innerHTML = `<strong>${ada[i]}</strong>&nbsp;&nbsp;<i class="fas fa-check"></i>`;
                        this.style.backgroundColor = "lightgrey";

                        // Meteo data handling in right container under the map
                        const titleCard = document.querySelector('.card-title');
                        titleCard.innerHTML = `${ada[i]}`;
                        
                        // API meteo weather call
                        let urlCityWeather = `https://api.openweathermap.org/data/2.5/weather?q=${ada[i]}&units=metric&appid=e2932b411693fa45bd1ebc3c7c212901&lang=fr`;
                        fetch(urlCityWeather).then( (response) => 
                            response.json().then((data) => {
                                console.log(data);

                                // DOM data handling
                                chart.options.plugins.title.text = "Prévision sur 7 jours";
                                
                                document.querySelector('#container').classList.add('bg-light');
                                data.wind.speed = (data.wind.speed * 3.6).toPrecision(4);
                                
                                const datasInfos1 = document.querySelector('#datasInfos1');
                                datasInfos1.innerHTML = `<i class="fas fa-thermometer-half"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Actuelle<br>${data.main.temp}°C<br>`;
                                
                                const datasInfos2 = document.querySelector('#datasInfos2');
                                datasInfos2.innerHTML = `${(data.weather[0].description).charAt(0).toUpperCase()}${data.weather[0].description.substr(1)}<br>`;

                                const datasInfos3 = document.querySelector('#datasInfos3');
                                datasInfos3.innerHTML = `<i class="fas fa-compress-alt"></i>&nbsp;&nbsp;Pression<br>${data.main.pressure} hPa<br>`;

                                const datasInfos4 = document.querySelector('#datasInfos4');
                                datasInfos4.innerHTML = `<i class="fas fa-tint"></i>&nbsp;&nbsp;&nbsp;Humidité<br>${data.main.humidity}%<br>`;

                                console.log('Latitude : ' + data.coord.lat);
                                console.log('Longitude : ' + data.coord.lon);

                                // DOM button and Wikipedia search handling 
                                const btnContent = document.querySelector('#searchButton');
                                btnContent.classList.add('btn');
                                btnContent.classList.add('btn-primary');
                                // Create Wikipedia link containing city name + title inside button element
                                btnContent.innerHTML = `<a href="http://www.google.fr/search?q=${ada[i].toLowerCase()}" 
                                target="_blank" title="Recherche Wikipedia">Informations sur ${ada[i]}</a>`;

                                let lat = data.coord.lat;
                                let lon = data.coord.lon;

                                // Get weather data for 5 days by an API call
                                let tabDatasWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely&units=metric&appid=e2932b411693fa45bd1ebc3c7c212901&lang=fr`;
                                fetch(tabDatasWeather).then( (response) => {
                                    response.json().then((datas) => {
                                        console.log(datas.daily);

                                        // Canvas update with data temperatures (with 440 ms delay)
                                        setTimeout(function() {  
                                            function updateChart() {
                                                datasCity.classList.remove('opacityGraph');
                                                chart.type = 'line';
                                                chart.data.labels = ['J+0', 'J+1', 'J+2', 'J+3', 'J+4', 'J+5', 'J+6'];
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

