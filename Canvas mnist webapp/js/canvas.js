window.addEventListener("load", () => {
    const canvas = document.getElementById('canvas');

    const ctx = canvas.getContext("2d");


    const downloadButton = document.getElementById('downloadBtn');
    const clearButton = document.getElementById('clearBtn');
    const wrapper = document.getElementById('wrapper');
    const predictionResult = document.getElementById('predictionResult');

    canvas.height = 500;
    canvas.width = wrapper.clientWidth;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    let bound = canvas.getBoundingClientRect();

    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        ctx.lineWidth = 50;
        ctx.lineCap = "square";

        ctx.strokeStyle = "#000000";
        ctx.lineTo(e.clientX - bound.left, e.clientY - bound.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - bound.left, e.clientY - bound.top);
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    downloadButton.addEventListener("click", () => {
        let imgURL = canvas.toDataURL('image/png');
        let strImage = imgURL.replace(/^data:image\/[a-z]+;base64,/, "");

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: strImage
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                M.toast({ html: 'This is a ' + result.prediction })
                predictionResult.removeAttribute('hidden');
                predictionResult.innerText = 'Prediction: ' + result.prediction;
            })
    });

    clearButton.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});