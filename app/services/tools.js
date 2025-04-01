import axios from 'axios';
const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser();

/**
 * Fetches and parses the Grinnell Chamber RSS feed
 * Returns a JSON object with the RSS feed content
 * List of events in response.rss.channel.item
 * 
 * @returns {Promise<Object>} - Returns the RSS feed content
 * @throws {Error} If the fetch request fails
 */
async function fetchGrinnellChamberRSS() {
  try {
    const response = await axios.get('https://www.grinnellchamber.org/en/events/community_calendar/?action=rss');
    return parser.parse(response.data);
  } catch (error) {
    console.error('Error fetching Grinnell Chamber RSS:', error);
    throw new Error('Failed to fetch Grinnell Chamber events');
  }
}

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