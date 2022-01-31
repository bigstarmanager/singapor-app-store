import { Capacitor } from '@capacitor/core';
import LogRocket from 'logrocket';
import meta from '../../../../package.json';

const { VUE_APP_ENV } = process.env;

const identifyUser = (data) => {
  if (!Capacitor.isNativePlatform()) return;
  if (VUE_APP_ENV === 'development') return;
  LogRocket.identify('user', {
    ...data,
    release: meta.version,
    releaseHtmlVersion: meta.htmlVersion
  });
};

const logrocket = {
  identifyUser
};

export default logrocket;
