# JSON Infinite Recursion Problem - Issue Summary

## The Problem

When making a POST request to your Spring Boot application through Postman, you encountered the following error:

```
Could not write JSON: Document nesting depth (1001) exceeds the maximum allowed (1000, from `StreamWriteConstraints.getMaxNestingDepth()`)
```

This error occurs when Jackson (the JSON serialization library used by Spring Boot) tries to convert your Java objects to JSON and gets caught in an infinite loop, creating a response that's too deeply nested.

## Root Cause

The infinite recursion was caused by a bidirectional relationship between two entity classes:

1. `MemberInfoEntity` contains a list of `SkillEntity` objects
2. `SkillEntity` contains a list of `MemberInfoEntity` objects

This circular reference creates a loop during JSON serialization:

- Jackson starts serializing a `MemberInfoEntity`
- It includes the `SkillEntity` objects in the JSON
- Each `SkillEntity` includes its `MemberInfoEntity` objects
- Those `MemberInfoEntity` objects include their `SkillEntity` objects
- And so on...

### Specific Technical Issue

The root cause was a **naming inconsistency** that prevented the `@JsonIgnoreProperties` annotations from working correctly:

- In `MemberInfoEntity`, the field was named `skill` (singular) but the getter/setter methods were named `getSkills()`/`setSkills()` (plural)
- The `@JsonIgnoreProperties` and `mappedBy` references were using the field name (`skill`) instead of the property name that Jackson sees (`skills`)
- Jackson uses Java Bean naming conventions, so it looks for a property called `skills` based on the `getSkills()` method
- Since the names didn't match, Jackson couldn't properly apply the circular reference prevention

## The Solution

### 1. Rename the Field for Consistency

Changed the field name in `MemberInfoEntity` to match the getter/setter methods:

```java
// Before:
private List<SkillEntity> skill;

// After:
private List<SkillEntity> skills;
```

### 2. Update References in the SkillEntity Class

Updated the mappedBy attribute and JsonIgnoreProperties annotation in SkillEntity:

```java
// Before:
@ManyToMany(mappedBy = "skill", fetch = FetchType.LAZY)
@JsonIgnoreProperties("skill")
private List<MemberInfoEntity> members;

// After:
@ManyToMany(mappedBy = "skills", fetch = FetchType.LAZY)
@JsonIgnoreProperties("skills")
private List<MemberInfoEntity> members;
```

### 3. Update Getters/Setters in MemberInfoEntity

Updated the getter/setter to use the renamed field:

```java
// Before:
public List<SkillEntity> getSkills() {
  return this.skill;
}

public void setSkills(List<SkillEntity> skill) {
  this.skill = skill;
}

// After:
public List<SkillEntity> getSkills() {
  return this.skills;
}

public void setSkills(List<SkillEntity> skills) {
  this.skills = skills;
}
```

## Key Takeaways

1. **Consistent Naming**: Always ensure that field names match the corresponding getter/setter methods to avoid confusing Jackson and other libraries.

2. **Bidirectional Relationships**: When you have bidirectional relationships between entities, you need to handle the circular references to prevent infinite recursion during JSON serialization.

3. **@JsonIgnoreProperties**: This annotation tells Jackson to ignore specific properties when serializing an object, which breaks the circular reference chain.

4. **JPA Mappings**: The `mappedBy` attribute in `@ManyToMany` relationships should reference the field name in the other entity.

## Best Practices for the Future

1. **Consider Using DTOs**: For complex entity relationships, consider using Data Transfer Objects (DTOs) to control exactly what gets serialized in your API responses.

2. **Validate JSON Responses**: Test your API endpoints with tools like Postman to catch serialization issues early.

3. **Consistent Naming Conventions**: Follow Java Bean naming conventions consistently throughout your codebase.

4. **Keep Database Schema and Entity Names Aligned**: Your entity field names and database column names should be consistently mapped using JPA annotations.
