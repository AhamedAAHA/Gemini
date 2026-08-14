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
  {
    id: "sample-er",
    name: "Emergency room visit (hospital)",
    type: "hospital",
    blurb: "An ER visit billed at level 2 but coded as level 4 — plus a duplicate, inflated tests, and a non-covered ambulance ride.",
    text: [
      "GENERAL HOSPITAL SYSTEM",
      "PATIENT BILL",
      "Member: Carlos Rivera",
      "Member ID: XR-220114",
      "Provider: GENERAL HOSPITAL SYSTEM",
      "Date of service: 07/14/2026",
      "Statement date: 08/03/2026",
      "",
      "Line  Date        Code    Description                               Qty  Billed      Allowed     Paid",
      "01  07/14/2026  99284  Emergency department visit, level 2           1  $1,850.00   $259.00     $207.20",
      "02  07/14/2026  99284  Emergency department visit, level 2           1  $1,850.00   $259.00     $207.20",
      "03  07/14/2026  71046  Chest x-ray, 2 views                           1  $640.00     $39.00      $31.20",
      "04  07/14/2026  93000  Electrocardiogram complete                     1  $380.00     $29.00      $23.20",
      "05  07/14/2026  81002  Urinalysis, automated                          1  $95.00      $7.00       $5.60",
      "06  07/14/2026  80053  Comprehensive metabolic panel                  1  $310.00     $22.00      $17.60",
      "07  07/14/2026  A0429  Ambulance transportation, ground               1  $1,950.00   $0.00       $0.00",
      "",
      "TOTAL BILLED: $7,075.00",
      "TOTAL ALLOWED: $670.00",
      "TOTAL PAID: $536.00",
      "AMOUNT YOU OWE: $134.00",
    ].join("\n"),
  },
  {
    id: "sample-lab",
    name: "Lab work + office visit (EOB)",
    type: "EOB",
    blurb: "A bundled blood-draw fee and consistently marked-up lab panels on top of an office visit.",
    text: [
      "MY HEALTH PLAN INC.",
      "EXPLANATION OF BENEFITS",
      "Member: Priya Nair",
      "Member ID: XR-554902",
      "Provider: LAKEWOOD MEDICAL GROUP",
      "Date of service: 08/01/2026",
      "Statement date: 08/21/2026",
      "",
      "Line  Date        Code    Description                               Qty  Billed      Allowed     Paid",
      "01  08/01/2026  99213  Office visit, established patient, level 3    1  $250.00     $74.00      $59.20",
      "02  08/01/2026  36415  Routine venipuncture (blood draw)              1  $65.00      $4.00       $3.20",
      "03  08/01/2026  85025  Complete blood count automated                 1  $65.00      $14.00      $11.20",
      "04  08/01/2026  80053  Comprehensive metabolic panel                  1  $140.00     $22.00      $17.60",
      "05  08/01/2026  88305  Surgical pathology, gross and microscopic      1  $450.00     $128.00     $102.40",
      "06  08/01/2026  99214  Office visit, established patient, level 4    1  $109.00     $109.00     $87.20",
      "",
      "TOTAL BILLED: $1,079.00",
      "TOTAL ALLOWED: $357.00",
      "TOTAL PAID: $285.60",
      "AMOUNT YOU OWE: $71.40",
    ].join("\n"),
  },
];

export function getSample(id: string): SampleBill | undefined {
  return SAMPLE_BILLS.find((s) => s.id === id);
}
