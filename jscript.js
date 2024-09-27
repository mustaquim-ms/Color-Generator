function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function() {
    const image = new Image();
    image.src = reader.result;
    image.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const colorPalette = extractColors(pixels, 5); // Extract 5 colors

      displayColorPalette(colorPalette);
    };
  };
  reader.readAsDataURL(event.target.files[0]);
}

function extractColors(pixels, numColors) {
  const colorFrequency = {};
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const colorString = `rgb(${r}, ${g}, ${b})`;
    colorFrequency[colorString] = (colorFrequency[colorString] || 0) + 1;
  }

  const sortedColors = Object.entries(colorFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([color, frequency]) => color);

  return sortedColors.slice(0, numColors);
}

function displayColorPalette(colorPalette) {
  const colorPaletteDiv = document.getElementById('color-palette');
  colorPaletteDiv.innerHTML = '';
  for (const color of colorPalette) {
    const colorItem = document.createElement('div');
    colorItem.classList.add('color-item');
    colorItem.style.backgroundColor = color;
    colorItem.textContent = color;
    colorPaletteDiv.appendChild(colorItem);
  }
}
