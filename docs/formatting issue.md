## 1. tag

http method: GET
path: `/tag`

expected:

```
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

got:

```
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

## 2. 

http method: GET
path: `/tag`

expected:

```
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

got:

```
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