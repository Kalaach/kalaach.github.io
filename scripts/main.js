const ID_TYPE = {
  id: 'id',
  class: 'class'
};

const MEDIA_LINK_TYPE = {
  Y: 'Y'
};

const textRevealer = (function () {
  const textRevealClassName = "text-revealer";

  function init() {
    const textRevealElements = document.getElementsByClassName(textRevealClassName);
    for (const textRevealElement of textRevealElements) {
      textRevealElement.innerHTML = textRevealElement.innerText.split(' ').map(
        (textChunk) => `<span class="text-revealer-item"><span class="text-revealer-item-inner">${textChunk}</span></span>`
      ).join(' ');
    }
  }

  return {
    init
  };
})();

const observerHandler = (function () {
  let iustitiaRallax;
  const elementsToObserve = [
    {
      idType: ID_TYPE.id,
      id: 'landing',
      observer: new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const headerElement = document.getElementById('header');
          if (entry.isIntersecting) {
            headerElement.classList.remove('visible');
          } else {
            headerElement.classList.add('visible');
            iustitiaRallax.start();
          }
        });
      }, {
        rootMargin: '-90px'
      })
    },
    {
      idType: ID_TYPE.class,
      id: 'content-number-container',
      observer: new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, {
        threshold: 0.5
      })
    },
    {
      idType: ID_TYPE.class,
      id: 'text-revealer',
      observer: new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      }, {
        threshold: 1
      })
    },
    {
      idType: ID_TYPE.class,
      id: 'quote-container',
      observer: new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show-marks');
          }
        });
      }, {
        threshold: 1
      })
    },
    {
      idType: ID_TYPE.class,
      id: 'bio-text-container',
      observer: new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      })
    },
    {
      idType: ID_TYPE.class,
      id: 'thumbnail-container',
      observer: new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const thumbnailElements = document.getElementsByClassName('thumbnail');
            for (let i = 0; i < thumbnailElements.length; i++) {
              setTimeout(() => { thumbnailElements[i].classList.add('reveal'); }, i * 200);
            }
          }
        });
      }, {
        threshold: 0.1
      })
    }
  ]

  function init() {
    registerObservers();
    initRallax();
  }

  function registerObservers() {
    elementsToObserve.forEach(elementToObserve => {
      switch (elementToObserve.idType) {
        case ID_TYPE.id:
          const element = document.getElementById(elementToObserve.id);
          if (!element) {
            console.warn(`No element found with ID ${elementToObserve.id}`);
            return;
          }
          elementToObserve.observer.observe(element);
          return;
        case ID_TYPE.class:
          const elements = document.getElementsByClassName(elementToObserve.id);
          if (!elements || !elements.length) {
            console.warn(`No elements found with class name ${elementToObserve.id}`);
            return;
          }
          for (const element of elements) {
            elementToObserve.observer.observe(element);
          }
          return;
      }
    });
  }

  function initRallax() {
    rallax('.video-container', { speed: 0.4 });
    iustitiaRallax = rallax('.bio-background-container', { speed: 0.4 });
    iustitiaRallax.stop();
  }

  return {
    init,
    elementsToObserve
  };
})();

const drHorvathBelaJs = (function (observerHandler, textRevealer) {
  function init() {
    initObserverHandler();
    initLenis();
    initTextRevealItems();
    initClickListeners();
  }

  function initObserverHandler() {
    observerHandler.init();
  }

  function initClickListeners() {
    for (const thumbnailElement of document.getElementsByClassName('thumbnail')) {
      thumbnailElement.addEventListener('click', function () {
        if (!this.dataset || !this.dataset.link || !this.dataset.linkType) {
          return;
        }
        showMediaPlayer(this.dataset.link, this.dataset.linkType);
      });
    }
    document.getElementById('close-media-player').addEventListener('click', function () {
      hideMediaPlayer();
    });
    document.getElementById('mobile-hamburger').addEventListener('click', function () {
      const mobileMainNavElement = document.getElementById('mobile-main-nav');
      const mobileMainNavOpen = mobileMainNavElement.classList.contains('open');
      if (mobileMainNavOpen) {
        this.classList.remove('open');
        mobileMainNavElement.classList.remove('open');
      } else {
        this.classList.add('open');
        mobileMainNavElement.classList.add('open');
      }
    });
    for (const mobileMainNavItemElement of document.getElementsByClassName('mobile-main-nav-item')) {
      mobileMainNavItemElement.addEventListener('click', function () {
        document.getElementById('mobile-main-nav').classList.remove('open');
        document.getElementById('mobile-hamburger').classList.remove('open');
      });
    }
  }

  function showMediaPlayer(link, linkType) {
    const mediaPlayerContainerElement = document.getElementById('media-player-container');
    const visible = mediaPlayerContainerElement.classList.contains('visible');
    if (visible) {
      return;
    }
    const mediaPlayerElement = document.getElementById('media-player');
    if (linkType === MEDIA_LINK_TYPE.Y) {
      mediaPlayerElement.setAttribute('src', link);
    }
    mediaPlayerContainerElement.classList.add('visible');
  }

  function hideMediaPlayer() {
    const mediaPlayerContainerElement = document.getElementById('media-player-container');
    mediaPlayerContainerElement.classList.add('outro');
    setTimeout(() => {
      mediaPlayerContainerElement.classList.remove('visible');
      mediaPlayerContainerElement.classList.remove('outro');
    }, 600);
  }

  function initLenis() {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function initTextRevealItems() {
    textRevealer.init();
  }

  return {
    init
  };
})(observerHandler, textRevealer);

drHorvathBelaJs.init();