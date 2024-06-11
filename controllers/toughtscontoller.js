const { where } = require("sequelize");
const Tought = require("../models/Tougths");
const User = require("../models/User");
const {Op} = require('sequelize')
module.exports = class ToughtController {
  static async showTougths(req, res) {
    let search = ''
    if(req.query.search){
      search = req.query.search
    }
    let order = 'DESC'
    if(req.query.order === 'old'){
      order = 'ASC'
    }else {
      order = 'DESC'
    }
    const toughtData = await Tought.findAll({
      include: User,
      where:{
        title:{[Op.like]: `%${search}%`}
      },
      order:[['createdAt', order]]
    });
    const tought = toughtData.map((result) => result.get({ plain: true }));
    let qtdtougths = tought.length

    if(qtdtougths === 0){
      qtdtougths = false
    }
    console.log(tought)
    res.render("toughts/home", { tought, search, qtdtougths });
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
      title: req.body.title,
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
