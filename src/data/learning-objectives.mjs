/**
 * CTFL v4.0 learning objectives, grouped by syllabus section. Shown at the top of each section in the notes as
 * "In this section you'll learn to…", so trainees know what each section is for and how it's examined (K-level).
 */
export const LEARNING_OBJECTIVES = {
  '1.1': [['1.1.1', 'K1', 'Identify typical test objectives'], ['1.1.2', 'K2', 'Differentiate testing from debugging']],
  '1.2': [['1.2.1', 'K2', 'Give examples of why testing is necessary'], ['1.2.2', 'K1', 'Recall the relation between testing and quality assurance'], ['1.2.3', 'K2', 'Distinguish between root cause, error, defect and failure']],
  '1.3': [['1.3.1', 'K2', 'Explain the seven testing principles']],
  '1.4': [['1.4.1', 'K2', 'Summarise the different test activities and tasks'], ['1.4.2', 'K2', 'Explain the impact of context on the test process'], ['1.4.3', 'K2', 'Differentiate the testware that supports the test activities'], ['1.4.4', 'K2', 'Explain the value of maintaining traceability'], ['1.4.5', 'K2', 'Compare the different roles in testing']],
  '1.5': [['1.5.1', 'K2', 'Give examples of the generic skills required for testing'], ['1.5.2', 'K1', 'Recall the advantages of the whole team approach'], ['1.5.3', 'K2', 'Distinguish the benefits and drawbacks of independence of testing']],
  '2.1': [['2.1.1', 'K2', 'Explain the impact of the chosen SDLC on testing'], ['2.1.2', 'K1', 'Recall good testing practices that apply to all SDLCs'], ['2.1.3', 'K1', 'Recall examples of test-first approaches to development'], ['2.1.4', 'K2', 'Summarise how DevOps might have an impact on testing'], ['2.1.5', 'K2', 'Explain the shift-left approach'], ['2.1.6', 'K2', 'Explain how retrospectives can be used for process improvement']],
  '2.2': [['2.2.1', 'K2', 'Distinguish the different test levels'], ['2.2.2', 'K2', 'Distinguish the different test types'], ['2.2.3', 'K2', 'Distinguish confirmation testing from regression testing']],
  '2.3': [['2.3.1', 'K2', 'Summarise maintenance testing and its triggers']],
  '3.1': [['3.1.1', 'K1', 'Recognise types of work products that can be examined by static testing'], ['3.1.2', 'K2', 'Explain the value of static testing'], ['3.1.3', 'K2', 'Compare and contrast static and dynamic testing']],
  '3.2': [['3.2.1', 'K1', 'Identify the benefits of early and frequent stakeholder feedback'], ['3.2.2', 'K2', 'Summarise the activities of the review process'], ['3.2.3', 'K1', 'Recall the responsibilities of the main roles in reviews'], ['3.2.4', 'K2', 'Compare and contrast the different review types'], ['3.2.5', 'K1', 'Recall the factors that contribute to a successful review']],
  '4.1': [['4.1.1', 'K2', 'Distinguish black-box, white-box and experience-based test techniques']],
  '4.2': [['4.2.1', 'K3', 'Use equivalence partitioning to derive test cases'], ['4.2.2', 'K3', 'Use boundary value analysis to derive test cases'], ['4.2.3', 'K3', 'Use decision table testing to derive test cases'], ['4.2.4', 'K3', 'Use state transition testing to derive test cases']],
  '4.3': [['4.3.1', 'K2', 'Explain statement testing'], ['4.3.2', 'K2', 'Explain branch testing'], ['4.3.3', 'K2', 'Explain the value of white-box testing']],
  '4.4': [['4.4.1', 'K2', 'Explain error guessing'], ['4.4.2', 'K2', 'Explain exploratory testing'], ['4.4.3', 'K2', 'Explain checklist-based testing']],
  '4.5': [['4.5.1', 'K2', 'Explain how to write user stories in collaboration with developers and business representatives'], ['4.5.2', 'K2', 'Classify the different options for writing acceptance criteria'], ['4.5.3', 'K3', 'Use acceptance test-driven development (ATDD) to derive test cases']],
  '5.1': [['5.1.1', 'K2', 'Give examples of the purpose and content of a test plan'], ['5.1.2', 'K1', 'Recognise how a tester adds value to iteration and release planning'], ['5.1.3', 'K2', 'Compare and contrast entry criteria and exit criteria'], ['5.1.4', 'K3', 'Use estimation techniques to calculate the required test effort'], ['5.1.5', 'K3', 'Apply test case prioritisation'], ['5.1.6', 'K1', 'Recall the concepts of the test pyramid'], ['5.1.7', 'K2', 'Summarise the testing quadrants and their relationships with test levels and test types']],
  '5.2': [['5.2.1', 'K1', 'Identify risk level by using risk likelihood and risk impact'], ['5.2.2', 'K2', 'Distinguish between project risks and product risks'], ['5.2.3', 'K2', 'Explain how product risk analysis may influence the thoroughness and scope of testing'], ['5.2.4', 'K2', 'Explain what measures can be taken in response to analysed product risks']],
  '5.3': [['5.3.1', 'K1', 'Recall metrics used for testing'], ['5.3.2', 'K2', 'Summarise the purposes, content and audiences for test reports'], ['5.3.3', 'K2', 'Give examples of how to communicate the status of testing']],
  '5.4': [['5.4.1', 'K2', 'Summarise how configuration management supports testing']],
  '5.5': [['5.5.1', 'K3', 'Prepare a defect report']],
  '6.1': [['6.1.1', 'K2', 'Explain how different types of test tools support testing']],
  '6.2': [['6.2.1', 'K1', 'Recall the benefits and risks of test automation']],
};

export const K_MEANING = { K1: 'remember', K2: 'understand', K3: 'apply' };
