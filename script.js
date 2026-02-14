let clickCount = 0;
let clickTimer;

document.addEventListener("click", () => {
    clickCount++;

    if (clickCount === 1) {
        clickTimer = setTimeout(() => (clickCount = 0), 500);
    }

    if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;

        const elem = document.documentElement;

        if (!document.fullscreenElement) {
            elem.requestFullscreen?.() ||
                elem.webkitRequestFullscreen?.() ||
                elem.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() ||
                document.webkitExitFullscreen?.() ||
                document.msExitFullscreen?.();
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {

    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");
    const icon = menuIcon ? menuIcon.querySelector("i") : null;

    if (menuIcon && navbar && icon) {
        menuIcon.onclick = () => {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
            navbar.classList.toggle("active");
        };
    }


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


    const scrollObserver = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        }),
        { threshold: 0.12 }
    );

    document.querySelectorAll(".animate-on-scroll")
        .forEach(el => scrollObserver.observe(el));


    const header = document.querySelector("header");
    const navLinks = document.querySelectorAll("header nav a");
    const sections = document.querySelectorAll("section[id]");


    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '100px';
    sentinel.style.left = '0';
    sentinel.style.width = '1px';
    sentinel.style.height = '1px';
    sentinel.style.pointerEvents = 'none';
    sentinel.style.visibility = 'hidden';
    document.body.prepend(sentinel);

    const headerObserver = new IntersectionObserver((entries) => {
        const isNotAtTop = !entries[0].isIntersecting;
        if (header) header.classList.toggle("sticky", isNotAtTop);
    }, { root: null, threshold: 0 });

    headerObserver.observe(sentinel);



    const sectionObserverOptions = {
        root: null,

        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");


            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));


    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                    card.classList.remove("hide");
                    card.classList.add("show");
                } else {
                    card.classList.remove("show");
                    card.classList.add("hide");
                }
            });
        });
    });


    const loadMoreBtn = document.querySelector(".load-more-btn");

    if (loadMoreBtn) {
        let itemsToShow = 4;
        const allCards = Array.from(document.querySelectorAll(".project-card"));

        if (window.innerWidth <= 768) {
            allCards.forEach((card, index) => {
                if (index >= itemsToShow) {
                    card.classList.add("mobile-hidden");
                    card.style.display = "none";
                }
            });
        }

        loadMoreBtn.addEventListener("click", () => {
            const hiddenCards = allCards.filter(card => card.classList.contains("mobile-hidden"));

            hiddenCards.forEach(card => {
                card.classList.remove("mobile-hidden");
                card.style.display = "flex";
                card.classList.add("animate-visible");
            });

            loadMoreBtn.style.display = "none";
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                allCards.forEach(card => {
                    card.classList.remove("mobile-hidden");
                    card.style.display = "";
                });
                loadMoreBtn.style.display = "none";
            } else {
                const hasHidden = allCards.some(card => card.classList.contains("mobile-hidden"));
                if (hasHidden) {
                    loadMoreBtn.style.display = "block";
                }
            }
        });
    }


    const form = document.getElementById("contact-form");
    const result = document.getElementById("form-result");


    const keyField = document.getElementById("access_key");
    if (keyField && typeof WEB3FORM_KEY !== 'undefined') {
        keyField.value = WEB3FORM_KEY;
    }

    if (form && result) {
        form.addEventListener("submit", e => {
            e.preventDefault();

            const formData = new FormData(form);
            const accessKey = formData.get("access_key");

            if (!accessKey) {
                result.innerHTML = "Please add your Access Key in the HTML file first.";
                result.style.display = "block";
                result.className = "error";
                setTimeout(() => (result.style.display = "none"), 5000);
                return;
            }

            const json = JSON.stringify(Object.fromEntries(formData));


            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Message";
            if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            result.innerHTML = "Sending...";
            result.style.display = "block";
            result.className = "";

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            })
                .then(async response => {
                    const jsonResponse = await response.json();
                    const success = response.status === 200;

                    result.className = success ? "success" : "error";
                    result.innerHTML = jsonResponse.message || (success ? "Message sent successfully!" : "Something went wrong.");
                })
                .catch(() => {
                    result.innerHTML = "Connection error! Please try again.";
                    result.className = "error";
                })
                .finally(() => {
                    if (submitBtn) submitBtn.innerHTML = originalBtnText;
                    if (result.classList.contains("success")) {
                        form.reset();
                    }
                    setTimeout(() => (result.style.display = "none"), 5000);
                });
        });
    }


    const certificates = [
        { title: "forage-accenture", src: "images/accenture.png" },
        { title: "forage-aws", src: "images/aws-forage.png" },
        { title: "coursera-aws", src: "images/coursera-aws.png" },
        { title: "Scaler-DSA-Intermediate", src: "images/ScalerDSA-certificate.png" },
        { title: "coursera-Ai for Everyone", src: "images/coursera1.png" },
        { title: "coursera-GEN-AI", src: "images/coursera2.png" },
        { title: "tcs-cybersecurity-IAM", src: "images/tcs-cybersecurity-IAM.png" },
        { title: "forage-tata", src: "images/tata-forage.png" },
        { title: "Udemy-MERN", src: "images/udemy-MERN.png" }
    ];

    const mainview = document.querySelector(".main-view img");
    const certificatesmall = document.querySelector(".certificates-small");

    if (certificatesmall && mainview) {
        certificates.forEach(certificate => {
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

        // Load first image into main view if empty
        if (!mainview.src || mainview.src === window.location.href) {
            mainview.src = certificates[0].src;
        }


        if (window.innerWidth <= 768) {
            certificates.forEach(certificate => {
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
        }
    }


    let zoomModal = document.querySelector(".certificate-zoom-modal");
    if (!zoomModal) {
        zoomModal = document.createElement('div');
        zoomModal.className = "certificate-zoom-modal";
        zoomModal.innerHTML = `<img src="">`;
        document.body.appendChild(zoomModal);
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.certificate-card img') || e.target.closest('.main-view img')) {
            let src = e.target.src;
            zoomModal.querySelector('img').src = src;
            zoomModal.classList.add('active');
        } else if (e.target === zoomModal) {
            zoomModal.classList.remove('active');
        }
    });


    const progressBars = document.querySelectorAll(".progress");

    if (progressBars.length > 0) {

        const skillOptions = { threshold: 0.2 };

        const animateSkills = (entry, observer) => {
            const progress = entry.target;

            if (progress.classList.contains("animated")) return;
            progress.classList.add("animated");

            const targetValue = parseInt(progress.getAttribute("data-value")) || 0;
            const numberText = progress.querySelector("h3");
            const clr = progress.style.getPropertyValue("--clr");

            let current = 0;
            const duration = 1500;
            const intervalTime = 20;
            const steps = duration / intervalTime;
            const increment = targetValue / steps;

            const interval = setInterval(() => {
                current += increment;
                if (current >= targetValue) {
                    current = targetValue;
                    clearInterval(interval);
                }

                // Update UI using CSS variable directly
                progress.style.background = `conic-gradient(var(--clr) ${current * 3.6}deg, #2a2a2a 0deg)`;
                if (numberText) numberText.innerHTML = `${Math.round(current)}<span>%</span>`;
            }, intervalTime);

            // Stop observing after animation starts
            observer.unobserve(progress);
        };

        const skillObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills(entry, skillObserver);
                }
            });
        }, skillOptions);

        progressBars.forEach(bar => skillObserver.observe(bar));
    }
});
