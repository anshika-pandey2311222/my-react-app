import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DSATracker from "./pages/DSATracker";
import Home from "./pages/Home";
import Arrays from "./pages/TopicNotes/Arrays";
import LinkedList from "./pages/TopicNotes/LinkedLists";
import Stack from "./pages/TopicNotes/Stack";
import Tree from "./pages/TopicNotes/Trees";
import Searching from "./pages/TopicNotes/Searching";
import Chatbot from "./pages/Chatbot";
import Compiler from "./pages/Compiler";
import RoadmapPage from "./components/Roadmap/RoadmapPage";
import EasyDSA from "./pages/EasyDSA";
import Recursion from "./pages/TopicNotes/Recursion";
import Patterns from "./pages/Patterns";
import Basics from "./pages/Basics";
import Topics from "./pages/Topics";
import InterviewPrep from "./pages/InterviewPrep";
import FloatingChatbot from "./components/FloatingChatbot";
import HuffmanEncoding from "./pages/TopicNotes/HuffmanEncoding";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dsa-tracker" element={<DSATracker />} />
        <Route path="/array" element={<Arrays backendUrl={BACKEND_URL} />} />
        <Route path="/topics" element={<Topics backendUrl={BACKEND_URL} />} />
        <Route path="/linkedlist" element={<LinkedList backendUrl={BACKEND_URL} />} />
        <Route path="/stack" element={<Stack backendUrl={BACKEND_URL} />} />
        <Route path="/searching" element={<Searching backendUrl={BACKEND_URL} />} />
        <Route path="/chatbot" element={<Chatbot backendUrl={BACKEND_URL} />} />
        <Route path="/compiler" element={<Compiler backendUrl={BACKEND_URL} />} />
        <Route path="/roadmap" element={<RoadmapPage backendUrl={BACKEND_URL} />} />
        <Route path="/HuffmanEncoding" element={<HuffmanEncoding backendUrl={BACKEND_URL} />} />
        <Route path="/Patterns" element={<Patterns backendUrl={BACKEND_URL} />} />
        <Route path="/EasyDSA" element={<EasyDSA backendUrl={BACKEND_URL} />} />
        <Route path="/Recursion" element={<Recursion backendUrl={BACKEND_URL} />} />
        <Route path="/Basics" element={<Basics backendUrl={BACKEND_URL} />} />
        <Route path="/InterviewPrep" element={<InterviewPrep backendUrl={BACKEND_URL} />} />
        <Route path="/trees" element={<Tree backendUrl={BACKEND_URL} />} />
      </Routes>

      <FloatingChatbot backendUrl={BACKEND_URL} />
    </div>
  );
}
