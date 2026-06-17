const maps = {

  dulce_house: {
    background: "background2.png",
    width: 1920,
    height: 1600,
    collisions: [

      [32, 640, 384, 32],
      [544, 640, 256, 32],
      [32, 1056, 1088, 32],
      [1120, 640, 32, 416],
      [256, 160, 32, 288],
      [672, 160, 32, 288],
      [416, 96, 128, 32],
      [384, 512, 32, 128],
      [544, 512, 32, 128],
      [800, 640, 16, 16],
      [832, 624, 16, 16],
      [864, 592, 16, 16],
      [ 896, 576, 16, 16],
      [ 928, 576, 16, 16],

         [976, 576, 16, 16],
      [1008, 592, 16, 16],
      [1040, 608, 16, 16],
      [ 1072, 624, 16, 16],
      [ 1104, 640, 16, 16],

    ],
    interactions: [

      {
        x: 400,
        y: 300,
        width: 64,
        height: 160,
        text:
          "MOM: A lot of strange things have been happening these past few days. I've heard rumors that animals have been getting sick. Take good care of your pet!.\n\n\nDULCE: Sure, it´s my best friend."
      },

      {
        x: 416,
        y: 1056,
        width: 128,
        height: 32,
        text: "This door is sealed by a mystery force."
      },

      {
   x: 80,
   y: 736,
   width: 32,
  height: 32,
    type: "computer",
    name: "Living room Computer",
    hostname: "OFFICE-PC",
ip: "192.168.2.10",
network: "LOCAL_NET",
    accessMode: "login",

    users: [
        {
            username: "ADMIN",
            password: "PASS",
            role: "ADMIN"
        }
    ],
    files: [
        {
            name: "README.TXT",
            content: `========================================
There are a few things to think about in life.
========================================

-It's easy to lose track of oneself if one does not have routines such as sleeping regularly. Maybe not always but at least sometimes. Or just drink a lot of coffeeee....

-Be curious! Poking your nose around in various things, and also perhaps where it shouldn't be, is not a bad thing necessarily. It's just that old people seem to forget the importance of these things.

-You don't always have to sleep in your own bed. Sometimes you can find a derelict bed when you're out and about in the most peculiar places. Don't be afraid to take a nap.

-Do whatever you want. ANY fool can make a rule, and any fool can break it. So, have fun!

N`
        },
        {
            name: "NOTES.TXT",
            content: "The door code was changed yesterday."
        },
        {
            name: "LOG.TXT",
            content: "Last login: unknown user."
        }
    ]
}

    ],
items: [

    {
        itemId: "key_001",
        x: 768,
        y: 800,
        width: 32,
        height: 32,
        sprite: "generic_disk.png"
    }

],

    doors: [

  {
    x: 864,
    y: 608,
    width: 64,
    height: 32,

    targetMap: "dulce_kitchen",

   spawnX: 448,
   spawnY: 448,

   requiredPin: "1234"


  },
  {
    x: 576,
    y: 144,
    width: 64,
    height: 32,

     spriteWidth: 64,
  spriteHeight: 192,

  spriteOffsetX: 0,
  spriteOffsetY: -32,

    targetMap: "dulce_room",

   spawnX: 448,
   spawnY: 448,

  requiredPin: "2345",
  sprite: "sealed_door.png",
  }

]

  },

dulce_kitchen: {
    background: "background3.png",
    width: 960,
    height: 800,
    collisions: [
    ],
    interactions: [],
    doors: [

  {
    x: 448,
    y: 608,
    width: 64,
    height: 32,

    targetMap: "dulce_house",

   spawnX: 864,
   spawnY: 608
  }

],items: [

{
        itemId: "key_002",
        x: 448,
        y: 288,
        width: 32,
        height: 32,
        sprite: "generic_disk.png"
    }

],

  },

  dulce_room: {
    background: "background4.png",
    width: 960,
    height: 800,
    collisions: [
    ],
    interactions: [

{
   x: 448,
   y: 288,
   width: 32,
  height: 32,
    type: "computer",
    name: "Dulce Computer",
    hostname: "OFFICE-PC",
ip: "192.168.2.11",
network: "LOCAL_NET",
    accessMode: "login",

    users: [
        {
            username: "ADMIN",
            password: "PASS",
            role: "ADMIN"
        }
    ],
    files: [
        {
            name: "README.TXT",
            content: `========================================
There are a few things to think about in life.
========================================

-It's easy to lose track of oneself if one does not have routines such as sleeping regularly. Maybe not always but at least sometimes. Or just drink a lot of coffeeee....

-Be curious! Poking your nose around in various things, and also perhaps where it shouldn't be, is not a bad thing necessarily. It's just that old people seem to forget the importance of these things.

-You don't always have to sleep in your own bed. Sometimes you can find a derelict bed when you're out and about in the most peculiar places. Don't be afraid to take a nap.

-Do whatever you want. ANY fool can make a rule, and any fool can break it. So, have fun!

N`
        },
        {
            name: "NOTES.TXT",
            content: "The door code was changed yesterday."
        },
        {
            name: "LOG.TXT",
            content: "Last login: unknown user."
        }
    ]
}

    ],
    doors: [

  {
    x: 448,
    y: 608,
    width: 64,
    height: 32,

    targetMap: "dulce_house",

   spawnX: 576,
   spawnY: 148

  }

],items: [],

  }
};