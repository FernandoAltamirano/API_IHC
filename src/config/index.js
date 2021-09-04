module.exports = {
  database: {
    host: "ihc.ckjbvo0mntvn.us-east-2.rds.amazonaws.com",
    user: "administrador",
    password: "administrador",
    database: "IHC",
    clearExpired: true,
    checkExpirationInterval: 5000,
  },
  PORT: 4000 || process.env.PORT,
  SECRET_SESSION: "cachizi",
  SECRET_TOKEN: "joaquinisimo",
};
