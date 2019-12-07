const renderNavbar = function(loggedIn) {
    let element = '';
    if(loggedIn) {
        element = `<div class="navbar-brand">
                    <a class="navbar-item" href="/">
                        <img src="/otter.jpg" width="50" height="75">
                        <div><b><i>OdderJobs</i></b></div>
                    </a>
                </div>
                <div class="navbar-menu">
                        <div class="navbar-start">
                            <div class="navbar-item"><a class="navlink">Profile</a></div>
                            <div class="navbar-item"><a class="navlink" href="/messages.html">Messages</a></div>
                            <div class="navbar-item"><a class="navlink" href="/post-job-page.html">Post Job</a></div>
                        </div>
                    <div class="navbar-end">
                        <div class="navbar-item"><a class="navlink">Logout</a></div>
                    </div>
                </div>`
    } else {
        element = `<div class="navbar-brand">
                    <a class="navbar-item" href="https://bulma.io">
                        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
                    </a>
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

const renderMessage = function(message) {
    renderNavbar(true);
    let element = `<div class="box" id="`.concat(message.id, `"><div class="media content"><span class="sender"><strong>`, message.sender, 
        `</strong></span></div><div class="content"><span id="`, message.id, `-body">`, message.body, `</span></div></div>`);
    const messageroot = $("#messages-root");
    messageroot.append(element);
}


$(function() {
    let message = {id: 1, sender: "nick", body: "hello"};
    renderMessage(message);
});