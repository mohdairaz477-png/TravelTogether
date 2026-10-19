
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { User } from "./models/user.model";
import { Connection } from "./models/connection.model";
import { AdminNotificationModel } from "./models/admin-notification.model";
import { DirectMessage } from "./models/direct-message.model";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from backend/.env");
}

app.use(cors());
app.use(express.json());
// Verify JWT token and get the logged-in user
app.get("/api/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token is missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    return res.json({
      message: "Token is valid.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: !!process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase(),
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ message: "TravelTogether API is running" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Enter your name, email, and a password of at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      username: normalizedEmail.split("@")[0].replace(/[^a-z0-9_.-]/g, ""),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await AdminNotificationModel.create({ type: "signup", userId: user._id.toString(), userName: user.name, userEmail: user.email, message: `New user registered: ${user.name} (${user.email})` });
    const token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username || "",
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
        console.log("[Login user from MongoDB]", {
      name: user.name,
      email: user.email,
      id: user._id.toString(),
    });

    await AdminNotificationModel.create({ type: "login", userId: user._id.toString(), userName: user.name, userEmail: user.email, message: `${user.name} (${user.email}) logged in` });
    const token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: !!process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});


// Authenticated API helper: never trust user IDs supplied by the browser.
function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Sign in required." });
    const decoded = jwt.verify(header.slice(7), JWT_SECRET!) as { userId: string };
    (req as any).authUserId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) return res.status(503).json({ message: "Admin access is not configured on the server." });
  User.findById((req as any).authUserId).select("email").then(user => {
    if (!user || user.email.toLowerCase() !== adminEmail) return res.status(403).json({ message: "Admin access required." });
    return next();
  }).catch(() => res.status(500).json({ message: "Could not verify admin access." }));
}

// Search travellers by username, name, or email. Return public fields only.
app.get("/api/users/search", authenticate, async (req, res) => {
  try {
    const query = String(req.query.q || req.query.name || req.query.username || "").trim();
    const currentUserId = (req as any).authUserId;
    if (query.length < 2) {
      return res.status(400).json({ message: "Enter at least 2 characters to search." });
    }
    if (query.length > 80) {
      return res.status(400).json({ message: "Search text is too long." });
    }
    // Escape regex metacharacters so input is treated as plain text.
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const travellers = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { name: { $regex: escaped, $options: "i" } },
        { username: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ],
    }).select("_id name username rating tripCount joinedAt").sort({ name: 1 }).limit(10).lean();
    return res.json({
      users: travellers.map((traveller: any) => ({
        _id: String(traveller._id),
        name: traveller.name,
        username: traveller.username || "",
        rating: traveller.rating || 0,
        tripCount: traveller.tripCount || 0,
        joinedAt: traveller.joinedAt || "",
      })),
    });
  } catch (e) {
    console.error("User search failed", e);
    return res.status(500).json({ message: "Could not search for users." });
  }
});

// Connection requests persist in MongoDB and are scoped to the signed-in account.
app.get("/api/connections", authenticate, async (req, res) => {
  try {
    const userId = (req as any).authUserId;
    const requests = await Connection.find({ $or: [{ fromUserId: userId }, { toUserId: userId }] })
      .populate("fromUserId", "name email avatar")
      .populate("toUserId", "name email avatar")
      .sort({ createdAt: -1 }).lean();
    return res.json({ requests: requests.map((r: any) => ({
      _id: String(r._id), fromUserId: String(r.fromUserId?._id || r.fromUserId),
      fromUserName: r.fromUserId?.name || "Traveller", fromUserAvatar: r.fromUserId?.avatar || "from-violet-400 to-blue-600",
      toUserId: String(r.toUserId?._id || r.toUserId), toUserName: r.toUserId?.name || "Traveller",
      toUserAvatar: r.toUserId?.avatar || "from-violet-400 to-blue-600", matchScore: r.matchScore || 0,
      message: r.message || "", status: r.status, createdAt: r.createdAt, respondedAt: r.respondedAt || null,
      responseMessage: r.responseMessage || null
    })) });
  } catch (e) { console.error("Connection list failed", e); return res.status(500).json({ message: "Could not load connection requests." }); }
});

app.post("/api/connections", authenticate, async (req, res) => {
  try {
    const fromUserId = (req as any).authUserId;
    const { toUserId, message = "", matchScore = 0 } = req.body || {};
    if (!toUserId || !/^[a-f\d]{24}$/i.test(String(toUserId))) return res.status(400).json({ message: "Valid recipient is required." });
    if (fromUserId === String(toUserId)) return res.status(400).json({ message: "You cannot connect with yourself." });
    const recipient = await User.findById(toUserId).select("_id");
    if (!recipient) return res.status(404).json({ message: "Traveller not found." });
    const existing = await Connection.findOne({ $or: [
      { fromUserId, toUserId, status: "pending" }, { fromUserId: toUserId, toUserId: fromUserId, status: "pending" },
      { fromUserId, toUserId, status: "accepted" }, { fromUserId: toUserId, toUserId: fromUserId, status: "accepted" }
    ] });
    if (existing) return res.status(409).json({ message: "A pending request or connection already exists." });
    const request = await Connection.create({ fromUserId, toUserId, message: String(message).slice(0, 1000), matchScore: Math.max(0, Math.min(100, Number(matchScore) || 0)) });
    return res.status(201).json({ request });
  } catch (e) { console.error("Connection create failed", e); return res.status(500).json({ message: "Could not send request." }); }
});

app.patch("/api/connections/:id/respond", authenticate, async (req, res) => {
  try {
    const userId = (req as any).authUserId;
    const { action, responseMessage = "" } = req.body || {};
    if (!['accepted', 'rejected'].includes(action)) return res.status(400).json({ message: "Action must be accepted or rejected." });
    const request = await Connection.findOne({ _id: req.params.id, toUserId: userId, status: "pending" });
    if (!request) return res.status(404).json({ message: "Pending request not found." });
    request.status = action; request.responseMessage = String(responseMessage).slice(0, 1000); request.respondedAt = new Date();
    await request.save(); return res.json({ message: `Request ${action}.`, request });
  } catch { return res.status(500).json({ message: "Could not respond to request." }); }
});

app.delete("/api/connections/:id", authenticate, async (req, res) => {
  try {
    const userId = (req as any).authUserId;
    const deleted = await Connection.findOneAndDelete({ _id: req.params.id, fromUserId: userId, status: "pending" });
    if (!deleted) return res.status(404).json({ message: "Pending sent request not found." });
    return res.json({ message: "Request cancelled." });
  } catch { return res.status(500).json({ message: "Could not cancel request." }); }
});

// Direct messages between accepted connections. Trip chat remains a separate feature.
app.get("/api/messages/direct/:userId", authenticate, async (req, res) => {
  try {
    const currentUserId = String((req as any).authUserId);
    const otherUserId = String(req.params.userId);
    if (!/^[a-f\d]{24}$/i.test(otherUserId)) return res.status(400).json({ message: "Invalid user ID." });
    if (currentUserId === otherUserId) return res.status(400).json({ message: "You cannot chat with yourself." });
    const connection = await Connection.findOne({ status: "accepted", $or: [
      { fromUserId: currentUserId, toUserId: otherUserId },
      { fromUserId: otherUserId, toUserId: currentUserId },
    ] }).select("_id");
    if (!connection) return res.status(403).json({ message: "You can message users only after the connection is accepted." });
    const messages = await DirectMessage.find({ $or: [
      { senderId: currentUserId, recipientId: otherUserId },
      { senderId: otherUserId, recipientId: currentUserId },
    ] }).sort({ createdAt: 1 }).limit(500).lean();
    return res.json({ messages: messages.map((m: any) => ({
      _id: String(m._id), senderId: String(m.senderId), recipientId: String(m.recipientId),
      content: m.content, createdAt: m.createdAt,
    })) });
  } catch (error) {
    console.error("Load direct messages failed:", error);
    return res.status(500).json({ message: "Could not load this conversation." });
  }
});

app.post("/api/messages/direct/:userId", authenticate, async (req, res) => {
  try {
    const senderId = String((req as any).authUserId);
    const recipientId = String(req.params.userId);
    const content = typeof req.body?.content === "string" ? req.body.content.trim() : "";
    if (!/^[a-f\d]{24}$/i.test(recipientId)) return res.status(400).json({ message: "Invalid recipient ID." });
    if (senderId === recipientId) return res.status(400).json({ message: "You cannot message yourself." });
    if (!content) return res.status(400).json({ message: "Message cannot be empty." });
    if (content.length > 4000) return res.status(400).json({ message: "Message is too long (maximum 4000 characters)." });
    const connection = await Connection.findOne({ status: "accepted", $or: [
      { fromUserId: senderId, toUserId: recipientId },
      { fromUserId: recipientId, toUserId: senderId },
    ] }).select("_id");
    if (!connection) return res.status(403).json({ message: "Accept the connection request before chatting." });
    const message = await DirectMessage.create({ senderId, recipientId, content });
    return res.status(201).json({ message: {
      _id: String(message._id), senderId, recipientId, content: message.content, createdAt: message.createdAt,
    } });
  } catch (error) {
    console.error("Send direct message failed:", error);
    return res.status(500).json({ message: "Could not send message." });
  }
});

// Admin data endpoints. Access is verified on the server from ADMIN_EMAIL + JWT.
app.get("/api/admin/users", authenticate, requireAdmin, async (_req, res) => {
  try { const users = await User.find().select("-password").sort({ createdAt: -1 }).lean(); return res.json({ users }); }
  catch { return res.status(500).json({ message: "Could not load users." }); }
});
app.get("/api/admin/notifications", authenticate, requireAdmin, async (_req, res) => {
  try { const notifications = await AdminNotificationModel.find().sort({ createdAt: -1 }).limit(100).lean(); return res.json({ notifications }); }
  catch { return res.status(500).json({ message: "Could not load notifications." }); }
});
app.patch("/api/admin/notifications/read-all", authenticate, requireAdmin, async (_req, res) => {
  try { await AdminNotificationModel.updateMany({ read: false }, { $set: { read: true } }); return res.json({ message: "Notifications marked as read." }); }
  catch { return res.status(500).json({ message: "Could not update notifications." }); }
});


app.delete("/api/admin/notifications", authenticate, requireAdmin, async (_req, res) => {
  try {
    const result = await AdminNotificationModel.deleteMany({});
    return res.json({
      message: "All notifications cleared successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear notifications error:", error);
    return res.status(500).json({
      message: "Could not clear notifications.",
    });
  }
});


async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TravelTogether API running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
