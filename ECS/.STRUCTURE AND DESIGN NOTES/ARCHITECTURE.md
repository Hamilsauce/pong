# Game
  - Role 1
  - Role 2

# SceneGraph
  - Model that provides lifetime management 
    for a vector of scene nodes.
  - Probably collision
  - Tracks visual objects and state

## SceneNodes 
  - Collection of renderable/physical/graphical 
  - object representations.
  - 
  - manage their own hierarchies for render state 

# Components
  - Can be queried for type information and dynamically cast. 

Instead of translating a mesh from local 
space to world space, a scene node’s 
transformation matrix transforms its
position locally in relation to its
parent, instead. This means that all 
transformation information `cascades 
down the scene graph - including scaling
transformations`. This means that all
scene nodes that are children of a
given node with a scale will have their
transformation matrices scaled - whether 
this is desirable or not is context 
dependent - being able to size up our 
car to be a monster truck by setting 
the chassis scale to 5.0 will 
automatically increase the size of 
its wheels, due to the parent/child
relationship of their transformations - but 
as you will see in the example, 
sometimes having a scale in the
matrix can cause undesirable artifacts.
