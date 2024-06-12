const express = require("express");

const { userRouter } = require("./routes/userRouter");
const { productRouter } = require("./routes/productRouter");

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

exports.startWebServer = function startWebServer(serverConfig) {
  const { host, port } = serverConfig;
  return new Promise((resolve, reject) => {
    app.listen(port, host, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Listening on host ${host} and port ${port}`);
        resolve();
      }
    });
  });
};
