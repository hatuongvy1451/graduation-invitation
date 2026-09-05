/* =====================================================
   SCREEN CONTROL
===================================================== */

let currentScreen = "loadingScreen";


function showScreen(screenId) {

    const current =
        document.getElementById(currentScreen);

    const next =
        document.getElementById(screenId);

    if (!next) return;

    if (current) {
        current.classList.remove("active");
    }

    setTimeout(() => {

        next.classList.add("active");

        next.scrollTo({
            top: 0,
            behavior: "instant"
        });

    }, 100);

    currentScreen = screenId;
}


/* =====================================================
   LOADING
===================================================== */

const progressBar =
    document.getElementById("progressBar");

const loadingText =
    document.getElementById("loadingText");

const startBtn =
    document.getElementById("startBtn");


let progress = 0;

const loadingMessages = [

    "Đang chuẩn bị một điều đặc biệt...",

    "Đang gom lại những năm tháng ấy...",

    "Một chút kỷ niệm...",

    "Một chút cảm xúc...",

    "Và một lời mời dành cho bạn..."
];


const loadingInterval =
    setInterval(() => {

        progress += 2;

        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;
        }


        if (loadingText) {

            const index =
                Math.min(
                    Math.floor(progress / 20),
                    loadingMessages.length - 1
                );

            loadingText.textContent =
                loadingMessages[index];
        }


        if (progress >= 100) {

            clearInterval(loadingInterval);

            if (startBtn) {

                startBtn.disabled = false;
            }

            if (loadingText) {

                loadingText.textContent =
                    "Mọi thứ đã sẵn sàng ✨";
            }

        }

    }, 45);


/* Ban đầu khóa nút */

if (startBtn) {

    startBtn.disabled = true;
}


/* =====================================================
   START
===================================================== */

function startInvitation() {

    if (startBtn && startBtn.disabled) {
        return;
    }

    showScreen("journeyScreen");

    setTimeout(() => {

        revealFirstJourneyItem();

    }, 600);
}


/* =====================================================
   JOURNEY
===================================================== */

const journeyScreen =
    document.getElementById("journeyScreen");

const journeyItems =
    document.querySelectorAll(
        "#journeyScreen .journey-item"
    );


/*
 * Hiện từng cột mốc khi người dùng
 * cuộn tới.
 */

function revealJourneyItem(item) {

    if (!item) return;

    item.classList.add("visible");
}


/*
 * Hiện cột mốc đầu tiên
 */

function revealFirstJourneyItem() {

    if (!journeyItems.length) {
        return;
    }

    revealJourneyItem(
        journeyItems[0]
    );
}


/*
 * Intersection Observer
 */

if (journeyScreen && journeyItems.length) {

    const journeyObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= .25
                    ) {

                        revealJourneyItem(
                            entry.target
                        );

                    }

                });

            },

            {
                root: journeyScreen,
                threshold: .25
            }
        );


    journeyItems.forEach(item => {

        journeyObserver.observe(item);

    });

}


/* =====================================================
   CONTINUE TO ENVELOPE
===================================================== */

function openEnvelopeScreen() {

    showScreen("envelopeScreen");

}


/* =====================================================
   ENVELOPE
===================================================== */

const envelopeWrapper =
    document.querySelector(
        ".envelope-wrapper"
    );


function openInvitation() {

    if (!envelopeWrapper) {
        return;
    }


    /*
     * Nếu đã mở rồi thì không mở lại
     */

    if (
        envelopeWrapper.classList.contains("open")
    ) {
        return;
    }


    envelopeWrapper.classList.add("open");


    /*
     * Cho người dùng nhìn animation
     * phong bì mở trước khi chuyển
     */

    setTimeout(() => {

        showScreen("invitationScreen");

    }, 1500);

}


/* =====================================================
   RSVP
===================================================== */

function showThankYou() {

    const thankYou =
        document.getElementById("thankYou");

    if (!thankYou) {
        return;
    }


    thankYou.classList.add("show");


    /*
     * Cuộn nhẹ xuống để người dùng
     * thấy lời cảm ơn
     */

    setTimeout(() => {

        thankYou.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* =====================================================
   KEYBOARD SUPPORT
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        /*
         * Enter / Space ở màn hình phong bì
         */

        if (
            currentScreen === "envelopeScreen" &&
            (
                event.key === "Enter" ||
                event.key === " "
            )
        ) {

            event.preventDefault();

            openInvitation();
        }

    }
);

function getGuestName() {
    const params = new URLSearchParams(window.location.search);
    return params.get("guest") || "bạn";
}

function renderGuestName() {
    const guestName = document.getElementById("guestName");

    if (guestName) {
        guestName.textContent = getGuestName();
    }
}

document.addEventListener("DOMContentLoaded", renderGuestName);