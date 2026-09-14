export const environment = {
  production: false,

  //DEV
  authBaseUrl: 'http://localhost:9001', // Spring Boot auth base URL
  apiBaseUrl: 'http://localhost:8082', // Spring Boot API base URL

  //PRD
  // authBaseUrl: 'https://authjsb.restapi.n4softsol.com', // Spring Boot auth base URL
  // apiBaseUrl: 'https://persjsb.restapi.n4softsol.com', // Spring Boot API base URL

  appInfo: {
    gitUpdate: '1.6',
    application: 'dev-apps-angular-respers',
    profiles: ['dev'], // Set to dev for the development environment
  },
};
