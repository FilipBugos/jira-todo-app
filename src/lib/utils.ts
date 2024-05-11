// TODO: specify labels
export function convertLabelIdToLabelName(labelId: number | null): string {
  switch (labelId) {
    case 1:
      return "Bug";
    case 2:
      return "Feature";
    case 3:
      return "Enhancement";
    case 4:
      return "Documentation";
    case 5:
      return "Duplicate";
    case 6:
      return "Help Wanted";
    case 7:
      return "Good First Issue";
    case 8:
      return "Question";
    case 9:
      return "Wontfix";
    default:
      return "Invalid";
  }
}

// TODO: specify labels
export function getLabels() {
  return [
    { ID: 1, Name: "Bug" },
    { ID: 2, Name: "Feature" },
    { ID: 3, Name: "Enhancement" },
    { ID: 4, Name: "Documentation" },
    { ID: 5, Name: "Duplicate" },
    { ID: 6, Name: "Help Wanted" },
    { ID: 7, Name: "Good First Issue" },
    { ID: 8, Name: "Question" },
    { ID: 9, Name: "Wontfix" }
  ];
}

// TODO: specify statuses
export function getStatuses() {
  return [
    { ID: 1, Name: "Open" },
    { ID: 2, Name: "In Progress" },
    { ID: 3, Name: "Done" }
  ];
}
