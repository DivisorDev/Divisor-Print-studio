const canvas = new fabric.Canvas("designCanvas", {
  backgroundColor: '#fff',
  preserveObjectStacking: true
});

// Update UI when object is selected
canvas.on('selection:created', showControls);
canvas.on('selection:updated', showControls);
canvas.on('selection:cleared', hideControls);

function showControls() {
  document.getElementById('editControls').style.display = 'block';
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'i-text') {
    document.getElementById('colorPicker').value = activeObject.fill;
  }
}

function hideControls() {
  document.getElementById('editControls').style.display = 'none';
}

// Upload Image
document.getElementById("uploadImage").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      img.scaleToWidth(200);
      img.set({
        left: 100,
        top: 100,
        cornerColor: '#ffd814',
        cornerStrokeColor: '#111',
        transparentCorners: false,
        cornerSize: 10
      });
      canvas.add(img);
      canvas.setActiveObject(img);
    });
  };
  reader.readAsDataURL(file);
});

// Add Text
function addText() {
  const textVal = document.getElementById('textInput').value || 'New Text';
  const text = new fabric.IText(textVal, {
    left: 100,
    top: 100,
    fontFamily: 'Poppins',
    fontSize: 30,
    fill: '#111',
    cornerColor: '#ffd814',
    cornerStrokeColor: '#111',
    transparentCorners: false,
    cornerSize: 10
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  document.getElementById('textInput').value = '';
}

// Change Color
function changeColor(color) {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set('fill', color);
    canvas.renderAll();
  }
}

// Delete Object
function deleteObject() {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length) {
    canvas.discardActiveObject();
    activeObjects.forEach((obj) => {
      canvas.remove(obj);
    });
    canvas.renderAll();
  }
}

// Download Design
function downloadDesign() {
  const dataURL = canvas.toDataURL({
    format: 'jpeg',
    quality: 0.8
  });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'my-design.jpg';
  link.click();
}

// Submit Design
function submitDesign() {
  const designData = canvas.toDataURL();

  fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ design: designData })
  })
    .then(res => res.json())
    .then(data => {
      alert("Design submitted successfully! Check WhatsApp to complete your order.");
      window.location.href = "shop.html";
    })
    .catch(err => alert("Error submitting design. Please try again."));
}

// Mobile Responsive Handling
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  // Logic for responsive canvas if needed, but keeping 400x400 for consistency
}
