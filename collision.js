// collision.js

const CollisionSystem = (() => {
  const collisionRects = [];

  return {
    add: function (x, y, width, height) {
      collisionRects.push({ x, y, width, height });
    },

    check: function (rect) {
      return collisionRects.some(zone =>
        rect.x < zone.x + zone.width &&
        rect.x + rect.width > zone.x &&
        rect.y < zone.y + zone.height &&
        rect.y + rect.height > zone.y
      );
    },

    debugDraw: function (ctx, offsetX, offsetY) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0)';              // Borde azul
      ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'; // Relleno azul transparente
      //ctx.fillStyle = "rgba(0, 0, 0, 0)";
      collisionRects.forEach(zone => {
        ctx.fillRect(
          zone.x + offsetX,
          zone.y + offsetY,
          zone.width,
          zone.height
        );
        ctx.strokeRect(
          zone.x + offsetX,
          zone.y + offsetY,
          zone.width,
          zone.height
        );
      });
      ctx.restore();
    },

    clear: function () {
      collisionRects.length = 0;
    }
  };
})();
