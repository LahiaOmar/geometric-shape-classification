let drawCanvas = document.getElementById("canvas")
let download = document.getElementById("link")
let se_cnt = drawCanvas.getContext("2d")
let class_prediction = document.getElementById("class_prediction")

clearCanvas = (canvas, context) => {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

drawLine = (start, end, context)=>{
  context.moveTo(start.x, start.y)
  context.lineTo(end.x, end.y)
  context.stroke()
}

drawInCanvas = (canvas, start, end) => {
  canvas.beginPath()
  canvas.moveTo(start.x, start.y)
  canvas.lineTo(end.x, end.y)
  canvas.lineWidth = 3
  canvas.lineCap = "round"
  canvas.strokeStyle = "#000000"
  canvas.lineJoin = "round"
  canvas.shadowBlur = 2
  canvas.stroke()
}

drawCanvas.addEventListener('mousedown', (e) => {
  console.log("mousedown", e)
  this.downBtn = true
  this.x = e.offsetX
  this.y = e.offsetY
}, 0)

drawCanvas.addEventListener("mouseup", (e) => {
  this.downBtn = false
  html2canvas(drawCanvas).then(
    (drawCanvas) => {
      let img = drawCanvas.toDataURL("image/jpg")

      fetch('/prediction', {
        method: 'POST',
        body: JSON.stringify(img),
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then((resp) => {
        console.log("resp from the server",resp.status)
        if(resp.status === 200){
          resp.json()
          .then((data)=>{
            console.log("prediction data", data)
            if(data.error){
              console.log(data.error)
            }
            else{
              if(data.score < 4.000){
                class_prediction.innerText = "unknown"
              }
              else{
                class_prediction.innerText = data.class
              }
            }
          })
        }
        clearCanvas(drawCanvas, se_cnt)
      })
    }
  )
})

drawCanvas.addEventListener("mousemove", (e) => {
  if (this.downBtn) {
    start = { x: this.x, y: this.y }
    se_end = { x: e.offsetX, y: e.offsetY }
    drawInCanvas(se_cnt, start, se_end)
  }
  this.x = e.offsetX
  this.y = e.offsetY
})
