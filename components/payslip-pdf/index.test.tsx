import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PayslipPdf from "@/components/payslip-pdf";

describe("PayslipPdf", () => {
  test("renders", () => {
    render(<PayslipPdf />);
  });
});
