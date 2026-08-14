export type SampleBill = {
  id: string;
  name: string;
  type: string;
  blurb: string;
  text: string;
};

export const SAMPLE_BILLS: SampleBill[] = [
  {
    id: "sample-mri",
    name: "Knee MRI + follow-up (EOB)",
    type: "EOB",
    blurb: "Duplicate MRI, wildly inflated prices, a $1,000 phantom on the total, and a non-covered supply charge.",
    text: [
      "MY HEALTH PLAN INC.",
      "EXPLANATION OF BENEFITS",
      "Member: Jane Doe",
      "Member ID: XR-998773",
      "Provider: CITY ORTHOPEDIC CENTER",
      "Date of service: 06/10/2026",
      "Statement date: 07/02/2026",
      "",
      "Line  Date        Code    Description                               Qty  Billed      Allowed     Paid",
      "01  06/10/2026  73721  MRI knee joint without contrast               1  $2,400.00   $497.00     $397.60",
      "02  06/10/2026  73721  MRI knee joint without contrast               1  $2,400.00   $497.00     $397.60",
      "03  06/10/2026  99213  Office visit, established patient, level 3    1  $320.00     $74.00      $59.20",
      "04  06/10/2026  99214  Office visit, established patient, level 4    1  $109.00     $109.00     $87.20",
      "05  06/10/2026  85025  Complete blood count automated                 2  $58.00      $14.00      $11.20",
      "06  06/10/2026  270    Medical supplies, non-covered                  1  $225.00     $0.00       $0.00",
      "",
      "TOTAL BILLED: $6,512.00",
      "TOTAL ALLOWED: $1,700.00",
      "TOTAL PAID: $1,360.00",
      "AMOUNT YOU OWE: $340.00",
    ].join("\n"),
  },
];

export function getSample(id: string): SampleBill | undefined {
  return SAMPLE_BILLS.find((s) => s.id === id);
}
