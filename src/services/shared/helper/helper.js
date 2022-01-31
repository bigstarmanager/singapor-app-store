const getUserLS = () => JSON.parse(localStorage.getItem('user'));

const getGenderName = (gender) => {
  return gender.toLowerCase() == 'f' ? 'Female' : gender.toLowerCase() == 'm' ? 'Male' : '-';
};

const getRegexEmail = () => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
};

const hideEmail = function (email) {
  return email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += '*';
    }
    return gp2;
  });
};

const hideMobile = function (mobile) {
  return mobile.slice(0, 3) + mobile.slice(3).replace(/.(?=....)/g, '*');
};

/**
 * from strapi CMS
 * external banner deeplink url = valid URL, ex: https://www.google.com
 * internal banner deeplink url = not valid URL, ex: /main/supplier/2222
 */
const isExternalBannerUrl = function (url) {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};

function isInViewport(el) {
  if (!el) {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export { getUserLS, getGenderName, getRegexEmail, hideEmail, hideMobile, isExternalBannerUrl, isInViewport };
