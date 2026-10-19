import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants";
import { useState, useEffect, useCallback } from "react";

//store the recent experssions and results of that expression
export interface HistoryItem {
  expression: string;
  result: string;
}

export function useCalculator() {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "x":
      case "*":
        return a * b;
      case "÷":
      case "/":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const handleDigit = useCallback(
    (digit: string) => {
      setDisplayValue((currentDisplay) => {
        if (currentDisplay === "Error" || overwrite) {
          setOverwrite(false);
          return digit === "." ? "0." : digit;
        }

        if (digit === "." && currentDisplay.includes(".")) {
          return currentDisplay;
        }
        return currentDisplay === "0" && digit !== "."
          ? digit
          : currentDisplay + digit;
      });
    },
    [overwrite],
  );

  const handleOperation = useCallback(
    (op: string) => {
      if (displayValue === "Error") return;

      const current = parseFloat(displayValue);

      if (prevValue !== null && operation && !overwrite) {
        const prev = parseFloat(prevValue);
        const result = calculate(prev, current, operation);

        if (isNaN(result)) {
          setDisplayValue("Error");
          setPrevValue(null);
          setOperation(null);
          setOverwrite(true);
          return;
        }

        const formatted = Number(result.toFixed(8)).toString();

        setHistory((prevHistory) => [
          { expression: `${prev} ${operation} ${current}`, result: formatted },
          ...prevHistory,
        ]);

        setDisplayValue(formatted);
        setPrevValue(formatted);
      } else {
        setPrevValue(displayValue);
      }

      setOperation(op);
      setOverwrite(true);
    },
    [displayValue, prevValue, operation, overwrite],
  );

  const handleEquals = useCallback(() => {
    if (!operation || prevValue === null || displayValue === "Error") return;

    const prev = parseFloat(prevValue);
    const current = parseFloat(displayValue);
    const result = calculate(prev, current, operation);

    if (isNaN(result)) {
      setDisplayValue("Error");
    } else {
      const formatted = Number(result.toFixed(8)).toString();

      setHistory((prevHistory) => [
        { expression: `${prev} ${operation} ${current}`, result: formatted },
        ...prevHistory,
      ]);

      setDisplayValue(formatted);
    }

    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  }, [operation, prevValue, displayValue]);

  const handleClear = useCallback(() => {
    setDisplayValue("0");
    setPrevValue(null);
    setOperation(null);
    setOverwrite(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (displayValue === "Error" || overwrite) return;

    setDisplayValue((prev) => {
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-"))) {
        return "0";
      }
      return prev.slice(0, -1);
    });
  }, [displayValue, overwrite]);

  const handleToggleSign = useCallback(() => {
    if (displayValue === "0" || displayValue === "Error") return;
    setDisplayValue((prev) =>
      prev.startsWith("-") ? prev.slice(1) : "-" + prev,
    );
  }, [displayValue]);

  const handlePercentage = useCallback(() => {
    if (displayValue === "Error") return;
    const current = parseFloat(displayValue);
    const result = current / 100;
    setDisplayValue(Number(result.toFixed(8)).toString());
  }, [displayValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === ".") handleDigit(".");
      else if (e.key === "+") handleOperation("+");
      else if (e.key === "-") handleOperation("-");
      else if (e.key === "*") handleOperation("x");
      else if (e.key === "/") {
        e.preventDefault();
        handleOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Escape") handleClear();
      else if (e.key === "%") handlePercentage();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleDigit,
    handleOperation,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercentage,
  ]);

  return {
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
    clearHistory: () => setHistory([]),
  };
}
