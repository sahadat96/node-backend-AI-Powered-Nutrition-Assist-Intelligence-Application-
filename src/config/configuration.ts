export default () => ({

   app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10), 
    frontendUrl: process.env.FRONTEND_URL || '*',
   },

  
  database: {
    url: process.env.DATABASE_URL,
  },
  
   jwt: {
     secret: process.env.JWT_SECRET,
     expiresIn: process.env.JWT_EXPIRES_IN || '15m',
     refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
   google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  redirect_url: {
    frontEndRedirect: process.env.FRONTEND_OAUTH_SUCCESS_URL
  }

  
});