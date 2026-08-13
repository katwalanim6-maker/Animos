// Global Anim OS bootstrap
(function () {
  document.documentElement.classList.add('js-ready');

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-href]').forEach((element) => {
      element.addEventListener('click', () => {
        const href = element.dataset.href;
        if (href) window.location.href = href;
      });
    });

    document.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.add('page-leaving');
      });
    });
  });
})();
