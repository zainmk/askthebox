const OMDB_API_KEY = 'ee46ee2e';

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

async function fetchMovieDetails(imdbID) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
    return res.json();
}

async function fetchSeasonEpisodes(imdbID, season) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&Season=${season}`);
    return res.json();
}

export async function fetchICSEvents(media) {
    const details = await fetchMovieDetails(media.imdbID);

    if (media.Type === 'movie') {
        const released = details.Released;
        if (!released || released === 'N/A') {
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

    if (media.Type === 'series') {
        const totalSeasons = parseInt(details.totalSeasons) || 1;
        const events = [];

        for (let s = 1; s <= totalSeasons; s++) {
            const seasonData = await fetchSeasonEpisodes(media.imdbID, s);
            if (seasonData.Response === 'False' || !seasonData.Episodes) continue;
            for (const ep of seasonData.Episodes) {
                const icsDate = formatDateToICS(ep.Released);
                if (!icsDate) continue;
                events.push({
                    date: icsDate,
                    displayDate: formatDateDisplay(icsDate),
                    summary: `${media.Title} - S${String(s).padStart(2, '0')}E${String(ep.Episode).padStart(2, '0')}: ${ep.Title}`,
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
