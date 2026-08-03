document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("mainVideoPlayer");
    const workspace = document.getElementById("playerWorkspace");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const rewindBtn = document.getElementById("rewindBtn");
    const forwardBtn = document.getElementById("forwardBtn");
    const currentTimeEl = document.getElementById("currentTime");
    const totalDurationEl = document.getElementById("totalDuration");
    const timelineWrapper = document.getElementById("timelineWrapper");
    const timelineProgress = document.getElementById("timelineProgress");
    const fullScreenBtn = document.getElementById("fullScreenBtn");
    const leftTapZone = document.getElementById("leftTapZone");
    const rightTapZone = document.getElementById("rightTapZone");
    const mobileSettingsOpenBtn = document.getElementById("mobileSettingsOpenBtn");
    const mobileBottomSheet = document.getElementById("mobileBottomSheet");
    const sheetBackdrop = document.getElementById("sheetBackdrop");
    const sheetCloseBtn = document.getElementById("sheetCloseBtn");

    if (!video || !workspace) {
        return;
    }

    let controlsTimeout;

    const formatTime = (seconds) => {
        if (Number.isNaN(seconds)) {
            return "00:00";
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
    };

    const resetControlsTimeout = () => {
        workspace.classList.add("show-controls");
        window.clearTimeout(controlsTimeout);

        if (!video.paused) {
            controlsTimeout = window.setTimeout(() => {
                workspace.classList.remove("show-controls");
            }, 3000);
        }
    };

    const setPlayIcon = () => {
        if (!playPauseBtn) {
            return;
        }

        playPauseBtn.innerHTML = video.paused
            ? '<i class="fa-solid fa-play"></i>'
            : '<i class="fa-solid fa-pause"></i>';
    };

    const closeBottomSheet = () => {
        mobileBottomSheet?.classList.remove("open");

        if (sheetBackdrop) {
            sheetBackdrop.style.display = "none";
        }
    };

    workspace.addEventListener("mousemove", resetControlsTimeout);
    workspace.addEventListener("click", resetControlsTimeout);
    workspace.addEventListener("touchstart", resetControlsTimeout);

    playPauseBtn?.addEventListener("click", (event) => {
        event.stopPropagation();

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }

        setPlayIcon();
        resetControlsTimeout();
    });

    forwardBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        video.currentTime = Math.min(video.duration || video.currentTime + 10, video.currentTime + 10);
        resetControlsTimeout();
    });

    rewindBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - 10);
        resetControlsTimeout();
    });

    leftTapZone?.addEventListener("click", (event) => {
        event.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - 10);
        leftTapZone.classList.add("ripple-active");
        window.setTimeout(() => leftTapZone.classList.remove("ripple-active"), 500);
        resetControlsTimeout();
    });

    rightTapZone?.addEventListener("click", (event) => {
        event.stopPropagation();
        video.currentTime = Math.min(video.duration || video.currentTime + 10, video.currentTime + 10);
        rightTapZone.classList.add("ripple-active");
        window.setTimeout(() => rightTapZone.classList.remove("ripple-active"), 500);
        resetControlsTimeout();
    });

    video.addEventListener("timeupdate", () => {
        if (video.duration && timelineProgress) {
            timelineProgress.style.width = `${(video.currentTime / video.duration) * 100}%`;
        }

        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(video.currentTime);
        }
    });

    video.addEventListener("loadedmetadata", () => {
        if (totalDurationEl) {
            totalDurationEl.textContent = formatTime(video.duration);
        }
    });

    video.addEventListener("play", setPlayIcon);
    video.addEventListener("pause", setPlayIcon);

    timelineWrapper?.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!video.duration) {
            return;
        }

        const rect = timelineWrapper.getBoundingClientRect();
        video.currentTime = ((event.clientX - rect.left) / rect.width) * video.duration;
    });

    fullScreenBtn?.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!document.fullscreenElement) {
            workspace.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    mobileSettingsOpenBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        mobileBottomSheet?.classList.add("open");

        if (sheetBackdrop) {
            sheetBackdrop.style.display = "block";
        }
    });

    sheetCloseBtn?.addEventListener("click", closeBottomSheet);
    sheetBackdrop?.addEventListener("click", closeBottomSheet);

    document.querySelectorAll(".sheet-opt-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const parent = button.parentElement;
            parent.querySelectorAll(".sheet-opt-btn").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
        });
    });
});
