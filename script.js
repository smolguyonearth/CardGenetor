// CSV Parser function
function parseCSV(str) {
    const arr = [];
    let quote = false;
    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
}

let cardsData = [];
let currentCardIndex = 0;

// Fetch and load cards data
fetch('csv/cards.csv')
    .then(response => response.text())
    .then(text => {
        const rows = parseCSV(text);
        // Start from 1 to skip header
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i];
            if (columns.length < 4 || !columns[0] || !columns[0].trim() || columns[0] === 'count') continue;
            
            cardsData.push({
                name: columns[0].trim(),
                type: columns[1].trim(),
                bgColor: columns[2].trim(),
                description: columns[3].trim()
            });
        }
        if (cardsData.length > 0) {
            renderCard(currentCardIndex);
        }
    })
    .catch(err => {
        console.error("Error loading CSV. Make sure you are running a local web server (e.g. npx serve .) to avoid CORS issues: ", err);
    });

function renderCard(index) {
    const card = cardsData[index];
    if (!card) return;

    const titleEl = document.querySelector('.card-title');
    titleEl.textContent = card.name;
    if (card.name.length > 10) {
        titleEl.style.fontSize = '70px';
    } else {
        titleEl.style.fontSize = '';
    }
    document.querySelector('.card-type').innerText = card.type.toUpperCase() + '.';
    document.querySelector('.card-inner').style.backgroundColor = '#' + card.bgColor.replace('#', '');
    const subtitleEl = document.querySelector('.card-subtitle');
    subtitleEl.innerText = card.description;
    if (card.description.length > 75) {
        subtitleEl.style.fontSize = '35px';
    } else {
        subtitleEl.style.fontSize = '';
    }

    const imgEl = document.querySelector('.card-image-container img');
    if (imgEl) {
        // The drive replaces ' with _ in filenames
        const fileName = card.name.replace(/'/g, '_');
        imgEl.src = `cards/${fileName}.png`;
        const normalizedName = card.name.trim().toUpperCase();
        if (normalizedName === 'UNIVERSUM PARADOX' || normalizedName === "SERENITY CITIZENS' PARK") {
            imgEl.style.maxWidth = '80%';
        } else {
            imgEl.style.maxWidth = '';
        }
        imgEl.onerror = function() {
            this.src = 'example/image.png';
        };
    }

    // Set text color: black for yellow background, white for everything else
    const textColor = card.bgColor.replace('#', '').toUpperCase() === 'FFC200' ? '#000' : '#fff';
    document.querySelector('.card-title').style.color = textColor;
    document.querySelector('.card-subtitle').style.color = textColor;
    document.querySelector('.card-type').style.color = textColor;
}

document.getElementById('prev-btn')?.addEventListener('click', () => {
    if (cardsData.length === 0) return;
    currentCardIndex = (currentCardIndex - 1 + cardsData.length) % cardsData.length;
    renderCard(currentCardIndex);
});

document.getElementById('next-btn')?.addEventListener('click', () => {
    if (cardsData.length === 0) return;
    currentCardIndex = (currentCardIndex + 1) % cardsData.length;
    renderCard(currentCardIndex);
});


// Single Card Export functionality
document.getElementById('export-btn').addEventListener('click', () => {
    exportCardPNG('card-export.png', document.getElementById('export-btn'), 'Download Sample');
});

// Helper function to export current DOM to PNG
function exportCardPNG(filename, btnElement, originalText) {
    const cardElement = document.getElementById('card-node');
    if (btnElement) {
        btnElement.disabled = true;
        btnElement.textContent = 'Exporting...';
    }

    return html2canvas(cardElement, {
        backgroundColor: null, // Keep background transparent (outside the card)
        scale: 2, // 2x resolution for crisp output
        useCORS: true // Properly load fonts and external images
    })
    .then(function (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        // Create an invisible anchor tag to trigger the download
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();

        if (btnElement) {
            btnElement.disabled = false;
            btnElement.textContent = originalText;
        }
    })
    .catch(function (error) {
        console.error("Error generating PNG:", error);
        alert("Failed to export image: " + filename);

        if (btnElement) {
            btnElement.disabled = false;
            btnElement.textContent = originalText;
        }
    });
}
