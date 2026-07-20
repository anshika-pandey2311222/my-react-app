import React from "react";
import LinkedListCodeTabs from "./LinkedListCodeTabs";

const videos = [
  { language: "Python", url: "https://www.youtube.com/watch?v=1iz9SRWdpX8" },
  { language: "Java", url: "https://www.youtube.com/watch?v=hDwPD6kTmEk" },
  { language: "C++", url: "https://www.youtube.com/watch?v=FZfjv7DraD4" },
  { language: "C", url: "https://www.youtube.com/watch?v=MCIwn7mY4jY" },
];

const listTypes = [
  {
    name: "Singly Linked List",
    pointerDesc: "Data + Next pointer",
    traversal: "Forward direction only",
    useCase: "Basic stacks, simple sequential processing",
    overhead: "Low (1 pointer/node)"
  },
  {
    name: "Doubly Linked List",
    pointerDesc: "Data + Next pointer + Previous pointer",
    traversal: "Bidirectional (Forward & Backward)",
    useCase: "Browser history navigation, LRU Cache systems",
    overhead: "High (2 pointers/node)"
  },
  {
    name: "Circular Linked List",
    pointerDesc: "Tail node loops back to Head node",
    traversal: "Continuous looping loop loops",
    useCase: "Round-Robin CPU process scheduling, media loops",
    overhead: "Low to High (Depends on Singly/Doubly foundation)"
  }
];

export default function LinkedList() {
  const [activeTypeTab, setActiveTypeTab] = useState(0);

  return (
    <div className="min-h-screen bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800 p-6 sm:p-10">
        
        {/* Header Zone */}
        <div className="border-b border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00FFFF] tracking-tight">
            Mastering the Linked List
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-3xl leading-relaxed">
            Unlike rigid sequential layouts like arrays, a linked list adapts dynamically by weaving structural links between scattered memory points. Let's break down its internal mechanics, key structural variants, and algorithm use cases.
          </p>
        </div>

        {/* Conceptual Breakdown */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#00FFFF] flex items-center gap-2">
            What is a Linked List?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-400">
            <div className="bg-gray-950 p-5 rounded-lg border border-gray-800">
              <h3 className="text-white font-semibold mb-2">The Node Structure</h3>
              <p className="text-sm">The fundamental building block. Every isolated node contains raw information plus the pointer addresses that bind it to its neighbors.</p>
            </div>
            <div className="bg-gray-950 p-5 rounded-lg border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Non-Contiguous Allocation</h3>
              <p className="text-sm">Arrays demand an absolute block of contiguous storage slots. Linked lists can break elements apart across completely isolated gaps in memory.</p>
            </div>
            <div className="bg-gray-950 p-5 rounded-lg border border-gray-800">
              <h3 className="text-white font-semibold mb-2">The Pointer Chain</h3>
              <p className="text-sm">Accessing items relies exclusively on chasing down paths sequential step-by-step from the initial entry node point (the Head).</p>
            </div>
          </div>
        </section>

        {/* Structural Variations Tabs */}
        <section className="mb-12 bg-gray-950 rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">
            Structural Variations & Core Types
          </h2>
          
          {/* Tabs Control Row */}
          <div className="flex border-b border-gray-800 mb-6 overflow-x-auto gap-2">
            {listTypes.map((type, idx) => (
              <button
                key={type.name}
                onClick={() => setActiveTypeTab(idx)}
                className={`py-2 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                  activeTypeTab === idx 
                    ? "border-[#00FFFF] text-[#00FFFF]" 
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-medium text-white mb-2">{listTypes[activeTypeTab].name}</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                {listTypes[activeTypeTab].name === "Singly Linked List" && "Each node holds just one forwarding reference. Ideal when minimizing system memory utilization is paramount."}
                {listTypes[activeTypeTab].name === "Doubly Linked List" && "Includes dual structural links. Dramatically simplifies absolute insertion and element parsing directions at the cost of heavier node sizing storage allocations."}
                {listTypes[activeTypeTab].name === "Circular Linked List" && "Locks elements together into endless loops. The definitive selection for handling continuous scheduling pipelines."}
              </p>
              <table className="w-full text-left text-xs text-gray-400">
                <tbody>
                  <tr className="border-b border-gray-900"><td className="py-2 font-semibold text-gray-500">Pointer Setup:</td><td className="py-2 text-gray-300">{listTypes[activeTypeTab].pointerDesc}</td></tr>
                  <tr className="border-b border-gray-900"><td className="py-2 font-semibold text-gray-500">Traversal Vector:</td><td className="py-2 text-gray-300">{listTypes[activeTypeTab].traversal}</td></tr>
                  <tr className="border-b border-gray-900"><td className="py-2 font-semibold text-gray-500">Memory Overhead:</td><td className="py-2 text-gray-300">{listTypes[activeTypeTab].overhead}</td></tr>
                  <tr><td className="py-2 font-semibold text-gray-500">Prime Application:</td><td className="py-2 text-[#00FFFF]">{listTypes[activeTypeTab].useCase}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex items-center justify-center min-h-[140px]">
              {/* Fallback code visualization context placeholder */}
              <div className="text-center font-mono text-xs text-gray-500">
                {activeTypeTab === 0 && "[Head] -> [Node A] -> [Node B] -> NULL"}
                {activeTypeTab === 1 && "NULL <- [Head] <-> [Node A] <-> [Node B] -> NULL"}
                {activeTypeTab === 2 && "[Head] -> [Node A] -> [Node B] --loops back to--> [Head]"}
              </div>
            </div>
          </div>
        </section>

        {/* Complexity Analysis Matrix */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">Time & Space Complexity Profiles</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-left font-mono text-sm">
              <thead className="bg-gray-950 text-gray-400 text-xs border-b border-gray-800">
                <tr>
                  <th className="p-4 font-sans font-bold">Operation</th>
                  <th className="p-4 text-[#00FFFF]">Singly List</th>
                  <th className="p-4 text-emerald-400">Array (Static)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                <tr><td className="p-4 font-sans font-medium text-white">Access / Search by Index</td><td className="p-4 text-red-400">O(n)</td><td className="p-4 text-emerald-400">O(1)</td></tr>
                <tr><td className="p-4 font-sans font-medium text-white">Prepend / Insert at Head</td><td className="p-4 text-emerald-400">O(1)</td><td className="p-4 text-red-400">O(n)</td></tr>
                <tr><td className="p-4 font-sans font-medium text-white">Insert at Known Position</td><td className="p-4 text-emerald-400">O(1)</td><td className="p-4 text-red-400">O(n)</td></tr>
                <tr><td className="p-4 font-sans font-medium text-white">Append / Insert at Tail</td><td className="p-4 text-gray-400">O(1)* (with tail ref)</td><td className="p-4 text-red-400">O(n) if full</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Live Code Blocks Selector */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">
            Basic Linked List Operations Implementation
          </h2>
          <LinkedListCodeTabs />
        </section>

        {/* Media & Resources section */}
        <section className="mb-12 border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">Video Reference Masterclasses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map(({ language, url }) => (
              <a
                key={language}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-[#00FFFF] rounded-lg transition group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white group-hover:text-[#00FFFF] transition">
                    Linked List Architecture in {language}
                  </span>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300">
                    Watch Tutorial →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Comprehensive Problems Tracks Sorted By Difficulty */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-[#00FFFF]">Curated Problem Roadmaps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-gray-400 mb-3 uppercase tracking-wide">1. Foundational Fundamentals</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Traverse a linked list safely without dropping references</li>
                <li>Insert node cleanly at head vs. trailing tail pointer</li>
                <li>Safely detach and delete middle target items</li>
                <li>Search values iteratively vs. recursively</li>
              </ul>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-yellow-500 mb-3 uppercase tracking-wide">2. The Easy-Medium Track</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Reverse pointers in-place (Three-pointer technique)</li>
                <li>Detect structural loops via Floyd's Tortoise & Hare</li>
                <li>Identify exact junction intersection point of two lists</li>
                <li>Find Nth node from end using Fast/Slow step spacing</li>
              </ul>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-orange-500 mb-3 uppercase tracking-wide">3. Intermediate Core Challenges</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Add values represented by digit lists with dynamic carries</li>
                <li>Partition an unsorted line around arbitrary pivot values</li>
                <li>Clone complex objects embedded with random point addresses</li>
                <li>Sort lists in O(n log n) matching Merge Sort paradigms</li>
              </ul>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-red-500 mb-3 uppercase tracking-wide">4. Advanced Mastery Track</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Reverse sub-nodes safely in strict K-group batches</li>
                <li>Merge K sorted node inputs via Priority Queue heaps</li>
                <li>Construct a complete production-grade LRU Cache system</li>
                <li>Flatten multilevel branching nested list blocks</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
