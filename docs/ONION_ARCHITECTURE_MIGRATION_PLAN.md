# Onion Architecture Migration Plan

## Current State Assessment

### Already Migrated to Onion Architecture
- ✅ Subject module (use cases, repository, entities)
- ✅ Course module (partial - has use cases but still has old service)
- ✅ User module (partial - has use cases but still has old service)

### Not Yet Migrated
- ❌ Tag module - still uses old service pattern
- ❌ DisplayText module - still uses old service pattern
- ❌ Auth module - still uses old service pattern
- ❌ Favourites functionality - still in old SubjectsService
- ❌ Recommended subjects functionality - still in old SubjectsService

### Architectural Violations (CRITICAL - Already in "Onion" Code!)

#### 🚨 Violation 1: Application → Infrastructure (Old Services)
**Files violating this rule:**
- `src/application/use-cases/subject/create-subject.use-case.ts` - imports `TagService`, `DisplayTextService`
- `src/application/use-cases/subject/update-subject.use-case.ts` - imports `TagService`, `DisplayTextService`, `SubjectsService`
- `src/application/use-cases/subject/delete-subject.use-case.ts` - imports `SubjectsService`
- `src/application/use-cases/subject/list-subjects.use-case.ts` - imports `TagService`
- `src/application/use-cases/course/create-course.use-case.ts` - imports `TagService`, `DisplayTextService`
- `src/application/use-cases/course/update-course.use-case.ts` - imports `TagService`, `DisplayTextService`, `CourseService`
- `src/application/use-cases/course/delete-course.use-case.ts` - imports `CourseService`

**Problem:** Use cases are importing services from old feature folders (`src/tag/`, `src/display-text/`, etc.) which violates onion architecture. The application layer should ONLY depend on domain layer interfaces.

#### 🚨 Violation 2: Application → Infrastructure (Direct Mongoose Usage)
**Files violating this rule:**
- `src/application/use-cases/subject/create-subject.use-case.ts` - imports `Types` from `'mongoose'`
- `src/application/use-cases/subject/update-subject.use-case.ts` - imports `Types` from `'mongoose'`
- `src/application/use-cases/course/create-course.use-case.ts` - imports `Types` from `'mongoose'`
- `src/application/use-cases/course/update-course.use-case.ts` - imports `Types` from `'mongoose'`
- `src/application/use-cases/display-text/find-unused-display-texts.use-case.ts` - imports `Model` from `'mongoose'` AND uses `@InjectModel()`

**Problem:** Application layer is directly importing and using Mongoose types and decorators. This tightly couples the use cases to a specific database implementation.

#### 🚨 Violation 3: Application → Infrastructure (Mongoose Schemas)
**Files violating this rule:**
- `src/application/use-cases/subject/create-subject.use-case.ts` - imports `Subject` from `'../../../subjects/schemas/subject.schema'`
- `src/application/use-cases/course/create-course.use-case.ts` - imports `Course` from `'../../../course/schema/course.schema'`
- `src/application/use-cases/display-text/find-unused-display-texts.use-case.ts` - imports schemas from `subjects/schemas/` and `course/schema/`
- `src/application/application.module.ts` - imports `Subject, SubjectSchema` from `'../subjects/schemas/subject.schema'`
- `src/casl/casl-ability.factory/casl-ability.factory.ts` - imports `User` from `'../../users/schemas/user.schema'`

**Problem:** Application layer is importing Mongoose schemas (infrastructure concern) instead of using domain entities. Schemas should only be used in the infrastructure layer.

#### 🚨 Violation 4: Application Uses @InjectModel Directly
**Files violating this rule:**
- `src/application/use-cases/display-text/find-unused-display-texts.use-case.ts`:
  - Line 13: `@InjectModel(Subject.name) private subjectModel: Model<Subject>`
  - Line 14: `@InjectModel(Course.name) private courseModel: Model<Course>`

**Problem:** A use case is directly injecting Mongoose models, completely bypassing the repository pattern. This should use repositories instead.

### Summary of Violations

1. **Old Services Still Exist**: Services in `src/course/`, `src/subjects/`, `src/tag/`, `src/display-text/`, `src/users/` directly inject Mongoose models with `@InjectModel()`
2. **Use Cases Depend on Old Services**: Application layer imports `TagService`, `DisplayTextService`, `UsersService` instead of using repositories
3. **Use Cases Import Mongoose Directly**: `Types`, `Model` imported from mongoose package
4. **Use Cases Use @InjectModel**: Direct Mongoose model injection in use cases
5. **Schemas in Wrong Location**: Mongoose schemas are in feature folders instead of `infrastructure/persistence/mongoose/models/`
6. **Application Imports Schemas**: Use cases and modules import Mongoose schemas for CASL authorization
7. **DTOs Scattered**: DTOs exist in both old feature folders and `application/dto/`
8. **Mixed Controller Dependencies**: Controllers inject both use cases and old services

---

## Migration Strategy

### Phase 0: Fix Existing Onion Architecture Violations (CRITICAL - DO THIS FIRST!)

These are violations in code that's supposedly already following onion architecture. Must be fixed before proceeding with new migrations.

#### 0.1: Remove Mongoose Types from Use Cases

**Problem:** Use cases import `Types` and `Model` from mongoose.

**Files to fix:**
- `src/application/use-cases/subject/create-subject.use-case.ts`
- `src/application/use-cases/subject/update-subject.use-case.ts`
- `src/application/use-cases/course/create-course.use-case.ts`
- `src/application/use-cases/course/update-course.use-case.ts`

**Solution:**
1. Remove `import { Types } from 'mongoose'`
2. Change `Types.ObjectId[]` to `string[]` in use case code
3. Let the repositories handle ObjectId conversion internally
4. Use plain strings for IDs throughout the application layer

**Example:**
```typescript
// BEFORE (wrong):
import { Types } from 'mongoose';
const tagIds: Types.ObjectId[] = [];

// AFTER (correct):
const tagIds: string[] = [];
```

#### 0.2: Remove Schema Imports from Use Cases and CASL

**Problem:** Use cases and CASL factory import Mongoose schemas for authorization checks.

**Files to fix:**
- `src/application/use-cases/subject/create-subject.use-case.ts` (line 12)
- `src/application/use-cases/course/create-course.use-case.ts` (line 12)
- `src/casl/casl-ability.factory/casl-ability.factory.ts` (line 8)

**Solution:**
1. In use cases: Use the domain entity classes for CASL checks instead of schemas
2. Update CASL factory to accept only domain entities

**Example for create-subject.use-case.ts:**
```typescript
// BEFORE (wrong):
import { Subject as SubjectSchema } from '../../../subjects/schemas/subject.schema';
if (!ability.can(CaslAction.Create, SubjectSchema)) {

// AFTER (correct):
import { Subject } from '../../../domain/entities/subject.entity';
if (!ability.can(CaslAction.Create, Subject)) {
```

**For CaslAbilityFactory:**
```typescript
// BEFORE (wrong):
import { User as LegacyUser } from "../../users/schemas/user.schema";
createForUser(user: User | LegacyUser)

// AFTER (correct):
createForUser(user: User)  // Only accept domain entity
```

#### 0.3: Fix FindUnusedDisplayTextsUseCase

**Problem:** This use case directly injects Mongoose models with `@InjectModel()`.

**File:** `src/application/use-cases/display-text/find-unused-display-texts.use-case.ts`

**Solution:**
1. Remove `@InjectModel()` injections
2. Remove `Model` import from mongoose
3. Create repository methods to handle the queries:
   - Add `findAllSubjectReferences()` to subject repository
   - Add `findAllCourseReferences()` to course repository
4. Inject and use repositories instead

**Example:**
```typescript
// BEFORE (wrong):
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
constructor(
  @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  @InjectModel(Course.name) private courseModel: Model<Course>,
) {}

// AFTER (correct):
constructor(
  @Inject(SUBJECT_REPOSITORY) private readonly subjectRepository: ISubjectRepository,
  @Inject(COURSE_REPOSITORY) private readonly courseRepository: ICourseRepository,
) {}
```

Add to subject-repository.interface.ts:
```typescript
findAllReferences(): Promise<{ titleId: string; descriptionId: string; moreInfoId: string }[]>
```

#### 0.4: Remove Schema Import from Application Module

**Problem:** Application module imports Mongoose schemas.

**File:** `src/application/application.module.ts` (line 48)

**Solution:**
1. Remove: `import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema'`
2. Remove from `MongooseModule.forFeature([...])` - this should only be in infrastructure module
3. If needed for CASL, use domain entities instead

---

### Phase 1: Create Missing Repositories and Entities

#### 1.1 Tag Module Migration

**Step 1.1.1: Create Domain Entity**
- Location: `src/domain/entities/tag.entity.ts`
- Create a `Tag` entity class with:
  - `uuid: string`
  - `name: string`
  - Static factory method: `Tag.create()`
  - Validation logic (no business logic here)

**Step 1.1.2: Create Repository Interface**
- Location: `src/domain/repositories/tag-repository.interface.ts`
- Define interface with methods:
  - `findAll(): Promise<Tag[]>`
  - `findByUuid(uuid: string): Promise<Tag>`
  - `findByName(name: string): Promise<Tag | null>`
  - `create(tag: Tag): Promise<Tag>`
  - `delete(uuid: string): Promise<void>`
  - Export token: `export const TAG_REPOSITORY = 'TAG_REPOSITORY'`

**Step 1.1.3: Move Mongoose Schema**
- Move `src/tag/schemas/tag.schema.ts` → `src/infrastructure/persistence/mongoose/models/tag.model.ts`
- Update class name from `Tag` to `TagModel` (avoid naming conflicts with entity)
- Keep `@Schema()` decorator and properties

**Step 1.1.4: Create Mapper**
- Location: `src/infrastructure/persistence/mongoose/mappers/tag.mapper.ts`
- Create `TagMapper` class with:
  - `toDomain(model: TagModel): Tag` - converts Mongoose model to domain entity
  - `toPersistence(entity: Tag): Partial<TagModel>` - converts domain entity to Mongoose data

**Step 1.1.5: Create Repository Implementation**
- Location: `src/infrastructure/persistence/mongoose/repositories/tag.repository.ts`
- Implement `ITagRepository` interface
- Use `@InjectModel(TagModel.name)`
- Use `TagMapper` for conversions
- Return raw Mongoose documents where needed (for backward compatibility)

**Step 1.1.6: Move DTOs**
- Move all DTOs from `src/tag/dto/` → `src/application/dto/tag/`
- Update imports throughout codebase

#### 1.2 DisplayText Module Migration

**Step 1.2.1: Create Domain Entity**
- Location: `src/domain/entities/display-text.entity.ts`
- Create `DisplayText` entity with:
  - `uuid: string`
  - `en: string`
  - `nl: string`
  - `ownerUuid: string`
  - Static factory: `DisplayText.create()`

**Step 1.2.2: Create Repository Interface**
- Location: `src/domain/repositories/display-text-repository.interface.ts`
- Define methods:
  - `findByUuid(uuid: string): Promise<DisplayText>`
  - `findByTranslations(nl: string, en: string): Promise<DisplayText | null>`
  - `create(displayText: DisplayText): Promise<DisplayText>`
  - `update(uuid: string, data: Partial<DisplayText>): Promise<DisplayText>`
  - `massUpdate(updates: Array<{uuid: string, nl?: string, en?: string}>): Promise<void>`
  - Export token: `export const DISPLAY_TEXT_REPOSITORY = 'DISPLAY_TEXT_REPOSITORY'`

**Step 1.2.3: Move Mongoose Schema**
- Move `src/display-text/schemas/display-text.schema.ts` → `src/infrastructure/persistence/mongoose/models/display-text.model.ts`
- Rename class to `DisplayTextModel`

**Step 1.2.4: Create Mapper**
- Location: `src/infrastructure/persistence/mongoose/mappers/display-text.mapper.ts`
- Implement `toDomain()` and `toPersistence()`

**Step 1.2.5: Create Repository Implementation**
- Location: `src/infrastructure/persistence/mongoose/repositories/display-text.repository.ts`
- Implement all interface methods
- Handle `lookupByTranslations` logic (create if not exists)

**Step 1.2.6: Move DTOs**
- Move DTOs from `src/display-text/dto/` → `src/application/dto/display-text/`

#### 1.3 User Module Migration

**Note**: User module may already have entity and repository. Verify and complete if partial.

**Step 1.3.1: Verify Domain Entity Exists**
- Check `src/domain/entities/user.entity.ts`
- Ensure it has all properties: `uuid`, `email`, `name`, `role`, `favourites`

**Step 1.3.2: Verify Repository Interface**
- Check `src/domain/repositories/user-repository.interface.ts`
- Ensure methods exist:
  - `findByUuid(uuid: string): Promise<User>`
  - `findByEmail(email: string): Promise<User | null>`
  - `create(user: User): Promise<User>`
  - `update(uuid: string, data: Partial<User>): Promise<User>`
  - `addFavourite(userUuid: string, subjectUuid: string): Promise<void>`
  - `removeFavourite(userUuid: string, subjectUuid: string): Promise<void>`
  - `findFavouriteSubjects(userUuid: string): Promise<any[]>`

**Step 1.3.3: Move Schema if Not Done**
- Move `src/users/schemas/user.schema.ts` → `src/infrastructure/persistence/mongoose/models/user.model.ts` if not already moved

**Step 1.3.4: Create/Verify Mapper**
- Verify `src/infrastructure/persistence/mongoose/mappers/user.mapper.ts` exists

**Step 1.3.5: Create/Verify Repository Implementation**
- Verify `src/infrastructure/persistence/mongoose/repositories/user.repository.ts` implements all methods

**Step 1.3.6: Move DTOs**
- Move DTOs from `src/users/dto/` → `src/application/dto/user/` if not done

---

### Phase 2: Create Use Cases

#### 2.1 Tag Use Cases

**Step 2.1.1: Create Use Cases**
Create in `src/application/use-cases/tag/`:
- `get-tag.use-case.ts` - Get tag by UUID
- `list-tags.use-case.ts` - List all tags
- `create-tag.use-case.ts` - Create new tag (with authorization check)
- `delete-tag.use-case.ts` - Delete tag (with authorization check)
- `lookup-tag-by-name.use-case.ts` - Find tag by name, optionally create if not found
- `index.ts` - Export all use cases

**Step 2.1.2: Dependencies**
Each use case should only depend on:
- `@Inject(TAG_REPOSITORY)` for data access
- `GetUserUseCase` for user lookups (if needed for authorization)
- `CaslAbilityFactory` for authorization
- NO imports of old services

#### 2.2 DisplayText Use Cases

**Step 2.2.1: Create Use Cases**
Create in `src/application/use-cases/display-text/`:
- `get-display-text.use-case.ts` - Get by UUID
- `list-display-texts.use-case.ts` - List with filters
- `create-display-text.use-case.ts` - Create new display text
- `update-display-text.use-case.ts` - Update existing
- `mass-update-display-text.use-case.ts` - Batch update
- `lookup-display-text-by-translations.use-case.ts` - Find by translations, create if needed
- `index.ts` - Export all

**Step 2.2.2: Authorization**
Add CASL authorization checks where appropriate (e.g., only owners can update their display texts)

#### 2.3 User Use Cases

**Step 2.3.1: Create Missing Use Cases**
If not already exist, create in `src/application/use-cases/user/`:
- `get-user.use-case.ts` - ✅ May already exist
- `add-favourite.use-case.ts` - Add subject to favourites
- `remove-favourite.use-case.ts` - Remove subject from favourites
- `get-favourites.use-case.ts` - Get user's favourite subjects
- `get-recommended-subjects.use-case.ts` - Get subjects based on user's tags
- Update `index.ts`

#### 2.4 Subject Use Cases (Additional)

**Step 2.4.1: Create Remaining Use Cases**
- `get-recommended-subjects.use-case.ts` - Find subjects with similar tags to user's favourites
- Move logic from `SubjectsService.findSubjectsBySimilarTags()`

---

### Phase 3: Update Existing Use Cases

#### 3.1 Remove Dependencies on Old Services

**CRITICAL:** This is the main fix for the Application → Infrastructure violation.

**Files to Update:**
- `src/application/use-cases/subject/create-subject.use-case.ts`
- `src/application/use-cases/subject/update-subject.use-case.ts`
- `src/application/use-cases/subject/delete-subject.use-case.ts`
- `src/application/use-cases/subject/list-subjects.use-case.ts`
- `src/application/use-cases/course/create-course.use-case.ts`
- `src/application/use-cases/course/update-course.use-case.ts`
- `src/application/use-cases/course/delete-course.use-case.ts`

**Changes Required:**

**1. Remove all old service imports:**
```typescript
// DELETE these lines:
import { TagService } from '../../../tag/tag.service';
import { DisplayTextService } from '../../../display-text/display-text.service';
import { SubjectsService } from '../../../subjects/subjects.service';
import { CourseService } from '../../../course/course.service';
```

**2. Import use cases instead:**
```typescript
// ADD these lines:
import { LookupTagByNameUseCase } from '../tag/lookup-tag-by-name.use-case';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-display-text-by-translations.use-case';
```

**3. Update constructor injections:**
```typescript
// BEFORE (wrong):
constructor(
  @Inject(SUBJECT_REPOSITORY)
  private readonly subjectRepository: ISubjectRepository,
  private readonly tagService: TagService,  // ❌ Wrong
  private readonly displayTextService: DisplayTextService,  // ❌ Wrong
) {}

// AFTER (correct):
constructor(
  @Inject(SUBJECT_REPOSITORY)
  private readonly subjectRepository: ISubjectRepository,
  private readonly lookupTagByNameUseCase: LookupTagByNameUseCase,  // ✅ Correct
  private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,  // ✅ Correct
) {}
```

**4. Update method calls:**
```typescript
// BEFORE (wrong):
const tag = await this.tagService.lookupByName(tagName, true);

// AFTER (correct):
const tag = await this.lookupTagByNameUseCase.execute(tagName, true);
```

```typescript
// BEFORE (wrong):
const title = await this.displayTextService.lookupByTranslations(
  dto.titleNL,
  dto.titleEN,
  true,
  userUuid
);

// AFTER (correct):
const title = await this.lookupDisplayTextUseCase.execute({
  nl: dto.titleNL,
  en: dto.titleEN,
  createIfNotExists: true,
  ownerUuid: userUuid
});
```

**5. Remove Mongoose Types usage:**
```typescript
// BEFORE (wrong):
import { Types } from 'mongoose';
const tagIds: Types.ObjectId[] = [];
tagIds.push(tag);

// AFTER (correct):
const tagIds: string[] = [];
tagIds.push(tag._id?.toString() || tag.uuid);  // Adjust based on what the use case returns
```

**6. For delete use cases, remove service dependencies:**
```typescript
// In delete-subject.use-case.ts and delete-course.use-case.ts
// BEFORE (wrong):
constructor(
  @Inject(SUBJECT_REPOSITORY)
  private readonly subjectRepository: ISubjectRepository,
  private readonly subjectsService: SubjectsService,  // ❌ Wrong
) {}

// AFTER (correct):
constructor(
  @Inject(SUBJECT_REPOSITORY)
  private readonly subjectRepository: ISubjectRepository,
) {}

// Then use repository methods instead of service methods
```

#### 3.2 Update list-subjects.use-case.ts

**File:** `src/application/use-cases/subject/list-subjects.use-case.ts`

**Current violation:** Imports `TagService` to find tags by name.

**Fix:**
```typescript
// BEFORE (wrong):
constructor(
  @Inject(SUBJECT_REPOSITORY)
  private readonly subjectRepository: ISubjectRepository,
  private readonly tagService: TagService,  // ❌ Wrong
) {}

async execute(level?, studyPoints?, tagName?) {
  let tagId = undefined;
  if (tagName) {
    const tag = await this.tagService.lookupByName(tagName, false);
    tagId = tag?._id?.toString();
  }
  // ...
}

// AFTER (correct):
constructor(
  @Inject(SUBJECT_REPOSITORY)
  private readonly subjectRepository: ISubjectRepository,
  @Inject(TAG_REPOSITORY)
  private readonly tagRepository: ITagRepository,  // ✅ Correct
) {}

async execute(level?, studyPoints?, tagName?) {
  let tagId = undefined;
  if (tagName) {
    const tag = await this.tagRepository.findByName(tagName);
    tagId = tag?.uuid;  // Use entity property
  }
  // ...
}
```

---

### Phase 4: Update Controllers

#### 4.1 Tag Controller

**Location:** `src/presentation/controllers/tag.controller.ts`

**Changes:**
1. Remove `TagService` injection
2. Inject use cases:
   - `ListTagsUseCase`
   - `CreateTagUseCase`
   - `DeleteTagUseCase`
3. Update all methods to call use cases instead of service
4. Keep controller thin - no business logic

#### 4.2 DisplayText Controller

**Location:** `src/presentation/controllers/display-text.controller.ts`

**Changes:**
1. Remove `DisplayTextService` injection
2. Inject use cases:
   - `ListDisplayTextsUseCase`
   - `UpdateDisplayTextUseCase`
   - `MassUpdateDisplayTextUseCase`
3. Update all methods

#### 4.3 Subjects Controller

**Location:** `src/presentation/controllers/subjects.controller.ts`

**Changes:**
1. Remove `SubjectsService` injection
2. Add use cases for favourites:
   - `AddFavouriteUseCase`
   - `RemoveFavouriteUseCase`
   - `GetFavouritesUseCase`
   - `GetRecommendedSubjectsUseCase`
3. Update methods:
   - `getFavourites()` → call `GetFavouritesUseCase`
   - `findSubjectsBySimilarTags()` → call `GetRecommendedSubjectsUseCase`
   - `setFavourite()` → call `AddFavouriteUseCase`
   - `removeFavourite()` → call `RemoveFavouriteUseCase`

#### 4.4 Course Controller

**Location:** `src/presentation/controllers/course.controller.ts` (if exists)

**Changes:**
1. Remove `CourseService` injection
2. Inject all course use cases
3. Update all method calls

#### 4.5 Users Controller

**Location:** `src/presentation/controllers/users.controller.ts` (if exists)

**Changes:**
1. Remove `UsersService` injection
2. Inject user use cases
3. Update all method calls

---

### Phase 5: Update Modules

#### 5.1 Infrastructure Module

**File:** `src/infrastructure/persistence/persistence.module.ts`

**Add Providers:**
```typescript
{
  provide: TAG_REPOSITORY,
  useClass: TagRepository,
},
{
  provide: DISPLAY_TEXT_REPOSITORY,
  useClass: DisplayTextRepository,
},
{
  provide: USER_REPOSITORY,
  useClass: UserRepository,
},
```

**Register Mongoose Models:**
- Import all model classes from `models/` directory
- Add to `MongooseModule.forFeature([...])`:
  - `TagModel`
  - `DisplayTextModel`
  - `UserModel`
  - (Any others not yet registered)

**Exports:**
- Export repository tokens so they can be injected in application layer

#### 5.2 Application Module

**File:** `src/application/application.module.ts`

**Add Use Case Providers:**
- All Tag use cases
- All DisplayText use cases
- All User use cases
- All Subject use cases (verify all are included)
- All Course use cases (verify all are included)

**Exports:**
- Export all use cases

**Remove Old Service Imports:**
- Remove imports of old service modules (after migration is complete)

#### 5.3 Update Feature Modules

**For each module (tag, display-text, users, subjects, course):**

1. **Remove `@Module` decorator** or mark as deprecated
2. **Update imports in app.module.ts**:
   - Remove old feature module imports
   - Ensure `ApplicationModule` is imported
   - Ensure `PersistenceModule` is imported

---

### Phase 6: Clean Up Old Code

**Only perform after Phase 5 is complete and tested!**

#### 6.1 Delete Old Service Files

Delete the following files:
- `src/tag/tag.service.ts`
- `src/tag/tag.service.spec.ts`
- `src/display-text/display-text.service.ts`
- `src/display-text/display-text.service.spec.ts`
- `src/users/users.service.ts`
- `src/users/users.service.spec.ts`
- `src/subjects/subjects.service.ts`
- `src/subjects/subjects.service.spec.ts`
- `src/course/course.service.ts`
- `src/course/course.service.spec.ts`

#### 6.2 Delete Old Module Files

If no longer needed:
- `src/tag/tag.module.ts`
- `src/display-text/display-text.module.ts`
- `src/users/users.module.ts`
- `src/subjects/subjects.module.ts`
- `src/course/course.module.ts`

#### 6.3 Delete Empty Directories

Remove old feature directories if empty:
- `src/tag/` (if only dto/ remains, those should be in application/)
- `src/display-text/`
- `src/users/`
- `src/subjects/`
- `src/course/`

#### 6.4 Update Imports

Search entire codebase for imports of old services and update:
- Auth module might still import old services
- Test files might need updates

---

### Phase 7: Update Auth Module (If Needed)

#### 7.1 Review Auth Dependencies

**File:** `src/auth/auth.service.ts`

**Check if it imports:**
- `UsersService` - Replace with `GetUserUseCase` or repository
- Any other old services

**Update to:**
```typescript
constructor(
  @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  // or inject GetUserUseCase if more complex logic needed
) {}
```

---

## Testing Strategy

### After Phase 0 (Critical Fixes):
Run architecture verification checks to ensure violations are fixed:
```bash
# These should return NO results after Phase 0
grep -r "import.*from 'mongoose'" src/application/
grep -r "@InjectModel" src/application/
grep -r "import.*Service.*from.*'\.\./\.\./\.\./" src/application/use-cases/
grep -r "import.*from.*schemas/" src/application/
grep -r "import.*from.*schema/" src/application/
```

### After Each Phase:

1. **Run Unit Tests:**
   ```bash
   npm test
   ```

2. **Run E2E Tests:**
   ```bash
   npm run test:e2e
   ```

3. **Manual Testing:**
   - Test all CRUD operations for the migrated module
   - Test authorization (CASL)
   - Test error cases

4. **Verify No Circular Dependencies:**
   ```bash
   npm run build
   ```

### Integration Testing Checklist:

- [ ] Tag operations (create, list, delete, lookup by name)
- [ ] DisplayText operations (create, update, mass update, lookup by translations)
- [ ] User operations (get, update, favourites)
- [ ] Subject operations (create, update, delete, list, get, favourites, recommended)
- [ ] Course operations (create, update, delete, list, get)
- [ ] Authentication and authorization work correctly
- [ ] All relationships populate correctly (tags, display texts)

---

## Verification: Architecture is Correct

### Onion Architecture Principles:

1. **Domain Layer (innermost)**
   - ✅ Contains only entities and repository interfaces
   - ✅ NO dependencies on outer layers
   - ✅ NO framework dependencies (NestJS, Mongoose)

2. **Application Layer**
   - ✅ Contains use cases and DTOs
   - ✅ Depends ONLY on domain layer (entities and repository interfaces)
   - ✅ NO dependencies on infrastructure or presentation
   - ✅ NO direct Mongoose usage

3. **Infrastructure Layer**
   - ✅ Contains repository implementations, Mongoose models, mappers
   - ✅ Depends on domain layer (implements repository interfaces)
   - ✅ CAN depend on frameworks (Mongoose, NestJS)

4. **Presentation Layer**
   - ✅ Contains controllers
   - ✅ Depends ONLY on application layer (use cases, DTOs)
   - ✅ NO dependencies on infrastructure
   - ✅ NO direct repository or service usage

### Dependency Rules (must be enforced):

```
Presentation (Controllers)
    ↓ (depends on)
Application (Use Cases, DTOs)
    ↓ (depends on)
Domain (Entities, Repository Interfaces)
    ↑ (implemented by)
Infrastructure (Repositories, Models, Mappers)
```

**NEVER allowed:**
- Application → Infrastructure
- Presentation → Infrastructure
- Presentation → Domain
- Domain → Application
- Domain → Infrastructure

### Checklist:

Run these searches to verify no violations:

```bash
# ❌ Check use cases don't import old services (should return 0 matches)
grep -r "import.*\(TagService\|DisplayTextService\|UsersService\|SubjectsService\|CourseService\)" src/application/use-cases/

# ❌ Check use cases don't import Mongoose (should return 0 matches)
grep -r "import.*from 'mongoose'" src/application/

# ❌ Check use cases don't use @InjectModel (should return 0 matches)
grep -r "@InjectModel" src/application/

# ❌ Check application doesn't import schemas (should return 0 matches)
grep -r "import.*from.*\(schemas\|schema\)/" src/application/

# ❌ Check CASL doesn't import schemas (should return 0 matches)
grep -r "import.*from.*schemas/" src/casl/

# ❌ Check controllers don't import repositories (should return 0 matches)
grep -r "Repository.*from.*infrastructure" src/presentation/

# ❌ Check controllers don't import old services (should return 0 matches, except auth.service temporarily)
grep -r "import.*\(TagService\|DisplayTextService\|UsersService\|SubjectsService\|CourseService\).*from" src/presentation/controllers/

# ❌ Check domain doesn't import anything except types (should return 0 matches)
grep -r "import.*from" src/domain/ | grep -v "'\.\/" | grep -v "^Binary file"

# ✅ Verify repositories ARE in infrastructure (should return matches)
ls -la src/infrastructure/persistence/mongoose/repositories/

# ✅ Verify entities ARE in domain (should return matches)
ls -la src/domain/entities/

# ✅ Verify use cases ARE in application (should return matches)
ls -la src/application/use-cases/
```

**Success Criteria:** All commands marked with ❌ should return **zero matches**. Commands marked with ✅ should return files.

---

## Rollback Plan

If migration causes critical issues:

1. **Git is your friend** - commit after each phase
2. **Revert last commit:**
   ```bash
   git revert HEAD
   ```
3. **Or reset to before migration:**
   ```bash
   git reset --hard <commit-before-migration>
   ```

---

## Priority Order for Migration

Given the architectural violations found, here's the updated priority:

### 🔥 CRITICAL (Fix Immediately):
**Phase 0 - Fix existing violations in "onion" code:**
1. Remove Mongoose imports from use cases (`Types`, `Model`)
2. Remove schema imports from use cases and CASL factory
3. Fix `FindUnusedDisplayTextsUseCase` to use repositories
4. Remove schema import from application module

### 1. **High Priority** (blocks proper onion architecture):
**Phase 1 & 2 - Create missing pieces:**
- Tag repository and use cases (needed by ALL use cases)
- DisplayText repository and use cases (needed by ALL use cases)

**Phase 3 - Fix use case dependencies:**
- Update all subject use cases to use new tag/displaytext use cases
- Update all course use cases to use new tag/displaytext use cases

### 2. **Medium Priority** (complete migration):
**Phase 4 & 5:**
- Update controllers to remove old service dependencies
- User favourites and recommendations functionality
- Update all modules for proper DI

### 3. **Low Priority** (cleanup):
**Phase 6 & 7:**
- Delete old service files
- Clean up empty directories
- Auth module refactoring (if needed)
- Test file updates

---

## Success Criteria

Migration is complete when:

1. ✅ **Phase 0 violations fixed:**
   - No Mongoose imports in application layer
   - No schema imports in application layer or CASL
   - No `@InjectModel` in use cases
   - Application module doesn't register Mongoose models

2. ✅ **Repository pattern complete:**
   - All repositories implemented (Tag, DisplayText, User, Subject, Course)
   - All repositories in `infrastructure/persistence/mongoose/repositories/`
   - All repository interfaces in `domain/repositories/`

3. ✅ **Use cases properly structured:**
   - No use case imports old services
   - All use cases depend only on repositories and other use cases
   - All use cases in `application/use-cases/`

4. ✅ **Controllers properly structured:**
   - All controllers depend only on use cases
   - No controller imports repositories or services directly
   - All controllers in `presentation/controllers/`

5. ✅ **Old code removed:**
   - No files exist in old service locations (`src/tag/tag.service.ts`, etc.)
   - All schemas moved to `infrastructure/persistence/mongoose/models/`
   - All DTOs moved to `application/dto/`

6. ✅ **Tests pass:**
   - All unit tests pass
   - All E2E tests pass
   - No circular dependencies

7. ✅ **Architecture compliance:**
   - All architecture verification searches return no violations
   - Dependency graph flows correctly (Presentation → Application → Domain ← Infrastructure)

8. ✅ **Functionality preserved:**
   - All API endpoints work as before
   - Authorization works correctly
   - CRUD operations work for all entities

---

## Notes for AI Executing This Plan

- **Work phase by phase** - complete one phase before moving to the next
- **Commit after each major step** for easy rollback
- **Update imports immediately** after moving files
- **Test frequently** - run tests after each module migration
- **Keep backward compatibility** during migration - don't break working features
- **Use same patterns** as existing use cases and repositories
- **Maintain consistent naming**: `ModelName.entity.ts`, `model-name.repository.ts`, `action-model-name.use-case.ts`
- **Copy authorization patterns** from existing use cases
- **Handle async operations properly** - use `await` with `for...of` loops when processing arrays
- **Populate Mongoose relations** in repositories as needed for API responses
- **Return raw Mongoose documents** from repositories when they need `_id` and `__v` fields for frontend compatibility

---

## Additional Resources

- Current onion architecture examples:
  - Subject module: `src/application/use-cases/subject/`
  - Subject repository: `src/infrastructure/persistence/mongoose/repositories/subject.repository.ts`
  - Subject entity: `src/domain/entities/subject.entity.ts`

- Follow these patterns exactly for consistency
