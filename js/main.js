const three = new Threestrap.Bootstrap();

const cube = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 100, 100),
  new THREE.MeshBasicMaterial({ color: 0xff3333 })
);

three.scene.add(cube);

three.camera.position.set(1, 1, 2);
three.camera.lookAt(new THREE.Vector3(0, 0, 0));

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

    const deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        toRadians(deltaMove.y * 1),
        toRadians(deltaMove.x * 1),
        0,
        'XYZ'
      ));

    cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
    
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

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

three.on('update', function () {
  cube.rotateY(0.02);
});


