/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");

menuButton.addEventListener("click", function () {

    const isOpen =
        mainNavigation.classList.toggle("mobile-open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );

    menuButton.textContent =
        isOpen ? "×" : "☰";

});


/* Close mobile menu when a link is clicked */

document.querySelectorAll(".navigation a").forEach(function (link) {

    link.addEventListener("click", function () {

        mainNavigation.classList.remove("mobile-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.textContent = "☰";

    });

});


/* =========================================
   RECIPE FILTER
========================================= */

const filterButtons =
    document.querySelectorAll(".filter-button");

const recipeCards =
    document.querySelectorAll(".recipe-card");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (item) {

            item.classList.remove("active");

        });

        button.classList.add("active");

        const filter =
            button.getAttribute("data-filter");


        recipeCards.forEach(function (card) {

            const category =
                card.getAttribute("data-category");


            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


/* =========================================
   RECIPE MODAL
========================================= */

const recipeModal =
    document.getElementById("recipeModal");

const recipeModalClose =
    document.getElementById("recipeModalClose");

const modalOverlay =
    recipeModal.querySelector(".modal-overlay");

const modalTitle =
    document.getElementById("modalTitle");

const modalCategory =
    document.getElementById("modalCategory");

const modalTime =
    document.getElementById("modalTime");

const modalDescription =
    document.getElementById("modalDescription");

const modalIngredients =
    document.getElementById("modalIngredients");


document.querySelectorAll(".view-recipe")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            const card =
                button.closest(".recipe-card");


            const title =
                card.dataset.title;

            const time =
                card.dataset.time;

            const category =
                card.dataset.categoryName;

            const description =
                card.dataset.description;

            const ingredients =
                card.dataset.ingredients
                    .split(",");


            modalTitle.textContent =
                title;

            modalCategory.textContent =
                category.toUpperCase();

            modalTime.textContent =
                "⏱ " + time;

            modalDescription.textContent =
                description;


            modalIngredients.innerHTML = "";


            ingredients.forEach(function (ingredient) {

                const li =
                    document.createElement("li");

                li.textContent =
                    ingredient.trim();

                modalIngredients.appendChild(li);

            });


            recipeModal.classList.add("show");

            recipeModal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-open"
            );

        });

    });


function closeRecipeModal() {

    recipeModal.classList.remove("show");

    recipeModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


recipeModalClose.addEventListener(
    "click",
    closeRecipeModal
);


modalOverlay.addEventListener(
    "click",
    closeRecipeModal
);


/* =========================================
   COUPON MODAL
========================================= */

const couponOpenButton =
    document.getElementById("couponOpenButton");

const couponModal =
    document.getElementById("couponModal");

const couponModalClose =
    document.getElementById("couponModalClose");

const couponModalOverlay =
    couponModal.querySelector(".modal-overlay");


function openCouponModal() {

    couponModal.classList.add("show");

    couponModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    updateSpinCounter();

}


function closeCouponModal() {

    couponModal.classList.remove("show");

    couponModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


couponOpenButton.addEventListener(
    "click",
    openCouponModal
);

couponModalClose.addEventListener(
    "click",
    closeCouponModal
);

couponModalOverlay.addEventListener(
    "click",
    closeCouponModal
);


/* =========================================
   DAILY SPIN LIMIT
========================================= */

const MAX_DAILY_SPINS = 3;

const SPIN_STORAGE_KEY =
    "healthyRecipeFinderSpinData";


function getTodayKey() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/*
    Get saved spin information.
*/

function getSpinData() {

    const today =
        getTodayKey();

    const saved =
        localStorage.getItem(
            SPIN_STORAGE_KEY
        );


    if (!saved) {

        return {
            date: today,
            spins: 0
        };

    }


    try {

        const data =
            JSON.parse(saved);


        /*
            If it is a new day,
            automatically reset the spins.
        */

        if (data.date !== today) {

            const freshData = {
                date: today,
                spins: 0
            };

            localStorage.setItem(
                SPIN_STORAGE_KEY,
                JSON.stringify(freshData)
            );

            return freshData;

        }


        return data;

    } catch (error) {

        const freshData = {
            date: today,
            spins: 0
        };

        localStorage.setItem(
            SPIN_STORAGE_KEY,
            JSON.stringify(freshData)
        );

        return freshData;

    }

}


/*
    Save spin information.
*/

function saveSpinData(data) {

    localStorage.setItem(
        SPIN_STORAGE_KEY,
        JSON.stringify(data)
    );

}


/*
    Update the counter shown
    inside the coupon window.
*/

const spinCounter =
    document.getElementById("spinCounter");

const spinButton =
    document.getElementById("spinButton");

const spinMessage =
    document.getElementById("spinMessage");


function updateSpinCounter() {

    const data =
        getSpinData();

    const remaining =
        Math.max(
            0,
            MAX_DAILY_SPINS - data.spins
        );


    if (remaining === 0) {

        spinCounter.textContent =
            "No free spins left today";

        spinButton.disabled = true;

        spinButton.textContent =
            "COME BACK TOMORROW";

    } else {

        spinCounter.textContent =
            `${remaining} free spin${remaining === 1 ? "" : "s"} remaining today`;

        spinButton.disabled = false;

        spinButton.textContent =
            "SPIN NOW";

    }

}


/* =========================================
   WHEEL SPIN
========================================= */

const couponWheel =
    document.getElementById("couponWheel");

const spinSound =
    document.getElementById("spinSound");


const prizes = [

    "10% OFF",
    "FREE RECIPE",
    "TRY AGAIN",
    "20% OFF",
    "BONUS",
    "15% OFF"

];


let currentRotation = 0;

let isSpinning = false;


/* =========================================
   SOUND FALLBACK
========================================= */

let audioContext = null;
let soundInterval = null;


/*
    This creates a simple spinning
    mechanical sound if the MP3 file
    is not available.
*/

function startFallbackSpinSound() {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        soundInterval =
            setInterval(function () {

                const oscillator =
                    audioContext.createOscillator();

                const gain =
                    audioContext.createGain();


                oscillator.type =
                    "triangle";

                oscillator.frequency.value =
                    120 + Math.random() * 80;


                gain.gain.setValueAtTime(
                    0.0001,
                    audioContext.currentTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.055,
                    audioContext.currentTime + 0.01
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    audioContext.currentTime + 0.08
                );


                oscillator.connect(gain);

                gain.connect(
                    audioContext.destination
                );


                oscillator.start();

                oscillator.stop(
                    audioContext.currentTime + 0.08
                );

            }, 95);

    } catch (error) {

        console.log(
            "Audio fallback unavailable."
        );

    }

}


function stopFallbackSpinSound() {

    if (soundInterval) {

        clearInterval(soundInterval);

        soundInterval = null;

    }

}


/*
    Start the real MP3 first.
    If it cannot play, use fallback sound.
*/

function startSpinSound() {

    let played = false;


    try {

        spinSound.currentTime = 0;

        const playPromise =
            spinSound.play();


        if (
            playPromise !== undefined
        ) {

            playPromise
                .then(function () {

                    played = true;

                })
                .catch(function () {

                    startFallbackSpinSound();

                });

        }

    } catch (error) {

        startFallbackSpinSound();

    }


    /*
        Small safety fallback.
    */

    setTimeout(function () {

        if (!played) {

            startFallbackSpinSound();

        }

    }, 250);

}


function stopSpinSound() {

    try {

        spinSound.pause();

        spinSound.currentTime = 0;

    } catch (error) {

        console.log(
            "Could not stop MP3."
        );

    }


    stopFallbackSpinSound();

}


/* =========================================
   ACTUAL SPIN LOGIC
========================================= */

spinButton.addEventListener(
    "click",
    function () {

        if (isSpinning) {
            return;
        }


        const data =
            getSpinData();


        /*
            HARD LIMIT:
            3 spins per day.
        */

        if (
            data.spins >=
            MAX_DAILY_SPINS
        ) {

            updateSpinCounter();

            spinMessage.textContent =
                "You have used all 3 free spins today. Come back tomorrow! 🌿";

            return;

        }


        isSpinning = true;

        spinButton.disabled = true;

        spinButton.textContent =
            "SPINNING...";


        /*
            Count this spin immediately.
        */

        data.spins += 1;

        saveSpinData(data);

        updateSpinCounter();


        /*
            Randomly select one of the
            six actual wheel sections.
        */

        const winningIndex =
            Math.floor(
                Math.random() *
                prizes.length
            );


        /*
            Each section is 60 degrees.

            The first section's center is
            30 degrees.

            We calculate the exact rotation
            needed to put the winning section
            underneath the pointer.
        */

        const segmentCenter =
            winningIndex * 60 + 30;


        const currentMod =
            ((currentRotation % 360) + 360)
            % 360;


        const targetMod =
            (360 - segmentCenter) % 360;


        let rotationDifference =
            targetMod - currentMod;


        if (rotationDifference < 0) {

            rotationDifference += 360;

        }


        /*
            Add five complete rotations
            for a proper spinning effect.
        */

        rotationDifference +=
            5 * 360;


        currentRotation +=
            rotationDifference;


        /*
            Play sound.
        */

        startSpinSound();


        /*
            Spin the wheel.
        */

        couponWheel.style.transform =
            `rotate(${currentRotation}deg)`;


        /*
            Wait until animation finishes.
        */

        setTimeout(function () {

            stopSpinSound();


            const result =
                prizes[winningIndex];


            if (
                result ===
                "TRY AGAIN"
            ) {

                spinMessage.textContent =
                    "You got TRY AGAIN! Better luck on your next spin. 🎡";

            } else if (
                result ===
                "FREE RECIPE"
            ) {

                spinMessage.textContent =
                    "🎉 You won a FREE RECIPE! Enjoy your healthy meal!";

            } else if (
                result ===
                "BONUS"
            ) {

                spinMessage.textContent =
                    "🎁 BONUS! You got an extra reward!";

            } else {

                spinMessage.textContent =
                    `🎉 Congratulations! You won ${result}!`;

            }


            isSpinning = false;

            updateSpinCounter();


        }, 5200);

    }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        if (
            recipeModal.classList.contains(
                "show"
            )
        ) {

            closeRecipeModal();

        }


        if (
            couponModal.classList.contains(
                "show"
            )
        ) {

            closeCouponModal();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

updateSpinCounter();
