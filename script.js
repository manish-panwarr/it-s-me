// Show alert when right - click or F12 is used
document.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // Block right-click menu
    //    alert("Go to git repo..");
});

document.addEventListener("keydown", function(e) {
    // F12 key (Developer tools)
    if (e.key === "F12") {
        e.preventDefault();
        alert("Go to git repo..");
    }
});
let clickCount = 0;
let clickTimer;

document.addEventListener("click", function () {
    clickCount++;

    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500);
    }

    if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;

        const elem = document.documentElement;

        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        document.body.classList.add("loading");
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("hidden");
                document.body.classList.remove("loading");
            }, 1000);
        });
    }

    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");
    const icon = menuIcon.querySelector("i");

    menuIcon.onclick = () => {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
        navbar.classList.toggle("active");
    };

    if (document.querySelector(".typing-text")) {
        new Typed(".typing-text", {
            strings: [
                "Welcome to My World",
                "A Full-Stack Developer's Journey",
                "Code That Works. Systems That Think."
            ],
            typeSpeed: 70,
            backSpeed: 40,
            loop: true,
            showCursor: false
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("header nav a");

    window.onscroll = () => {
        let currentSectionId = "";
        const top = window.scrollY;

        sections.forEach((sec) => {
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            if (top >= offset && top < offset + height) currentSectionId = sec.id;
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href").substring(1) === currentSectionId);
        });

        document.querySelector("header").classList.toggle("sticky", top > 100);

        if (navbar.classList.contains("active")) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-xmark");
            navbar.classList.remove("active");
        }
    };

    const form = document.getElementById("contact-form");

    if (form) {
        const result = document.getElementById("form-result");

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const accessKey = formData.get("access_key");

            if (!accessKey) {
                result.innerHTML = "Please add your Access Key in the HTML file first.";
                result.style.display = "block";
                result.classList.add("error");
                setTimeout(() => result.style.display = "none", 5000);
                return;
            }

            const json = JSON.stringify(Object.fromEntries(formData));
            result.innerHTML = "Sending...";
            result.style.display = "block";
            result.classList.remove("success", "error");

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            }).then(async (response) => {
                const jsonResponse = await response.json();
                const success = response.status === 200;
                result.classList.add(success ? "success" : "error");
                result.innerHTML = jsonResponse.message || (success ? "Success! Your message has been sent." : "Something went wrong.");
            }).catch(() => {
                result.innerHTML = "Something went wrong!";
                result.classList.add("error");
            }).finally(() => {
                form.reset();
                setTimeout(() => result.style.display = "none", 5000);
            });
        });
    }

    if (document.querySelector(".slider")) {
        const sliderSlides = document.querySelectorAll(".slide");
        const sliderPrevBtn = document.querySelector(".slider-btn.prev");
        const sliderNextBtn = document.querySelector(".slider-btn.next");
        const sliderDots = document.querySelectorAll(".dot");
        const sliderContainer = document.querySelector(".slider-container");
        const effectSelector = document.getElementById("effect-selector");

        const totalSlides = sliderSlides.length;
        if (totalSlides === 0) return;

        let currentIndex = 0;
        let currentEffect = effectSelector.value;
        let autoSlideInterval;
        let isAnimating = false;

        const onAnimationEnd = (currentSlide, nextSlide, newIndex) => {
            isAnimating = false;
            currentSlide.className = "slide";
            nextSlide.className = "slide active";
            currentIndex = newIndex;
            updateActiveDot(newIndex);
        };

        const effects = {
            fade: (c, n, i) => {
                n.classList.add("active");
                c.className = "slide animating fade-out";
                n.className = "slide active animating fade-in";
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), { once: true });
            },
            flip: (c, n, i, d) => {
                n.classList.add("active");
                c.className = `slide animating ${d === "next" ? "flip-out-next" : "flip-out-prev"}`;
                n.className = `slide active animating ${d === "next" ? "flip-in-next" : "flip-in-prev"}`;
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), { once: true });
            },
            windmill: (c, n, i) => {
                n.classList.add("active");
                c.className = "slide animating windmill-out";
                n.className = "slide active animating windmill-in";
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), { once: true });
            },
            concave: (c, n, i, d) => {
                n.classList.add("active");
                c.className = `slide animating ${d === "next" ? "concave-out-next" : "concave-out-prev"}`;
                n.className = `slide active animating ${d === "next" ? "concave-in-next" : "concave-in-prev"}`;
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), { once: true });
            },
            convex: (c, n, i, d) => {
                n.classList.add("active");
                c.className = `slide animating ${d === "next" ? "convex-out-next" : "convex-out-prev"}`;
                n.className = `slide active animating ${d === "next" ? "convex-in-next" : "convex-in-prev"}`;
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), { once: true });
            }
        };

        const animateSlide = (newIndex) => {
            if (isAnimating || newIndex === currentIndex) return;
            isAnimating = true;

            const dir = newIndex > currentIndex || (currentIndex === totalSlides - 1 && newIndex === 0)
                ? "next"
                : "prev";

            effects[currentEffect](sliderSlides[currentIndex], sliderSlides[newIndex], newIndex, dir);
        };

        const updateActiveDot = (index) => {
            sliderDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        };

        const showNext = () => animateSlide((currentIndex + 1) % totalSlides);
        const showPrev = () => animateSlide((currentIndex - 1 + totalSlides) % totalSlides);

        const startAuto = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(showNext, 5000);
        };

        sliderNextBtn.addEventListener("click", () => {
            showNext();
            startAuto();
        });

        sliderPrevBtn.addEventListener("click", () => {
            showPrev();
            startAuto();
        });

        sliderDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                animateSlide(index);
                startAuto();
            });
        });

        effectSelector.addEventListener("change", (e) => {
            currentEffect = e.target.value;
        });

        sliderContainer.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
        sliderContainer.addEventListener("mouseleave", startAuto);

        sliderSlides[0].classList.add("active");
        sliderDots[0].classList.add("active");
        startAuto();
    }
});

const certificates = [
    { title: "forage-accenture", src: "images/accenture.png" },
    { title: "forage-aws", src: "images/aws-forage.png" },
    { title: "coursera-aws", src: "images/coursera-aws.png" },
    { title: "Scaler-DSA-Intermediate", src: "images/ScalerDSA-certificate.png" },
    { title: "coursera-Ai for Everyone", src: "images/coursera1.png" },
    { title: "coursera-GEN-AI", src: "images/coursera2.png" },
    { title: "tcs-cybersecurity-IAM", src: "images/tcs-cybersecurity-IAM.png"},
    { title: "forage-tata", src: "images/tata-forage.png" },
    { title: "Udemy-MERN", src: "images/udemy-MERN.png" }
];

const mainview = document.querySelector(".main-view img");
const certificatesmall = document.querySelector(".certificates-small");

const showCertificates = () => {
    certificates.forEach((certificate) => {
        const card = document.createElement("div");
        card.classList.add("certificate-card");

        const img = document.createElement("img");
        img.src = certificate.src;
        img.alt = certificate.title;

        card.appendChild(img);
        certificatesmall.appendChild(card);

        card.addEventListener("click", () => {
            mainview.src = certificate.src;
        });
    });
};

showCertificates();





