// Show alert when right - click or F12 is used
// document.addEventListener("contextmenu", function(e) {
//     e.preventDefault(); // Block right-click menu
//     //    alert("Go to git repo..");
// });

// document.addEventListener("keydown", function(e) {
//     // F12 key (Developer tools)
//     if (e.key === "F12") {
//         e.preventDefault();
//         alert("Go to git repo..");
//     }
// });

let clickCount = 0;
let clickTimer;

document.addEventListener("click", function() {
    clickCount++;

    if (clickCount === 1) {
        // Start/reset timer on the first click
        clickTimer = setTimeout(() => {
            clickCount = 0; // Reset after timeout
        }, 500);
    }

    if (clickCount === 3) {
        clearTimeout(clickTimer); // Stop the timer
        clickCount = 0; // Reset click count

        const elem = document.documentElement;

        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                // Safari
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                // IE11
                elem.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                // Safari
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                // IE11
                document.msExitFullscreen();
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // ==================== 1. LOADER SCRIPT ====================
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

    // ==================== 2. ORIGINAL PORTFOLIO SCRIPT ====================

    // --- Navigation ---
    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");
    const icon = menuIcon.querySelector("i");
    menuIcon.onclick = () => {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
        navbar.classList.toggle("active");
    };

    // --- Typing Animation ---
    if (document.querySelector(".typing-text")) {
        new Typed(".typing-text", {
            strings: [
                "Welcome to My World",
                "A Full-Stack Developer's Journey",
                "Code That Works. Systems That Think.",
            ],
            typeSpeed: 70,
            backSpeed: 40,
            loop: true,
            showCursor: false,
        });
    }

    // --- On-Scroll Animations ---
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, {
            threshold: 0.12
        }
    );
    document
        .querySelectorAll(".animate-on-scroll")
        .forEach((el) => observer.observe(el));

    // --- Active Nav Link & Sticky Header on Scroll ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("header nav a");
    window.onscroll = () => {
        let currentSectionId = "";
        sections.forEach((sec) => {
            const top = window.scrollY;
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            if (top >= offset && top < offset + height) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === currentSectionId) {
                link.classList.add("active");
            }
        });

        document
            .querySelector("header")
            .classList.toggle("sticky", window.scrollY > 100);

        if (navbar.classList.contains("active")) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-xmark");
            navbar.classList.remove("active");
        }
    };

    // --- Functional Contact Form ---
    const form = document.getElementById("contact-form");
    if (form) {
        const result = document.getElementById("form-result");
        form.addEventListener("submit", function(e) {
            const formData = new FormData(form);
            const accessKey = formData.get("access_key");
            if (accessKey === null) {
                e.preventDefault();
                result.innerHTML = "Please add your Access Key in the HTML file first.";
                result.style.display = "block";
                result.classList.add("error");
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
                return;
            }
            e.preventDefault();
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);
            result.innerHTML = "Sending...";
            result.style.display = "block";
            result.classList.remove("success", "error");
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: json,
            }).then(async (response) => {
                let jsonResponse = await response.json();
                result.classList.add(response.status == 200 ? "success" : "error");
                result.innerHTML = jsonResponse.message || (response.status == 200 ? "Success! Your message has been sent." : "Something went wrong.");
            }).catch(() => {
                result.innerHTML = "Something went wrong!";
                result.classList.add("error");
            }).finally(() => {
                form.reset();
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
            });
        });
    }
    // ==================== 3. ADVANCED SLIDER SCRIPT ====================
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
        const animationEffects = {
            fade: (c, n, i) => {
                n.classList.add("active");
                c.classList.add("animating", "fade-out");
                n.classList.add("animating", "fade-in");
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), {
                    once: true,
                });
            },
            flip: (c, n, i, d) => {
                n.classList.add("active");
                const o = d === "next" ? "flip-out-next" : "flip-out-prev";
                const a = d === "next" ? "flip-in-next" : "flip-in-prev";
                c.classList.add("animating", o);
                n.classList.add("animating", a);
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), {
                    once: true,
                });
            },
            windmill: (c, n, i) => {
                n.classList.add("active");
                c.classList.add("animating", "windmill-out");
                n.classList.add("animating", "windmill-in");
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), {
                    once: true,
                });
            },
            concave: (c, n, i, d) => {
                n.classList.add("active");
                const o = d === "next" ? "concave-out-next" : "concave-out-prev";
                const a = d === "next" ? "concave-in-next" : "concave-in-prev";
                c.classList.add("animating", o);
                n.classList.add("animating", a);
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), {
                    once: true,
                });
            },
            convex: (c, n, i, d) => {
                n.classList.add("active");
                const o = d === "next" ? "convex-out-next" : "convex-out-prev";
                const a = d === "next" ? "convex-in-next" : "convex-in-prev";
                c.classList.add("animating", o);
                n.classList.add("animating", a);
                n.addEventListener("animationend", () => onAnimationEnd(c, n, i), {
                    once: true,
                });
            },
        };
        const animateSlide = (newIndex) => {
            if (isAnimating || newIndex === currentIndex) return;
            isAnimating = true;
            const dir =
                newIndex > currentIndex ||
                (currentIndex === totalSlides - 1 && newIndex === 0) ?
                "next" :
                "prev";
            animationEffects[currentEffect](
                sliderSlides[currentIndex],
                sliderSlides[newIndex],
                newIndex,
                dir
            );
        };
        const updateActiveDot = (index) => {
            sliderDots.forEach((dot, i) =>
                dot.classList.toggle("active", i === index)
            );
        };
        const showNextSlide = () => animateSlide((currentIndex + 1) % totalSlides);
        const showPrevSlide = () =>
            animateSlide((currentIndex - 1 + totalSlides) % totalSlides);
        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideInterval = setInterval(showNextSlide, 5000);
        };
        const stopAutoSlide = () => clearInterval(autoSlideInterval);

        sliderNextBtn.addEventListener("click", () => {
            showNextSlide();
            startAutoSlide();
        });
        sliderPrevBtn.addEventListener("click", () => {
            showPrevSlide();
            startAutoSlide();
        });
        sliderDots.forEach((dot, index) =>
            dot.addEventListener("click", () => {
                animateSlide(index);
                startAutoSlide();
            })
        );
        effectSelector.addEventListener(
            "change",
            (e) => (currentEffect = e.target.value)
        );
        sliderContainer.addEventListener("mouseenter", stopAutoSlide);
        sliderContainer.addEventListener("mouseleave", startAutoSlide);

        sliderSlides[0].classList.add("active");
        sliderDots[0].classList.add("active");
        startAutoSlide();
    }
});




const certificates = [
    {
        title: "forage-accenture",
        src: "images/accenture.png"
    },
    {
        title: "forage-aws",
        src: "images/aws-forage.png"
    },
    {
        title: "coursera-aws",
        src: "images/coursera-aws.png"
    },
    {
      title:"Scaler-DSA-Intermediate",
        src="images/ScalerDSA-certificate.png",
    },
    {
        title: "coursera-Ai for Everyone",
        src: "images/coursera1.png"
    },
    {
        title: "coursera-GEN-AI",
        src: "images/coursera2.png"
    },
    {
        title: "forage-tata",
        src: "images/tata-forage.png"
    },
    {
        title: "Udemy-MERN",
        src: "images/udemy-MERN.png"
    },
];

const mainview = document.querySelector(".main-view img");
const certificatesmall = document.querySelector(".certificates-small");

const showCertificates = () => {
    // Fill certificates twice for infinite scroll effect
    for (let i = 0; i < 1; i++) {
        certificates.forEach((certificate) => {
            const certificateCard = document.createElement("div");
            certificateCard.classList.add("certificate-card");

            const certificateImage = document.createElement("img");
            certificateImage.src = certificate.src;
            certificateImage.alt = certificate.title;

            certificateCard.appendChild(certificateImage);
            certificatesmall.appendChild(certificateCard);

            // Click event to update main view
            certificateCard.addEventListener("click", () => {
                mainview.src = certificate.src;
            });
        });
    }
};

showCertificates();


