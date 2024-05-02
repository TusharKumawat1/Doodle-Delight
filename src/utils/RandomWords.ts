const easyEnglishWords:string[] = [
    "car", "bus", "train", "plane", "bicycle", "motorcycle", "truck", "boat", "ship", "submarine",
    "dog", "cat", "horse", "elephant", "lion", "tiger", "zebra", "giraffe", "monkey", "kangaroo",
    "apple", "banana", "orange", "grape", "strawberry", "watermelon", "pineapple", "kiwi", "pear", "peach",
    "table", "chair", "desk", "sofa", "bed", "wardrobe", "bookshelf", "cabinet", "mirror", "lamp",
    "computer", "phone", "tablet", "television", "keyboard", "mouse", "printer", "speaker", "headphones", "camera",
    "house", "apartment", "castle", "cabin", "tent", "hut", "palace", "mansion", "villa", "igloo",
    "tree", "flower", "grass", "bush", "forest", "jungle", "orchard", "meadow", "park", "garden",
    "ball", "bat", "glove", "helmet", "goal", "net", "basket", "hoop", "racket", "club",
    "pen", "pencil", "marker", "crayon", "eraser", "notebook", "journal", "diary", "calendar", "folder",
    "chair", "table", "desk", "stool", "bench", "couch", "ottoman", "sofa", "rocking chair", "armchair",
    "bottle", "cup", "glass", "mug", "jug", "pitcher", "flask", "thermos", "tumbler", "jar",
    "clock", "watch", "timer", "alarm", "calendar", "stopwatch", "hourglass", "sundial", "chronometer", "pendulum",
    "door", "window", "gate", "fence", "wall", "roof", "floor", "ceiling", "staircase", "railing",
    "knife", "fork", "spoon", "chopsticks", "plate", "bowl", "cup", "mug", "saucer", "tray",
    "key", "lock", "padlock", "combination lock", "deadbolt", "latch", "chain lock", "cylinder lock", "lever lock", "rim lock",
    "shoe", "boot", "sandal", "sneaker", "slipper", "loafer", "moccasin", "flip-flop", "clog", "pump",
    "hat", "cap", "beanie", "beret", "bowler hat", "top hat", "fedora", "trilby", "sombrero", "helmet",
    "table", "chair", "lamp", "bookshelf", "rug", "curtain", "cushion", "vase", "clock", "mirror",
    "spoon", "fork", "knife", "plate", "bowl", "glass", "cup", "mug", "tray", "napkin",
    "carrot", "potato", "tomato", "onion", "garlic", "cucumber", "lettuce", "spinach", "cabbage", "broccoli",
    "house", "apartment", "cottage", "mansion", "castle", "cabin", "bungalow", "villa", "palace", "igloo",
    "ball", "bat", "glove", "goal", "net", "field", "court", "racket", "club", "puck",
    "tree", "flower", "grass", "bush", "hedge", "shrub", "plant", "weed", "cactus", "fern",
    "box", "bag", "case", "crate", "basket", "trunk", "barrel", "bin", "bucket", "pouch",
    "chair", "stool", "bench", "sofa", "couch", "ottoman", "armchair", "rocking chair", "recliner", "bean bag",
    "book", "magazine", "newspaper", "journal", "diary", "notebook", "novel", "poem", "story", "essay",
    "phone", "computer", "tablet", "television", "radio", "stereo", "speaker", "headphones", "microphone", "camera",
    "door", "window", "gate", "fence", "wall", "roof", "floor", "ceiling", "staircase", "railing",
    "guitar", "piano", "violin", "drum", "flute", "trumpet", "saxophone", "clarinet", "trombone", "harp",
    "bird", "dog", "cat", "fish", "rabbit", "hamster", "guinea pig", "mouse", "rat", "ferret",
    "cup", "plate", "bowl", "glass", "fork", "knife", "spoon", "napkin", "placemat", "coaster",
    "apple", "banana", "orange", "grape", "strawberry", "blueberry", "raspberry", "blackberry", "kiwi", "pineapple",
    "train", "bus", "car", "bicycle", "motorcycle", "truck", "boat", "ship", "submarine", "helicopter",
    "tree", "flower", "grass", "bush", "forest", "jungle", "orch"]  
export const fourRandomWords=()=>{
    let result:string[]=[]
    for (let i = 0; i < 3; i++) {
       let index=Math.floor(Math.random() * easyEnglishWords.length)
       result.push(easyEnglishWords[index])
    }
    return result
}