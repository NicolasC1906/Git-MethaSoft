import { CoreConfig } from '@core/types';

/**
 * Default App Config
 *
 * ? TIP:
 *
 * Change app config based on your preferences.
 * You can also change them on each component basis. i.e `app/main/pages/authentication/auth-login-v1/auth-login-v1.component.ts`
 *
 * ! IMPORTANT: If the enableLocalStorage option is true then make sure you clear the browser local storage(https://developers.google.com/web/tools/chrome-devtools/storage/localstorage#delete).
 *  ! Otherwise, it will not take the below config changes and use stored config from local storage.
 *
 */

// get the current hour
const currentHour = new Date().getHours();

// if it's between 6am and 4pm, activate light mode
const isLight = currentHour >= 6 && currentHour < 16;

// if it's between 4pm and 7pm, activate semi-dark mode
const isSemiDark = currentHour >= 16 && currentHour < 19;

// if it's between 7pm and 6am, activate dark mode
const isDark = currentHour >= 19 || currentHour < 6;

// prettier-ignore
export const coreConfig: CoreConfig = {
  app: {
    appName     : '| Norgas',                                        // App Name
    appTitle    : 'MethaSoft | Norgas', // App Title
    appLogoImage: 'https://intermediosdigitales.com.co/wp-content/uploads/2022/12/logo.png',                  // App Logo
    appLanguage : 'en',                                           // App Default Language (en, fr, de, pt etc..)
  },
  layout: {
    skin  : isLight ? 'default' : isSemiDark ? 'semi-dark' : 'dark',    // set skin based on time of day
    type  : 'vertical',                       // vertical, horizontal
    animation : 'fadeInLeft',                     // fadeInLeft, zoomIn , fadeIn, none
    menu : {
      hidden               : false,           // Boolean: true, false
      collapsed            : false,           // Boolean: true, false
    },
    // ? For horizontal menu, navbar type will work for navMenu type
    navbar: {
      hidden               : false,           // Boolean: true, false
      type                 : 'floating-nav',  // navbar-static-top, fixed-top, floating-nav, d-none
      background           : 'navbar-light',  // navbar-light. navbar-dark
      customBackgroundColor: true,            // Boolean: true, false
      backgroundColor      : ''               // BS color i.e bg-primary, bg-success
    },
    footer: {
      hidden               : false,           // Boolean: true, false
      type                 : 'footer-static', // footer-static, footer-sticky, d-none
      background           : 'footer-light',  // footer-light. footer-dark
      customBackgroundColor: false,           // Boolean: true, false
      backgroundColor      : ''               // BS color i.e bg-primary, bg-success
    },
    enableLocalStorage: true,
    customizer  : true,                       // Boolean: true, false (Enable theme customizer)
    scrollTop   : true,                       // Boolean: true, false (Enable scroll to top button)
    buyNow      : false                        // Boolean: true, false (Set false in real project, For demo purpose only)
  }
}
