module.exports = {
  getIndex: (req, res) => {
    res.render("main/index.ejs", { user: req.user });
  },
  getPP: (req, res) => {
    res.render("main/pp.ejs", { user: req.user });
  },
  getTOU: (req, res) => {
    res.render("main/tou.ejs", { user: req.user });
  }
};
