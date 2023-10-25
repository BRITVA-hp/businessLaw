document.addEventListener('DOMContentLoaded', () => {

  //menu

  const burger = document.querySelector('.header__burger')
  const menu = document.querySelector('.menu')
  const menuClose = document.querySelector('.menu__close')
  const menuLinks = document.querySelectorAll('.menu__link')

  burger.addEventListener('click', () => menu.classList.add('menu--active'))
  menuClose.addEventListener('click', () => menu.classList.remove('menu--active'))
  menuLinks.forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('menu--active'))
  })
  menu.addEventListener('click', e => {
    if (e.target.classList.contains('menu')) {
      menu.classList.remove('menu--active')
    }
  })

  // modal

  function calcScroll() {
    let div = document.createElement('div');

    div.style.width = '50px';
    div.style.height = '50px';
    div.style.overflowY = 'scroll';
    div.style.visibility = 'hidden';

    document.body.appendChild(div);
    let scarollWidth = div.offsetWidth - div.clientWidth;
    div.remove();

    return scarollWidth;
  }

  let scrollWidth = calcScroll();

  function modal(modal, modalActiveClass, triggers, modalClose) {
    const triggers_ = document.querySelectorAll(triggers),
      modal_ = document.querySelector(modal),
      modalClose_ = document.querySelector(modalClose);

    if (triggers_.length > 0) {
      triggers_.forEach(item => {
        item.addEventListener('click', () => {
          modal_.classList.add(modalActiveClass);
          document.body.style.overflow = 'hidden';
          document.body.style.marginRight = `${scrollWidth}px`;
        });
      });

      modalClose_.addEventListener('click', () => {
        modal_.classList.remove(modalActiveClass);
        document.body.style.overflow = '';
        document.body.style.marginRight = '0px';
      });

      modal_.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal__container')) {
          modal_.classList.remove(modalActiveClass);
          document.body.style.overflow = '';
          document.body.style.marginRight = '0px';
        }
      });
    }
  }

  modal('.modal', 'modal--active', '[data-modal]', '.modal__close');
  modal('.modal-info', 'modal--active', '[data-modal-info]', '.modal-info__close');

  //slider
  function slider(settings) {
    const window_ = document.querySelector(settings.windowSelector),
      field_ = document.querySelector(settings.fieldSelector),
      cards_ = document.querySelectorAll(settings.cardSelector),
      arrowPrev_ = document.querySelector(settings.buttonPrevSelector),
      arrowNext_ = document.querySelector(settings.buttonNextSelector),
      progress_ = document.querySelector(settings.progressSelector),
      dotsWrap_ = document.querySelector(settings.dotsWrapSelector);

    let startPoint,
      swipeAction,
      endPoint,
      sliderCounter = 0,
      dots_ = [],
      mouseMoveFlag = false,
      moveLastCardFlag = false

    if (window_) {
      // cards_[sliderCounter].querySelector('img').onload = function() {
      //   window_.style.height = cards_[sliderCounter].clientHeight + 'px'
      // }

      // считаем расстояние между карточками
      // общая длина всех карточек + расстояния между ними
      const lengthCardAndBetweenCards = cards_[cards_.length - 1].getBoundingClientRect().right - cards_[0].getBoundingClientRect().left;
      // расстояние между карточками
      const betweenCards = (lengthCardAndBetweenCards - (cards_[0].clientWidth * cards_.length)) / (cards_.length -1);

      // считаем количество карточек, помещающихся в окне
      function numberIntegerVisibleCards() {
        return Math.floor((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
      }
      // считаем на какая часть карточки не помещается
      function partCard() {
        return (window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards) - Math.trunc((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
      }
      // проверяем, показывается ли последняя карточка
      function lastCard() {
        if ( (sliderCounter + numberIntegerVisibleCards()) >= (cards_.length) && cards_.length > numberIntegerVisibleCards()) {
          sliderCounter = cards_.length - numberIntegerVisibleCards() - 1
          return true
        }
        return false
      }

      // проверяем, больше ли у нас карточек, чем может поместиться в видимой части слайдера
      function checkNumCards() {
        if (cards_.length > numberIntegerVisibleCards()) {
          return true
        }
        field_.style.transform = '';
        return false
      }

      //Устанавливаем ширину бегунка прогресс-бара
      if (progress_) {
        progress_.style.width = 100 / cards_.length + '%'
      }

      // Слайд следующий

      function slideNext(dots = false) {
        if (!checkNumCards()) {
          return
        }
        if(!dots) sliderCounter++;
        if (arrowNext_) arrowNext_.classList.remove(settings.buttonInactiveClass);
        if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonInactiveClass);
        if (sliderCounter >= cards_.length) {
          sliderCounter = cards_.length - 1;
        }
        if ((sliderCounter + 1) === cards_.length) {
          arrowNext_.classList.add(settings.buttonInactiveClass);
        }
        if (progress_) progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
        if (dotsWrap_) dots_.forEach(item => item.classList.remove(settings.dotActiveClass))
        if (lastCard()) {
          field_.style.transform = `translateX(-${field_.scrollWidth - window_.clientWidth}px)`
          sliderCounter = Math.ceil(cards_.length - numberIntegerVisibleCards() - partCard())
          if('dotActiveClass' in settings) dots_[dots_.length - 1].classList.add(settings.dotActiveClass)
          // window_.style.height = cards_[sliderCounter].scrollHeight + 'px'
          arrowNext_.classList.add(settings.buttonInactiveClass);
          return
        }
        if (dotsWrap_) dots_[sliderCounter].classList.add(settings.dotActiveClass)
        field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;

        // window_.style.height = cards_[sliderCounter].scrollHeight + 'px'
      }

      // Слайд предыдущий

      function slidePrev(dots = false) {
        if (!checkNumCards()) {
          return
        }
        sliderCounter = Math.floor(sliderCounter)
        if(!dots) sliderCounter--;
        if (arrowNext_) arrowNext_.classList.remove(settings.buttonInactiveClass);
        if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonInactiveClass);
        if (sliderCounter <= 0) {
          sliderCounter = 0;
        }
        if (sliderCounter === 0 && arrowPrev_) {
          arrowPrev_.classList.add(settings.buttonInactiveClass);
        }
        if (dotsWrap_) {
          dots_.forEach((item, index)=> {
            item.classList.remove(settings.dotActiveClass);
          });
          dots_[sliderCounter].classList.add(settings.dotActiveClass);
        }

        if (progress_) {
          progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
        }
        field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        // window_.style.height = cards_[sliderCounter].scrollHeight + 'px'
      }

      // Рендер точек

      if (dotsWrap_) {

        cards_.forEach(() => {
          const dot = document.createElement('div');
          dot.classList.add(settings.dotClass);
          dotsWrap_.appendChild(dot);
          dots_.push(dot);
        });
        dots_[0].classList.add(settings.dotActiveClass);
        dots_.forEach((item, index) => {
          item.addEventListener('click', () => {
            if (!checkNumCards()) {
              return
            }
            if (index > sliderCounter) {
              sliderCounter = index;
              slideNext(true)
              return
            }
            if (index < sliderCounter) {
              sliderCounter = index;
              slidePrev(true)
            }
          });
        });
      }

      // Переключение на стрелки
      if (arrowPrev_) {
        arrowPrev_.addEventListener('click', () => {
          slidePrev();
        });
      }

      if (arrowNext_) {
        arrowNext_.addEventListener('click', () => {
          slideNext();
        });
      }

      // Свайп слайдов тач-событиями

      window_.addEventListener('touchstart', (e) => {
        startPoint = e.changedTouches[0].pageX;
        if (lastCard() && numberIntegerVisibleCards() < cards_.length) moveLastCardFlag = true


      });

      window_.addEventListener('touchmove', (e) => {
        swipeAction = e.changedTouches[0].pageX - startPoint;
        if (moveLastCardFlag) {
          field_.style.transform = `translateX(${swipeAction + -(field_.clientWidth - window_.clientWidth)}px)`;
        } else {
          field_.style.transform = `translateX(${swipeAction + (-(cards_[0].scrollWidth + betweenCards) * sliderCounter)}px)`;

        }
      });

      window_.addEventListener('touchend', (e) => {
        moveLastCardFlag = false
        endPoint = e.changedTouches[0].pageX;
        if (Math.abs(startPoint - endPoint) > 50 && checkNumCards()) {
          if (arrowNext_) arrowNext_.classList.remove(settings.buttonInactiveClass);
          if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonInactiveClass);
          if (endPoint < startPoint) {
            slideNext();
          } else {
            slidePrev();
          }
        } else {
          field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        }
      });

      // Свайп слайдов маус-событиями
      window_.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startPoint = e.pageX;
        mouseMoveFlag = true;
        if (lastCard()) moveLastCardFlag = true
      });
      window_.addEventListener('mousemove', (e) => {
        if (mouseMoveFlag) {
          e.preventDefault();
          swipeAction = e.pageX - startPoint;
          if (moveLastCardFlag) {
            field_.style.transform = `translateX(${swipeAction + -(field_.clientWidth - document.documentElement.clientWidth)}px)`;
          } else {
            field_.style.transform = `translateX(${swipeAction + (-(cards_[0].scrollWidth + betweenCards) * sliderCounter)}px)`;
          }
        }
      });
      window_.addEventListener('mouseup', (e) => {
        moveLastCardFlag = false
        mouseMoveFlag = false
        endPoint = e.pageX;
        if (Math.abs(startPoint - endPoint) > 50 && checkNumCards()) {
          if (arrowNext_) arrowNext_.classList.remove(settings.buttonInactiveClass);
          if (arrowPrev_) arrowPrev_.classList.remove(settings.buttonInactiveClass);
          if (endPoint < startPoint) {
            slideNext();
          } else {
            slidePrev();
          }
        } else if(Math.abs(startPoint - endPoint) === 0) {
          return
        }
        else {
          field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        }
      })
      window_.addEventListener('mouseleave', () => {
        if (mouseMoveFlag) {
          field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        }
        mouseMoveFlag = false
        moveLastCardFlag = false
      })
    }
  }

  slider({
    windowSelector: '.spec__window',
    fieldSelector: '.spec__field',
    cardSelector: '.spec__card',
    buttonPrevSelector: '.spec__arrow--prev',
    buttonNextSelector: '.spec__arrow--next',
    buttonInactiveClass: 'spec__arrow--inactive',
    dotsWrapSelector: '.spec__dots',
    dotClass: 'spec__dot',
    dotActiveClass: 'spec__dot--active'
  });

  slider({
    windowSelector: '.info__window',
    fieldSelector: '.info__field',
    cardSelector: '.info__card-wrap',
    buttonPrevSelector: '.info__arrow--prev',
    buttonNextSelector: '.info__arrow--next',
    buttonInactiveClass: 'info__arrow--inactive',
    dotsWrapSelector: '.info__dots',
    dotClass: 'info__dot',
    dotActiveClass: 'info__dot--active'
  });

  slider({
    windowSelector: '.partners__window',
    fieldSelector: '.partners__field',
    cardSelector: '.partners__card',
    buttonPrevSelector: '.partners__arrow--prev',
    buttonNextSelector: '.partners__arrow--next',
    buttonInactiveClass: 'partners__arrow--inactive',
    dotsWrapSelector: '.partners__dots',
    dotClass: 'partners__dot',
    dotActiveClass: 'partners__dot--active'
  });

})