const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post('/api/send-winner-email', async (req, res) => {
  const { winnerIndex } = req.body;

  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
        user: 'mohitsinghsolanki8@gmail.com', // Your email
        pass: 'Ranaishere012#', // Your password
      },
    });

    // Mail options
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: 'mohitsinghsolanki8@gmail.com', // Replace with winner's email
      subject: 'Congratulations! You are the winner',
      text: 'You won the race! Congratulations!',
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending email', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
