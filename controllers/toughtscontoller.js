const { where } = require("sequelize");
const Tought = require("../models/Tougths");
const User = require("../models/User");

module.exports = class ToughtController {
  static showTougths(req, res) {
    console.log("chegando");
    res.render("toughts/home");
  }
  static async dashboard(req, res) {
    const userid = req.session.userid;

    if (!userid) {
      res.render("auth/login");
    }

    const user = await User.findOne({
      where: { id: userid },
      include: Tought,
      plain: true,
    });
    let toughtempy = false;

    const toughts = user.Toughts.map((resultad) => resultad.dataValues);
    if (toughts.length === 0) {
      toughtempy = true;
    }
    res.render("toughts/dashboard", { toughts, toughtempy });
  }
  static create(req, res) {
    res.render("toughts/create");
  }
  static async createPost(req, res) {
    console.log(req.session.userid);
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };
    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento adicionado com sucesso");
      req.session.save(() => {
        res.render("toughts/dashboard");
      });
    } catch (err) {
      console.log("aconteceu um erro: ", err);
    }
  }
  static async remove(req, res) {
    const id = req.body.id;
    const userid = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: userid } });
      req.flash("message", "Pensamento removido com sucesso");
      req.session.save(() => {
        res.render("toughts/dashboard");
      });
    } catch (err) {
      console.log("aconteceu um erro: ", err);
    }
  }
  static async editTought(req, res) {
    const id = req.params.id;
    console.log(id);
    const tougth = await Tought.findOne({ where: { id: id }, raw: true });
    console.log(tougth);
    res.render("toughts/edit", { tougth });
  }
  static async editToughtPost(req, res) {
    const id = req.body.id;
    const tougths = {
      title: req.body.title
    };
    
    try {
      Tought.update(tougths, { where: { id: id } });
      req.flash("message", "Pensamento atualizado com sucesso");
      res.redirect("/toughts/dashboard");
    } catch (err) {
      console.log(err);
    }
  }
};
