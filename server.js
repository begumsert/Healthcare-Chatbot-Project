const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { IamAuthenticator } = require("ibm-watson/auth");
const AssistantV2 = require("ibm-watson/assistant/v2");
const fs = require("fs");
const cors = require("cors");

dotenv.config();

const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: "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",
});

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

// Statik dosyalar için middleware ekleyin
app.use(express.static(path.join(__dirname)));

// Kök rota için bir GET işleyici
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chatbot.html"));
});

// Watson Assistant örneği oluşturun
const assistant = new AssistantV2({
  version: "2021-11-27",
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  serviceUrl: process.env.WATSON_SERVICE_URL,
});

// Kullanıcı mesajını işleyecek ve Watson'dan yanıt alacak API endpoint
app.post("/api/message", async (req, res) => {
  try {
    const { message } = req.body;
    // Session ID oluşturun veya önbellekten alın
    const sessionResponse = await assistant.createSession({
      assistantId: process.env.WATSON_ASSISTANT_ID,
    });
    const sessionId = sessionResponse.result.session_id;

    // Watson Assistant'a mesaj gönderin
    const messageResponse = await assistant.message({
      assistantId: process.env.WATSON_ASSISTANT_ID,
      sessionId: sessionId,
      input: {
        message_type: "text",
        text: message,
      },
    });

    // Watson'dan gelen yanıtı kullanıcıya gönderin
    res.json({ message: messageResponse.result.output.generic[0].text });

    // Session'ı sonlandırın
    await assistant.deleteSession({
      assistantId: process.env.WATSON_ASSISTANT_ID,
      sessionId: sessionId,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/getMessageReply", async (req, res) => {
  const myAssistant = await client.beta.assistants.retrieve(
    "asst_jBkWceW8ZADLpSm6YcQqKUnD"
  );
  var threadId;
  if (req.body.hasOwnProperty("threadId")) {
    console.log("here in has thread");
    threadId = req.body.threadId;
  } else {
    const thread = await client.beta.threads.create();
    threadId = thread.id;
  }

  const message = await client.beta.threads.messages.create(threadId, {
    role: "user",
    content: req.body.message,
  });
  var run = await client.beta.threads.runs.create(threadId, {
    assistant_id: myAssistant.id,
  });
  while (run.status === "queued" || run.status === "in_progress") {
    run = await client.beta.threads.runs.retrieve(threadId, run.id);
    console.log(run.status);
  }

  const message2 = await client.beta.threads.messages.list(threadId);

  const messageResults = message2.data[0].content[0].text.value;

  res.status(200).json({
    success: true,
    message: messageResults,
    threadId: threadId,
  });
});

app.post("/createUser", async (req, res) => {
  try {
    const existingData = JSON.parse(fs.readFileSync("users.json"));

    if (
      existingData.filter((user) => user.email === req.body.email).length !== 0
    ) {
      res.status(400).json({ success: false, message: "Email Already Exists" });
      return;
    }

    existingData.push(req.body);
    fs.writeFileSync("users.json", JSON.stringify(existingData, null, 2));
    res.status(200).json({ success: true, message: "Registered Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});
app.post("/loginUser", async (req, res) => {
  try {
    const existingData = JSON.parse(fs.readFileSync("users.json"));
    const user = existingData.find((user) => user.email === req.body.email);

    if (user === null || user === undefined) {
      res.status(400).json({ success: false, message: "Email does not exist" });
      return;
    }
    if (user.email === req.body.email && user.password === req.body.password) {
      res.status(200).json({
        success: true,
        message: "Login Successfully",
        user: { name: user.name, email: user.email },
      });
    } else {
      res.status(400).json({ success: false, message: "Password incorrect" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
