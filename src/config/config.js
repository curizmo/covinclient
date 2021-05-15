const basedConfig = {
  domainURL: process.env.REACT_APP_DOMAIN_URL,
  corsProxyUrl: process.env.REACT_APP_CORS_PROXY_URl,
  pusher: {
    key: process.env.REACT_APP_CORS_PUSHER_KEY,
    cluster: process.env.REACT_APP_CORS_PUSHER_CLUSTER,
  },
  aboutURL: process.env.REACT_APP_ABOUT_URL,
  stripe: {
    publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    amount: process.env.REACT_APP_PAYMENT_AMOUNT,
  },
  jitsi: {
    appId: process.env.REACT_APP_JITSI_APP_ID,
  },
};

export default basedConfig;
