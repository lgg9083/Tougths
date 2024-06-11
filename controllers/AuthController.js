const { error } = require("console");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }
  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "O email informado não pertence a nenhum usúario.");
      res.render("auth/login");
      return;
    }

    const checkPassword = bcrypt.compare(password, user.password);
    if (!checkPassword) {
      req.flash("message", "senha inválida.");
      res.render("auth/login");
      return;
    }
    req.session.userid = user.id;
    req.flash("message", "autenticação realizada com sucesso");
    req.session.save(() => {
      res.redirect("/");
    });
  }
  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, password, email, confirmpassword } = req.body;

    if (password != confirmpassword) {
      req.flash(
        "message",
        "As senha não são iguais, por favor tente novamente."
      );
      res.render("auth/register");
      return;
    }

    const checkEmail = await User.findOne({ where: { email: email } });

    if (checkEmail) {
      req.flash("message", "Esse email já esta associado a um usúario.");
      res.render("auth/register");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createuser = await User.create(user);
      req.session.userid = createuser.id;
      req.flash("message", "Usuario cadastrado com sucesso");
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
