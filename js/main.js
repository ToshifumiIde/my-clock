"use strict";

(() => {
  class ClockDrawer {
    constructor(canvas) {
      this.ctx = canvas.getContext("2d");
      this.width = canvas.width;
      this.height = canvas.height;
    }

    draw(angle, func) {
      this.ctx.save();
      //時計の中心位置の座標を移動させる//
      this.ctx.translate(this.width / 2, this.height / 2);
      // ctx.rotate(2 * Math.PI / 360 * angle);
      this.ctx.rotate((Math.PI / 180) * angle);

      //時刻の目盛りの描画
      this.ctx.beginPath();
      func(this.ctx);
      this.ctx.stroke();

      this.ctx.restore();
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  class Clock {
    constructor(drawer) {
      this.r = 100;
      this.drawer = drawer;
    }

    drawFace() {
      for (let angle = 0; angle < 360; angle += 6) {
        this.drawer.draw(angle, (ctx) => {
          ctx.moveTo(0, -this.r);
          //太字と細字の条件切り分け、
          if (angle % 30 === 0) {
            ctx.lineWidth = 2;
            ctx.lineTo(0, -this.r + 10); //太字の方は少し長くする。
            ctx.font = "13px Arial";
            ctx.textAlign = "center";
            ctx.fillText(angle / 30 || 12, 0, -this.r + 25);
          } else {
            ctx.lineTo(0, -this.r + 5); //目盛りを描画する長さ、細字は長さ半分
          }
        });
      }
    }

    drawHands() {
      //hour//
      this.drawer.draw(this.h * 30 + this.m * 0.5, (ctx) => {
        ctx.lineWidth = 6;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 50);
      });
      //minute//
      this.drawer.draw(this.m * 6, (ctx) => {
        ctx.lineWidth = 4;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 30);
      });
      //second//
      this.drawer.draw(this.s * 6, (ctx) => {
        ctx.strokeStyle = "red";
        ctx.moveTo(0, 20);
        ctx.lineTo(0, -this.r + 30);
      });
    }

    update() {
      const d = new Date();
      this.h = d.getHours();
      this.m = d.getMinutes();
      this.s = d.getSeconds();
    }

    run() {
      this.update();

      this.drawer.clear();
      this.drawFace();
      this.drawHands();

      setTimeout(() => {
        this.run();
      }, 100);
    }
  }

  const canvas = document.querySelector("canvas");
  if (typeof canvas.getContext === "undefined") {
    return;
  }

  const clock = new Clock(new ClockDrawer(canvas));
  clock.run();
})();
