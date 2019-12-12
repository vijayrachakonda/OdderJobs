import { getUser } from "../app.js"

let map = L.map('map').setView([35.912076156582295, -79.05118707892768], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiY3J6MTQ0IiwiYSI6ImNrM3RsYWQwMTA0MnQzbHFyNjhiMWc2cXoifQ.7dBNwkFofBnk_bt0GFpdaQ'
}).addTo(map);

let marker = L.marker([35.912076156582295, -79.05118707892768]);
marker.bindPopup(`<div class="has-text-centered"><b>Pruning an old tree</b><br>
                  <button class="button is-primary">Respond to Request</button></div>`).openPopup().addTo(map);

const pubRoot = new axios.create({
    baseURL: "http://localhost:3000/public"
});


async function handleRespondToJob(id) {
    if (await getUser() == false) {
        $("#loginModal").addClass("is-active");
        return;
    } else {
        window.location.replace(`/messages.html?id=${id}`);
    }
}

async function getJobs() {
    let jobList;
    const {foo, bar} = await pubRoot.get('/Nick/jobs').then(res=>jobList=res.data);

    let markers=[];
    let renderID = 0;
    jobList.result.forEach(function(job) {
        let subRenderID = renderID;
        let randLat = Math.random() * (36 - 35.9) + 35.9;
        let randLong = Math.random() * (-79.0 - -79.1) + -79.1;
        let marker = L.marker([randLat, randLong]);
        marker.bindPopup(`<div class="has-text-centered"><b>${job.title.slice(0,31)}...</b>
                          <br>${job.description}<br><br>
                          <a <button id="respond${renderID}" class="button is-primary">Respond to Request</button></div>`).openPopup().addTo(map);
        //$(`#respond${renderID}`).click(handleRespondToJob);
        $(document.body).on("click", `#respond${renderID}`, function() { handleRespondToJob(subRenderID) });
        markers.push(marker);
        renderID++;
    });
}
getJobs();