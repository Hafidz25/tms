import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import LevelPage from "@/app/dashboard/level-fee/page";

describe("<LevelPage />", () => {
  test("renders level fee page", () => {
    render(<LevelPage />);
  });
});
