"use client";

import { useState } from "react";
import { useCalculator } from "./hooks/useCalculator";

export default function Home() {
  const {
    displayValue,
    prevValue,
    operation,
    history,
    handleDigit,
    handleOperation,
    handleEquals,
    handleClear,
    handleBackspace,
    handleToggleSign,
    handlePercentage,
    clearHistory,
  } = useCalculator();

  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleScientificOp = (type: string) => {
    const current = parseFloat(displayValue);
    if (isNaN(current) || displayValue === "Error") return;

    let result = 0;
    switch (type) {
      case "sqrt":
        if (current < 0) {
          handleClear();
          handleDigit("Error");
          return;
        }
        result = Math.sqrt(current);
        break;
      case "square":
        result = Math.pow(current, 2);
        break;
      case "sin":
        result = Math.sin((current * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos((current * Math.PI) / 180);
        break;
      case "pi":
        result = Math.PI;
        break;
      default:
        return;
    }

    const formatted = Number(result.toFixed(8)).toString();
    handleClear();
    handleDigit(formatted);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      {/* Container expands smoothly when Scientific Mode is active */}
      <div
        className={`w-full transition-all duration-300 ${isScientific ? "max-w-md" : "max-w-xs sm:max-w-sm"} bg-black p-6 rounded-3xl shadow-2xl border border-neutral-800`}
      >
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4 text-xs font-semibold tracking-wider text-neutral-400">
          <button
            onClick={() => setIsScientific(!isScientific)}
            className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors"
          >
            {isScientific ? "Standard Mode" : "Scientific Mode"}
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1"
          >
            ⏱ History ({history.length})
          </button>
        </div>

        {/* Display Screen */}
        <div className="flex flex-col items-end justify-end h-32 px-4 py-4 mb-3 select-none overflow-hidden bg-neutral-900/50 rounded-2xl border border-neutral-800/50">
          <div className="text-neutral-400 text-sm h-6 font-mono">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ""}
          </div>
          <div className="text-white text-4xl sm:text-5xl font-light tracking-tight truncate w-full text-right">
            {displayValue}
          </div>
        </div>

        {/* History Drawer */}
        {showHistory && (
          <div className="mb-4 p-3 bg-neutral-900 rounded-2xl max-h-40 overflow-y-auto border border-neutral-800 text-sm">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-neutral-800">
              <span className="font-semibold text-neutral-400">
                History Log
              </span>
              <button
                onClick={clearHistory}
                className="text-xs text-red-400 hover:underline"
              >
                Clear
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-neutral-500 text-xs italic">
                No calculations recorded yet.
              </p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-1 text-xs font-mono border-b border-neutral-800/40"
                >
                  <span className="text-neutral-400">{item.expression} =</span>
                  <span className="text-amber-400 font-medium">
                    {item.result}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Dedicated Scientific Panel (Rendered above standard keys) */}
        {isScientific && (
          <div className="grid grid-cols-5 gap-2 mb-3">
            <button
              onClick={() => handleScientificOp("sqrt")}
              className="h-12 rounded-xl bg-neutral-800 text-amber-400 font-medium text-base hover:bg-neutral-700 active:scale-95 transition-all"
            >
              √
            </button>
            <button
              onClick={() => handleScientificOp("square")}
              className="h-12 rounded-xl bg-neutral-800 text-amber-400 font-medium text-base hover:bg-neutral-700 active:scale-95 transition-all"
            >
              x²
            </button>
            <button
              onClick={() => handleScientificOp("sin")}
              className="h-12 rounded-xl bg-neutral-800 text-amber-400 font-medium text-xs hover:bg-neutral-700 active:scale-95 transition-all"
            >
              sin
            </button>
            <button
              onClick={() => handleScientificOp("cos")}
              className="h-12 rounded-xl bg-neutral-800 text-amber-400 font-medium text-xs hover:bg-neutral-700 active:scale-95 transition-all"
            >
              cos
            </button>
            <button
              onClick={() => handleScientificOp("pi")}
              className="h-12 rounded-xl bg-neutral-800 text-amber-400 font-medium text-base hover:bg-neutral-700 active:scale-95 transition-all"
            >
              π
            </button>
          </div>
        )}

        {/* Standard Keypad Grid - Locked at 4 columns */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Top Utility Row */}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-neutral-400 text-black font-semibold text-lg active:opacity-70 active:scale-95 transition-all"
          >
            {displayValue !== "0" ? "C" : "AC"}
          </button>
          <button
            onClick={handleToggleSign}
            className="h-14 rounded-2xl bg-neutral-400 text-black font-semibold text-lg active:opacity-70 active:scale-95 transition-all"
          >
            ±
          </button>
          <button
            onClick={handlePercentage}
            className="h-14 rounded-2xl bg-neutral-400 text-black font-semibold text-lg active:opacity-70 active:scale-95 transition-all"
          >
            %
          </button>
          <button
            onClick={() => handleOperation("÷")}
            className={`h-14 rounded-2xl font-semibold text-xl active:opacity-70 active:scale-95 transition-all ${
              operation === "÷"
                ? "bg-white text-amber-500"
                : "bg-amber-500 text-white"
            }`}
          >
            ÷
          </button>

          {/* Row 1 */}
          <button
            onClick={() => handleDigit("7")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            7
          </button>
          <button
            onClick={() => handleDigit("8")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            8
          </button>
          <button
            onClick={() => handleDigit("9")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            9
          </button>
          <button
            onClick={() => handleOperation("x")}
            className={`h-14 rounded-2xl font-semibold text-xl active:opacity-70 active:scale-95 transition-all ${
              operation === "x"
                ? "bg-white text-amber-500"
                : "bg-amber-500 text-white"
            }`}
          >
            x
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit("4")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            4
          </button>
          <button
            onClick={() => handleDigit("5")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            5
          </button>
          <button
            onClick={() => handleDigit("6")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            6
          </button>
          <button
            onClick={() => handleOperation("-")}
            className={`h-14 rounded-2xl font-semibold text-xl active:opacity-70 active:scale-95 transition-all ${
              operation === "-"
                ? "bg-white text-amber-500"
                : "bg-amber-500 text-white"
            }`}
          >
            -
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit("1")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            1
          </button>
          <button
            onClick={() => handleDigit("2")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            2
          </button>
          <button
            onClick={() => handleDigit("3")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            3
          </button>
          <button
            onClick={() => handleOperation("+")}
            className={`h-14 rounded-2xl font-semibold text-xl active:opacity-70 active:scale-95 transition-all ${
              operation === "+"
                ? "bg-white text-amber-500"
                : "bg-amber-500 text-white"
            }`}
          >
            +
          </button>

          {/* Bottom Row */}
          <button
            onClick={() => handleDigit("0")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={() => handleDigit(".")}
            className="h-14 rounded-2xl bg-neutral-800 text-white font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all"
          >
            .
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-neutral-800 text-neutral-300 font-medium text-xl hover:bg-neutral-700 active:scale-95 transition-all flex items-center justify-center"
            title="Backspace"
          >
            ⌫
          </button>
          <button
            onClick={handleEquals}
            className="h-14 rounded-2xl bg-amber-500 text-white font-semibold text-xl hover:bg-amber-400 active:scale-95 transition-all"
          >
            =
          </button>
        </div>
      </div>
    </main>
  );
}
