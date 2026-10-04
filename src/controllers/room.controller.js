import crypto from "crypto";
import Room from "../models/room.js";
import Meeting from "../models/Meeting.js";
import Participant from "../models/participant.js";


const generateRoomCode = () => {
  return crypto.randomBytes(6).toString("hex");
};

export const createRoom = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Room title is required",
      });
    }

    const roomCode = generateRoomCode();

    const room = await Room.create({
      roomCode,
      title,
      hostId: req.userId,
    });

    console.log("Room created:", room);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: {
        id: room._id,
        roomCode: room.roomCode,
        title: room.title,
        hostId: room.hostId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      message: "Room found",
      room: {
        id: room._id,
        roomCode: room.roomCode,
        title: room.title,
        hostId: room.hostId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

