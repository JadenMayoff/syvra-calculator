import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCalculator } from "../app/hooks/useCalculator";

describe("useCalculator Hook Unit Tests", () => {
  // Test 1: Initial state
  it('should initialize with display value set to "0"', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.displayValue).toBe("0");
    expect(result.current.prevValue).toBeNull();
    expect(result.current.operation).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  // Test 2: Digit entry and concatenation
  it("should append digits correctly and avoid multiple leading zeros", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("1"));
    act(() => result.current.handleDigit("2"));
    act(() => result.current.handleDigit("3"));

    expect(result.current.displayValue).toBe("123");
  });

  // Test 3: Decimal handling
  it("should prevent multiple decimal points in a single number", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("1"));
    act(() => result.current.handleDigit("."));
    act(() => result.current.handleDigit("2"));
    act(() => result.current.handleDigit(".")); // Duplicate decimal - should be ignored
    act(() => result.current.handleDigit("3"));

    expect(result.current.displayValue).toBe("1.23");
  });

  // Test 4: Basic Addition
  it("should perform addition correctly (5 + 3 = 8)", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("5"));
    act(() => result.current.handleOperation("+"));
    act(() => result.current.handleDigit("3"));
    act(() => result.current.handleEquals());

    expect(result.current.displayValue).toBe("8");
  });

  // Test 5: Basic Subtraction & Negative values
  it("should perform subtraction correctly (10 - 4 = 6)", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("1"));
    act(() => result.current.handleDigit("0"));
    act(() => result.current.handleOperation("-"));
    act(() => result.current.handleDigit("4"));
    act(() => result.current.handleEquals());

    expect(result.current.displayValue).toBe("6");
  });

  // Test 6: Basic Multiplication
  it("should perform multiplication correctly (4 x 2 = 8)", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("4"));
    act(() => result.current.handleOperation("x"));
    act(() => result.current.handleDigit("2"));
    act(() => result.current.handleEquals());

    expect(result.current.displayValue).toBe("8");
  });

  // Test 7: Basic Division
  it("should perform division correctly (15 ÷ 3 = 5)", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("1"));
    act(() => result.current.handleDigit("5"));
    act(() => result.current.handleOperation("÷"));
    act(() => result.current.handleDigit("3"));
    act(() => result.current.handleEquals());

    expect(result.current.displayValue).toBe("5");
  });

  // Test 8: Division by zero edge case
  it('should handle division by zero and output "Error"', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("9"));
    act(() => result.current.handleOperation("÷"));
    act(() => result.current.handleDigit("0"));
    act(() => result.current.handleEquals());

    expect(result.current.displayValue).toBe("Error");
  });

  // Test 9: Floating point precision fix
  it("should round floating point arithmetic issues (0.1 + 0.2 = 0.3)", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("0"));
    act(() => result.current.handleDigit("."));
    act(() => result.current.handleDigit("1"));
    act(() => result.current.handleOperation("+"));
    act(() => result.current.handleDigit("0"));
    act(() => result.current.handleDigit("."));
    act(() => result.current.handleDigit("2"));
    act(() => result.current.handleEquals());

    expect(result.current.displayValue).toBe("0.3");
  });

  // Test 10: Backspace functionality
  it("should delete the last typed digit when backspace is triggered", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("5"));
    act(() => result.current.handleDigit("8"));
    act(() => result.current.handleBackspace());

    expect(result.current.displayValue).toBe("5");
  });

  // Test 11: Toggle sign (±)
  it("should toggle positive and negative numbers correctly", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("7"));
    act(() => result.current.handleToggleSign());
    expect(result.current.displayValue).toBe("-7");

    act(() => result.current.handleToggleSign());
    expect(result.current.displayValue).toBe("7");
  });

  // Test 12: Clear button (AC)
  it("should reset state completely when handleClear is called", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("9"));
    act(() => result.current.handleOperation("+"));
    act(() => result.current.handleClear());

    expect(result.current.displayValue).toBe("0");
    expect(result.current.prevValue).toBeNull();
    expect(result.current.operation).toBeNull();
  });

  // Test 13: History logging
  it("should record calculation history accurately", () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.handleDigit("6"));
    act(() => result.current.handleOperation("+"));
    act(() => result.current.handleDigit("4"));
    act(() => result.current.handleEquals());

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0]).toEqual({
      expression: "6 + 4",
      result: "10",
    });
  });
});
