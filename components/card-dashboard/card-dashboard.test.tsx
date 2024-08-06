import { describe, expect, it, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CardDashboard } from "@/components/card-dashboard";

describe("Card Dashboard Component", () => {
  it("render card dashboard component", () => {
    const component = render(
      //@ts-ignore
      <CardDashboard userExist={null} users={[]} briefs={[]} />
    );
    expect(component).toMatchSnapshot();
  });
});
