module.exports = {
  getIndex: (req, res) => {
    res.render("main/index.ejs", { 
      user: req.user
    });
  }
};
