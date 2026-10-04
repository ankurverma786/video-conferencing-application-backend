import Room from "../models/room.js";
import Meeting from "../models/Meeting.js";
import Participant from "../models/participant.js";

export const joinMeeting = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    let meeting = await Meeting.findOne({
      roomId: room._id,
      status: "active",
    });

    if (!meeting) {
      meeting = await Meeting.create({
        roomId: room._id,
        startedAt: new Date(),
        status: "active",
      });
    }

    const participant = await Participant.create({
      meetingId: meeting._id,
      userId: req.userId,
    });

    res.json({
      success: true,
      roomId: room._id,
      meetingId: meeting._id,
      participantId: participant._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};