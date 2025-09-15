# Fix TypeScript `any` Type Errors - Simple Prompt

## Quick Fix Prompt for Cursor AI:

```
Please fix all TypeScript `any` type errors in my codebase. For each `any` type, replace it with the most appropriate specific type:

1. **Function parameters**: Use proper interface or type
2. **API responses**: Create interfaces for response objects
3. **Event handlers**: Use proper React event types
4. **Object properties**: Define interfaces for object shapes
5. **Array elements**: Use generic types like `Array<Type>`

Examples of common fixes:
- `(data: any)` → `(data: MovieData)`
- `response: any` → `response: ApiResponse`
- `(e: any)` → `(e: React.ChangeEvent<HTMLInputElement>)`
- `items: any[]` → `items: Movie[]`

Create new interfaces when needed. Make types as specific as possible while maintaining functionality.
```

## Manual Steps:

1. **Run this prompt in Cursor AI**
2. **Review each suggested change**
3. **Create interfaces for complex objects**
4. **Test that functionality still works**

## Common Patterns to Look For:

- `any` in function parameters
- `any` in API response handling
- `any` in event handlers
- `any` in object destructuring
- `any` in array operations

## Files with `any` types that need fixing:
- `app/test-api/page.tsx` (line 6)
- `app/test-hero-filtering/page.tsx` (lines 8, 9, 10)
- `app/test-movie-tt0000758/page.tsx` (line 9)
- `app/test-movie/page.tsx` (lines 7, 58)

Just copy the prompt above and paste it into Cursor AI to automatically fix all `any` type errors!
