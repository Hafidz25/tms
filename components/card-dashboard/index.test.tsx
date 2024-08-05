import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CardDashboard from "@/components/card-dashboard";

describe("CardDashboard", () => {
  test("renders", () => {
    //@ts-ignore
    render(<CardDashboard userExist={null} users={[]} briefs={[]} />);
  });
});
