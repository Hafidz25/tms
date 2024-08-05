import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Feedback from "@/components/feedback";

describe("Feedback", () => {
  test("renders", () => {
    render(<Feedback />);
    // expect(screen.getByText("Your feedback component")).toBeInTheDocument();
  });
});
