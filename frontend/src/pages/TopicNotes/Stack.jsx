import React, { useState } from "react";
import StackCodeTabs from "./StackCodeTabs";

const videos = [
  { language: "Python", url: "https://www.youtube.com/watch?v=zwb3GmNAtFk" },
  { language: "Java", url: "https://www.youtube.com/watch?v=wjI1WNcIntg" },
  { language: "C", url: "https://www.youtube.com/watch?v=HjdJzNoT_qg" },
  { language: "C++", url: "https://www.youtube.com/watch?v=1AJ4ldcH2t4" },
];

const implementationStyles = [
  {
    type: "Array Implementation",
    allocation: "Contiguous Memory Block",
    pros: "Fast random cache lookups, zero pointer memory footprint overhead",
    cons: "Fixed size limit threshold, resizing introduces full array copying delays",
    overflowBehavior: "Throws Stack Overflow if limits are breached"
  },
  {
    type: "Linked List Implementation",
    allocation: "Dynamic Heap Segments",
    pros: "Boundless continuous growing scope, no upfront sizing parameters needed",
    cons: "Extra pointer address footprint tracking per node, worse cache locality",
    overflowBehavior: "Only hits limits if total system memory runs out"
  }
];

export default function Stack() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800 p-6 sm:p-10">
        
        {/* Main Content Header */}
        <div className="border-b border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00FFFF] tracking-tight">
            The Stack Data Structure
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-3xl leading-relaxed">
            A linear structural pattern controlled entirely by a strict sequencing rule: <strong>Last-In, First-Out (LIFO)</strong>. Elements can only enter or leave through a single doorway called the <strong>Top</strong>.
          </p>
        </div>

        {/* Fundamental Design Cards */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#00FFFF]">Core Mechanics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-400">
            <div className="bg-gray-950 p-5 rounded-lg border border-gray-800">
              <h3 className="text-white font-semibold mb-2">LIFO Access Strategy</h3>
              <p className="text-sm">The item added most recently is permanently prioritized. You cannot bypass the boundary line to target deeper elements without pulling off everything above them first.</p>
            </div>
            <div className="bg-gray-950 p-5 rounded-lg border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Restricted Mutability</h3>
              <p className="text-sm">There are no random inserts at index `i`. All mutations take place instantly at the current index position tracked by the single `top` marker reference.</p>
            </div>
            <div className="bg-gray-950 p-5 rounded-lg border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Safety Invariant Guard</h3>
              <p className="text-sm">Prevents out-of-bounds corruption errors. Attempts to extract elements from an empty container trigger a critical structural error called <code>Stack Underflow</code>.</p>
            </div>
          </div>
        </section>

        {/* Implementation Strategy Selector */}
        <section className="mb-12 bg-gray-950 rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">
            Architectural Implementations Comparison
          </h2>
          
          <div className="flex border-b border-gray-800 mb-6 overflow-x-auto gap-2">
            {implementationStyles.map((style, idx) => (
              <button
                key={style.type}
                onClick={() => setActiveTab(idx)}
                className={`py-2 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                  activeTab === idx 
                    ? "border-[#00FFFF] text-[#00FFFF]" 
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {style.type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-medium text-white mb-2">{implementationStyles[activeTab].type}</h3>
              <table className="w-full text-left text-xs text-gray-400">
                <tbody>
                  <tr className="border-b border-gray-900"><td className="py-2 font-semibold text-gray-500">Memory Blueprint:</td><td className="py-2 text-gray-300">{implementationStyles[activeTab].allocation}</td></tr>
                  <tr className="border-b border-gray-900"><td className="py-2 font-semibold text-gray-500">Key Advantage:</td><td className="py-2 text-emerald-400">{implementationStyles[activeTab].pros}</td></tr>
                  <tr className="border-b border-gray-900"><td className="py-2 font-semibold text-gray-500">Structural Con:</td><td className="py-2 text-red-400">{implementationStyles[activeTab].cons}</td></tr>
                  <tr><td className="py-2 font-semibold text-gray-500">Boundary Limit Risk:</td><td className="py-2 text-yellow-500">{implementationStyles[activeTab].overflowBehavior}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex items-center justify-center min-h-[140px]">
              <div className="text-center font-mono text-xs text-gray-500">
                {activeTab === 0 && "[Index 0: Base] -> [Index 1] -> [Index 2: Top pointer] -> [Empty]"}
                {activeTab === 1 && "[Top pointer] -> [Node C] -> [Node B] -> [Node A: Base] -> NULL"}
              </div>
            </div>
          </div>
        </section>

        {/* Complexity Profiles Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">Operation Complexity Run Times</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-left font-mono text-sm">
              <thead className="bg-gray-950 text-gray-400 text-xs border-b border-gray-800">
                <tr>
                  <th className="p-4 font-sans font-bold">Standard Method</th>
                  <th className="p-4 text-[#00FFFF]">Time Complexity</th>
                  <th className="p-4 text-gray-400">Space Complexity</th>
                  <th className="p-4 font-sans font-bold text-gray-500">Core Objective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                <tr><td className="p-4 font-sans font-medium text-white">push(x)</td><td className="p-4 text-emerald-400">O(1)</td><td className="p-4 text-gray-400">O(1)</td><td className="p-4 font-sans text-xs text-gray-500">Appends item onto the topmost level location</td></tr>
                <tr><td className="p-4 font-sans font-medium text-white">pop()</td><td className="p-4 text-emerald-400">O(1)</td><td className="p-4 text-gray-400">O(1)</td><td className="p-4 font-sans text-xs text-gray-500">Detaches and yields the current topmost item</td></tr>
                <tr><td className="p-4 font-sans font-medium text-white">peek() / top()</td><td className="p-4 text-emerald-400">O(1)</td><td className="p-4 text-gray-400">O(1)</td><td className="p-4 font-sans text-xs text-gray-500">Inspects values at top without removing them</td></tr>
                <tr><td className="p-4 font-sans font-medium text-white">isEmpty()</td><td className="p-4 text-emerald-400">O(1)</td><td className="p-4 text-gray-400">O(1)</td><td className="p-4 font-sans text-xs text-gray-500">Evaluates whether target references point to null</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive Code Implementation Tabs */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">
            Basic Stack Operations (Choose Your Language)
          </h2>
          <StackCodeTabs />
        </section>

        {/* Applications Block */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">Real-World Engineering Applications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
              <strong className="text-white block mb-1">Execution Call Stacks</strong>
              <p className="text-gray-400 text-xs">Used internally by system compilers to track subroutine invocation sequences, runtime parameters, and local scoping values during recursive executions.</p>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
              <strong className="text-white block mb-1">Expression Parsing</strong>
              <p className="text-gray-400 text-xs">Compilers convert high-level equations into machine formats like Postfix/Infix notation pipelines, tracking operational precedence safely.</p>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
              <strong className="text-white block mb-1">Undo/Redo State Records</strong>
              <p className="text-gray-400 text-xs">Text editors and design layout programs store sequential mutations inside tracking stacks to roll back operations predictably.</p>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
              <strong className="text-white block mb-1">Graph Exploration Backtracking</strong>
              <p className="text-gray-400 text-xs">Depth-First Search (DFS) configurations rely heavily on tracking current nodes using standard stack footprints to accurately reverse direction when hitting dead ends.</p>
            </div>
          </div>
        </section>

        {/* Video Resources List Grid */}
        <section className="mb-12 border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#00FFFF]">Video Resources Masterclasses</h2>
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
                    Stack Architecture in {language}
                  </span>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300">
                    Watch Tutorial →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Problem Breakdown Tracks */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-[#00FFFF]">Curated Practice Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-gray-400 mb-3 uppercase tracking-wide">1. Foundational Fundamentals</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Implement a basic stack outline structure using standard Arrays</li>
                <li>Design dynamic node additions based on Linked List blocks</li>
                <li>Verify valid matching structures using Balanced Parentheses</li>
                <li>Invert collection patterns using standard String Reversal</li>
              </ul>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-yellow-500 mb-3 uppercase tracking-wide">2. Core Evaluation Algorithms</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Evaluate complex values using Postfix notation parsing</li>
                <li>Convert Infix formatting lines directly into clean Prefix strings</li>
                <li>Find the Next Greater Element across variable array lengths</li>
                <li>Calculate localized trends using standard Stock Span steps</li>
              </ul>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-orange-500 mb-3 uppercase tracking-wide">3. Advanced Design Challenges</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Construct a complete Min Stack tracking minimum values in O(1) time</li>
                <li>Implement functional Queue mechanics using double Stack structures</li>
                <li>Identify the optimal guest element in the Celebrity Problem matrix</li>
                <li>Design quick middle retrieval indices using double link systems</li>
              </ul>
            </div>

            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-bold text-red-500 mb-3 uppercase tracking-wide">4. Hard Optimization Mastery</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                <li>Compute the Largest Rectangle bounds inside an active Histogram</li>
                <li>Find maximal boundary space inside a 2D Binary Matrix</li>
                <li>Optimize structural processing limits via Monotonic Stacks</li>
                <li>Keep track of continuous operational limits using sliding Min/Max window filters</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}