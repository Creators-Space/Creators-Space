// START
// This script is writtern for changing the three images of the hero section of webpage...
const heroImagesLinks = ['/assets/images/hero-img-left.png', '/assets/images/hero-img-center.png', '/assets/images/hero-img-right.png'];
let heroImgLeft = document.getElementById('hero-img-left');
let heroImgCenter = document.getElementById('hero-img-center');
let heroImgRight = document.getElementById('hero-img-right');
let leftImg = 0, centerImg = 1, rightImg = 2;

setInterval(() => {
    leftImg = (leftImg + 1) % 3;
    centerImg = (centerImg + 1) % 3;
    rightImg = (rightImg + 1) % 3;
    // switching the images...
    heroImgLeft.src = heroImagesLinks[leftImg];
    heroImgCenter.src = heroImagesLinks[centerImg];
    heroImgRight.src = heroImagesLinks[rightImg];

}, 3000);
// This script is writtern for changing the three images of the hero section of webpage...
// END