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

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

async function sendMessage(jobId, body) {
    if(body === "" || body === null) return;
    const userData = await userRoot.get('http://localhost:3000/account/status', {
        headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))}
    });
    let username = userData.data.user.name;
    let msgObj = {"time":formatAMPM(new Date()),"body":body,"from":{"name":username}};
    await axios({
        method:"POST",
        url:'http://localhost:3000/user/'.concat(jobId, '/messages'),
        headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        data: {
            "data": [msgObj],
            "type":"merge"
        }
    });
    let last = $("#".concat(jobId, "-msgs")).children().last();
    let fromMe = last.children().last().hasClass('from-me');
    $("#".concat(jobId, "-msgs")).append(renderMessage(msgObj, null, username));
    let scrollboi = document.getElementById(jobId.concat("-msgs"));
    scrollboi.scrollTop = scrollboi.scrollHeight;
}

const handleMessages = function(jobId) {
    $(document.body).on("click", "#".concat(jobId, "-send"), function() {
        let body = $("#".concat(jobId, '-newMsg')).val();
        $("#".concat(jobId, '-newMsg')).val('');
        sendMessage(jobId, body);
    });
}

const renderMessage = function(msg, prev, username) {
    let element = '';
    if(msg.from.name.toUpperCase() === username.toUpperCase()) {
        if(prev === null) {
            element = `<div class="media content" style="margin-top:10px;margin-bottom:0;float:right;clear:both"><span><strong>`.concat(msg.from.name, 
                `</strong></span></div><div style="margin-top:0;margin-bottom:10px;float:right;clear:both" class="content"><p class="from-me">`, msg.body, `</p></div>`);
        } else {
            if(prev.from.name.toUpperCase() === msg.from.name.toUpperCase()) {
                element = `<div class="content" style="margin-top:10px;margin-bottom:0;float:right;clear:both;"><p class="from-me">`.concat(msg.body, `</p></div>`);
            } else {
                element = `<div class="media content" style="margin-top:10px;margin-bottom:0;float:right;clear:both"><span><strong>`.concat(msg.from.name, 
                    `</strong></span></div><div style="margin-bottom:0;margin-top:0;float:right;clear:both" class="content"><p class="from-me">`, msg.body, `</p></div>`);
            }
        }
    }
    else {
        if(prev === null) {
            element = `<div class="media content" style="margin-top:10px;margin-bottom:0;float:left;clear:both"><span><strong>`.concat(msg.from.name, 
                `</strong></span></div><div style="margin-bottom:10px;margin-top:0;float:left;clear:both" class="content"><p class="from-them">`, msg.body, `</p></div>`);
        } else {
            if(prev.from.name.toUpperCase() === msg.from.name.toUpperCase()) {
                element = `<div class="content" style="margin-top:10px;margin-bottom:0;float:left;clear:both;"><p class="from-them">`.concat(msg.body, `</p></div>`);
            } else {
                element = `<div class="media content" style="margin-bottom:0;margin-top:10px;float:left;clear:both"><span><strong>`.concat(msg.from.name, 
                    `</strong></span></div><div style="margin-top:0;margin-bottom:0;float:left;clear:both" class="content"><p class="from-them">`, msg.body, `</p></div>`);
            }
        }
    }
    return element;
}

const renderMessages = function(jobs, username) {
    const messageroot = $("#messages-root");
    for(let i = 0; i < jobs.length; i++) {
        let messages = jobs[i].messages;
        let last = messages[messages.length - 1];
        messageroot.append(`<div id="`.concat(jobs[i].id, `-chat" class="box"><div class="media content">`,`<span class="jobTitle"><strong>`,
            jobs[i].title, `</strong>,<i> `, messages[0].from.name, `</i></span></div><div class="content"><span><i>`, last.time,`\t\t</i></span>`, `<span><strong>`, last.from.name,
            '</strong>: ', last.body, `</span></div><span class="icon"><i id="`, jobs[i].id, `-arrow" style="color:#0B93F6" class="fas fa-arrow-down"></i></span></div></div>
            <div id="`, jobs[i].id, `-wrapper" style="overflow:hidden;width:500px;margin:0 auto;"><div id="`, jobs[i].id, `-msgs" class="box" style="overflow-y:scroll;overflow-x:hidden;height:400px;position:relative"></div></div>`));
        $("#".concat(jobs[i].id, "-wrapper")).hide();
        $("#".concat(jobs[i].id,"-chat")).on("click", function() {
            if($("#".concat(jobs[i].id, "-arrow")).hasClass('fas fa-arrow-down')) {
                $("#".concat(jobs[i].id, "-arrow")).removeClass('fas fa-arrow-down');
                $("#".concat(jobs[i].id, "-arrow")).addClass('fas fa-arrow-up');
            } else {
                $("#".concat(jobs[i].id, "-arrow")).removeClass('fas fa-arrow-up');
                $("#".concat(jobs[i].id, "-arrow")).addClass('fas fa-arrow-down');
            }
            $("#".concat(jobs[i].id, "-wrapper")).empty();
            $("#".concat(jobs[i].id, "-wrapper")).toggle();
            $("#".concat(jobs[i].id, "-wrapper")).append(`<div id="`.concat(jobs[i].id, `-msgs" class="box" style="overflow-y:scroll;overflow-x:hidden;height:400px;position:relative"></div>`));
            if(messages[0].from.name === username) fromMe = true;
            $("#".concat(jobs[i].id, "-msgs")).append(renderMessage(messages[0], null, username));
            fromMe = false;
            for(let j = 1; j < messages.length; j++) {
                let message = messages[j];
                if(message.from.name === username) fromMe = true;
                let element = renderMessage(message, messages[j - 1], username);
                $("#".concat(jobs[i].id, "-msgs")).append(element);
            }
            $("#".concat(jobs[i].id, "-wrapper")).append(`<div class="send-message" id="`.concat(jobs[i].id, `-input" style="display:inline;white-space:nowrap;"></div>`));
            $("#".concat(jobs[i].id, "-input")).append(`<input id="`.concat(jobs[i].id, `-newMsg" style="width:90%;" class="input" type="text" placeholder="Send a message..."/>`));
            $("#".concat(jobs[i].id, "-input")).append(`<button id="`.concat(jobs[i].id, `-send" style="width:10%;" class="button is-info"><span class="icon"><i class="fas fa-paper-plane"></i></span></button>`));
            let scrollboi = document.getElementById(jobs[i].id.concat("-msgs"));
            scrollboi.scrollTop = scrollboi.scrollHeight;
        });
        handleMessages(jobs[i].id);
    }
}

async function createJob(username, job) {
    if(job.description.length > 500) job.description = job.description.slice(0, 500);
    const pubResult = await pubRoot.post('http://localhost:3000/public/jobs', {
        "data": [{"id":job.id,"title":job.title,"description":job.description, "postedBy": username}],
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
    let user = {name:"Nick", pass:"pass123",email:"Nick@nick.com"};
    let user2 = {name:"bob", pass:"pass123",email:"Bob@bob.com"};
    let job = {id:"2", title: "Test title 2", description:"Test description 2."};
    let job2 = {id:"3", title: "Test title 3", description:"Test description 3."};
    //createUser(user2);
    loginUser(user);
    createJob('bob', job2);
    //getMessages('bob');
    //deleteJob('nick','1');
});