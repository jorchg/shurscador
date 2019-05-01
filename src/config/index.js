let config = {
  environment: 'development',
  algolia: {
    appId: 'UCDHYKVJUR',
    readKey: 'a6a73fb259782a9759ab1377edb701d0',
  },
  api: {
    baseUrl: 'http://localhost:5000/shurscador/us-central1/v1',
  }
}

if (process.env.NODE_ENV === 'production') {
  config.environment = 'production';
  config.api.baseUrl = 'https://us-central1-shurscador.cloudfunctions.net/v1';
}

module.exports = config;
