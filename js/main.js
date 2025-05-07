document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/cats.csv');
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        
        const data = await response.text();
        const cats = parseCSV(data);
        
        const featuredContainer = document.getElementById('featured-cats-container');
        if (featuredContainer) {
            displayCats(
                cats.filter(cat => cat.found_home === 'Нет').slice(0, 3), 
                'featured-cats-container'
            );
        }

        const seekingContainer = document.getElementById('cats-seeking-home');
        const foundContainer = document.getElementById('cats-with-home');
        
        if (seekingContainer && foundContainer) {
            displayCats(
                cats.filter(cat => cat.found_home === 'Нет'), 
                'cats-seeking-home'
            );
            displayCats(
                cats.filter(cat => cat.found_home === 'Да'), 
                'cats-with-home'
            );
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        const container = document.getElementById('featured-cats-container') || 
                            document.getElementById('cats-seeking-home');
        if (container) {
            container.innerHTML = '<p class="error">Не удалось загрузить данные о котиках</p>';
        }
    }
});

function displayCats(cats, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнер ${containerId} не найден`);
        return;
    }
    
    container.innerHTML = cats.map(cat => `
        <div class="card">
            <div class="card-img-container">
                <img src="${cat.photo_url}" alt="${cat.name}" 
                    onerror="this.src='assets/no_image.png'" loading="lazy">
            </div>
            <div class="cat-info">
                <h3>${cat.name}</h3>
                <p class="cat-description">${cat.description}</p>
                <div class="cat-details">
                    <p><span class="detail-label">Возраст:</span> ${cat.age}</p>
                    <p><span class="detail-label">Пол:</span> ${cat.gender}</p>
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
    
    return lines.slice(1)
        .filter(line => line.trim() !== '')
        .map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index]?.trim();
                return obj;
            }, {});
        });
}