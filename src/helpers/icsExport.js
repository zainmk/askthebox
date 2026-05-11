const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

function formatDateToICS(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function formatDateDisplay(icsDate) {
    const year = icsDate.slice(0, 4);
    const month = icsDate.slice(4, 6);
    const day = icsDate.slice(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function nextDay(icsDate) {
    const year = parseInt(icsDate.slice(0, 4));
    const month = parseInt(icsDate.slice(4, 6)) - 1;
    const day = parseInt(icsDate.slice(6, 8));
    const date = new Date(Date.UTC(year, month, day + 1));
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}${m}${d}`;
}

function buildICS(events) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//askthebox//EN',
    ];
    for (const event of events) {
        lines.push(
            'BEGIN:VEVENT',
            `DTSTART;VALUE=DATE:${event.date}`,
            `DTEND;VALUE=DATE:${nextDay(event.date)}`,
            `SUMMARY:${event.summary}`,
            'END:VEVENT'
        );
    }
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function resolveTmdbId(media) {
    if (media.tmdbID) {
        return { tmdbID: media.tmdbID, mediaType: media.Type === 'movie' ? 'movie' : 'tv' };
    }
    // Fall back to finding by IMDb ID for older entries
    const res = await fetch(`${TMDB_BASE}/find/${media.imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`);
    const data = await res.json();
    if (data.movie_results?.length > 0) return { tmdbID: data.movie_results[0].id, mediaType: 'movie' };
    if (data.tv_results?.length > 0) return { tmdbID: data.tv_results[0].id, mediaType: 'tv' };
    throw new Error('Could not find this title on TMDB.');
}

async function fetchMovieDetails(tmdbID) {
    const res = await fetch(`${TMDB_BASE}/movie/${tmdbID}?api_key=${TMDB_API_KEY}`);
    return res.json();
}

async function fetchTVDetails(tmdbID) {
    const res = await fetch(`${TMDB_BASE}/tv/${tmdbID}?api_key=${TMDB_API_KEY}`);
    return res.json();
}

async function fetchSeasonEpisodes(tmdbID, season) {
    const res = await fetch(`${TMDB_BASE}/tv/${tmdbID}/season/${season}?api_key=${TMDB_API_KEY}`);
    return res.json();
}

export async function fetchICSEvents(media) {
    const { tmdbID, mediaType } = await resolveTmdbId(media);

    if (mediaType === 'movie') {
        const details = await fetchMovieDetails(tmdbID);
        const released = details.release_date;
        if (!released) {
            throw new Error('No release date available for this movie.');
        }
        const icsDate = formatDateToICS(released);
        if (!icsDate) {
            throw new Error('Could not parse release date.');
        }
        return {
            filename: `${media.Title.replace(/[^a-z0-9]/gi, '_')}_release.ics`,
            events: [{ date: icsDate, displayDate: formatDateDisplay(icsDate), summary: `${media.Title} - Release Date` }],
        };
    }

    if (mediaType === 'tv') {
        const details = await fetchTVDetails(tmdbID);
        const totalSeasons = details.number_of_seasons || 1;
        const events = [];

        for (let s = 1; s <= totalSeasons; s++) {
            const seasonData = await fetchSeasonEpisodes(tmdbID, s);
            if (!seasonData.episodes) continue;
            for (const ep of seasonData.episodes) {
                const icsDate = formatDateToICS(ep.air_date);
                if (!icsDate) continue;
                events.push({
                    date: icsDate,
                    displayDate: formatDateDisplay(icsDate),
                    summary: `${media.Title} - S${String(s).padStart(2, '0')}E${String(ep.episode_number).padStart(2, '0')}: ${ep.name}`,
                });
            }
        }

        if (events.length === 0) {
            throw new Error('No episode release dates available for this series.');
        }
        return {
            filename: `${media.Title.replace(/[^a-z0-9]/gi, '_')}_episodes.ics`,
            events,
        };
    }

    throw new Error('Unsupported media type.');
}

export function downloadICS({ events, filename }) {
    const ics = buildICS(events);
    downloadFile(ics, filename);
}
