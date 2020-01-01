window.onload = () => {
    //sniffing
    let edge = window.navigator.userAgent.indexOf("Edge") > -1,
        mobile = window.innerWidth < 781;

    //media based on idk
    if(!mobile) {
        document.querySelectorAll('.background video').forEach(video => {
            video.src = video.getAttribute('data-src');
        });
    }
    else {
        document.querySelectorAll('.background img').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }

    window.onresize = () => {
        mobile = window.innerWidth < 781;
        
        if(mobile) {
            document.querySelectorAll('.background img').forEach(img => {
                img.src = img.getAttribute('data-src');
            });
            document.querySelectorAll('.background video').forEach(video => {
                video.src = '';
            });
        }
        else {
            document.querySelectorAll('.background img').forEach(img => {
                img.src = '';
            });
            document.querySelectorAll('.background video').forEach(video => {
                video.src = video.getAttribute('data-src');
            });
        }
    }


    //mobile nav
    let navMenuBtn = document.getElementById('nav-menu-btn'),
        navMenuContainer = document.getElementById('nav-mobile-container'),
        navMenuTargets = document.querySelectorAll('#nav-mobile a');
    
    navMenuBtn.addEventListener('click', () => {
        navMenuBtn.classList.toggle('active');
        navMenuContainer.classList.toggle('active');
    });

    navMenuTargets.forEach(element => {element.onclick = () => {
        navMenuBtn.classList.toggle('active');
        navMenuContainer.classList.toggle('active');
    }});

    let header = document.getElementsByTagName('header')[0];
    let navContainer = document.getElementById('nav-menu-container');
    navContainer.style.height = header.offsetHeight + 'px';

    let sections = document.getElementsByClassName('navLink'),
        curSection, scrollPosition = document.getElementById('scroll-pos');

    //anchor tags
    document.querySelectorAll('a[href^="#"]').forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(element.getAttribute('href'));
            window.scrollTo(0, target.offsetTop - header.offsetHeight);
        });
    });

    //about-me image resize
    if(window.innerWidth < 780) {document.querySelector('#about-me .content-image div').style.height = document.querySelector('#about-me .content-image div').offsetWidth+'px';}
    window.addEventListener('resize', () => {
        navContainer.style.height = header.offsetHeight + 'px';
        if(window.innerWidth < 780) {document.querySelector('#about-me .content-image div').style.height = document.querySelector('#about-me .content-image div').offsetWidth+'px';}
        else {document.querySelector('#about-me .content-image div').style.height = '100%';}
    });

    //scroll events
    window.addEventListener('scroll', function(event) {
        //section highlight
        curSection = Math.floor(window.pageYOffset/window.innerHeight+.25);
        for (let index = 0; index < sections.length; index++) {
            if((index != curSection && sections[index].classList.contains('active')) || (index == curSection && !sections[index].classList.contains('active'))) {
                sections[index].classList.toggle('active');
            }
        }

        //header bg
        if(window.pageYOffset > (window.innerHeight-50) && !header.classList.contains('active')) {header.classList.add('active');}
        if(window.pageYOffset < (window.innerHeight-50) && header.classList.contains('active')) {header.classList.remove('active');}
            

        //scroll top button
        // if(window.pageYOffset/window.innerHeight > 0.2 && !scrollTopBtn.classList.contains('active')) {scrollTopBtn.classList.add('active')}
        // if(window.pageYOffset/window.innerHeight < 0.2 && scrollTopBtn.classList.contains('active')) {scrollTopBtn.classList.remove('active')}

        //handle scroll pos updates
        scrollPosition.style.cssText = 'transform: scaleX(' + window.pageYOffset/(document.documentElement.scrollHeight-window.innerHeight) + ') !important;';
    });

    //image showcase
    let showImage = document.getElementById('showImage'),
        showImageContainer = document.getElementById('showImageContainer');
    
    document.querySelectorAll('.post').forEach(image => {
        image.addEventListener('click', () => {
            showImage.src = image.src;
            showImageContainer.classList.add('active');
        });
    });

    //autocomplete change
    let contactForm = document.getElementById('contact-form'),
        contactName = document.getElementById('name'),
        contactEmail = document.getElementById('email');
        contactMessage = document.getElementById('message'),
        contactMessageLen = contactMessage.getAttribute('maxlength');
        contactResponse = document.getElementById('response');
    
    //if message too long
    contactMessage.addEventListener('keydown', () => {
        if(contactMessage.value.length >= contactMessageLen) {
            notify('Message too long!', 'Attention');
        }
    });

    contactForm.addEventListener("submit", function(e){
        e.preventDefault();

        //validate
        let email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.test(contactEmail.value)) {
            notify('Enter valid email!', 'Attention');
            return false;
        }

        contactName.setAttribute('name', 'name');
        contactEmail.setAttribute('name', 'email');
        contactEmail.value = contactEmail.value.toLowerCase();

        submitForm();
        return false;
    });

    function submitForm() {
        //setup variables
        let http, data, encodedString, prop;

        http = new XMLHttpRequest();
        http.open("POST", "/mail.php", true);
        http.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        data = {
            name: contactName.value,
            email: contactEmail.value,
            message: contactMessage.value
        };

        encodedString = '';
        for (prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + data[prop].trim());
            }
        }

        http.send(encodedString);
        http.onload = () => {
            contactResponse.innerHTML = http.responseText;
            contactResponse.classList.add('active');
        }
    }
}

function notify(message, headline = '') {
    let _message = document.querySelector('#notify > p'),
        _headline = document.querySelector('#notify > h4'),
        timer;
    
    _message.innerHTML = message;
    _headline.style.display = (headline == '') ? 'none':'block';

    if(headline != '')
        _headline.innerHTML = headline;
    document.getElementById('notify').classList.add('active');

    clearTimeout(timer);
    timer = setTimeout(function() {document.getElementById('notify').classList.remove('active')}, 2000);
}

function getViewMode() {
    let width = window.innerWidth;
    switch (width) {
        case width < 450:
            return 'mobile';
        case width < 780:
            return 'tablet';
        default:
            return 'desktop';
    }
}
