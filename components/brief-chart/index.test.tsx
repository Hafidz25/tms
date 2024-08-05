import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BriefChart from "@/components/brief-chart";

describe("BriefChart", () => {
  test("renders", () => {
    //@ts-ignore
    render(<BriefChart userExist={"Admin"} users={[]} briefs={[]} />);
  });
});
