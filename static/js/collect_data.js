let stage = document.getElementById("canvas");
let context = stage.getContext("2d");
let down = document.getElementById("download")
let clear = document.getElementById("clear")
let className = document.getElementById("className")

clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

clear.addEventListener('click', (e) => {
  clearCanvas()
})

down.addEventListener('click', (e) => {
  e.preventDefault()
  html2canvas(canvas).then(
    (canvas) => {
      let img = canvas.toDataURL("image/jpg")
      let link = document.getElementById("link")
      link.download = (className.value) ? className.value : "unknown"
      link.href = img
      link.click()
      clearCanvas();
    })
})

canvas.addEventListener('mousedown', (e) => {
  this.down = true;
  this.X = e.offsetX;
  this.Y = e.offsetY;
}, 0);

canvas.addEventListener('mouseup', () => {
  this.down = false;
}, 0);

canvas.addEventListener('mousemove', (e) => {
  if (this.down) {
    context.beginPath();
    context.moveTo(this.X, this.Y);
    context.lineTo(e.offsetX, e.offsetY);
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle = "#000000"
    context.lineJoin = "round";
    context.shadowBlur = 2;
    context.stroke();
    this.X = e.offsetX;
    this.Y = e.offsetY;
  }
}, 0);