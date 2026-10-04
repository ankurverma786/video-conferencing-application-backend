import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";


const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/meetings", meetingRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Video conferencing API is running"
  });
});

export default app;