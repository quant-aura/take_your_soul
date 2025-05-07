document.addEventListener('DOMContentLoaded', () => {
    loadAllCats();
});

async function loadAllCats() {
    try {
        const response = await fetch('data/cats.csv');
        const data = await response.text();
        const cats = parseCSV(data);
    
        displayCats(cats.filter(cat => cat.found_home === 'Нет').slice(0, 3), 'cats-seeking-home');
        displayCats(cats.filter(cat => cat.found_home === 'Да').slice(0, 3), 'cats-with-home');
    } catch (error) {
        console.error('Ошибка загрузки данных о котиках:', error);
    }
}

function displayCats(cats, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Элемент с ID ${containerId} не найден`);
        return;
    }
    
    container.innerHTML = cats.map(cat => `
        <div class="card">
            <img src="${cat.photo_url}" alt="${cat.name}" onerror="this.src='assets/no_image.png'">
            <div class="cat-info">
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
                <div>
                    <p><span>Возраст:</span> ${cat.age}</p>
                    <p><span>Пол:</span> ${cat.gender}</p>
                </div>
                <p class="${cat.found_home === 'Да' ? 'found-home' : 'looking-home'} status-badge">
                    ${cat.found_home === 'Да' ? '🏠 Обрёл дом!' : '❤️ Ищет дом!'}
                </p>
            </div>
        </div>
    `).join('');
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