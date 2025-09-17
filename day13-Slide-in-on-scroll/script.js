

//debounce fn need to better understand..
function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function () {
        var context = this, args = arguments; //this refers current obj and argument are all value passed into a function
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};




//select images to slide in
const sliderImage = document.querySelectorAll('.slide-in')
//create a function called check slide every time a person scroll console.count(e)
function checkSlide(e) {
    //loop over the image
    sliderImage.forEach(sliderImage => {
        //window.scrollY it returns the pixels a document has scrolled from the upper left corner of the window
        //window.innerHeight return the height of a window's content area. ---this is read only.
        //slideImage.height return the height of the image and here we are storing the value when image is half shown.
        const slideInAt = (window.scrollY + window.innerHeight) - sliderImage.height / 2; //over here slideInAt variable is equal to the value of window.scrollY 

        const imageBottom = sliderImage.offsetTop + sliderImage.height; //to store bottom of the image we are adding the offsettop of image and adding it to it's height
        const isHalfShown = slideInAt > sliderImage.offsetTop;
        const isNotScrolledPast = window.scrollY < imageBottom;

        if (isHalfShown && isNotScrolledPast) {
            sliderImage.classList.add('active');
        } else {
            sliderImage.classList.remove('active');
        }
    });
}

//when the window is scrolled run fn check slide == performance issue use debounce
window.addEventListener('scroll', debounce(checkSlide));





