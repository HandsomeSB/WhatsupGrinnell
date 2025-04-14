import axios from 'axios';
const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser();
import { storeData, getData } from '../utils/basicStorage';
import moment from 'moment';

/**
 * Fetches and parses the Grinnell Chamber RSS feed
 * Returns a JSON object with the RSS feed content
 * List of events in response.rss.channel.item
 * 
 * @returns {Promise<Object>} - Returns the RSS feed content
 * @throws {Error} If the fetch request fails
 */
export async function fetchGrinnellChamberRSS() {
  try {
    const response = await axios.get('https://www.grinnellchamber.org/en/events/community_calendar/?action=rss');
    return parser.parse(response.data);
  } catch (error) {
    console.error('Error fetching Grinnell Chamber RSS:', error);
    throw new Error('Failed to fetch Grinnell Chamber events');
  }
}

/**
 * Wrapper around fetchGrinnellChamberRSS to fetch and reduce the data
 * Returns an array of events grouped by date, ready for SectionList
 * @returns {Promise<Array>} - Returns an array of events grouped by date
 * @throws {Error} If the fetch request fails
 */
export async function fetchGrinnellChamberRSSDateReduced() {
    try{
        const events = (await fetchGrinnellChamberRSS()).rss.channel.item;
        const grouped = events.reduce(
            (acc, event) => {
                event.pubDate = moment(event.pubDate, "ddd, DD MMM YYYY HH:mm:ss Z", true).toDate().toISOString(); // Convert to ISO string
                const eventDate = new Date(event.pubDate).toDateString();
                if (!acc[eventDate]) {
                    acc[eventDate] = [];
                }
                acc[eventDate].push(event);
                return acc;
            }, {});

        return Object.keys(grouped).map((date) => ({
            title: date,
            data: grouped[date],
        }));
    } catch (error) {
        console.error('Error fetching Grinnell Chamber RSS:', error);
        throw new Error('Failed to fetch Grinnell Chamber events');
    }
}

/**
 * Fetches and caches the Grinnell Chamber RSS feed
 * @returns {Promise<Array>} - Returns an array of events grouped by date
 * @throws {Error} If the fetch request fails
 */
export async function updateAndGetCachedRSS() {
    const cacheKey = 'grinnellChamberEventsCache';
    const cachedData = await getData(cacheKey);

    if (cachedData) {
        // Schedule the update
        fetchGrinnellChamberRSSDateReduced().then(async (data) => {
            storeData(cacheKey, data);
        });
        return cachedData;
    } else {
        const data = await fetchGrinnellChamberRSSDateReduced()
        await storeData(cacheKey, data);
        return data;
    }
}