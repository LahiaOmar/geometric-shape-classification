let second_canvas = document.getElementById("canvas")
let download = document.getElementById("link")
let se_cnt = second_canvas.getContext("2d")
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

second_canvas.addEventListener('mousedown', (e) => {
  console.log("mousedown", e)
  this.downBtn = true
  this.x = e.offsetX
  this.y = e.offsetY
}, 0)

second_canvas.addEventListener("mouseup", (e) => {
  this.downBtn = false
  html2canvas(second_canvas).then(
    (second_canvas) => {
      let img = second_canvas.toDataURL("image/jpg")

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
              class_prediction.innerText = data.class
            }
          })
        }
        clearCanvas(second_canvas, se_cnt)
      })
    }
  )
})

second_canvas.addEventListener("mousemove", (e) => {
  if (this.downBtn) {
    start = { x: this.x, y: this.y }
    se_end = { x: e.offsetX, y: e.offsetY }
    drawInCanvas(se_cnt, start, se_end)
  }
  this.x = e.offsetX
  this.y = e.offsetY
})
