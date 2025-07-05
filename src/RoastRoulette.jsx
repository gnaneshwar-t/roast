import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const friends = [
  "Maniker", "Lokesh", "Krishnateja", "Amshith", "Harshith", "Rohith",
  "Saivivek", "Ruthvika", "Sahithi", "Sarayu", "Aakanksha", "Anvitha",
  "Sneha", "Tapaswini", "Ketana", "Bhavaneeswar", "Koushik"
];

const roasts = [
  "You're not dumb, you just have a lot of unexpressed potential. Very, very deeply buried.",
  "You bring so little to the table, even chairs are more useful.",
  "You have something no one else has… a complete lack of self-awareness.",
  "You're like a software bug—no one knows what you’re doing, including you.",
  "Your brain has too many tabs open, and none of them are loading.",
  "You say 'trust me' more than your brain says 'think first'.",
  "Your vibe is giving… unskilled but confident.",
  "You're the human version of 'buffering…'",
  "You’re not built different, you’re just broken in a unique way.",
  "Your confidence is inspiring. Your logic? Not so much.",
  "You try so hard to be mysterious, but it's just confusion.",
  "You make me believe in deleting conversations before they're even over.",
  "Your presence is like CAPTCHA—unnecessary and mildly frustrating.",
  "You're a limited edition… thank god.",
  "If effort could be invisible, you’d be a master at it.",
  "You don't have bad ideas, just… consistently below average ones.",
  "You're not the main character; you're the buffering wheel.",
  "Your sense of humor is like your WiFi signal—weak and unstable.",
  "You're like a group project—everyone suffers and no one likes you.",
  "You talk like there’s a laugh track behind you. There isn’t."
];


export default function RoastRoulette() {
  const [selectedFriend, setSelectedFriend] = useState("");
  const [roast, setRoast] = useState("");
  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      const line = roasts[Math.floor(Math.random() * roasts.length)];
      setRoast(line);
      addDoc(collection(db, "roasts"), {
        person: selectedFriend,
        roast: line,
        timestamp: Date.now(),
      });
      setTimeout(() => fetchLeaderboard(), 1000);
    }
  }, [selectedFriend]);

  async function fetchLeaderboard() {
    const snap = await getDocs(collection(db, "roasts"));
    const counts = {};
    snap.forEach((doc) => {
      const name = doc.data().person;
      counts[name] = (counts[name] || 0) + 1;
    });
    setLeaderboard(counts);
  }

  return (
    <div style={{ backgroundColor: "#121212", color: "white", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔥 Roast Roulette</h1>
      <select
        value={selectedFriend}
        onChange={(e) => setSelectedFriend(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", borderRadius: "5px" }}
      >
        <option value="">-- Select a Friend --</option>
        {friends.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {roast && (
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#1e1e1e", borderRadius: "10px" }}>
          <h2>{selectedFriend} 🔥</h2>
          <p>"{roast}"</p>
        </div>
      )}

      <div style={{ marginTop: "3rem" }}>
        <h2>👑 Leaderboard (Most Roasted)</h2>
        <ul>
          {Object.entries(leaderboard)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => (
              <li key={name}>{name} - {count} roasts</li>
            ))}
        </ul>
      </div>
    </div>
  );
}
