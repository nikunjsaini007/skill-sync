import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

type StoredUser = {
  id: string; name: string; email: string; passwordHash: string; avatar: string;
  headline: string; bio: string; college: string; skillsOffered: string[]; skillsWanted: string[];
  experience: "Beginner" | "Intermediate" | "Advanced" | "Expert"; interests: string; learningGoals: string;
  isOnboarded: boolean; isPremium: boolean; rating: number; reviewsCount: number; achievements: string[];
  location?: string; createdAt: string;
};
type StoredConnection = { id: string; senderId: string; receiverId: string; status: "pending" | "accepted" | "rejected"; createdAt: string };
type StoredMessage = { id: string; connectionId: string; senderId: string; text: string; createdAt: string; read: boolean };
type Database = { users: StoredUser[]; connections: StoredConnection[]; messages: StoredMessage[] };

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "skillsync.json");
const jwtSecret = process.env.JWT_SECRET || "change-this-development-secret-before-deploying";

function readDatabase(): Database {
  if (!fs.existsSync(databasePath)) return { users: [], connections: [], messages: [] };
  try { return JSON.parse(fs.readFileSync(databasePath, "utf8")) as Database; }
  catch { return { users: [], connections: [], messages: [] }; }
}
function writeDatabase(database: Database) {
  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), "utf8");
}
function publicUser(user: StoredUser) {
  const { passwordHash, ...profile } = user;
  return profile;
}
function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function passwordMatches(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const candidate = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}
function signToken(userId: string) {
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString("base64url");
  const signature = crypto.createHmac("sha256", jwtSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}
function authenticatedUser(req: express.Request, res: express.Response): StoredUser | null {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) { res.status(401).json({ error: "Sign in is required." }); return null; }
  const [payload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", jwtSecret).update(payload).digest("base64url");
  if (!payload || !signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) { res.status(401).json({ error: "Invalid session." }); return null; }
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (claims.exp < Date.now()) throw new Error("expired");
    const user = readDatabase().users.find(item => item.id === claims.sub);
    if (!user) throw new Error("missing");
    return user;
  } catch { res.status(401).json({ error: "Session expired. Please sign in again." }); return null; }
}

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!String(name || "").trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || String(password || "").length < 8) {
    return res.status(400).json({ error: "Enter a name, valid email, and a password of at least 8 characters." });
  }
  const database = readDatabase();
  if (database.users.some(user => user.email === normalizedEmail)) return res.status(409).json({ error: "An account already exists for this email." });
  const user: StoredUser = { id: crypto.randomUUID(), name: String(name).trim(), email: normalizedEmail, passwordHash: hashPassword(String(password)), avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", headline: "", bio: "", college: "", skillsOffered: [], skillsWanted: [], experience: "Intermediate", interests: "", learningGoals: "", isOnboarded: false, isPremium: false, rating: 5, reviewsCount: 0, achievements: ["Early Adopter"], createdAt: new Date().toISOString() };
  database.users.push(user); writeDatabase(database);
  res.status(201).json({ token: signToken(user.id), user: publicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const database = readDatabase();
  const user = database.users.find(item => item.email === String(req.body?.email || "").trim().toLowerCase());
  if (!user || !passwordMatches(String(req.body?.password || ""), user.passwordHash)) return res.status(401).json({ error: "Incorrect email or password." });
  res.json({ token: signToken(user.id), user: publicUser(user) });
});

app.get("/api/me", (req, res) => { const user = authenticatedUser(req, res); if (user) res.json(publicUser(user)); });
app.patch("/api/me", (req, res) => {
  const current = authenticatedUser(req, res); if (!current) return;
  const database = readDatabase(); const user = database.users.find(item => item.id === current.id)!;
  const fields = ["name", "avatar", "headline", "bio", "college", "skillsOffered", "skillsWanted", "experience", "interests", "learningGoals", "isOnboarded", "location"] as const;
  for (const field of fields) if (req.body?.[field] !== undefined) (user as any)[field] = req.body[field];
  writeDatabase(database); res.json(publicUser(user));
});
app.get("/api/users", (req, res) => {
  const current = authenticatedUser(req, res); if (!current) return;
  const query = String(req.query.q || "").toLowerCase();
  const users = readDatabase().users.filter(user => user.id !== current.id && user.isOnboarded).filter(user => !query || [user.name, user.college, user.headline, user.bio, ...user.skillsOffered, ...user.skillsWanted].join(" ").toLowerCase().includes(query)).map(publicUser);
  res.json(users);
});
app.get("/api/connections", (req, res) => { const current = authenticatedUser(req, res); if (current) res.json(readDatabase().connections.filter(c => c.senderId === current.id || c.receiverId === current.id)); });
app.post("/api/connections", (req, res) => {
  const current = authenticatedUser(req, res); if (!current) return;
  const receiverId = String(req.body?.receiverId || ""); const database = readDatabase();
  if (receiverId === current.id || !database.users.some(user => user.id === receiverId)) return res.status(400).json({ error: "That user is unavailable." });
  if (database.connections.some(c => (c.senderId === current.id && c.receiverId === receiverId) || (c.senderId === receiverId && c.receiverId === current.id))) return res.status(409).json({ error: "A connection already exists." });
  const connection: StoredConnection = { id: crypto.randomUUID(), senderId: current.id, receiverId, status: "pending", createdAt: new Date().toISOString() }; database.connections.push(connection); writeDatabase(database); res.status(201).json(connection);
});
app.patch("/api/connections/:id", (req, res) => {
  const current = authenticatedUser(req, res); if (!current) return;
  const database = readDatabase(); const connection = database.connections.find(c => c.id === req.params.id && (c.senderId === current.id || c.receiverId === current.id));
  if (!connection) return res.status(404).json({ error: "Connection not found." });
  if (req.body?.status === "accepted" || req.body?.status === "rejected") { if (connection.receiverId !== current.id) return res.status(403).json({ error: "Only the recipient can respond." }); connection.status = req.body.status; }
  else return res.status(400).json({ error: "Invalid connection update." });
  writeDatabase(database); res.json(connection);
});
app.delete("/api/connections/:id", (req, res) => {
  const current = authenticatedUser(req, res); if (!current) return;
  const database = readDatabase(); const index = database.connections.findIndex(c => c.id === req.params.id && (c.senderId === current.id || c.receiverId === current.id));
  if (index < 0) return res.status(404).json({ error: "Connection not found." }); database.connections.splice(index, 1); writeDatabase(database); res.status(204).end();
});
app.get("/api/messages", (req, res) => {
  const current = authenticatedUser(req, res); if (!current) return; const database = readDatabase();
  const accessible = new Set(database.connections.filter(c => c.status === "accepted" && (c.senderId === current.id || c.receiverId === current.id)).map(c => c.id));
  res.json(database.messages.filter(message => accessible.has(message.connectionId)));
});
app.post("/api/messages", (req, res) => {
  const current = authenticatedUser(req, res); if (!current) return; const { connectionId, text } = req.body || {}; const database = readDatabase();
  const connection = database.connections.find(c => c.id === connectionId && c.status === "accepted" && (c.senderId === current.id || c.receiverId === current.id));
  if (!connection || !String(text || "").trim()) return res.status(400).json({ error: "You can only message an accepted connection." });
  const message: StoredMessage = { id: crypto.randomUUID(), connectionId, senderId: current.id, text: String(text).trim().slice(0, 4000), createdAt: new Date().toISOString(), read: false }; database.messages.push(message); writeDatabase(database); res.status(201).json(message);
});

// Lazy-initialized Gemini AI client
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set. AI features will fallback to simulation.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// REST API for Syncy AI Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, profile } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        text: `Hey! I'm Syncy, your SkillSync AI Assistant. I notice that the GEMINI_API_KEY is not currently configured, but I can still simulate a friendly response! You mentioned: "${message}". In a fully connected setup, I would analyze your profile (${profile?.name || "User"}) to recommend custom matches and learning paths!`
      });
    }

    const ai = getGemini();
    
    // Construct instructions context
    const profileContext = profile 
      ? `User Profile:\n- Name: ${profile.name}\n- College: ${profile.college}\n- Skills Offered: ${profile.skillsOffered?.join(", ") || "None"}\n- Skills Wanted: ${profile.skillsWanted?.join(", ") || "None"}\n- Experience Level: ${profile.experience}\n- Interests: ${profile.interests || "None"}\n- Goals: ${profile.learningGoals || "None"}`
      : "User Profile: Not yet fully completed onboarding.";

    const systemInstruction = `You are Syncy, a brilliant, friendly, and supportive peer-to-peer career mentor and skill matchmaker on the SkillSync platform.
Your goals:
1. Help users discover the best learning roadmaps for their desired skills.
2. Provide career advice, resume tips, and learning roadmaps.
3. Suggest skills they could offer or learn next.
4. Help them refine their bio or profile headlines to attract better matches.
5. Provide match recommendations or icebreaker lines for peer exchanges.

Keep your tone engaging, motivational, direct, and conversational (like a tech-startup mentor). Avoid robotic intro/outro phrases.
Format your responses using clean Markdown structure (bullet points, bolding, simple lists).

Here is the context of the user you are chatting with:
${profileContext}`;

    // Convert client-supplied history to contents structure for the SDK
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: { role: string; text: string }) => {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      });
    }
    
    // Append the current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/chat:", error);
    res.status(500).json({ error: "Something went wrong. Let's try again in a moment!", details: error.message });
  }
});

// Endpoint for Syncy to generate Profile copy (bios, headlines, or suggestions)
app.post("/api/ai/generate-profile", async (req, res) => {
  try {
    const { skillsOffered, skillsWanted, experience, interests, promptType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return simulated bio/headline
      if (promptType === "bio") {
        return res.json({
          text: `Passionate enthusiast ready to exchange skills on SkillSync! I am eager to share my knowledge in ${skillsOffered?.join(", ") || "my fields"} and looking forward to learning ${skillsWanted?.join(", ") || "new tools"}. Let's collaborate, build projects, and grow together!`
        });
      } else {
        return res.json({
          text: `Exchanging ${skillsOffered?.[0] || "skills"} for ${skillsWanted?.[0] || "knowledge"} | Let's sync!`
        });
      }
    }

    const ai = getGemini();
    let prompt = "";
    if (promptType === "bio") {
      prompt = `Generate a modern, highly compelling, human-sounding personal bio (approx 100-150 words) for a professional or student profile.
Details:
- Skills Offered: ${skillsOffered?.join(", ") || "None"}
- Skills Wanted: ${skillsWanted?.join(", ") || "None"}
- Experience Level: ${experience || "Enthusiast"}
- Interests: ${interests || "General learning"}

The bio should be written in the first person, look warm and active, and explicitly mention peer-to-peer exchange and building real projects. Return ONLY the plain text of the bio, no quotes or intro phrases.`;
    } else {
      prompt = `Generate 3 options for a short, punchy, modern profile headline (one liner, max 80 chars) for a peer skill-exchanger.
Details:
- Skills Offered: ${skillsOffered?.join(", ") || "None"}
- Skills Wanted: ${skillsWanted?.join(", ") || "None"}
- Experience: ${experience || "Enthusiast"}

Provide ONLY the headlines, one per line, formatted with numbers (e.g. "1. Headline").`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional resume writer and copywriter specializing in tech startup branding.",
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/generate-profile:", error);
    res.status(500).json({ error: "Failed to generate copywriting options." });
  }
});

// Configure Vite middleware in development or static hosting in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillSync dev server running on http://localhost:${PORT}`);
  });
}

startServer();
