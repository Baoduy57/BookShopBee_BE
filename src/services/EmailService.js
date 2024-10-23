const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let listItem = "";
  const attachImage = [];
  orderItems.forEach((order) => {
    listItem += `<div>
<div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>

</div>`;
    attachImage.push({ path: order.image });
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // địa chỉ người gửi
    to: `${email},"sb-qoetj33464407@personal.example.com"`, // danh sách người nhận
    subject: "Hello bạn đã đặt hàng tại BookShopBee ✔", //Tiêu đề email
    text: "Bạn đã đặt hàng thành công tại BookShopBee", // nội dung dạng văn bản
    html: `<div><b>Bạn đã đặt hàng thành công tại BookShopBee</b></div>${listItem}`, // html body
    attachments: attachImage, // file đính kèm
  });
};

module.exports = { sendEmailCreateOrder };
