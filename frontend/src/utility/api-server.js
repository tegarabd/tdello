import axios from "axios";

export async function sendEmail(type, title, admin, to, link, expired) {
  try {
    await axios({
      method: "post",
      url: "http://localhost:3001/sendemail",
      data: {
        type,
        title,
        admin,
        to,
        link,
        expired
      },
    });
  } catch (error) {
    alert(error);
  }
}
