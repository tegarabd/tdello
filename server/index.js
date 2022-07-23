const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to my CHello");
});

app.post("/sendemail", (req, res) => {
  sendInvitationEmail(req.body, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send("Success");
    }
  });
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});

const EMAIL = "chello_td@outlook.com";
const PASSWORD = "TDsayangangkatan22-1";

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

function sendInvitationEmail(data, callback) {
  const {type, title, admin, to, link, expired} = data
  transporter.sendMail(
    {
      from: EMAIL,
      to,
      subject: `CHello ${type} Invitation`,
      text: `
        CHello! you have been invited to join a CHello ${type} ${title} by ${admin}.\n
        \n
        ${link}\n
        \n
        Please note that this link will expired at ${expired}.
      `,
    },
    callback()
  );
  transporter.close();
}
