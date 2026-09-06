/* =====================================================
   SCREEN CONTROL
===================================================== */

let currentScreen =
  sessionStorage.getItem("currentScreen") || "loadingScreen";


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

  // Lưu màn hình hiện tại
  sessionStorage.setItem(
    "currentScreen",
    screenId
  );
}


/* =====================================================
   KHÔI PHỤC MÀN HÌNH KHI QUAY LẠI
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const savedScreen =
    sessionStorage.getItem("currentScreen");

  if (savedScreen) {

    const screen =
      document.getElementById(savedScreen);

    if (screen) {

      // Tắt tất cả màn hình
      document
        .querySelectorAll(".page")
        .forEach(page => {
          page.classList.remove("active");
        });

      // Mở lại màn hình trước đó
      screen.classList.add("active");

      currentScreen = savedScreen;

      screen.scrollTo({
        top: 0,
        behavior: "instant"
      });
    }
  }

  renderGuestName();
});

/* =====================================================
   LOADING
===================================================== */

const progressBar =
  document.getElementById("progressBar");

const progressPercent =
  document.getElementById("progressPercent");

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

  "Và một lời mời đặc biệt dành cho bạn..."
];


const loadingInterval =
  setInterval(() => {

    progress += 2;

    if (progressPercent) {
      progressPercent.textContent =
        `${Math.min(progress, 100)}%`;
    }

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

  const popup =
    document.getElementById("thankYouPopup");

  if (!popup) return;

  const {
    guest,
    type
  } = getGuestInfo();

  const guestType =
    guestTypes[type] || guestTypes.ten;


  /* ===============================
     TIÊU ĐỀ
  =============================== */

  const thankYouTitle =
    document.getElementById("thankYouTitle");

  if (thankYouTitle) {

    thankYouTitle.textContent =
      guestType.thankYouTitle.replace(
        "{guest}",
        guest
      );
  }


  /* ===============================
     LỜI CẢM ƠN
  =============================== */

  const thankYouText =
    document.getElementById("thankYouText");

  if (thankYouText) {

    thankYouText.textContent =
      guestType.thankYou.replace(
        "{guest}",
        guest
      );
  }


  /* ===============================
     MESSAGE
  =============================== */

  const thankYouMessage =
    document.querySelector(
      ".thankyou-message span"
    );

  if (thankYouMessage) {

    if (type === "A") {

      thankYouMessage.textContent =
        "Hẹn gặp m tại ngày đặc biệt này nha!";

    } else if (type === "M" || type === "N") {

      thankYouMessage.textContent =
        "Hẹn gặp chí cốt của tui tại ngày đặc biệt này nha!";

    } else if (type === "T") {

      thankYouMessage.textContent =
        "Hẹn gặp Tiến tại ngày đặc biệt này nha!";

    } else if (type === "GL") {

      thankYouMessage.textContent =
        "Hẹn gặp Gia Linh tại ngày đặc biệt này nha!";

    } else if (type === "NL") {

      thankYouMessage.textContent =
        "Hẹn gặp Ngọc Linh tại ngày đặc biệt này nha!";

    } else if (type === "T") {

      thankYouMessage.textContent =
        "Hẹn gặp Trang tại ngày đặc biệt này nha!";

    } else if (type === "H") {

      thankYouMessage.textContent =
        "Hẹn gặp Hạnh tại ngày đặc biệt này nha!";
    } else if (type === "Y") {

      thankYouMessage.textContent =
        "Hẹn gặp Ý tại ngày đặc biệt này nha!";
    }
  }


  /* ===============================
     HIỆN POPUP
  =============================== */

  popup.classList.add("show");

  document.body.style.overflow = "hidden";
}


function closeThankYou() {

  const popup =
    document.getElementById("thankYouPopup");

  if (!popup) return;

  popup.classList.remove("show");

  document.body.style.overflow = "";
}


/* Click ra ngoài popup để đóng */

const thankYouPopup =
  document.getElementById("thankYouPopup");

if (thankYouPopup) {

  thankYouPopup.addEventListener(
    "click",
    function (event) {

      if (event.target === this) {
        closeThankYou();
      }

    }
  );
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

/* =====================================================
   GUEST
===================================================== */

function getGuestInfo() {
  const params = new URLSearchParams(window.location.search);

  const guest = params.get("guest") || "bạn";
  const type = (params.get("type") || "A").toUpperCase();

  return {
    guest,
    type
  };
}

/* =====================================================
   GUEST TYPE
===================================================== */

const guestTypes = {

  // A
  A: {
    titleEnvelope:
      "Ngọc An có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt t muốn gửi đến m!",

    invitation:
      "T mời m đến chung vui cùng t trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp m nha!",

    thankYou:
      "Cảm ơn m đã đến chung vui cùng t nha. Iu lắm!!!",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. T muốn ngày hôm đó có m ở đó để cùng t ăn mừng, chụp 7749 tấm hình và lưu lại vài kỷ niệm trước khi mỗi đứa lại bận với những chặng đường riêng.",

    message2:
      "M đến nha. Không cần gì nhiều đâu, chỉ cần gặp nhau, nói chuyện, chụp hình rồi cùng t tận hưởng ngày này là vui rồi. Có m ở đó thì ngày tốt nghiệp của t sẽ vui hơn nhiều lắm đó. Bạn ruột của t!!!"
  },

  // M
  M: {
    titleEnvelope:
      "Mai Mai có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Mai Mai!",

    invitation:
      "Tui mời Mai Mai đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp bà nha!",

    thankYou:
      "Cảm ơn bà đã đến chung vui cùng tui nha. Iu lắm!!!",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có bà ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",

    message2:
      "Bà đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có bà ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó. Chí cốt của tui!!!"
  },

  // N
  N: {
    titleEnvelope:
      "Ngọc Nga có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Ngọc Nga!",

    invitation:
      "Tui mời Ngọc Nga đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp bà nha!",

    thankYou:
      "Cảm ơn bà đã đến chung vui cùng tui nha. Iu lắm!!!",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có bà ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",

    message2:
      "Bà đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có bà ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó. Chí cốt của tui!!!"
  },

  // T
  T: {
    titleEnvelope:
      "Tăng Tiến có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Tiến!",

    invitation:
      "Tui mời Tiến đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Tiến nha!",

    thankYou:
      "Cảm ơn Tiến đã đến chung vui cùng tui nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có Tiến ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Tiến đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có Tiến ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó."
  },

  // GL
  GL: {
    titleEnvelope:
      "Gia Linh có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Gia Linh!",

    invitation:
      "Tui mời Gia Linh đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Gia Linh nha!",

    thankYou:
      "Cảm ơn Gia Linh đã đến chung vui cùng tui nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có Gia Linh ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Gia Linh đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có Gia Linh ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó."
  },

  // NL
  NL: {
    titleEnvelope:
      "Ngọc Linh có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Ngọc Linh!",

    invitation:
      "Tui mời Ngọc Linh đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Ngọc Linh nha!",

    thankYou:
      "Cảm ơn Ngọc Linh đã đến chung vui cùng tui nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có Ngọc Linh ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Ngọc Linh đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có Ngọc Linh ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó."
  },

  // T
  T: {
    titleEnvelope:
      "Trang có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Trang!",

    invitation:
      "Tui mời Trang đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Trang nha!",

    thankYou:
      "Cảm ơn Trang đã đến chung vui cùng tui nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có Trang ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Trang đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có Trang ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó."
  },

  // H
  H: {
    titleEnvelope:
      "Hạnh có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Hạnh!",

    invitation:
      "Tui mời Hạnh đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Hạnh nha!",

    thankYou:
      "Cảm ơn Hạnh đã đến chung vui cùng tui nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có Hạnh ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Hạnh đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có Hạnh ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó."
  },

  // Y
  Y: {
    titleEnvelope:
      "Như Ý có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt tui muốn gửi đến Ý!",

    invitation:
      "Tui mời Ý đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Ý nha!",

    thankYou:
      "Cảm ơn Ý đã đến chung vui cùng tui nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có Ý ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Ý đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có Ý ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó. Và tui đợi ngày tốt nghiệp của Ý nha hihi!!!"
  },
};


/* =====================================================
   RENDER GUEST
===================================================== */

function renderGuestName() {

  const { guest, type } = getGuestInfo();

  const guestName =
    document.getElementById("guestName");

  const guestMessage =
    document.getElementById("guestMessage");

  const titleEnvelope =
    document.getElementById("titleEnvelope");

  const envelopeMessage =
    document.getElementById("envelopeMessage");

  const thankYouTitle =
    document.getElementById("thankYouTitle");

  const thankYouText =
    document.querySelector("#thankYou p");

  const message1 =
    document.getElementById("message1");

  const message2 =
    document.getElementById("message2");

  const guestType =
    guestTypes[type] || guestTypes.A;


  // Tên khách
  if (guestName) {
    guestName.textContent = guest;
  }


  // Lời mời
  if (guestMessage) {
    guestMessage.textContent =
      guestType.invitation.replace(
        "{guest}",
        guest
      );
  }


  // Tiêu đề phong bì
  if (titleEnvelope) {
    titleEnvelope.innerHTML =
      guestType.titleEnvelope.replace(
        "{guest}",
        guest
      );
  }


  // Lời nhắn trong phong bì
  if (envelopeMessage) {
    envelopeMessage.innerHTML =
      guestType.envelopeMessage.replace(
        "{guest}",
        guest
      );
  }


  // Tiêu đề cảm ơn
  if (thankYouTitle) {
    thankYouTitle.textContent =
      guestType.thankYouTitle.replace(
        "{guest}",
        guest
      );
  }


  // Lời cảm ơn
  if (thankYouText) {
    thankYouText.textContent =
      guestType.thankYou.replace(
        "{guest}",
        guest
      );
  }


  // Message 1
  if (message1) {
    message1.textContent =
      guestType.message1.replace(
        "{guest}",
        guest
      );
  }


  // Message 2
  if (message2) {
    message2.textContent =
      guestType.message2.replace(
        "{guest}",
        guest
      );
  }
}