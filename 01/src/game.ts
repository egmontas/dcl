import * as utils from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'

///ui.displayAnnouncement('hello world')

/// --- UpDown ---

const point1 = new Vector3(0, 0, 0)
const point2 = new Vector3(0, 3, 0)
const point3 = new Vector3(0, 0, 0)

const myPath = new Path3D([point1, point2, point3])

@Component("pathData")
export class PathData {
  origin: Vector3 = myPath.path[0]
  target: Vector3 = myPath.path[1]
  fraction: number = 0
  nextPathIndex: number = 1
}

export class UDPath implements ISystem {
  
  update(dt: number) {
	let transform = parentUD.getComponent(Transform)
	let path = parentUD.getComponent(PathData)
	if (path.fraction <= 1) {
		transform.position = Vector3.Lerp(path.origin, path.target, path.fraction)
		path.fraction += dt / 5
		} else {
		path.nextPathIndex += 1
	if (path.nextPathIndex >= myPath.path.length) {
        path.nextPathIndex = 0
		}
		path.origin = path.target
		path.target = myPath.path[path.nextPathIndex]
		path.fraction = 0
	}
  }
}

engine.addSystem(new UDPath())

const parentUD = new Entity()
parentUD.addComponent(
new Transform({
  position: new Vector3(0, 0, 0),
  scale: new Vector3(1, 1, 1),
})
)
parentUD.addComponent(new PathData())
engine.addEntity(parentUD)

/// --- Rotate ---

export class GraphicsRotate implements ISystem {
  update() {
    let logorot = objTwo.getComponent(Transform)
    logorot.rotate(Vector3.Up(), 2)
  }
}

engine.addSystem(new GraphicsRotate())

/// --- Objects ---

/// Blackbox

let objOne = new Entity()
objOne.addComponent(new GLTFShape("models/dcl_01_box1.gltf"))
objOne.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8),
    scale: new Vector3(1, 1, 1),
  })
)
objOne.setParent(parentUD)

///objOne.addComponent(new PathData())

/// Logo

let objTwo = new Entity()
objTwo.addComponent(new GLTFShape("models/dcl_01_graphic.gltf"))
objTwo.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8),
	  scale: new Vector3(1, 1, 1),
  })
)

/// Ground

let objThree = new Entity()
objThree.addComponent(new GLTFShape("models/dcl_01_ground.gltf"))
objThree.addComponent(
  new Transform({
    position: new Vector3(8,0,8),
    scale: new Vector3(1, 1, 1),
  })
)

engine.addEntity(objOne)
engine.addEntity(objTwo)
engine.addEntity(objThree)

/// --- Sound ---

const proxySound = new Entity()
const clip = new AudioClip("sounds/dcl_01_sound.mp3")
const source = new AudioSource(clip)
proxySound.addComponent(source)
proxySound.addComponent(
	new Transform({
		position: new Vector3 (8,8,8),
	})
	)
source.playing = true
source.loop = true
source.volume = 1

engine.addEntity(proxySound)

/// --- Stream ---

const videoOne = new VideoClip("videos/dcl_01_video.mp4")
const vtexOne = new VideoTexture(videoOne)
const matOne = new BasicMaterial()
matOne.texture = vtexOne

const scrOne = new Entity()
scrOne.addComponent(new PlaneShape())
scrOne.addComponent(
	new Transform({
		position: new Vector3(8,9,15.225),
		scale: new Vector3(14.45, 14.45, 14.45),
	})
	)

scrOne.addComponent(matOne)

scrOne.addComponent(
	new OnPointerDown(() => {
	vtexOne.playing = !vtexOne.playing
	})
)

scrOne.setParent(parentUD)	

engine.addEntity(scrOne)
vtexOne.playing = true
vtexOne.loop = true

/// --- Video ---

const videoTwo = new VideoClip("videos/dcl_01_video.mp4")
const vtexTwo = new VideoTexture(videoTwo)
const matTwo = new BasicMaterial()
matTwo.texture = vtexTwo

const scrTwo = new Entity()
scrTwo.addComponent(new PlaneShape())
scrTwo.addComponent(
	new Transform({
		position: new Vector3(15.225, 9, 8),
		rotation: new Quaternion(0,1,0,1), 
		scale: new Vector3(14.45, 14.45, 14.45),
	})
)

scrTwo.addComponent(matTwo)

scrTwo.addComponent(
	new OnPointerDown(() => {
		vtexTwo.playing = !vtexTwo.playing
	})
)

scrTwo.setParent(parentUD)	

engine.addEntity(scrTwo)
vtexTwo.playing = false
vtexTwo.loop = true

///

const videoThree = new VideoClip("videos/dcl_01_video.mp4")
const vtexThree = new VideoTexture(videoThree)
const matThree = new BasicMaterial()
matThree.texture = vtexThree

const scrThree = new Entity()
scrThree.addComponent(new PlaneShape())
scrThree.addComponent(
	new Transform({
		position: new Vector3(8, 9, 0.775),
		rotation: new Quaternion(0,1,0,0), 
		scale: new Vector3(14.45, 14.45, 14.45),
	})
)

scrThree.addComponent(matThree)

scrThree.addComponent(
	new OnPointerDown(() => {
		vtexThree.playing = !vtexThree.playing
	})
)

scrThree.setParent(parentUD)

engine.addEntity(scrThree)
vtexThree.playing = false
vtexThree.loop = true

///

const videoFour = new VideoClip("videos/dcl_01_video.mp4")
const vtexFour = new VideoTexture(videoFour)
const matFour = new BasicMaterial()
matFour.texture = vtexFour

const scrFour = new Entity()
scrFour.addComponent(new PlaneShape())
scrFour.addComponent(
	new Transform({
		position: new Vector3(0.775, 9, 8),
		rotation: new Quaternion(0,1,0,-1),
		scale: new Vector3(14.45, 14.45, 14.45),
	})
)

scrFour.addComponent(matFour)

scrFour.addComponent(
	new OnPointerDown(() => {
		vtexFour.playing = !vtexFour.playing
	})
)

scrFour.setParent(parentUD)	

engine.addEntity(scrFour)
vtexFour.playing = false
vtexFour.loop = true

///

let infoPanel = new Entity()
infoPanel.addComponent(new PlaneShape)
infoPanel.addComponent(
  new Transform({
    position: new Vector3(8, 16.225, 8),
		rotation: new Quaternion(1,0,0,1), 
		scale: new Vector3(14.45, 14.45, 14.45),
  })
)

const infoTex = new Texture("images/dcl_01_info.jpg", { wrap: 2})
const infoMat = new Material()
infoMat.albedoTexture = infoTex

infoPanel.addComponent(infoMat)

infoPanel.setParent(parentUD)	

engine.addEntity(infoPanel)

/** 
const videoFive = new VideoClip("videos/dcl_01_video.mp4")
const vtexFive = new VideoTexture(videoFive)
const matFive = new BasicMaterial()
matFive.texture = vtexFive

const scrFive = new Entity()
scrFive.addComponent(new PlaneShape())
scrFive.addComponent(
	new Transform({
		position: new Vector3(8, 16.225, 8),
		rotation: new Quaternion(1,0,0,1), 
		scale: new Vector3(14.45, 14.45, 14.45),
	})
)
scrFive.addComponent(new scrFivePathData())
scrFive.addComponent(matFive)

scrFive.addComponent(
	new OnPointerDown(() => {
		vtexFive.playing = !vtexFive.playing
	})
)
engine.addEntity(scrFive)
vtexFive.playing = true
vtexFive.loop = true
**/

