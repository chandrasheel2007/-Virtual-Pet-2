//Create variables here
var dog, dogImg, happyDog, database;
var bg;
var foodS = 20;
var foodStock = 20;
var feedPet, addFood;
var fedTime, lastFed, foodObj;
var feedFood, buyFood, xy;
var hor=0, min=0, sec=0;
var o_loc = 0;
var hours, name_inp, name_btn, name=" ";
var intro;




function preload()
{
  //load images here
  bg = loadImage("images/day.jpg");

  dogImg = loadImage('images/dogImg.png');
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(1000, 500);

  //refer to the database
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  fedTime = database.ref('Hour');
  fedTime.on("value", read);

  hor = database.ref('Hour');
  hor.on("value", readTimeDataBaseHours);

  min = database.ref('Minute');
  min.on("value", readTimeDataBaseMins);

  sec = database.ref('Second');
  sec.on("value", readTimeDataBaseSecs);

  

  //create Food Object
  foodObj = new Food();

  //create Dog Sprite
  dog = createSprite(800, 350, 100, 100);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  var currentHR = 0;

  //Buttons
  //To take name the dog

  intro = createElement('h3');

  name_inp = createInput("Enter the Name of your Dog");
  name_inp.position(width/2+260, 80);

  name_btn = createButton("Name your Dog Now!");
  name_btn.position(width/2+280, 140);
  name_btn.mousePressed(function(){
    name_inp.hide();
    name_btn.hide();
    name = name_inp.value();
    
    
  })

  //To feed the dog
  feedFood = createButton("Feed");
  feedFood.position(width/2+270, 200);
  feedFood.mousePressed(function(){
    feedDog();
  });

  //to add more food
  buyFood = createButton("Add Food");
  buyFood.position(width/2+350, 200);
  buyFood.mousePressed(function(){
    if(foodS<20){
    foodS+=1;
    database.ref("/").update({
      'Food': foodS
    })

  }
    else if(foodS>=20){
      foodS=20;
    }

  })

}


function draw() {
  background(bg);
  currentHR = hour();
  drawSprites();

  if(o_loc===1){
    dog.addImage(happyDog);
    image(foodObj.image, 620, 350, 120, 100);
  }
  if(o_loc===0){
    dog.addImage(dogImg);
    
  }

  if(currentHR-hor>=1){
    o_loc=0;
  }
  else if (currentHR-hor<1){
    o_loc = 1;
  }

  if(hor>=13){
    hours = hor-12;
  }

  


  push();
  textSize(25);
  strokeWeight(4);
  stroke(255, 120, 0);
  fill(0);
  textAlign(CENTER);
  text("Milk Bottles Left: "+foodS, 150, 45);
  if(hor<=12){
  text("Last Fed: "+ hor +": "+ min+ ": "+ sec + " AM", 820, 50 );
  }
  else if(hor>=13){
  text("Last Fed: "+ hours +": "+ min+ ": "+ sec + " PM", 820, 50 );
  }


  if(name!==" "){
    push();
    textSize(25);
    strokeWeight(4);
    stroke(255, 120, 0);
    fill(0);
    textAlign(CENTER);
    text("Say Hello to "+name+" !", width/2, 120);
    pop();
  }
  pop();



  foodObj.getFoodStock();


    foodObj.display();
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }
  else if(x>0){
    x=x-1;
  }
  database.ref("/").update({
    'Food': x
  })
}

function readTimeDataBaseHours(hours){
  hor = hours.val();
}

function readTimeDataBaseMins(mins){
  min = mins.val();
}

function readTimeDataBaseSecs(secs){
  sec = secs.val();
}

function read(data){
  lastFed=data.val();
}

function feedDog(){
  if(foodS!==0){
  hor = hour();
  min = minute();
  sec = second();
  database.ref("/").update({
    "Hour": hor,
    "Minute": min,
    "Second": sec
  })
}
  dog.addImage(happyDog);
  writeStock(foodS);
  o_loc=1;


}



async function getTime(){

  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
    var responsejson = await response.json();
    var dt = responsejson.datetime;
    var hr = dt.slice(11, 13);

    if(hr>=06&&hr<18){
      bg = loadImage("images/day.jpg");
    }
    else if (hr>=18&&hr<06){
      bg = loadImage("images/night.jpg");
    }

}



