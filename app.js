(function () {
  var canvas = document.querySelector('.canvas');
  var ctx = canvas.getContext('2d');

  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;
  var isSmallScreen = width < 500;
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var faceRadius = width > 900 ? halfWidth / 2 : halfWidth - 40;
  var handTailLength = faceRadius * 0.1;
  var hourHandLength = faceRadius * 0.5;
  var minuteHandLength = faceRadius * 0.9;
  var secondHandLength = faceRadius * 0.9;
  var hourTickLength = 20;
  var minuteTickLength = 6;
  var hourTickWidth = 4;
  var minuteTickWidth = 2;
  var fontSize = isSmallScreen ? 32 : 48;

  render();


  function render() {
    var date = new Date();
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();

    var exactSeconds = seconds + date.getMilliseconds() / 1000;
    var exactMinutes = minutes + seconds / 60;
    var exactHours = hours + minutes / 60;

    var hourHandAngle = exactHours % 12 / 12 * 360;
    var minuteHandAngle = exactMinutes / 60 * 360;
    var secondHandAngle = exactSeconds / 60 * 360;

    ctx.clearRect(0, 0, width, height);

    // rim
    ctx.beginPath();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 24;
    ctx.arc(halfWidth, halfHeight, faceRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // ticks
    for (var i = 0; i < 60; i++) {
      var isHourTick = i % 5 === 0;

      // length - rimWidth / 2
      var tickLength = isHourTick ? hourTickLength : minuteTickLength;
      tickLength = faceRadius - tickLength - 12;

      var angle = i * 6 - 90;

      // point closer to the rim
      var endX = Math.cos(angle * Math.PI / 180) * faceRadius + halfWidth;
      var endY = Math.sin(angle * Math.PI / 180) * faceRadius + halfHeight;

      var startX = Math.cos(angle * Math.PI / 180) * tickLength + halfWidth;
      var startY = Math.sin(angle * Math.PI / 180) * tickLength + halfHeight;

      ctx.beginPath();
      ctx.lineCap = 'butt';
      ctx.strokeStyle = '#444';
      ctx.lineWidth = isHourTick ? hourTickWidth : minuteTickWidth;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.closePath();

      // number

      if (isHourTick) {
        var number = i / 5 || 12;

        // number = romanize(number);

        var numberX = Math.cos(angle * Math.PI / 180) * (tickLength - fontSize / 1.5) + halfWidth;
        var numberY = Math.sin(angle * Math.PI / 180) * (tickLength - fontSize / 1.5) + halfHeight;

        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = fontSize + 'px serif';
        ctx.fillStyle = '#444';
        ctx.fillText(number, numberX, numberY);
        ctx.closePath();
      }
    }

    // hour hand
    drawHand(hourHandAngle, hourHandLength);

    // minute hand
    drawHand(minuteHandAngle, minuteHandLength);

    // second hand
    drawHand(secondHandAngle, secondHandLength, 4, '#f44');

    // middle bolt
    ctx.beginPath();
    ctx.fillStyle = '#f44';
    ctx.arc(halfWidth, halfHeight, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(render);
  }

  function drawHand(angle, length, width, color) {
    // arc drawing starts at 3 o'clock by default
    angle = angle - 90;
    var endX = Math.cos(angle * Math.PI / 180) * length + halfWidth;
    var endY = Math.sin(angle * Math.PI / 180) * length + halfHeight;

    // add "tails"
    var startX = Math.cos((angle - 180) * Math.PI / 180) * handTailLength + halfWidth;
    var startY = Math.sin((angle - 180) * Math.PI / 180) * handTailLength + halfHeight;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.strokeStyle = color || '#444';
    ctx.lineWidth = width || 14;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
  }

  function romanize(number) {
    var remainder;
    var str = '';

    var x = number / 10;
    number = number % 10;

    if (x >= 1) {
      str += 'X';
    }

    var v = number / 5;
    number = number % 5;

    if (v >= 1) {
      str += 'V';
    }

    str += 'I'.repeat(number);

    return str;
  }

  function random(max) {
    return Math.random() * max;
  }
})();
