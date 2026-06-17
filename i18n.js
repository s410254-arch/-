const I18N = (function(){
  const cache = {};
  let current = null;

  function getLocale() {
    return localStorage.getItem('babycare_locale') || (navigator.language ? navigator.language.split('-').length>1 ? navigator.language : 'zh-TW' : 'zh-TW');
  }

  async function loadLocale(locale) {
    if (cache[locale]) return cache[locale];
    try {
      const res = await fetch(`/locales/${locale}.json`);
      if (!res.ok) throw new Error('not found');
      const json = await res.json();
      cache[locale] = json;
      return json;
    } catch (e) {
      // fallback to zh-TW if available
      if (locale !== 'zh-TW') return loadLocale('zh-TW');
      return {};
    }
  }

  function t(key) {
    if (!current) return key;
    return current[key] || key;
  }

  async function apply() {
    const locale = getLocale();
    current = await loadLocale(locale);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
      }
      if (el.getAttribute('data-i18n-value') === 'html') {
        el.innerHTML = t(key);
      } else if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
        el.value = t(key);
      } else if (el.tagName === 'INPUT' && el.type === 'text') {
        // keep user-entered value
      } else {
        el.textContent = t(key);
      }
    });
    document.querySelectorAll('[data-i18n-lang]').forEach(sel => {
      sel.value = locale;
    });
  }

  function setLocale(l) {
    localStorage.setItem('babycare_locale', l);
    return apply();
  }

  return { getLocale, setLocale, t, apply, loadLocale };
})();

document.addEventListener('DOMContentLoaded', () => { I18N.apply(); });
window.I18N = I18N;
