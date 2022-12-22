 var ball = function() {
   var e = document.getElementById('ball')

   var r = {}
   r.dx = 0
   r.dy = 0

   function update() {
     r.right = r.cx + r.r;
     r.left = r.cx - r.r;
     r.top = r.cy - r.r;
     r.bottom = r.cy + r.r;
   }

   Object.defineProperty(r, "cx", {
     get: function() { return e.cx.baseVal.value },
     set: function(val) {
       e.cx.baseVal.value = val;
       update();
     }
   })
   Object.defineProperty(r, "cy", {
     get: function() { return e.cy.baseVal.value },
     set: function(val) {
       e.cy.baseVal.value = val;
       update();
     }
   })
   Object.defineProperty(r, "r", {
     get: function() { return e.r.baseVal.value },
     set: function(val) {
       e.r.baseVal.value = val;
       update();
     }
   })

   update();

   return r;
 }();