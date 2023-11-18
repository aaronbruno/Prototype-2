title = "test";

description = `
`;

characters = [];

const G = {
  WIDTH: 100,
  HEIGHT: 150,
  STAR_SPEED_MIN: 0.5,
  STAR_SPEED_MAX: 1.0,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type  { Star [] }
 */
let stars;

// The game loop function
function update() {
  // The init function running at startup
  if (!ticks) {
    // A CrispGameLib function
    // First argument (number): number of times to run the second argument
    // Second argument (function): a function that returns an object. This
    // object is then added to an array. This array will eventually be
    // returned as output of the times() function.
    stars = times(20, () => {
      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      // An object of type Star with appropriate properties
      return {
        // Creates a Vector
        pos: vec(posX, posY),
        // More RNG
        speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX),
      };
    });
  }

  // Update for Star
  stars.forEach((s) => {
    // Move the star downwards
    s.pos.y += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_black");
    // Draw the star as a square of size 1
    box(s.pos, 1);
  });
}
