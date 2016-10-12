class SoundToArray {
    constructor() {
        this.audioContext = new window.AudioContext();
        this.analyser = this.audioContext.createAnalyser();
    }

    set fftSize(size) {
        context.analyser.fftSize = size;
    }

    get fftSize() {
        return context.analyser.fftSize;
    }

    setup(fftSize) {
        this.analyser.fftSize = fftSize || 64;

        return new Promise((resolve, reject) => {
            if (!navigator.getUserMedia || !window.AudioContext) {
                reject("WebAudio API not supported on your browser!");
                return;
            }

            navigator.getUserMedia({ audio: true },
                (stream) => {
                    const source = this.audioContext.createMediaStreamSource(stream);

                    source.connect(this.analyser);

                    resolve();
                },
                (err) => {
                    reject('User media error occured: ' + err.name + ' ' + err.message);
                });
        });
    }

    *data() {
        const bufferLength = this.analyser.fftSize,
            dataArray = new Uint8Array(bufferLength);

        this.analyser.getByteFrequencyData(dataArray);

        yield dataArray;
    }
}