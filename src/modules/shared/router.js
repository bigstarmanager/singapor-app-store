import Home from '../../views/Home/index';
import LoginEmail from './views/LoginEmail/index';
import ResetPassword from './views/ResetPassword';
import SignUpInfo from './views/SignUp/SignUpInfo';
import LoginMobile from './views/LoginMobile';
import ForgotPassword from './views/ForgotPassword';
import Onboarding from './views/onboarding';
import AccessSignUpInfo from './views/AccessSignUp/AccessSignUpInfo';

const sharedRoutes = [
  {
    path: '/',
    redirect: '/main/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/shared/auth/email',
    name: 'LoginEmail',
    component: LoginEmail
  },
  {
    path: '/shared/auth/reset-password',
    name: 'ResetPassword',
    props: (route) => {
      const userId = parseInt(route.params.userId);
      return { userId };
    },
    component: ResetPassword
  },
  {
    path: '/shared/auth/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/shared/auth/mobile',
    name: 'LoginMobile',
    component: LoginMobile
  },
  {
    path: '/shared/auth/signup-info',
    name: 'SignUp-Info',
    component: SignUpInfo
  },
  {
    path: '/shared/auth/onboarding',
    name: 'Onboarding',
    props: true,
    component: Onboarding
  },
  {
    path: '/shared/auth/signup-access',
    name: 'SignUp-Access',
    component: AccessSignUpInfo
  }
];

export default sharedRoutes;
