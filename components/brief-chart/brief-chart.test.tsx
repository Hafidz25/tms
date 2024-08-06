import { describe, expect, it, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BriefChart } from "@/components/brief-chart";

describe("Brief Chart Component", () => {
  it("render brief chart component", () => {
    const component = render(
      //@ts-ignore
      <BriefChart userExist={"Admin"} users={[]} briefs={[]} />
    );
    expect(component).toMatchSnapshot();
  });
});
