const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || window.location.origin
    : window.location.origin
};

export default config;