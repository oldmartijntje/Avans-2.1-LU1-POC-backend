## tag endpoints

### 1. tag

http method: GET
path: `/tag`

expected:

```json
[
    {
        "_id": "68f0c8c484d21988f4d62748",
        "tagName": "test",
        "__v": 0
    },
    {
        "_id": "68f0c8c484d21988f4d6274a",
        "tagName": "mongodb",
        "__v": 0
    }
]
```
got:

```json
[
    {
        "id": "68f0c8c484d21988f4d62748",
        "tagName": "test"
    },
    {
        "id": "68f0c8c484d21988f4d6274a",
        "tagName": "mongodb"
    }
]
```

## course endpoints

### 1. create course

http method: POST
path: `/course`
body: 
```json
{
        "titleNL": "Kunstacademie",
        "titleEN": "Art Academy",
        "descriptionNL": "Een creatieve studie over schilderen, tekenen, beeldhouwen en conceptueel denken.",
        "descriptionEN": "A creative study about painting, drawing, sculpting, and conceptual thinking.",
        "languages": ["NL", "EN"],
        "tags": ["art", "drawing", "painting", "sculpture", "design", "creativity", "concept", "visuals", "media", "exhibition"]
    }
```
expected:

```json
{
    "uuid": "7ec32e82-61d7-4f58-93af-f1b3c769aaa8",
    "title": {
        "_id": "68f9035b7d954953ea6be77d",
        "dutch": "Kunstacademie",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Art Academy",
        "__v": 0
    },
    "description": {
        "_id": "68f9035b7d954953ea6be774",
        "dutch": "Een creatieve studie over schilderen, tekenen, beeldhouwen en conceptueel denken.",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "A creative study about painting, drawing, sculpting, and conceptual thinking.",
        "__v": 0
    },
    "languages": [
        "NL",
        "EN"
    ],
    "tags": [
        {
            "_id": "68f9035b7d954953ea6be776",
            "tagName": "sculpture",
            "__v": 0
        },
        {
            "_id": "68f8ff767d954953ea6bdb2a",
            "tagName": "drawing",
            "__v": 0
        },
        {
            "_id": "68f8ff767d954953ea6bdb22",
            "tagName": "art",
            "__v": 0
        },
        {
            "_id": "68f9024a7d954953ea6be2c8",
            "tagName": "painting",
            "__v": 0
        },
        {
            "_id": "68f8ff767d954953ea6bdb28",
            "tagName": "design",
            "__v": 0
        },
        {
            "_id": "68f901f57d954953ea6be152",
            "tagName": "visuals",
            "__v": 0
        },
        {
            "_id": "68f900657d954953ea6bdcde",
            "tagName": "media",
            "__v": 0
        },
        {
            "_id": "68f9035b7d954953ea6be778",
            "tagName": "exhibition",
            "__v": 0
        }
    ],
    "_id": "694a779070f5bba24b3aa46f",
    "__v": 0
}
```
got:

```json
{
    "uuid": "7ec32e82-61d7-4f58-93af-f1b3c769aaa8",
    "titleId": "{\n  _id: new ObjectId('68f9035b7d954953ea6be77d'),\n  dutch: 'Kunstacademie',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Art Academy',\n  __v: 0\n}",
    "descriptionId": "{\n  _id: new ObjectId('68f9035b7d954953ea6be774'),\n  dutch: 'Een creatieve studie over schilderen, tekenen, beeldhouwen en conceptueel denken.',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'A creative study about painting, drawing, sculpting, and conceptual thinking.',\n  __v: 0\n}",
    "languages": [
        "NL",
        "EN"
    ],
    "tagIds": [
        "{\n  _id: new ObjectId('68f8ff767d954953ea6bdb22'),\n  tagName: 'art',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f8ff767d954953ea6bdb2a'),\n  tagName: 'drawing',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f9024a7d954953ea6be2c8'),\n  tagName: 'painting',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f9035b7d954953ea6be776'),\n  tagName: 'sculpture',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f8ff767d954953ea6bdb28'),\n  tagName: 'design',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f901857d954953ea6bdf99'),\n  tagName: 'creativity',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f9035b7d954953ea6be77a'),\n  tagName: 'concept',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f901f57d954953ea6be152'),\n  tagName: 'visuals',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900657d954953ea6bdcde'),\n  tagName: 'media',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f9035b7d954953ea6be778'),\n  tagName: 'exhibition',\n  __v: 0\n}"
    ]
}
```


### 2. get course

http method: GET
path: `/course`

expected:

```json
[
    {
        "_id": "68f279d8074d145b14692516",
        "uuid": "7af37c4b-8c7f-454f-ab80-8b7a3eeae29a",
        "title": {
            "_id": "68f295e0074d145b1469a3c9",
            "dutch": "Informatica",
            "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
            "english": "Informatics",
            "__v": 0
        },
        "description": {
            "_id": "68f295e0074d145b1469a3c6",
            "dutch": "Een vak over het maken van apps en robots",
            "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
            "english": "A class about creating apps and robots",
            "__v": 0
        },
        "languages": [
            "NL",
            "EN"
        ],
        "tags": [
            {
                "_id": "68f279d8074d145b14692505",
                "tagName": "blazor",
                "__v": 0
            },
            {
                "_id": "68f278c4074d145b14692158",
                "tagName": "backend",
                "__v": 0
            },
            {
                "_id": "68f279d8074d145b14692509",
                "tagName": "php",
                "__v": 0
            },
            {
                "_id": "68f27973074d145b14692441",
                "tagName": "c#",
                "__v": 0
            },
            {
                "_id": "68f278c4074d145b14692154",
                "tagName": "experience",
                "__v": 0
            },
            {
                "_id": "68f279d8074d145b14692511",
                "tagName": "asp.net",
                "__v": 0
            },
            {
                "_id": "68f279d8074d145b1469250f",
                "tagName": "datascience",
                "__v": 0
            },
            {
                "_id": "68f902457d954953ea6be2a8",
                "tagName": "development",
                "__v": 0
            },
            {
                "_id": "68f279d8074d145b14692507",
                "tagName": "ai",
                "__v": 0
            },
            {
                "_id": "68f279d8074d145b1469250d",
                "tagName": "python",
                "__v": 0
            },
            {
                "_id": "68f0c8c484d21988f4d6274a",
                "tagName": "mongodb",
                "__v": 0
            },
            {
                "_id": "68f278c4074d145b14692152",
                "tagName": "frontend",
                "__v": 0
            }
        ],
        "__v": 3
    }
]
```
got:

```json
[
    {
        "uuid": "7af37c4b-8c7f-454f-ab80-8b7a3eeae29a",
        "titleId": "{\n  _id: new ObjectId('68f295e0074d145b1469a3c9'),\n  dutch: 'Informatica',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Informatics',\n  __v: 0\n}",
        "descriptionId": "{\n  _id: new ObjectId('68f295e0074d145b1469a3c6'),\n  dutch: 'Een vak over het maken van apps en robots',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'A class about creating apps and robots',\n  __v: 0\n}",
        "languages": [
            "NL",
            "EN"
        ],
        "tagIds": [
            "{\n  _id: new ObjectId('68f279d8074d145b14692505'),\n  tagName: 'blazor',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f278c4074d145b14692158'),\n  tagName: 'backend',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f279d8074d145b14692509'),\n  tagName: 'php',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f27973074d145b14692441'),\n  tagName: 'c#',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f278c4074d145b14692154'),\n  tagName: 'experience',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f279d8074d145b14692511'),\n  tagName: 'asp.net',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f279d8074d145b1469250f'),\n  tagName: 'datascience',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f902457d954953ea6be2a8'),\n  tagName: 'development',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f279d8074d145b14692507'),\n  tagName: 'ai',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f279d8074d145b1469250d'),\n  tagName: 'python',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f0c8c484d21988f4d6274a'),\n  tagName: 'mongodb',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f278c4074d145b14692152'),\n  tagName: 'frontend',\n  __v: 0\n}"
        ]
    }
]
```

### 3. get specific course

http method: GET
path: `/course/:uuid`

expected:

```json
{
    "_id": "68f279d8074d145b14692516",
    "uuid": "7af37c4b-8c7f-454f-ab80-8b7a3eeae29a",
    "title": {
        "_id": "68f295e0074d145b1469a3c9",
        "dutch": "Informatica",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Informatics",
        "__v": 0
    },
    "description": {
        "_id": "68f295e0074d145b1469a3c6",
        "dutch": "Een vak over het maken van apps en robots",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "A class about creating apps and robots",
        "__v": 0
    },
    "languages": [
        "NL",
        "EN"
    ],
    "tags": [
        {
            "_id": "68f279d8074d145b14692505",
            "tagName": "blazor",
            "__v": 0
        },
        {
            "_id": "68f278c4074d145b14692158",
            "tagName": "backend",
            "__v": 0
        },
        {
            "_id": "68f279d8074d145b14692509",
            "tagName": "php",
            "__v": 0
        },
        {
            "_id": "68f27973074d145b14692441",
            "tagName": "c#",
            "__v": 0
        },
        {
            "_id": "68f278c4074d145b14692154",
            "tagName": "experience",
            "__v": 0
        },
        {
            "_id": "68f279d8074d145b14692511",
            "tagName": "asp.net",
            "__v": 0
        },
        {
            "_id": "68f279d8074d145b1469250f",
            "tagName": "datascience",
            "__v": 0
        },
        {
            "_id": "68f902457d954953ea6be2a8",
            "tagName": "development",
            "__v": 0
        },
        {
            "_id": "68f279d8074d145b14692507",
            "tagName": "ai",
            "__v": 0
        },
        {
            "_id": "68f279d8074d145b1469250d",
            "tagName": "python",
            "__v": 0
        },
        {
            "_id": "68f0c8c484d21988f4d6274a",
            "tagName": "mongodb",
            "__v": 0
        },
        {
            "_id": "68f278c4074d145b14692152",
            "tagName": "frontend",
            "__v": 0
        }
    ],
    "__v": 3
}
```
got:

```json
{
    "uuid": "7af37c4b-8c7f-454f-ab80-8b7a3eeae29a",
    "titleId": "{\n  _id: new ObjectId('68f295e0074d145b1469a3c9'),\n  dutch: 'Informatica',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Informatics',\n  __v: 0\n}",
    "descriptionId": "{\n  _id: new ObjectId('68f295e0074d145b1469a3c6'),\n  dutch: 'Een vak over het maken van apps en robots',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'A class about creating apps and robots',\n  __v: 0\n}",
    "languages": [
        "NL",
        "EN"
    ],
    "tagIds": [
        "{\n  _id: new ObjectId('68f279d8074d145b14692505'),\n  tagName: 'blazor',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f278c4074d145b14692158'),\n  tagName: 'backend',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f279d8074d145b14692509'),\n  tagName: 'php',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f27973074d145b14692441'),\n  tagName: 'c#',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f278c4074d145b14692154'),\n  tagName: 'experience',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f279d8074d145b14692511'),\n  tagName: 'asp.net',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f279d8074d145b1469250f'),\n  tagName: 'datascience',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f902457d954953ea6be2a8'),\n  tagName: 'development',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f279d8074d145b14692507'),\n  tagName: 'ai',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f279d8074d145b1469250d'),\n  tagName: 'python',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f0c8c484d21988f4d6274a'),\n  tagName: 'mongodb',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f278c4074d145b14692152'),\n  tagName: 'frontend',\n  __v: 0\n}"
    ]
}
```


### 4. delete course

http method: DELETE
path: `/course/:uuid`

expected:

```json
{
    "message": "Subject deleted successfully"
}
```
got:

```json
true
```

### 5. update course

http method: PATCH
path: `/course/:uuid`

expected:

```json
{
    "_id": "68f902fd7d954953ea6be5e1",
    "uuid": "6a52eb5b-b1ab-4266-b668-df52b8328e6c",
    "title": {
        "_id": "694a792f70f5bba24b3aa493",
        "dutch": "Je moeder 2.0",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Your Mother 2.0",
        "__v": 0
    },
    "description": {
        "_id": "68f24b09ecb6686bbd665546",
        "dutch": "Je moeder is een plopkoek",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Your mother is a plopcookie",
        "__v": 0
    },
    "languages": [
        "NL",
        "EN"
    ],
    "tags": [
        {
            "_id": "68f0c8c484d21988f4d6274a",
            "tagName": "mongodb",
            "__v": 0
        },
        {
            "_id": "68f0c8c484d21988f4d62748",
            "tagName": "test",
            "__v": 0
        }
    ],
    "__v": 1
}
```
got:

```json
{
    "uuid": "6a52eb5b-b1ab-4266-b668-df52b8328e6c",
    "titleId": "{\n  _id: new ObjectId('694a792f70f5bba24b3aa493'),\n  dutch: 'Je moeder 2.0',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Your Mother 2.0',\n  __v: 0\n}",
    "descriptionId": "{\n  _id: new ObjectId('68f24b09ecb6686bbd665546'),\n  dutch: 'Je moeder is een plopkoek',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Your mother is a plopcookie',\n  __v: 0\n}",
    "languages": [
        "NL",
        "EN"
    ],
    "tagIds": [
        "{\n  _id: new ObjectId('68f0c8c484d21988f4d62748'),\n  tagName: 'test',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f0c8c484d21988f4d6274a'),\n  tagName: 'mongodb',\n  __v: 0\n}"
    ]
}
```

### course - what goes well?

- POST to `/course/joined/:uuid` is correct
- DELETE to `/course/joined/` is correct
- GET to `/course/joined/` is correct

## subject endpoints

### 1. get a single subject

http method: GET
path: `/subjects/:uuid`

expected:

```json
{
    "_id": "68f901267d954953ea6bde93",
    "uuid": "71b11e94-e4e9-4526-9c62-7850fcedbeea",
    "title": {
        "_id": "68f901257d954953ea6bde8e",
        "dutch": "Mobiele Applicatie Ontwikkeling",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Mobile Application Development",
        "__v": 0
    },
    "description": {
        "_id": "68f901257d954953ea6bde87",
        "dutch": "Leer mobiele apps bouwen voor Android en iOS met moderne frameworks.",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Learn to build mobile apps for Android and iOS using modern frameworks.",
        "__v": 0
    },
    "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "level": "NLQF-6",
    "studyPoints": 5,
    "moreInfo": {
        "_id": "68f901267d954953ea6bde91",
        "dutch": "Deze module behandelt cross-platform tools zoals Flutter en React Native.",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "This module covers cross-platform tools such as Flutter and React Native.",
        "__v": 0
    },
    "languages": [
        "NL",
        "EN"
    ],
    "tags": [
        {
            "_id": "68f278c4074d145b14692152",
            "tagName": "frontend",
            "__v": 0
        },
        {
            "_id": "68f901257d954953ea6bde85",
            "tagName": "react-native",
            "__v": 0
        },
        {
            "_id": "68f901257d954953ea6bde8b",
            "tagName": "mobile",
            "__v": 0
        },
        {
            "_id": "68f901257d954953ea6bde89",
            "tagName": "flutter",
            "__v": 0
        }
    ],
    "__v": 0,
    "isFavourite": false
}
```
got:

```json
{
    "uuid": "71b11e94-e4e9-4526-9c62-7850fcedbeea",
    "titleId": "{\n  _id: new ObjectId('68f901257d954953ea6bde8e'),\n  dutch: 'Mobiele Applicatie Ontwikkeling',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Mobile Application Development',\n  __v: 0\n}",
    "descriptionId": "{\n  _id: new ObjectId('68f901257d954953ea6bde87'),\n  dutch: 'Leer mobiele apps bouwen voor Android en iOS met moderne frameworks.',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Learn to build mobile apps for Android and iOS using modern frameworks.',\n  __v: 0\n}",
    "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "level": "NLQF-6",
    "studyPoints": 5,
    "moreInfoId": "{\n  _id: new ObjectId('68f901267d954953ea6bde91'),\n  dutch: 'Deze module behandelt cross-platform tools zoals Flutter en React Native.',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'This module covers cross-platform tools such as Flutter and React Native.',\n  __v: 0\n}",
    "languages": [
        "NL",
        "EN"
    ],
    "tagIds": [
        "{\n  _id: new ObjectId('68f278c4074d145b14692152'),\n  tagName: 'frontend',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f901257d954953ea6bde85'),\n  tagName: 'react-native',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f901257d954953ea6bde8b'),\n  tagName: 'mobile',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f901257d954953ea6bde89'),\n  tagName: 'flutter',\n  __v: 0\n}"
    ]
}
```

### 2. update subject

http method: PATCH
path: `/subjects/:uuid`

expected:

```json
{
    "_id": "68f902757d954953ea6be3ca",
    "uuid": "48a04b3e-e9fe-4fd5-b71b-4d9e35da1444",
    "title": {
        "_id": "694a7b75ed99af9d7d4dcea8",
        "dutch": "Je Vader",
        "english": "Your Father",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "__v": 0
    },
    "description": {
        "_id": "68f24b09ecb6686bbd665546",
        "dutch": "Je moeder is een plopkoek",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Your mother is a plopcookie",
        "__v": 0
    },
    "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "level": "NLQF-5",
    "studyPoints": 3,
    "moreInfo": {
        "_id": "694a7b75ed99af9d7d4dceab",
        "dutch": "kaas",
        "english": "cheese",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "__v": 0
    },
    "languages": [
        "NL",
        "EN"
    ],
    "tags": [],
    "__v": 1
}
```
got:

```json
{
    "uuid": "48a04b3e-e9fe-4fd5-b71b-4d9e35da1444",
    "titleId": "{\n  _id: new ObjectId('694a7b75ed99af9d7d4dcea8'),\n  dutch: 'Je Vader',\n  english: 'Your Father',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  __v: 0\n}",
    "descriptionId": "{\n  _id: new ObjectId('68f24b09ecb6686bbd665546'),\n  dutch: 'Je moeder is een plopkoek',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Your mother is a plopcookie',\n  __v: 0\n}",
    "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "level": "NLQF-5",
    "studyPoints": 3,
    "moreInfoId": "{\n  _id: new ObjectId('694a7b75ed99af9d7d4dceab'),\n  dutch: 'kaas',\n  english: 'cheese',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  __v: 0\n}",
    "languages": [
        "NL",
        "EN"
    ],
    "tagIds": [
        "{\n  _id: new ObjectId('68f25b8c58df22f527e91f93'),\n  tagName: 'biology',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900817d954953ea6bdd44'),\n  tagName: 'psychology',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f902207d954953ea6be1f6'),\n  tagName: 'training',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900477d954953ea6bdc74'),\n  tagName: 'science',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f25b8c58df22f527e91f91'),\n  tagName: 'nature',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900477d954953ea6bdc72'),\n  tagName: 'behavior',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900577d954953ea6bdcaa'),\n  tagName: 'health',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900477d954953ea6bdc6e'),\n  tagName: 'research',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f901fb7d954953ea6be178'),\n  tagName: 'education',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f902757d954953ea6be3c2'),\n  tagName: 'animals',\n  __v: 0\n}"
    ]
}
```

### 3. get all subjects

http method: GET
path: `/subjects`

expected:

```json
[
    {
        "_id": "68f27973074d145b14692449",
        "uuid": "d00502ee-1b6f-441d-804f-8b4487475c1d",
        "title": {
            "_id": "68f27973074d145b14692444",
            "dutch": "Software Ontwikkelen",
            "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
            "english": "Software Development",
            "__v": 0
        },
        "description": {
            "_id": "68f27973074d145b1469243d",
            "dutch": "Een cursus in het maken van apps en robots",
            "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
            "english": "A curses about making apps and robots",
            "__v": 0
        },
        "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "level": "NLQF-6",
        "studyPoints": 10,
        "moreInfo": {
            "_id": "68f29705ff189f3c974e1787",
            "dutch": "404",
            "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
            "english": "404",
            "__v": 0
        },
        "languages": [
            "EN",
            "FR"
        ],
        "tags": [
            {
                "_id": "68f278c4074d145b14692154",
                "tagName": "experience",
                "__v": 0
            },
            {
                "_id": "68f27973074d145b1469243f",
                "tagName": "mariadb",
                "__v": 0
            },
            {
                "_id": "68f278c4074d145b14692158",
                "tagName": "backend",
                "__v": 0
            },
            {
                "_id": "68f27973074d145b14692441",
                "tagName": "c#",
                "__v": 0
            },
            {
                "_id": "68f278c4074d145b14692152",
                "tagName": "frontend",
                "__v": 0
            },
            {
                "_id": "68f27973074d145b14692439",
                "tagName": "database",
                "__v": 0
            },
            {
                "_id": "68f27973074d145b1469243b",
                "tagName": "sql",
                "__v": 0
            },
            {
                "_id": "68f27973074d145b14692437",
                "tagName": "C++",
                "__v": 0
            }
        ],
        "__v": 1,
        "isFavourite": true
    }
]
```
got:

```json
[
    {
        "uuid": "d00502ee-1b6f-441d-804f-8b4487475c1d",
        "titleId": "{\n  _id: new ObjectId('68f27973074d145b14692444'),\n  dutch: 'Software Ontwikkelen',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Software Development',\n  __v: 0\n}",
        "descriptionId": "{\n  _id: new ObjectId('68f27973074d145b1469243d'),\n  dutch: 'Een cursus in het maken van apps en robots',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'A curses about making apps and robots',\n  __v: 0\n}",
        "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "level": "NLQF-6",
        "studyPoints": 10,
        "moreInfoId": "{\n  _id: new ObjectId('68f29705ff189f3c974e1787'),\n  dutch: '404',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: '404',\n  __v: 0\n}",
        "languages": [
            "EN",
            "FR"
        ],
        "tagIds": [
            "{\n  _id: new ObjectId('68f278c4074d145b14692154'),\n  tagName: 'experience',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f27973074d145b1469243f'),\n  tagName: 'mariadb',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f278c4074d145b14692158'),\n  tagName: 'backend',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f27973074d145b14692441'),\n  tagName: 'c#',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f278c4074d145b14692152'),\n  tagName: 'frontend',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f27973074d145b14692439'),\n  tagName: 'database',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f27973074d145b1469243b'),\n  tagName: 'sql',\n  __v: 0\n}",
            "{\n  _id: new ObjectId('68f27973074d145b14692437'),\n  tagName: 'C++',\n  __v: 0\n}"
        ]
    }
]
```

### 4. add subject

http method: POST
path: `/subjects`

expected:

```json
{
    "uuid": "212e6b9c-00cb-4e29-b15c-7d72869dd8ea",
    "title": {
        "_id": "68f902757d954953ea6be3c5",
        "dutch": "Diergedrag en Training",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Animal Behavior and Training",
        "__v": 0
    },
    "description": {
        "_id": "68f902757d954953ea6be3c0",
        "dutch": "Leer hoe dieren denken, leren en reageren op hun omgeving.",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "Learn how animals think, learn, and respond to their environment.",
        "__v": 0
    },
    "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "level": "NLQF-5",
    "studyPoints": 3,
    "moreInfo": {
        "_id": "68f902757d954953ea6be3c8",
        "dutch": "Je leert gedrag interpreteren en trainingstechnieken toepassen.",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
        "english": "You’ll learn to interpret behavior and apply training techniques.",
        "__v": 0
    },
    "languages": [
        "NL",
        "EN"
    ],
    "tags": [
        {
            "_id": "68f25b8c58df22f527e91f91",
            "tagName": "nature",
            "__v": 0
        },
        {
            "_id": "68f902757d954953ea6be3c2",
            "tagName": "animals",
            "__v": 0
        },
        {
            "_id": "68f25b8c58df22f527e91f93",
            "tagName": "biology",
            "__v": 0
        },
        {
            "_id": "68f901fb7d954953ea6be178",
            "tagName": "education",
            "__v": 0
        },
        {
            "_id": "68f902207d954953ea6be1f6",
            "tagName": "training",
            "__v": 0
        },
        {
            "_id": "68f900477d954953ea6bdc6e",
            "tagName": "research",
            "__v": 0
        },
        {
            "_id": "68f900577d954953ea6bdcaa",
            "tagName": "health",
            "__v": 0
        },
        {
            "_id": "68f900817d954953ea6bdd44",
            "tagName": "psychology",
            "__v": 0
        },
        {
            "_id": "68f900477d954953ea6bdc72",
            "tagName": "behavior",
            "__v": 0
        },
        {
            "_id": "68f900477d954953ea6bdc74",
            "tagName": "science",
            "__v": 0
        }
    ],
    "_id": "694a7d3270f5bba24b3aa5a4",
    "__v": 0
}
```
got:

```json
{
    "uuid": "5fa93d8e-bb3c-47a5-bd0f-147a10bbf0c2",
    "titleId": "{\n  _id: new ObjectId('68f902757d954953ea6be3c5'),\n  dutch: 'Diergedrag en Training',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Animal Behavior and Training',\n  __v: 0\n}",
    "descriptionId": "{\n  _id: new ObjectId('68f902757d954953ea6be3c0'),\n  dutch: 'Leer hoe dieren denken, leren en reageren op hun omgeving.',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'Learn how animals think, learn, and respond to their environment.',\n  __v: 0\n}",
    "ownerUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "level": "NLQF-5",
    "studyPoints": 3,
    "moreInfoId": "{\n  _id: new ObjectId('68f902757d954953ea6be3c8'),\n  dutch: 'Je leert gedrag interpreteren en trainingstechnieken toepassen.',\n  creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',\n  english: 'You’ll learn to interpret behavior and apply training techniques.',\n  __v: 0\n}",
    "languages": [
        "NL",
        "EN"
    ],
    "tagIds": [
        "{\n  _id: new ObjectId('68f902757d954953ea6be3c2'),\n  tagName: 'animals',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900477d954953ea6bdc72'),\n  tagName: 'behavior',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f902207d954953ea6be1f6'),\n  tagName: 'training',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f25b8c58df22f527e91f93'),\n  tagName: 'biology',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f25b8c58df22f527e91f91'),\n  tagName: 'nature',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900817d954953ea6bdd44'),\n  tagName: 'psychology',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f901fb7d954953ea6be178'),\n  tagName: 'education',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900477d954953ea6bdc74'),\n  tagName: 'science',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900577d954953ea6bdcaa'),\n  tagName: 'health',\n  __v: 0\n}",
        "{\n  _id: new ObjectId('68f900477d954953ea6bdc6e'),\n  tagName: 'research',\n  __v: 0\n}"
    ]
}
```

### 5. delete subject

http method: DELETE
path: `/subjects/:uuid`

expected:

```json
{
    "message": "Subject deleted successfully"
}
```
got:

```json
true
```

### 1. name

http method: GET
path: `/endpoint`

expected:

```json

```
got:

```json

```

### subjects - what goes well?

- GET to `/subjects/reccomended` is correct
- GET to `/subjects/favourites` is correct
- POST to `/subjects/favourite/:uuid` is correct
- DELETE to `/subjects/favourite/:uuid` is correct

## auth

### auth - what goes well?

- GET to `/auth/profile` is correct
- POST to `/auth/login` is correct
- POST to `/auth/register` is correct

## display-text

### 1. get displaytext

http method: GET
path: `/display-text`

expected:

```json
{
    "_id": "694a9f6a70f5bba24b3aa5e3",
    "dutch": "test.text (nieuw)",
    "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "english": "test.text (new)",
    "uiKey": "test.text",
    "__v": 0
}
```
got:

```json
{
    "id": "694a9f6a70f5bba24b3aa5e3",
    "dutch": "test.text (nieuw)",
    "english": "test.text (new)",
    "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "uiKey": "test.text"
}
```

### 2. get displaytext orphans

http method: GET
path: `/display-text/orphans`

expected:

```json
[]
```
because there currently are none.


got:

```json
[
    {
        "id": "68f24b09ecb6686bbd665546",
        "dutch": "Je moeder is een plopkoek",
        "english": "Your mother is a plopcookie",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20"
    },
    {
        "id": "68f27973074d145b1469243d",
        "dutch": "Een cursus in het maken van apps en robots",
        "english": "A curses about making apps and robots",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20"
    },
    {
        "id": "68f27973074d145b14692444",
        "dutch": "Software Ontwikkelen",
        "english": "Software Development",
        "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20"
    }
]
```

these are not orphans

### 3. edit UI key

http method: PATCH
path: `/display-text/:key`

expected:

```json
{
    "_id": "694a9f6a70f5bba24b3aa5e3",
    "dutch": "e",
    "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "english": "e",
    "uiKey": "test.text",
    "__v": 0
}
```
got:

```json
{
    "id": "694a9f6a70f5bba24b3aa5e3",
    "dutch": "e",
    "english": "e",
    "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "uiKey": "test.text"
}
```

### displaytext - what goes well?

- POST to `/display-text` is correct
- DELETE to `/display-text/orphans` is correct
- GET to `/display-text` is correct
- PATCH to `/display-text` is correct