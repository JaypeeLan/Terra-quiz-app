const nodemailer = require("nodemailer");

class EmailService {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Your App <TerraQuizApp>`;
  }

  createTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendVerification() {
    await this.send(
      "Your account verification link",
      `Hello ${this.firstName},\n\nPlease verify your account by clicking on the link below:\n\n${this.url}`
    );
  }
}

module.exports = EmailService;
