const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

// Ortam değişkenlerini yükleyin
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Static dosyaları sunmak için
app.use(express.static('public'));

/// Body-parser middleware'ini kullanarak form verilerini işlemeye yarar
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB ile bağlantı kur
mongoose.connect('mongodb://localhost:27017/healthChatBot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mongoose modelini tanımla
const formSchema = new mongoose.Schema({
  name: String,
  email: String
});

const Form = mongoose.model('Form', formSchema);

// HTML formunu gönderecek basit bir ana sayfa
app.get('/', (req, res) => {
  res.send(`
    <form action="/submit-form" method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name"><br><br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email"><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// POST isteği için route
app.post('/submit-form', (req, res) => {
  const newForm = new Form({
    name: req.body.name,
    email: req.body.email
  });

  newForm.save().then(() => console.log('Form Data Saved'));
  res.send('Thank you for your submission!');
});

// IBM Watson Assistant servisini yapılandırın
const assistant = new AssistantV2({
  version: "2021-11-27",
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  serviceUrl: process.env.WATSON_SERVICE_URL,
});

// Express JSON middleware'ini kullanın
app.use(express.json());

// API endpoint'i
app.post("/get-response", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Bir oturum ID'si başlatın
    const session = await assistant.createSession({
      assistantId: process.env.WATSON_ASSISTANT_ID,
    });

    const sessionId = session.result.session_id;

    // Kullanıcı mesajına yanıt alın
    const message = await assistant.message({
      assistantId: process.env.WATSON_ASSISTANT_ID,
      sessionId: sessionId,
      input: {
        message_type: "text",
        text: userMessage,
      },
    });

    // Watson'ın cevabını alın ve gönderin
    const watsonResponse = message.result.output.generic[0].text;
    res.json({ message: watsonResponse });

    // Mesajı ve yanıtı MongoDB'ye kaydedin
    const newMessage = new Message({
      message: userMessage,
      response: watsonResponse
    });
    await newMessage.save();

  } catch (error) {
    console.error("Watson Assistant ile iletişimde bir hata oluştu:", error);
    res.status(500).send("Watson Assistant hatası");
  }
});

// Sunucuyu başlatın
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
