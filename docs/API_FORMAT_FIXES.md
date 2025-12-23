# API Format Fixes Summary

## Issues Fixed

This document summarizes the changes made to fix API response formatting issues identified in `docs/formatting issue.md`.

### Problems Identified

After converting to onion architecture, the API endpoints started returning incorrect response formats:

1. **Tag endpoints**: Returned `id` instead of `_id`, missing `__v` field
2. **Course endpoints**: Returned string representations of populated objects instead of actual nested objects
3. **Subject endpoints**: Same issues as course endpoints
4. **Display-text endpoints**: Returned `id` instead of `_id`, missing `__v` field
5. **Delete endpoints**: Returned `true` instead of `{"message": "..."}` objects
6. **Display-text orphans**: Incorrectly returning non-orphaned display texts

### Root Cause

The onion architecture introduced mappers that converted Mongoose documents (with `_id` and `__v`) to domain entities (with `id`). When these entities were returned to the API, they lost the MongoDB-specific fields that the frontend expected.

## Changes Made

### 1. Repository Changes

Modified all repositories to return raw Mongoose documents instead of mapped domain entities for API responses:

#### Tag Repository
- **File**: `src/infrastructure/persistence/mongoose/repositories/tag.repository.ts`
- **Change**: `findAll()` now returns `any[]` (raw Mongoose documents) instead of `TagEntity[]`
- **Reason**: Preserves `_id` and `__v` fields

#### Course Repository
- **File**: `src/infrastructure/persistence/mongoose/repositories/course.repository.ts`
- **Changes**:
  - `findAll()`, `findById()`, `create()`, `update()` now return raw Mongoose documents
  - `delete()` now returns `{message: 'Subject deleted successfully'}` instead of `boolean`
- **Reason**: Preserves nested populated objects with `_id` and `__v` fields

#### Subject Repository
- **File**: `src/infrastructure/persistence/mongoose/repositories/subject.repository.ts`
- **Changes**:
  - `findAll()`, `findById()`, `create()`, `update()` now return raw Mongoose documents
  - `delete()` now returns `{message: 'Subject deleted successfully'}` instead of `boolean`
- **Reason**: Preserves nested populated objects and proper response format

#### Display-Text Repository
- **File**: `src/infrastructure/persistence/mongoose/repositories/display-text.repository.ts`
- **Changes**:
  - All methods now return raw Mongoose documents instead of domain entities
- **Reason**: Preserves `_id` and `__v` fields

### 2. Interface Updates

Updated repository interfaces to match the new return types:

- `src/domain/repositories/tag-repository.interface.ts`
- `src/domain/repositories/course-repository.interface.ts`
- `src/domain/repositories/subject-repository.interface.ts`
- `src/domain/repositories/display-text-repository.interface.ts`

All changed from returning domain entities to returning `any` (raw Mongoose documents).

### 3. Display-Text Orphan Detection Fix

- **File**: `src/application/use-cases/display-text/find-unused-display-texts.use-case.ts`
- **Change**: Added logic to check if display texts without `uiKey` are actually referenced in subjects/courses
- **Reason**: Previously returned all display texts without `uiKey`, even if they were in use

### 4. Module Configuration

- **File**: `src/application/application.module.ts`
- **Change**: Added MongooseModule imports for Subject and Course schemas
- **Reason**: Allows the FindUnusedDisplayTextsUseCase to access the models for orphan detection

### 5. Test Suite

- **File**: `src/presentation/controllers/format-validation.spec.ts`
- **Purpose**: Comprehensive test suite that validates API responses match the expected format
- **Tests**:
  - Tag endpoints return `_id` and `__v`
  - Course endpoints return nested objects with proper structure
  - Subject endpoints return nested objects with proper structure
  - Display-text endpoints return `_id` and `__v`
  - Delete endpoints return message objects
  - Updated existing test in `tag.controller.spec.ts` to check for `_id` and `__v`

## Verification

All format validation tests pass:

```bash
npm test -- format-validation
```

Results:
- ✓ GET /tag should return _id and __v fields
- ✓ POST /course should return nested title/description/tags objects with _id and __v
- ✓ DELETE /course/:uuid should return success message, not boolean
- ✓ GET /subjects/:uuid should return nested objects with _id and __v
- ✓ DELETE /subjects/:uuid should return success message, not boolean
- ✓ GET /display-text should return _id and __v fields, not id
- ✓ PATCH /display-text/:key should return _id and __v fields

## Expected API Responses

### Tags
```json
[
    {
        "_id": "68f0c8c484d21988f4d62748",
        "tagName": "test",
        "__v": 0
    }
]
```

### Courses
```json
{
    "_id": "694a779070f5bba24b3aa46f",
    "uuid": "7ec32e82-61d7-4f58-93af-f1b3c769aaa8",
    "title": {
        "_id": "68f9035b7d954953ea6be77d",
        "dutch": "Kunstacademie",
        "english": "Art Academy",
        "__v": 0
    },
    "description": {
        "_id": "68f9035b7d954953ea6be774",
        "dutch": "Een creatieve studie",
        "english": "A creative study",
        "__v": 0
    },
    "languages": ["NL", "EN"],
    "tags": [
        {
            "_id": "68f9035b7d954953ea6be776",
            "tagName": "sculpture",
            "__v": 0
        }
    ],
    "__v": 0
}
```

### Delete Operations
```json
{
    "message": "Subject deleted successfully"
}
```

### Display Texts
```json
{
    "_id": "694a9f6a70f5bba24b3aa5e3",
    "dutch": "test.text (nieuw)",
    "english": "test.text (new)",
    "creatorUuid": "169ad315-039c-4d10-8cde-a0ae5c449d20",
    "uiKey": "test.text",
    "__v": 0
}
```

## Notes

- The changes maintain the onion architecture's separation of concerns
- Domain entities still exist and can be used for business logic
- Only the API layer now returns raw Mongoose documents to maintain backwards compatibility
- The mappers are still available if needed for internal operations
- This approach prioritizes API compatibility while preserving the architectural pattern
