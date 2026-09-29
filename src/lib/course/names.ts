/**
 * How a module is named on screen. The programme opens with an Introduction
 * (number 0), then Modules 1 to 14. Every label goes through here so the
 * Introduction is never called "Module 0".
 */
export const moduleName = (n: number) => (n === 0 ? 'Introduction' : `Module ${n}`)

/** Short form for number badges: "Intro", "01", "02"... */
export const moduleBadge = (n: number) => (n === 0 ? 'Intro' : String(n).padStart(2, '0'))

/** The strip at the top of every slide. */
export const sectionLabel = (n: number) => `AWS Cloud Training · ${moduleName(n)}`
