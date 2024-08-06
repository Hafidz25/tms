import { describe, expect, it, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PayslipPdf } from "@/components/payslip-pdf";

describe("Payslip PDF Component", () => {
  it("render payslip pdf component", () => {
    const component = render(<PayslipPdf />);
    expect(component).toMatchSnapshot();
  });
});
