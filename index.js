let deferredPrompt;
window.canSubmit = false;
const addBtn = document.querySelector(".install-pwa-btn");
const submitBtn = document.querySelector(".submit-btn");
const allInputs = document.querySelectorAll("input");

// Handle virtual keyboard
if ("virtualKeyboard" in navigator) {
  // Tell the browser you are taking care of virtual keyboard occlusions yourself.
  navigator.virtualKeyboard.overlaysContent = true;
  navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
    const { x, y, width, height } = event.target.boundingRect;
    if (height > 0) {
      console.log("keyboard is shown");
      if (window.canSubmit) {
        submitBtn.style.display = "block";
      }
    } else {
      console.log("keyboard is hidden");
      submitBtn.style.display = "none";
    }
  });
}

// Register service worker to control making site work offline
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/poc-img/sw.js").then(() => {
    console.log("Service Worker Registered");
  });
}

// Handle install prompt on desktop
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = "block";
  addBtn.addEventListener("click", () => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = "flex";
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the Install prompt");
        if (allInputs?.[0]) {
          allInputs[0].focus();
        }
      } else {
        console.log("User dismissed the Install prompt");
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener("appinstalled", () => {
  addBtn.style.display = "none";
});
