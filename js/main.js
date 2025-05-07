document.addEventListener('DOMContentLoaded', async () => {
    try {
        const catsResponse = await fetch('data/cats.csv');
        if (!catsResponse.ok) {
            throw new Error('Ошибка загрузки CSV с котиками');
        }
        const catsData = await catsResponse.text();
        const allCats = parseCSV(catsData);

        const catsSeekingHome = allCats.filter(cat => cat.found_home === 'Нет');

        const container = document.getElementById('featured-cats-container');
        if (!container) {
            console.error('Контейнер featured-cats-container не найден');
            return;
        }
        
        container.innerHTML = catsSeekingHome.map(cat => `
            <div class="card">
                <img src="${cat.photo_url}" alt="${cat.name}" onerror="this.src='assets/no-image.jpg'">
                <div class="cat-info">
                    <h3>${cat.name}</h3>
                    <p>${cat.description}</p>
                    <div class="cat-details">
                        <p><span>Возраст:</span> ${cat.age}</p>
                        <p><span>Пол:</span> ${cat.gender}</p>
                    </div>
                    <p class="looking-home status-badge">❤️ Ищет дом!</p>
                </div>
            </div>
        `).join('');

        try {
            const eventsResponse = await fetch('data/events.csv');
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.text();
                const events = parseCSV(eventsData);
                displayFeaturedEvents(events.filter(event => event.is_upcoming === 'Да').slice(0, 2));
            }
        } catch (eventsError) {
            console.error('Ошибка загрузки мероприятий:', eventsError);
        }

    } catch (error) {
        console.error('Ошибка:', error);
        const container = document.getElementById('featured-cats-container');
        if (container) {
            container.innerHTML = '<p class="error">Не удалось загрузить данные о котиках</p>';
        }
    }
});

function displayFeaturedEvents(events) {
    const container = document.getElementById('featured-events-container');
    if (container) {
        container.innerHTML = events.map(event => `
            <!-- Ваш HTML для мероприятий -->
        `).join('');
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim();
            return obj;
        }, {});
    });
}