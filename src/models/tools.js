import { fetchGrinnellChamberRSS, updateAndGetCachedRSS } from "../services/chamberRSS";
import moment from 'moment';

/**
 * Gets events happening on a given date range
 * 
 * @param {string} date - The date to get events for
 * @returns {Promise<Array>} - Returns an array of events
 */
async function getEventsFromDate(startDate, endDate) {
  const events = await fetchGrinnellChamberRSS();
  
  // Convert input date to Date object if it isn't already
  startDate = moment(startDate);
  endDate = moment(endDate);
  
  return events.rss.channel.item.filter(event => {
    // Convert RSS pubDate to Date object
    const eventDate = moment(event.pubDate, "ddd, DD MMM YYYY HH:mm:ss Z", true);
    
    return eventDate.isSameOrAfter(startDate) && eventDate.isSameOrBefore(endDate);
  });
}

/**
 * Gets events happening on a given date range
 * Uses js Date object for date comparison
 * 
 * @param {string} date - The date to get events for
 * @returns {Promise<Array>} - Returns an array of events
 */
async function getEventsFromDateCached(startDate, endDate) {
  const events = await updateAndGetCachedRSS();

  startDate = new Date(startDate);
  endDate = new Date(endDate);
  
  let output = [];

  events.forEach(eventDay => {
    const eventDate = new Date(eventDay["title"]);
    if (eventDate >= startDate && eventDate <= endDate) {
      output.push(eventDay);
    }
  });

  return output;
}

export { getEventsFromDate, getEventsFromDateCached };