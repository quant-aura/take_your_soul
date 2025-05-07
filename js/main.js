// Загрузка featured котов на главную
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedCats();
    loadFeaturedEvents();
});

async function loadFeaturedCats() {
    try {
        const response = await fetch('data/cats.csv');
        const data = await response.text();
        const cats = parseCSV(data);
        displayFeaturedCats(cats.filter(cat => cat.found_home === 'Нет').slice(0, 3));
    } catch (error) {
        console.error('Ошибка загрузки данных о котиках:', error);
    }
}

async function loadFeaturedEvents() {
    try {
        const response = await fetch('data/events.csv');
        const data = await response.text();
        const events = parseCSV(data);
        displayFeaturedEvents(events.filter(event => event.is_upcoming === 'Да').slice(0, 2));
    } catch (error) {
        console.error('Ошибка загрузки данных о мероприятиях:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/cats.csv');
        if (!response.ok) throw new Error('Ошибка загрузки CSV');
    
        const data = await response.text();
        const cats = parseCSV(data);

    const container = document.getElementById('featured-cats-container');
    if (!container) {
        console.error('Контейнер не найден! Проверьте ID элемента');
        return;
    }
    
    container.innerHTML = cats.map(cat => `
        <div class="card">
            <img src="${cat.photo_url}" alt="${cat.name}" onerror="this.src='assets/no-image.png'">
            <div class="card-content">
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
                <p><strong>Возраст:</strong> ${cat.age}</p>
                <p class="${cat.found_home === 'Да' ? 'found-home' : 'looking-home'}">
                    ${cat.found_home === 'Да' ? 'Обрёл дом!' : 'Ищет дом!'}
                </p>
            </div>
        </div>
    `).join('');

    } catch (error) {
        console.error('Ошибка:', error);
        const container = document.getElementById('featured-cats-container');
        if (container) {
            container.innerHTML = '<p class="error">Не удалось загрузить данные о котиках</p>';
        }
    }
});

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

function displayFeaturedCats(cats) {
    const container = document.getElementById('featured-cats-container');
    if (!container) return;
    
    container.innerHTML = cats.map(cat => `
        <div class="card">
            <img src="${cat.photo_url}" alt="${cat.name}">
            <div class="card-content">
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
                <p><strong>Возраст:</strong> ${cat.age}</p>
                <p><strong>Пол:</strong> ${cat.gender}</p>
                <p class="looking-home">Ищет дом!</p>
            </div>
        </div>
    `).join('');
}

function displayFeaturedEvents(events) {
    const container = document.getElementById('featured-events-container');
    if (!container) return;
    
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