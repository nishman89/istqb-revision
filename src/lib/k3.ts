/**
 * The eight K3 ("apply") learning objectives. Every ISTQB CTFL v4.0 sample paper has exactly
 * one question on each, so these are 8 of the 40 marks.
 */
export interface K3Topic {
  lo: string;
  title: string;
  /** Link into the notes, relative to the site root. */
  notes: string;
  method: string[];
}

export const K3_TOPICS: K3Topic[] = [
  { lo: 'FL-4.2.1', title: 'Equivalence partitioning', notes: 'chapters/4/#equivalence-partitioning', method: [
    'List every partition - valid and invalid - for each input or output.',
    'Watch for "hidden" partitions, e.g. two overnight periods, or values outside the stated range.',
    'Coverage = partitions hit by at least one test ÷ all partitions. Check whether the question says "valid" only.',
  ] },
  { lo: 'FL-4.2.2', title: 'Boundary value analysis', notes: 'chapters/4/#boundary-value-analysis', method: [
    'Draw the partitions on a number line and mark each minimum and maximum.',
    '2-value: each boundary + its closest neighbour in the next partition. 3-value: each boundary + both neighbours.',
    'Coverage = coverage items tested ÷ coverage items identified. Tick off the given test values one by one.',
  ] },
  { lo: 'FL-4.2.3', title: 'Decision table testing', notes: 'chapters/4/#decision-tables', method: [
    'Coverage items are the feasible columns (rules). Ignore infeasible ones.',
    'For each test, find the one column it matches - "-" means the condition doesn\'t matter.',
    'Coverage = distinct columns hit ÷ feasible columns. Two tests hitting the same column count once.',
  ] },
  { lo: 'FL-4.2.4', title: 'State transition testing', notes: 'chapters/4/#state-transition-diagrams', method: [
    'Write each test as a path of states and events, starting from the stated start state.',
    'Count distinct valid transitions exercised. Stop a path if it hits an event that isn\'t valid from that state.',
    'Know the three criteria: all states < valid transitions < all transitions (valid + invalid).',
  ] },
  { lo: 'FL-4.5.3', title: 'ATDD test cases', notes: 'chapters/4/#atdd', method: [
    'Map each option to an acceptance criterion - the right test checks exactly what the criterion says.',
    'Reject tests that go beyond the user story, or test something no criterion mentions.',
    'Positive tests first, then negative, then non-functional.',
  ] },
  { lo: 'FL-5.1.4', title: 'Test estimation', notes: 'chapters/5/#estimation-techniques', method: [
    'Three-point: E = (a + 4m + b) / 6, SD = (b − a) / 6. Multiply by the number of items if asked for several.',
    'Ratios: total the historical development and test effort first, then apply that ratio.',
    'Extrapolation: apply the formula given in the question exactly - read the brackets carefully.',
  ] },
  { lo: 'FL-5.1.5', title: 'Test case prioritisation', notes: 'chapters/5/#test-case-prioritisation', method: [
    'Dependencies come first: a test can\'t run until everything it depends on has run.',
    'Among the tests that are free to run, pick the highest priority (check whether 1 is high or low!).',
    'Additional coverage: pick the test that adds the most not-yet-covered items each time.',
  ] },
  { lo: 'FL-5.5.1', title: 'Defect reports', notes: 'chapters/5/#what-goes-in-a-defect-report', method: [
    'A good report lets someone reproduce the failure: steps, environment and versions, expected vs actual result.',
    'Describe the failure, not your guess at the cause - and don\'t blame the test data unless it\'s clearly wrong.',
    'Look for the pattern across failing tests (e.g. "duplicates are dropped") rather than listing symptoms.',
  ] },
];
