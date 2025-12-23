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

### 2. create course

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


### 3. get course

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

### 4. get specific course

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


### 5. delete course

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

### 6. update course

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