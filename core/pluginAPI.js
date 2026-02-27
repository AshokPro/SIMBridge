module.exports = {
  registerRoute: (app, path, handler) => {
    app.use(path, handler);
  }
};