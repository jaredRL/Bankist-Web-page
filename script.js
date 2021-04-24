'use strict';

///////////////////////////////////////////////////////////
////////////      Selection of Elements          //////////
///////////////////////////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
///////////////////////////////////////////////////////////
////////////         Modal Window          ///////////////
///////////////////////////////////////////////////////////

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

///////////////////////////////////////////////////////////
////////////      Event Listeners            /////////////
///////////////////////////////////////////////////////////
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Smooth scroll to section 1 of the page when the 'learn more' button is clicked
btnScrollTo.addEventListener('click', function (e) {
  //get section coordinates
  const s1coords = section1.getBoundingClientRect();
  //scrolling
  /*   window.scrollTo(
    //desired section coordinates + current scroll position(wherever that happens to be)
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );
*/

  /*   //Smooth scrolling in older browsers
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
 */
  //Smooth scrolling in modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////    NAVBAR LINKS       ///////////////////
//select all navbar elements, use forEach to perform a f'n on each element
/* document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault(); //prevents jumping to href upon click
    const id = this.getAttribute('href'); //'this' points to the current element in an event listener
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //use 'id' which is assigned to the href attribute of the clicked element as a UI location to call .scrollIntoView()
  });
});
 */

//////////////    EVENT DELEGATION       //////////////////
/*Use the fact that events bubble up from an event target though its parent elements to delegate the event-handler to a parent element, thus avoiding unnecessary copying of the event-handler, which may impact performance when there are many elements involved.

Another important use case for event delegation is for elements that may not exist yet in the UI at runtime. E.g. Buttons can be created in the UI dynamically as the user interacts.
*/
// 1. Add event listener to common parent element
// 2. Determine which element originated the event (event target: e.target)

document.querySelector('.nav__links').addEventListener('click', function (e) {
  //Matching strategy(does e.target contain the link?)
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault(); //prevents jumping to href upon click
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////    Tab buttons       //////////////////
//delegate tab buttons to parent element
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //Guard clause:
  if (!clicked /* falsy */) return; //ignores clicks outside of buttons

  //Activate clicked tab:
  // 1. remove active class from all tabs, in preparation for adding it to the clicked tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // 2. add active class
  clicked.classList.add('operations__tab--active');

  //Activate Content Area
  // 1. Remove active class from all content
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // 2. add active class:
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////////////////
// ///////  Nav link fade animation    ////////////////////
///////////////////////////////////////////////////////////

// //mouseenter doesn't bubble, so use 'mouseover'
// nav.addEventListener('mouseover', function (e) {
//   //check if the clicked element is indeed a nav link
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     //to select siblings, go to the closest parent element and select the child elements
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     console.log(siblings);
//     //select the logo by [same as above]
//     const logo = link.closest('.nav').querySelector('img');
//   }
//   //Reduce opacity of non-targeted links
//   siblings.forEach(el => {
//     if (el !== link) {
//       el.style.opacity = 0.5;
//       logo.style.opacity = 0.5;
//     }
//   });
// });

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};
//Rather than having the event listener handler f'n call the handlehover f'n, we can use the bind method to set the this keyword to the desired opacity value. This results in relatively cleaner and more concise code.
nav.addEventListener('mouseover', handleHover.bind(0.5));

//when the mouse leaves the element
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////
////////////  make the Navbar sticky  ////////////////////
///////////////////////////////////////////////////////////
//Using a scroll event is generally bad practice, because scroll events are constantly firing, which leads to poor performance on certain devices. The solution below uses the scroll event. For a better solution, see the code which follows: 'Sticky Nav: Intersection Observer API'
// 1. Get the scroll position at which you want the sticky navbar to begin.
// const initialCoords = section1.getBoundingClientRect();
// // 2. Use that information to build the scroll event listener (scroll events are on the window)
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

///////////////////////////////////////////////////////////
//////////  Sticky Nav: Intersection Observer API  ////////
///////////////////////////////////////////////////////////
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {});
// };

// const obsOptions = {
//   root: null, //when the value is 'null', the root is the viewport
//   threshold: 0.1, //the point of intersection between the viewport and the specified area of the page at which we want the action to take place
// };

// //Create an intersection observer which accepts a callback and an options object:
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; //like const entry = entries[0]
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, //percentage
  rootMargin: `-${navHeight}px`, //units must be px
});

headerObserver.observe(header);

///////////////////////////////////////////////////////////
//////////  Revealing elements on scroll   ///////////////
///////////////////////////////////////////////////////////
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //protect performance by preventing repeated observations
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2, //when >= 20% of section intersects w/ viewport
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////
//////////        Lazy Loading Images       ///////////////
///////////////////////////////////////////////////////////
const loadImg = function (entries, observer) {
  const [entry] = entries; // = entries[0] (since there is only one threshold in this case, there will be only one entry)

  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //Use a listener to detect when the high-res image has loaded, and only then remove the blur filter
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //Protect performance: Stop observing once images have been revealed
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '100px', //load the images 100px before they appear in the UI during scrolling
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////////
//////////        The slider component       //////////////
///////////////////////////////////////////////////////////
const slide = function () {
  // `slider.style.transform = 'scale(0.4) translateX(-700px)';
  // slider.style.overflow = 'visible';
  //set the initial location of slides:
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`)); //0%, 100%, 200%, 300% (see html/css)

  //Right side button (next slide):
  let curSlide = 0;
  const maxSlide = slides.length; //we can read the length property on a nodeList, as we do an array

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = 'dots__dot' data-slide = '${i}'></button>`
      );
    });
  };
  createDots();

  const activateDot = function (slide) {
    // 1. Remove active class from all dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // 2. Add active class to the dot which corresponds to the current slide
    document
      .querySelector(`.dots__dot[data-slide = '${slide}']`)
      .classList.add('dots__dot--active');
  };
  activateDot(0);

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  goToSlide(0);

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    }
    curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //move slides with arrow keys
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //get slide, based on the data attribute for each dot
      const { slide } = e.target.dataset;
      //const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slide();
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// TODO: Boundary: Web page / lecture notes
///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
////////////            LECTURES                  ////////
///////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////      Types of Events and Event Handlers, lect. 186
///////////////////////////////////////////////////////////
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('Yada yada yada');
};
//Code executed when the mouse pointer enters a certain element: MOUSEENTER
// h1.addEventListener('mouseenter', alertH1);
//works similar to hover

//If you want to remove an event listener after a single event (e.g. remove alertH1 3sec after event)
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

////////////////////////////////////////////////////////////  Event Propogation: Bubbling + Capturing, lect. 187-8   ////////////////////////////////////////////////////////////
/* JavaScript events have two phases: Bubbling and Capturing.
 */

////////////////////////////////////////////////////////////                DOM Traversing, lect. 190                ////////////////////////////////////////////////////////////
/* Definition: walking through the DOM, selecting an element based on another element
 */

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CodeWars
/* There is an array with some numbers. All numbers are equal except for one. Try to find it!

findUniq([ 1, 1, 1, 2, 1, 1 ]) === 2
findUniq([ 0, 0, 0.55, 0, 0 ]) === 0.55
It’s guaranteed that array contains at least 3 numbers.

The tests contain some very huge arrays, so think about performance. */
///////////////////////////////////////////////////////////

// Case 1:
// const arrUp2 = [1, 2, 2]; //----------------1 = 2
// const arrDown2 = [2, 2, 1]; //----------------0 = 1

// // Case 2:
// const arrUp1 = [1, 1, 2]; // ----------------0 = 1
// const arrDown1 = [2, 1, 1]; //----------------1 = 2

// 0 = 1 ? unique = pos2
// 1 = 2 ? unique = pos0

//Maybe the positions aren't as important as I'm guessing.
//Case 1, Up:   pos1 = pos2 ? unique = pos0
//Case 2, Up:   pos0 = pos1 ? unique = pos2
//Case 1, Down: pos0 = pos1 ? unique = pos2
//Case 2, Down: pos1 = pos2 ? unique = pos0

// 2U = 1D = UniqueNumber = position 2
// 2D = 1U = UniqueNumber = position 0
//
///////////////////////////////////////////////////////////

function findUniq(arr) {
  const uniqArr = arr.sort((a, b) => a - b).filter(num => num !== arr[1]);
  return uniqArr[0];
}

// console.log(findUniq([3, 10, 3, 3, 3]));
