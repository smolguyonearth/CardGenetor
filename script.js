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
