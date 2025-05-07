document.addEventListener('DOMContentLoaded', () => {
    loadAllCats();
});

async function loadAllCats() {
    try {
        const response = await fetch('data/cats.csv');
        const data = await response.text();
        const cats = parseCSV(data);
    
        displayCats(cats.filter(cat => cat.found_home === 'Нет'), 'cats-seeking-home');
        displayCats(cats.filter(cat => cat.found_home === 'Да'), 'cats-with-home');
    } catch (error) {
        console.error('Ошибка загрузки данных о котиках:', error);
    }
}

function displayCats(cats, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = cats.map(cat => `
        <div class="card">
            <img src="${cat.photo_url}" alt="${cat.name}">
            <div class="card-content">
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
                <p><strong>Возраст:</strong> ${cat.age}</p>
                <p><strong>Пол:</strong> ${cat.gender}</p>
                ${cat.found_home === 'Да' 
                    ? '<p class="found-home">Обрёл дом!</p>' 
                    : '<p class="looking-home">Ищет дом!</p>'}
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