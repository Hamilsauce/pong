function fly(p, speed, delay) {
  TweenMax.to(p, speed, {
    opacity: 0,
    y: 750 - rotationSpeed / 3 + Math.random() * 100,
    x: 955 - 40 + Math.random() * 80,
    scale: 4 - rotationSpeed / 100,
    fill: "#000000",
    delay: delay,
    ease: Strong.easeInOut,
    onComplete: resetParticle,
    onCompleteParams: [p]
  });
}

function loop(){
  t++;
  if (t%10 == 0){
    var star = getStar();
    showStar(star);
  }
  
  var particlesNumber = Math.round(rule3(-rotationSpeed, 0, 1000, 1,3));
  var speedParticles = rule3(-rotationSpeed, 0, 1000, 1.5,.2);
  for (var i=0; i<1; i++){
      var p = getSmokeParticle();
      fly(p, speedParticles, i*.1);
  }
  fireScaleY = .8 + Math.random()*.3 -rotationSpeed/500;
  fireScaleY = Math.min(fireScaleY,1.5);
  fireScaleX = 1+rotationSpeed/100;
  fireScaleX = Math.min(Math.max(fireScaleX,.4),1);
  yellowFireScale = .8 + Math.random()*.3;
  //*
  if (autoRotate){
    rotationSpeed += (rocketProperSpeed - rotationSpeed)/30;
    rocketRotation = rocket._gsTransform.rotation;
    rocketRotation -= rotationSpeed;
    TweenLite.set(rocket, {
      rotation:rocketRotation
    });
  }
  //*/
  TweenLite.set(fire, {
    scaleX:fireScaleX, 
    scaleY:fireScaleY
  });
  TweenLite.set(yellowFire, {
    scale:yellowFireScale, 
    rotation:-20 + yellowFireScale*20
  });
  requestAnimationFrame(loop);
}

loop();

function rule3(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}
