/* ==========================================================================
   strings.js — every shell UI sentence in one place (PhET "In-sim Language
   Selection" baseline: user-visible chrome is separable from the mechanics).
   Worlds keep their own lesson copy; this file owns the app chrome only.
   ========================================================================== */

export const STRINGS = {
  /* rail + first-run tip */
  tipRail: 'The rail',
  tipRailBody: ' is your subjects — fourteen worlds, each one an instrument you steer.',
  tipCoach: 'This coach',
  tipCoachBody: ' states the claim, the goal, and the controls that move it.',
  tipDots: 'The dots',
  tipDotsBody: ' — four states: new, learning (a check question answered), amber when a lesson is learned, green when it has survived the review ladder.',
  tipDismiss: 'Got it',
  tipAria: 'How Lumen works',

  /* dots + toasts */
  toastGoalMet: (name) => `${name} goal met — now its check questions feed the review ladder.`,
  toastHeld: (name) => `${name} held — the review ladder ran its course.`,

  /* stagebar */
  startLesson: 'Start a lesson',
  noLessons: 'No lessons yet',
  fastPathLabel: 'Adult path',
  placeMe: 'place me',
  allWorlds: 'all worlds',
  soundOn: 'Sounds on',
  soundOff: 'Sounds off',

  /* lesson runner chrome */
  lessonComplete: 'Lesson complete',
  lessonDone: (title) => `${title} — done.`,
  waitingForYou: '● waiting for you',
  skip: 'Skip',
  nextStep: 'Next',
  exit: 'Exit',
  continueLabel: 'Continue',
  earlierInLesson: (n) => `Earlier in this lesson · ${n} ${n === 1 ? 'step' : 'steps'}`,
  checkpointTitle: 'Checkpoint · mixed review',
  checkpointCopy: 'Two questions from other lessons of this world — the ladder’s mixing rule.',

  /* placement */
  placementTitle: 'Where should I start?',
  placementCopy: 'Six short questions: exploring, arithmetic, reasoning, applying it, and two common traps. The hardest rung you clear sets this world’s stage.',

  /* stuck helper */
  stuckTitle: 'Stuck on this step?',
  stuckSimplify: 'Simplify',
  stuckStartLesson: 'Start a lesson',
  stuckReset: 'Reset controls'
};
