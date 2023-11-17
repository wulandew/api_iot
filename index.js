import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import mqtt from "mqtt"; // Import pustaka MQTT
import cors from "cors";

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/table", (req, res) => {
  // Kode untuk mendapatkan data dari MQTT
  const client = mqtt.connect("mqtt://test.mosquitto.org"); // Ganti dengan alamat IP broker MQTT
  const topic = "distanceTopic"; // Ganti dengan topik yang sesuai

  client.on("connect", () => {
    client.subscribe(topic);
  });

  client.on("message", (topic, message) => {
    // 
    const data = message.toString();
    res.send(data);
    client.end();
  });
});

app.listen(8800, () => {
  console.log("Connected!");
});
