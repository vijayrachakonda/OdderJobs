const localStorage = window.localStorage;
const pubRoot = new axios.create({baseurl:"http://localhost:3000/public"});
const privateRoot = new axios.create({baseurl:"http://localhost:3000/private"});
const userRoot = new axios.create({baseurl:"http://localhost:3000/user"});

const renderNavbar = function(loggedIn) {
    let element = '';
    if(loggedIn) {
        element = `<div class="navbar-brand">
                    <a class="navbar-item" href="/"><img src="/otter.png" width="50" height="50"></a>
                </div>
                <div class="navbar-menu">
                        <div class="navbar-start">
                            <div class="navbar-item"><a class="navlink">Profile</a></div>
                            <div class="navbar-item"><a class="navlink" href="/jobs.html">Jobs</a></div>
                            <div class="navbar-item"><a class="navlink" href="/messages.html">Messages</a></div>
                        </div>
                    <div class="navbar-end">
                        <div class="navbar-item"><a class="navlink">Logout</a></div>
                    </div>
                </div>`
    } else {
        element = `<div class="navbar-brand">
                    <a class="navbar-item" href="/"><img src="/otter.png" width="50" height="50"></a>
                </div>
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <div class="navbar-item">Job Listings</div>
                    </div>
                <div class="navbar-end">
                    <div class="navbar-item">Login/Register</div>
                </div>
            </div>`
    }
    const navroot = $("#navbar-root");
    navroot.append(element);
}

const handleMessages = function(jobId) {
    $(document.body).on("click", "#".concat(jobId, "-send"), function() {
        let value = $("#".concat(jobId, '-newMsg')).val();
        $("#".concat(jobId, '-newMsg')).val('');
        sendM
    });
}

const renderMessages = function(jobs, username) {
    const messageroot = $("#messages-root");
    for(let i = 0; i < jobs.length; i++) {
        let messages = jobs[i].messages;
        let last = messages[messages.length - 1];
        messageroot.append(`<div id="`.concat(jobs[i].id, `-chat" class="box"><div class="media content">`,`<span class="jobTitle"><strong>`,
            jobs[i].title, `</strong>,<i> `, messages[0].from.name, `</i></span></div><div class="content"><span><i>`, last.time,`\t\t</i></span>`, `<span><strong>`, last.from.name,
            '</strong>: ', last.body, `</span></div><span class="icon"><i id="`, jobs[i].id, `-arrow" style="color:#0B93F6" class="fas fa-arrow-down"></i></span></div></div>
            <div id="`, jobs[i].id, `-msgs" class="box" style="margin:0 auto;overflow:scroll;width:500px;height:500px"></div>`));
        $("#".concat(jobs[i].id, "-msgs")).hide();
        $("#".concat(jobs[i].id,"-chat")).on("click", function() {
            if($("#".concat(jobs[i].id, "-arrow")).hasClass('fas fa-arrow-down')) {
                $("#".concat(jobs[i].id, "-arrow")).removeClass('fas fa-arrow-down');
                $("#".concat(jobs[i].id, "-arrow")).addClass('fas fa-arrow-up');
            } else {
                $("#".concat(jobs[i].id, "-arrow")).removeClass('fas fa-arrow-up');
                $("#".concat(jobs[i].id, "-arrow")).addClass('fas fa-arrow-down');
            }
            $("#".concat(jobs[i].id, "-msgs")).empty();
            $("#".concat(jobs[i].id, "-msgs")).toggle();
            for(let j = 0; j < messages.length; j++) {
                let message = messages[j];
                let element = '';
                if(message.from.name === username) {
                    if(j > 0 && messages[j - 1].from.name === message.from.name) {
                        element = `<div class="content" style="margin-top:0px;float:right;clear:both;"><p class="from-me">`.concat(message.body, `</span></div>`);
                    } else {
                        element = `<div class="media content" style="margin-bottom:0px;float:right;clear:both"><span><strong>`.concat(message.from.name, 
                            `</strong></span></div><div style="margin-top:0px;float:right;clear:both" class="content"><p class="from-me">`, message.body, `</span></div>`);
                    }
                }
                else {
                    if(j > 0 && messages[j - 1].from.name === message.from.name) {
                        element = `<div class="content" style="margin-top:0px;float:left;clear:both;"><p class="from-them">`.concat(message.body, `</span></div>`);
                    } else {
                        element = `<div class="media content" style="margin-bottom:0px;float:left;clear:both"><span><strong>`.concat(message.from.name, 
                            `</strong></span></div><div style="margin-top:0px;float:left;clear:both" class="content"><p class="from-them">`, message.body, `</span></div>`);
                    }
                }
                $("#".concat(jobs[i].id, "-msgs")).append(element);
            }
            $("#".concat(jobs[i].id, "-msgs")).append(`<div class="send-message" id="`.concat(jobs[i].id, `-input" style="position:sticky;top:0;display:inline;white-space:nowrap;"></div>`));
            $("#".concat(jobs[i].id, "-input")).append(`<input id="`.concat(jobs[i].id, `-newMsg" style="width:90%;" class="input" type="text" placeholder="Send a message..."/>`));
            $("#".concat(jobs[i].id, "-input")).append(`<button id="`.concat(jobs[i].id, `-send" style="width:10%;" class="button is-info"><span class="icon"><i class="fas fa-paper-plane"></i></span></button>`));
        });
        handleMessages(jobs[i].id);
    }
}

async function createJob(username, job) {
    const pubResult = await pubRoot.post('http://localhost:3000/public/'.concat(username,'/jobs'), {
        "data": [{"id":job.id,"title":job.title,"description":job.description}],
        "type": "merge"
    });
    const privResult = await axios({
        method:"POST",
        url:'http://localhost:3000/private/'.concat(username,'/',job.id),
        headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        data: {
            "data": {
                "id":job.id,
                "title":job.title,
                "description":job.description,
                "accepted":false
            }
        }
    });
    const userResult = await axios({
        method:"POST",
        url:'http://localhost:3000/user/'.concat(job.id),
        headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        data: {
            "data": {
                "id":job.id,
                "title":job.title,
                "description":job.description,
                "accepted":false,
                "messages":[{
                    "time":"Test time",
                    "body":"Test inquiry",
                    "from":{
                        "name":"Test user"
                    }
                }, {"time":"test time 2",
                    "body":"test response",
                    "from":{
                        "name":username
                    }
                }, {"time":"test time 3",
                    "body":"test message...",
                    "from":{
                        "name":username
                    }
                }]
            }
        }
    });
}

async function deleteJob(username, id) {
    const pubResult = await axios({
        method:'DELETE',
        url:'http://localhost:3000/public/'.concat(username,'/',id),
    });
    const privResult = await axios({
        method:'DELETE',
        url:'http://localhost:3000/private/'.concat(username,'/',id),
    });
    const userResult = await axios({
        method:'DELETE',
        url:'http://localhost:3000/user/'.concat(id),
    });
}

async function getMessages(username) {
    const userData = await userRoot.get('http://localhost:3000/user/', {
        headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))}
    });
    let jobIds = userData.data.result;
    let jobs = [];
    for(let i = 0; i < jobIds.length; i++) {
        const job = await userRoot.get('http://localhost:3000/user/'.concat(jobIds[i]), {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))}
        });
        jobs[i] = job.data.result;
    }
    renderMessages(jobs, username);
}

async function createUser(user) {
    return await axios({
        method:'POST',
        url:'http://localhost:3000/account/create',
        data: {
            "name":user.name,
            "pass":user.pass,
            "data": {"email":user.email}
        }
    });
}

async function loginUser(user) {
    const result = await axios({
        method:'POST',
        url:'http://localhost:3000/account/login',
        data: {
            "name":user.name,
            "pass":user.pass
        }
    });
    localStorage.setItem('jwt', result.data.jwt);
    return result;
}

$(function() {
    renderNavbar(true);
    let user = {name:"nick", pass:"pass123",email:"Nick@nick.com"};
    let user2 = {name:"bob", pass:"pass123",email:"Bob@bob.com"};
    let job = {id:"2", title: "Test title 2", description:"Test description 2."};
    let job2 = {id:"3", title: "Test title 3", description:"Test description 3."};
    //createUser(user);
    //loginUser(user);
    //createJob('Nick', job2);
    getMessages('Nick');
    //deleteJob('nick','1');
});