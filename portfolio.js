// Navbar Toggle
let total_Count;
let menuIcon = document.querySelector('#menu-icon');
let nav = document.querySelector('.navbar');
menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-times');
    nav.classList.toggle('active');
};

// Scroll Reveal
ScrollReveal({
    reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});
ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .service-content, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

// Typed JS
const typed = new Typed('.multiple-text', {
    strings: ['Full Stack Developer', 'Java Developer', 'BCA Student'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

// Contact Form
function contactMe() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("PhoneNumber").value;
    let subject = document.getElementById("Subject").value;
    let message = document.getElementById("message").value;

    emailjs.send("service_4ssqd0a", "template_q8ux8m5", {
        title: subject,
        name: name,
        email: email,
        phone: phone,
        message: message,
    }).then(() => {
        alert("Message sent successfully!");
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("PhoneNumber").value = "";
        document.getElementById("Subject").value = "";
        document.getElementById("message").value = "";
    }, (error) => {
        alert("Failed to send message. Please try again.");
        console.error(error);
    });
}

// Create age verification overlay
function showAgeVerificationGate() {
    const gate = document.createElement('div');
    gate.id = 'entry-gate';
    gate.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%; background:#111;
        color:#fff; display:flex; justify-content:center; align-items:center;
        z-index:9999; flex-direction:column; text-align:center; padding:20px;
    `;
    gate.innerHTML = `
        <h2>We respect your privacy 🙏</h2>
        <p>With your permission, we’d like to access your region to provide a better and more personalized experience.And Viewcount, according to the region.</p>
        <div>
            <button onclick="handleUserConsent(true)">Agree</button>
        </div>
        <style>
            #entry-gate button {
                margin: 10px;
                padding: 12px 24px;
                font-size: 18px;
                background: #191f36;
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
            }
            #entry-gate button:hover {
                background: #0b5ed7;
            }
        </style>
    `;
    document.body.appendChild(gate);
}

// Handle user age verification
function handleUserConsent(isAdult) {
    const gate = document.getElementById('entry-gate');


    // If adult, try to get precise geolocation
    getPreciseLocation().then(preciseLoc => {
        const name = "Anonymous";
        const timeSpent = Math.round(performance.now() / 1000);
        const locationData = {
            ip: "N/A (browser geolocation)",
            city: "N/A",
            region: "N/A",
            country: "N/A",
            latitude: preciseLoc.latitude,
            longitude: preciseLoc.longitude
        };
        sendUserData(name, timeSpent, locationData);
        gate.remove();
    }).catch(async err => {
        console.warn("Precise location denied, falling back to IP.", err);
        const name = "Anonymous";
        const timeSpent = Math.round(performance.now() / 1000);
        const ipData = await getUserLocation();
        sendUserData(name, timeSpent, ipData);
        gate.remove();
    });
}

// Get IP-based location
async function getUserLocation() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=a640a2504d1bd2');
        const data = await response.json();
        return {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            location: data.loc
        };
    } catch (error) {
        console.error('Error fetching IP location:', error);
        return null;
    }
}

// Get precise location
function getPreciseLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation not supported.');
        } else {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                error => reject(error)
            );
        }
    });
}

// Send data via emailjs
async function sendUserData(name, timeSpent, locationData) {
    ++total_Count;
    console.log(total_Count);
    const { ip = "N/A", city = "N/A", region = "N/A", country = "N/A", latitude, longitude, location } = locationData;
    const locStr = location || (latitude && longitude ? `${latitude},${longitude}` : "N/A");

    emailjs.send("service_4ssqd0a", "template_04jpqfo", {
        title: "User Data Collected",
        name: name,
        ip: ip,
        city: city,
        region: region,
        country: country,
        location: locStr,
        timeSpent: timeSpent,
        Time: new Date().toLocaleString(),
        totalCount:total_Count


    }).then(() => {
        console.log("User data sent successfully!");
    }).catch(err => {
        console.error("Failed to send user data:", err);
    });
}

// Trigger verification on load
document.addEventListener("DOMContentLoaded", () => {
    showAgeVerificationGate();
});
