const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d'); //canvasRenderingContext2D - main API to draw and read pixels
const strip = document.querySelector('.strip'); //elsment to show saved photos
const snap = document.querySelector('.snap'); //shutter sound

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }) //return a promise
        .then(localMediaStream => {
            // console.log(localMediaStream);
            // video.src = window.URL.createObjectURL(localMediaStream); // it is object therefor we are converting it into a url using windo.URL.createObjecURL which is now depreciated
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error("OH NO!!!", err);

        });
}


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height); //paints the current video frame onto the canvas.

        //filters on the video
        let pixels = ctx.getImageData(0, 0, width, height); // this will give us a big array containing rgba value of each pixels.
        //returns an object with a data property -- a Unit8ClampedArray of RGBA values in order [R,G,B,A,R,G,B,A...] each pixel has 4 values (0-255) 
        // console.log(pixels);
        // debugger;


        //red effect
        // pixels = redEffect(pixels);

        // //rgbsplit effect
        pixels = rgbSplit(pixels);

        ctx.globalAlpha = 0.1; //ghosting effect 

        //green screen effect
        // pixels = greenScreen(pixels);

        //put them back to canvas.
        ctx.putImageData(pixels, 0, 0);




    }, 16);
}

function takePhoto() {

    //played the sound
    // snap.currentTime = 0;
    // snap.play();

    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg'); //return a base64-encoded image string
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'picture');
    link.textContent = 'Download Image';
    link.innerHTML = `<img src='${data}' alt='your image'/>`
    strip.insertBefore(link, strip.firstChild);
    console.log(data);//this will give text page representation of image
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200;//red
        pixels.data[i + 1] = pixels.data[i + 1] - 110;//green
        pixels.data[i + 2] = pixels.data[i + 2] + 100;//blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 650] = pixels.data[i + 0];//red
        pixels.data[i + 500] = pixels.data[i + 1];//green
        pixels.data[i - 550] = pixels.data[i + 2];//blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = (input.value);
    });

    // console.log(levels);

    for (i = 0; i < pixels.data.length; i += 4) {
        let red = pixels.data[i + 0];
        let green = pixels.data[i + 1];
        let blue = pixels.data[i + 2];
        let alpha = pixels.data[i + 3];

        if (red >= levels.rmin && red <= levels.rmax &&
            green >= levels.gmin && green <= levels.gmax &&
            blue >= levels.bmin && blue <= levels.bmax) {
            //take it out
            pixels.data[i + 3] = 0;
        }

    }
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas); //canplay fires when video has enough data to start playing