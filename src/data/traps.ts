/**
 * Common exam traps for each chapter: the confusions the ISTQB sample papers deliberately test,
 * taken from the "Is not correct" explanations in Sample Exams A-D.
 */
export interface Trap {
  trap: string;
  truth: string;
}

export const TRAPS: Record<number, Trap[]> = {
  1: [
    { trap: 'Testing finds and fixes defects', truth: 'Testing finds failures and defects. Debugging - a development activity - finds the cause and fixes it.' },
    { trap: 'Testing is part of quality assurance', truth: 'Testing is a form of quality control (product-focused, corrective). QA is process-focused and preventive.' },
    { trap: 'A failure causes a defect', truth: 'The order is error (human mistake) → defect (in the work product) → failure (seen at run time). A root cause sits behind the error.' },
    { trap: 'Test analysis creates the test cases', truth: 'Analysis decides WHAT to test (test conditions). Design decides HOW (test cases, coverage items, test data requirements). Implementation builds procedures, scripts, suites and the execution schedule.' },
    { trap: 'Whole-team means anyone can take any role at any time', truth: 'Anyone with the right skills can do any task, and everyone is responsible for quality - roles still need competence.' },
  ],
  2: [
    { trap: 'Confirmation and regression testing are the same', truth: 'Confirmation testing checks the original defect is fixed. Regression testing checks the change hasn\'t broken anything else.' },
    { trap: 'Shift-left means testing less later on', truth: 'Shift-left means starting earlier. It does not mean neglecting testing later in the lifecycle.' },
    { trap: 'Interfaces with an external system = component integration testing', truth: 'Interactions between components = component integration. Interfaces with other systems and external services = system integration.' },
    { trap: 'Testers review work products once they are published', truth: 'Good practice in every SDLC: testers review drafts as soon as they are available.' },
    { trap: 'Any change to a live system is "maintenance"', truth: 'Maintenance triggers are modifications, upgrades or migrations of the environment, and retirement - of a system already in operation.' },
  ],
  3: [
    { trap: 'Static testing finds failures', truth: 'Static testing finds defects directly - nothing is executed, so there are no failures.' },
    { trap: 'Dynamic testing can find everything static testing can', truth: 'Some defects, such as unreachable code, can only be found statically - and some, such as slow response times, only dynamically.' },
    { trap: 'The review leader runs the meetings', truth: 'The facilitator (moderator) runs the meetings. The review leader has overall responsibility. The manager decides what is reviewed and provides resources. The scribe records.' },
    { trap: 'Evaluating the reviewers is a review objective', truth: 'Evaluating participants should never be an objective of a review - it is a success factor to avoid.' },
  ],
  4: [
    { trap: 'BVA works on any partition', truth: 'BVA only works on ordered partitions. 2-value = the boundary + its neighbour in the next partition; 3-value = the boundary + both neighbours.' },
    { trap: 'Coverage always counts every partition', truth: 'Read whether the question asks for valid partitions only, or all partitions including invalid ones - the answer changes.' },
    { trap: 'One test case per transition', truth: 'A single test case can - and usually does - cover several state transitions in sequence.' },
    { trap: '100% statement coverage gives 100% branch coverage', truth: 'Branch coverage subsumes statement coverage, not the other way round. And even 100% coverage doesn\'t guarantee every defect is found.' },
    { trap: 'Exploratory testing has no test design', truth: 'In exploratory testing, tests are designed, executed and evaluated at the same time - and black-box techniques can be used.' },
    { trap: 'Mixing up acceptance criteria formats', truth: 'Given/When/Then is scenario-oriented. Bullet-point verification lists and input/output tables are rule-oriented.' },
  ],
  5: [
    { trap: 'Averaging the ratios in ratio-based estimation', truth: 'Average the total development and test effort first, then take the ratio - averaging each project\'s ratio gives a different (wrong) answer.' },
    { trap: 'Running tests strictly in priority order', truth: 'Logical dependencies come first: a high-priority test that depends on a low-priority one must wait for it. Within that, go by priority.' },
    { trap: 'Mixing up product and project risks', truth: 'Product risks are about quality (e.g. slow response, poor architecture). Project risks are about the project (e.g. scope creep, staff shortages, poor tool support).' },
    { trap: 'Running out of budget can\'t be an exit criterion', truth: 'Running out of time or budget can be a valid exit criterion, if stakeholders accept the risk.' },
    { trap: 'A test progress report includes each defect\'s steps to reproduce', truth: 'That belongs in a defect report. Progress reports summarise progress, deviations, metrics, risks and the next period\'s testing.' },
  ],
  6: [
    { trap: 'Test automation removes the need for critical thinking', truth: 'Over-relying on a tool and ignoring human critical thinking is listed as a risk of test automation.' },
    { trap: 'Mixing up tool categories', truth: 'DevOps tools = pipeline and workflow tracking; collaboration tools = communication; management tools = tests, defects, requirements and configuration.' },
  ],
};
