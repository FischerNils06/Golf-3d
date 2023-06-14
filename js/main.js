const fall = require('./physics.js');
const three = new Threestrap.Bootstrap();


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 100, 100),
  new THREE.MeshBasicMaterial({ color: 0xff3333 })
);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide })
);

plane.rotateX(Math.PI / 2);
plane.position.y = -0.5;

three.scene.add(sphere);
three.scene.add(plane);

const cameraDistance = 2; // Adjust the desired distance of the camera from the cube

// Set initial camera position and target
three.camera.position.set(0, 0, cameraDistance);
three.camera.lookAt(sphere.position);

let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

// Add mouse event listeners
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);

function onMouseDown(event) {
  if (event.button === 0) {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
}

function onMouseMove(event) {
  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    const theta = (deltaMove.x * Math.PI) / 180;
    const phi = (deltaMove.y * Math.PI) / 180;

    const spherical = new THREE.Spherical().setFromVector3(
      three.camera.position.clone().sub(sphere.position)
    );

    spherical.theta -= theta;
    spherical.phi -= phi;

    // Restrict the vertical rotation to avoid flipping the camera
    spherical.phi = Math.max(
      0.01, // Minimum angle (close to the bottom)
      Math.min(Math.PI - 0.01, spherical.phi) // Maximum angle (close to the top)
    );

    const targetPosition = new THREE.Vector3().setFromSpherical(spherical).add(sphere.position);

    three.camera.position.copy(targetPosition);
    three.camera.lookAt(sphere.position);

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
}

function onMouseUp(event) {
  if (event.button === 0) {
    isDragging = false;
  }
}

three.on('update', function () {
  sphere.rotateY(0.02);
  fall(sphere);
});



