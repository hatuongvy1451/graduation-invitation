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
    guestTypes[type] || guestTypes.A;


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

    } else if (type === "TT") {

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

    } else if (type === "F") {
      thankYouMessage.textContent =
        "Con hẹn gặp cả nhà mình tại ngày đặc biệt này nha!";
    }

    else if (type === "UM") {
      thankYouMessage.textContent =
        "Con hẹn gặp Út Mi tại ngày đặc biệt này nha!";
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
    messageButton:
      "♡ Có điều t muốn nói với m... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho t xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù t biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "An ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà t muốn gửi đến m!",

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
    messageButton:
      "♡ Có điều tui muốn nói với bà... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Mai ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến bà!",

    invitation:
      "Tui mời Mai Mai đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp bà nha!",

    thankYou:
      "Cảm ơn bà đã đến chung vui cùng tui nha. Iu lắm!!!",

    message1:
      "Mai ơiii, vậy là 4,5 năm đại học cũng đã kết thúc rồi. Tiếc cái là ngày tốt nghiệp của tui và Nga lại trùng ngày, trùng luôn cả giờ nữa chứ. Hôm đó mà có bà ở bên cạnh chung vui cùng tui thì tui vui lắm luôn á, mặc dù không đủ 3 đứa mình nhưng có bà ở đó tui hạnh phúc lắm. Không cần gì nhiều đâu, chỉ cần bà đến, mình gặp nhau, nói chuyện, chụp 7749 tấm hình rồi cùng nhau lưu lại một kỷ niệm thật đẹp nha.",

    message2:
      "Bà cứ đi dự lễ của Nga trước nha, đừng rối hay lo phải chạy qua chạy lại giữa hai đứa tui nè. Nếu xong xuôi còn thời gian thì ghé qua tui chơi, còn không cũng hong sao hết á. Tụi mình hẹn một bữa khác quẩy tưng bừng, ăn mừng tốt nghiệp, nói tùm lum chuyện và chụp thêm 7749 tấm hình cùng nhau nhaaa. Chí cốt của tui!!!"
  },

  // N
  N: {
    messageButton:
      "♡ Có điều tui muốn nói với bà... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Nga ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến bà!",

    invitation:
      "Tui mời Ngọc Nga đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp bà nha!",

    thankYou:
      "Cảm ơn bà đã đến chung vui cùng tui nha. Iu lắm!!!",

    message1:
      "Nga ơiii, vậy là những năm tháng đại học của tụi mình cũng đã khép lại rồi. Mà buồn cái là ngày tốt nghiệp của hai đứa mình lại trùng ngày, trùng luôn cả giờ nữa chứ. Tiếc ghê, không thể có mặt trong ngày đặc biệt của nhau được.",

    message2:
      "Thôi thì hôm đó mỗi đứa tận hưởng ngày tốt nghiệp của mình nha. Rồi hẹn nhau một bữa khác, tụi mình phải quẩy, ăn mừng tốt nghiệp, nói tùm lum chuyện, chụp 7749 tấm hình bù lại mới được đó. Chúc mừng tốt nghiệp Nga nha, hẹn ngày lên kèo quẩy tưng bừng nhen!!! Chí cốt của tui!!!"
  },

  // TT
  TT: {
    messageButton:
      "♡ Có điều tui muốn nói với Tiến... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Tiến ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến Tiến!",

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
    messageButton:
      "♡ Có điều tui muốn nói với Gia Linh... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Gia Linh ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến Gia Linh!",

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
    messageButton:
      "♡ Có điều tui muốn nói với Ngọc Linh... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Ngọc Linh ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến Ngọc Linh!",

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
    messageButton:
      "♡ Có điều tui muốn nói với Trang... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Trang ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến Trang!",

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
    messageButton:
      "♡ Có điều tui muốn nói với Hạnh... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Hạnh ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến Hạnh!",

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
    messageButton:
      "♡ Có điều tui muốn nói với Ý... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Ý ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến Ý!",

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

  // B
  B: {
    messageButton:
      "♡ Có điều tui muốn nói với Bích... Nhấn vào để mở ra đọc nha ♡",

    messageButtonClose:
      "💗 Đọc xong rồi có thể nhấn vào đây để đóng lại nha",

    rsvpDescription:
      "Cho tui xin một chút thông tin để chuẩn bị chu đáo hơn nha. Mặc dù tui biết hết rồi nhưng vẫn phải hỏi cho đúng thủ tục hehe!!!",

    titleEnvelope:
      "Bích ơi,<br>mở thư nè!",

    envelopeMessage:
      "Có một lời mời nhỏ mà tui muốn gửi đến Bích!",

    invitation:
      "Tui mời Bích đến chung vui cùng tui trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Bích nha!",

    thankYou:
      "Cảm ơn Bích đã đến chung vui cùng tui nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Tui muốn ngày hôm đó có Bích ở đó để cùng tui ăn mừng, chụp 7749 tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Bích đến nha. Không cần gì nhiều đâu, chỉ cần mình gặp nhau, nói chuyện, chụp hình rồi cùng tui tận hưởng ngày này nha. Có bà ở đó thì ngày tốt nghiệp của tui sẽ vui hơn nhiều lắm đó."
  },

  // F
  F: {
    messageButton:
      "♡ Có điều con muốn nói với gia đình mình... Nhấn vào để mở ra đọc nha ạ ♡",

    messageButtonClose:
      "💗 Gia đình mình đọc xong rồi có thể nhấn vào đây để đóng lại nha ạ",

    titleEnvelope:
      "Cả nhà mình có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt con muốn gửi đến cả gia đình mình!",

    invitation:
      "Dạ con mời bà ngoại, ba mẹ, dượng/dì ba, cậu út, bé Bon/Ti đến chung vui cùng con trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Con hẹn gặp cả nhà mình ạ!",

    thankYou:
      "Cảm ơn cả nhà đã đến chung vui cùng con nha.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Con muốn ngày hôm đó có cả nhà ở đó để cùng con ăn mừng, chụp cả ngàn tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Cả nhà đến nha. Có gia đình bên cạnh con rất là vui và hạnh phúc lắm. Gia đình là số 1 của con!!!"
  },

  // UM
  UM: {
    messageButton:
      "♡ Có điều con muốn nói với Út Mi... Nhấn vào để mở ra đọc nha ạ ♡",

    messageButtonClose:
      "💗 Út Mi đọc xong rồi có thể nhấn vào đây để đóng lại nha ạ",

    titleEnvelope:
      "Út Mi có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt con muốn gửi đến Út Mi!",

    invitation:
      "Dạ con mời Út Mi đến chung vui cùng con trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp Út Mi nha!",

    thankYou:
      "Cảm ơn Út Mi đã đến chung vui cùng con ạ.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Con muốn ngày hôm đó có Út Mi ở đó để cùng con ăn mừng, chụp cả ngàn tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha.",
    message2:
      "Út Mi có thời gian thì đến với con nha. Có Út Mi bên cạnh con rất là vui và hạnh phúc lắm. Con yêu cô út của con!!!"
  },

  // MT
  MT: {
    messageButton:
      "♡ Có điều con muốn nói với Chú Mến và Dì Trinh... Nhấn vào để mở ra đọc nha ạ ♡",

    messageButtonClose:
      "💗 Chú Mến và Dì Trinh đọc xong rồi có thể nhấn vào đây để đóng lại nha ạ",

    titleEnvelope:
      "Gia đình Chú Mến và Dì Trinh có một<br>chiếc thư mời",

    envelopeMessage:
      "Có một điều đặc biệt con muốn gửi đến gia đình chú và dì!",

    invitation:
      "Dạ con mời chú và dì, bé Na, Bo đến chung vui cùng con trong ngày tốt nghiệp nhé.",

    thankYouTitle:
      "Hẹn gặp chú và dì cũng như bé Na và Bo nha!",

    thankYou:
      "Cảm ơn gia đình chú và dì đã đến chung vui cùng con ạ.",

    message1:
      "Vậy là 4,5 năm đại học cũng đã tới lúc kết thúc rồi. Con muốn ngày hôm đó có Chú Mến và Dì Trinh ở đó để cùng con ăn mừng, chụp cả ngàn tấm hình và lưu lại thật nhiều kỷ niệm tươi đẹp cùng nhau nha ạ.",
    message2:
      "Gia đình chú và dì có thời gian thì đến với con nha. Ngoài gia đình, chú và dì cũng là người đã chứng kiến từng bước con trưởng thành đến bây giờ, bé Na và Bo là 2 đứa em dễ thương). Có mọi người bên cạnh, con rất là vui và hạnh phúc lắm."
  }
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

  const rsvpDescription =
    document.getElementById("rsvpDescription");

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

  // Nút mở message
  const messageButton =
    document.querySelector(".secret-message-btn");

  if (messageButton) {
    messageButton.textContent =
      guestType.messageButton;
  }

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

  // Mô tả xác nhận
  if (rsvpDescription && guestType.rsvpDescription) {
    rsvpDescription.textContent =
      guestType.rsvpDescription.replace(
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

  // Thời gian tham dự
  const graduationTime = document.getElementById("graduationTime");

  if (graduationTime) {
    if (type === "F" || type === "UM" || type === "MT") {
      graduationTime.textContent = "09:00 - 11:00";
    } else {
      graduationTime.textContent = "09:30 - 11:00";
    }
  }
}

/* =================================================
   RSVP FORM
================================================= */

let rsvpGuestNumber = 1;


/* MỞ FORM */

function openRSVP() {
  const { type } = getGuestInfo();

  if (type === "F" || type === "UM" || type === "MT") {
    showThankYou();
    return;
  }

  const popup = document.getElementById("rsvpPopup");

  if (!popup) return;

  // Hiện popup
  popup.classList.add("show");

  // Khóa scroll trang phía sau
  document.body.style.overflow = "hidden";
}


/* ĐÓNG FORM */

function closeRSVP() {

  const popup = document.getElementById("rsvpPopup");

  if (!popup) return;

  popup.classList.remove("show");

  document.body.style.overflow = "";

}


/* SỐ NGƯỜI THAM DỰ */

function changeGuestNumber(value) {

  rsvpGuestNumber += value;

  if (rsvpGuestNumber < 1) {
    rsvpGuestNumber = 1;
  }

  if (rsvpGuestNumber > 10) {
    rsvpGuestNumber = 10;
  }

  const number =
    document.getElementById("rsvpGuestNumber");

  if (number) {
    number.textContent = rsvpGuestNumber;
  }

}


/* SUBMIT */

function submitRSVP(event) {
  event.preventDefault();

  const form = document.getElementById("rsvpForm");

  const name = document.getElementById("rsvpName").value.trim();
  const contact = document.getElementById("rsvpContact").value.trim();

  if (!name) {
    alert("Vui lòng nhập tên của bạn nha 💗");
    return;
  }

  if (!contact) {
    alert("Vui lòng nhập thông tin liên hệ nha 💗");
    return;
  }

  emailjs.sendForm(
    "service_wvbf5le",
    "template_6mbdsnq",
    form
  )
    .then(function () {

      console.log("Gửi xác nhận thành công!");

      // Đóng form xác nhận
      closeRSVP();

      // Hiện popup cảm ơn
      showThankYou();

      // Xóa dữ liệu form
      form.reset();

    })
    .catch(function (error) {

      console.error("EmailJS Error:", error);

      alert(
        "Không gửi được thông tin. Bạn thử lại giúp mình nha 💗"
      );
    });
}

/* CLICK RA NGOÀI POPUP */

document.addEventListener(
  "click",
  function (event) {

    const popup =
      document.getElementById("rsvpPopup");

    if (!popup) return;

    if (
      event.target === popup
    ) {
      closeRSVP();
    }

  }
);


/* ESC */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {
      closeRSVP();
    }

  }
);

function toggleMessage() {
  const message = document.getElementById("hiddenMessage");
  const button = document.querySelector(".secret-message-btn");

  if (!message || !button) return;

  const { type } = getGuestInfo();

  const guestType =
    guestTypes[type] || guestTypes.A;

  message.classList.toggle("show");

  if (message.classList.contains("show")) {
    button.textContent =
      guestType.messageButtonClose;
  } else {
    button.textContent =
      guestType.messageButton;
  }
}