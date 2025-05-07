document.addEventListener('DOMContentLoaded', () => {
    loadAllEvents();
});

async function loadAllEvents() {
    try {
        const response = await fetch('data/events.csv');
        const data = await response.text();
        const events = parseCSV(data);
    
        displayEvents(events.filter(event => event.is_upcoming === 'Да'), 'upcoming-events-container');
        displayEvents(events.filter(event => event.is_upcoming === 'Нет'), 'past-events-container');
    } catch (error) {
        console.error('Ошибка загрузки данных о мероприятиях:', error);
    }
}

function displayEvents(events, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="card">
            <img src="${event.photo_url}" alt="${event.title}">
            <div class="card-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p class="event-date">${formatDate(event.date)}</p>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim();
            return obj;
        }, {});
    });
}