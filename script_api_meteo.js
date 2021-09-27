
document.querySelector('#cp').addEventListener('input', function() {
    if(this.value.length == 5) {
        let urlCommune = `https://geo.api.gouv.fr/communes?&codePostal=${this.value}&fields=code,nom,
        codesPostaux,long,lat;codeRegion,population&format=json&geometry=contour&lat&lon`;

        fetch(urlCommune).then((response) => 
            response.json().then((data) => {
                console.log(data);
                console.log(data.length);
                let ada = [];
                
                for(let j=0; j < data.length; j++) {
                    ada[j] = data[j].nom;
                }
                console.log(ada);
                
                let affichage = '<ul>';
                for(let ville of data) {
                    affichage += `<li><strong>${ville.nom} (${ville.code})</strong> - 
                    ${ville.population} habitants;</li>`;
                    document.querySelector('#infosVilles').innerHTML = affichage;
                }

                let aka = [...document.querySelectorAll('li')];

                for(let i = 0; i<aka.length; i++){
                    aka[i].addEventListener('click', function() {
                        this.innerHTML = `<strong><a href="http://www.google.fr/search?q=${ada[i].toLowerCase()}" 
                        target="_blank" title="Recherche Wikipedia">${ada[i]}</a></strong>`;
                    })

                    aka[i].addEventListener('dblclick', function() {
                        this.remove();
                    })
                }
            })
        ).catch(err => {
            console.log('Erreur : '+err)
            document.querySelector('#infosVilles').innerHTML = `${err}`;
        });
    }
});

