// config.js — centralized API base configuration
(function(){
  var base = window.__API_BASE__ || (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || (window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':'+window.location.port : ''));
  window.API_BASE = base;
  if (typeof API_BASE === 'undefined') { API_BASE = base; }
})();
