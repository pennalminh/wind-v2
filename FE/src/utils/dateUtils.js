export function getCurrentWeekAndYear() {
  const now = new Date();
  const year = now.getFullYear();

  // January 4 is always in week 1. 
  // This is a common standard for calculating week numbers (ISO 8601).
  const jan4 = new Date(year, 0, 4);
  
  // Calculate the day of the week for Jan 4 (0 for Sunday, 1 for Monday, etc.)
  // Adjust so Monday is 0 and Sunday is 6
  const jan4Day = (jan4.getDay() + 6) % 7;
  
  // Calculate the day of the year for the current date
  const dayOfYear = Math.ceil((now - new Date(year, 0, 1)) / (24 * 60 * 60 * 1000));
  
  // Calculate the week number
  const week = Math.ceil((dayOfYear + jan4Day) / 7);
  
  return { weekNumber: week, year };
}
