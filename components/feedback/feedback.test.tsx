import { describe, expect, it, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Feedback } from "@/components/feedback";

describe("Feedback Component", () => {
  it("render feedback component", () => {
    const component = render(<Feedback />);
    expect(component).toMatchSnapshot();
  });
});
