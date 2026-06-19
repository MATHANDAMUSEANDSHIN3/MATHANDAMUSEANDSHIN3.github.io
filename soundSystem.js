const SoundSystem = (() => {

    const sounds = {
        cursor: new Audio("cursor.wav"),
        accept: new Audio("portal reverb.wav"),
    cancel: new Audio("electricArc.wav"),
        item: new Audio("cursor.wav"),
        open: new Audio("cursor.wav"),
        computer: new Audio("roboReady.wav")
    };

    function play(name) {

        const sound = sounds[name];

        if (!sound) return;

        sound.currentTime = 0;
        sound.play();

    }

    return {
        play
    };

})();