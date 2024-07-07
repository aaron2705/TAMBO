var config = {
  server: "LAPTOP-BH5K91S6\\SQLEXPRESS",
  authentication: {
    type: "default",
    options: {
      userName: "aaron",
      password: "admin"
    }
  },
  options: {
    port: 1433,
    database: "tambo",
    trustServerCertificate: true
  }
}
module.exports = config;
