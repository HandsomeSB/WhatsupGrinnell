import { fetchGrinnellChamberRSS } from "../services/chamberRSS";

/**
 * Gets events happening on a given date range
 * 
 * @param {string} date - The date to get events for
 * @returns {Promise<Array>} - Returns an array of events
 */
async function getEventsFromDate(startDate, endDate) {
  const events = await fetchGrinnellChamberRSS();
  
  // Convert input date to Date object if it isn't already
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  
  return events.rss.channel.item.filter(event => {
    // Convert RSS pubDate to Date object
    const eventDate = new Date(event.pubDate);

    // Inclusive range
    let inrange = (val, a, b) => {
      return val >= a && val <= b;
    }
    
    return eventDate >= startDate && eventDate <= endDate;
  });
}

export { fetchGrinnellChamberRSS,getEventsFromDate };