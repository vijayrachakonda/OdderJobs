let map = L.map('map').setView([35.912076156582295, -79.05118707892768], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiY3J6MTQ0IiwiYSI6ImNrM3RsYWQwMTA0MnQzbHFyNjhiMWc2cXoifQ.7dBNwkFofBnk_bt0GFpdaQ'
}).addTo(map);

let marker = L.marker([35.912076156582295, -79.05118707892768]);
marker.bindPopup(`<div class="has-text-centered"><b>Pruning an old tree</b>
                  <br>Tall people needed to prune<br>branches of ver...<br>
                  <button class="button is-primary">Respond to Request</button></div>`).openPopup().addTo(map);

const pubRoot = new axios.create({
    baseURL: "http://localhost:3000/public"
});

async function getJobs() {
    let jobList;
    const {foo, bar} = await pubRoot.get('/Nick/jobs').then(res=>jobList=res.data);

    let markers=[];
    let renderID = 0;
    jobList.result.forEach(function(job) {
        let randLat = Math.random() * (36 - 35.9) + 35.9;
        let randLong = Math.random() * (-79.0 - -79.1) + -79.1;
        let marker = L.marker([randLat, randLong]);
        let firstLine, secondLine = "";
        if (job.description.length <= 33) {
            firstLine = job.description.slice(0, job.description.length);
        } else if (job.description.length>33 && job.description.length <=66) {
            firstLine = job.description.slice(0, 34);
            secondLine = job.description.slice(35, job.description.length);
        } else {
            firstLine = job.description.slice(0,34);
            secondLine= job.description.slice(35, 63) + "...";
        }
        marker.bindPopup(`<div class="has-text-centered"><b>${job.title.slice(0,31)}...</b>
                          <br>${firstLine}<br>${secondLine}<br>
                          <button class="button is-primary">Respond to Request</button></div>`).openPopup().addTo(map);
        $
        markers.push(marker);
    });
}
getJobs();