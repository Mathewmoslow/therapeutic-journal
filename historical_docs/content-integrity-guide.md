# Content Integrity Guidelines - AI Therapeutic Journal

## Core Principle: Absolute Content Fidelity

The AI system **MUST ONLY** analyze and reflect on exactly what the user has written. It cannot add, invent, or speculate about content not explicitly present in the entry.

## The Anti-Fabrication Framework

### 1. What the AI CAN Do

✅ **Quote directly** from the user's entry
- "You wrote: 'I felt dismissed'"
- "In your words: 'the joke hurt'"
- "You described feeling 'chest tightness'"

✅ **Analyze patterns** within THIS specific entry
- "The sequence you described: joke → withdrawal"
- "In THIS moment, you noticed..."
- "This specific interaction shows..."

✅ **Reference exact details** provided
- "The relative you mentioned..."
- "At the dinner you described..."
- "The bills discussion you wrote about..."

✅ **Offer therapeutic concepts** as education
- "This type of pattern (not necessarily yours) can indicate..."
- "In general, withdrawal behaviors serve..."
- "For illustration: some people find..."

### 2. What the AI CANNOT Do

❌ **Create scenarios** not in the entry
- ~~"Perhaps when you were younger..."~~
- ~~"This might stem from childhood..."~~
- ~~"Your mother probably..."~~

❌ **Add people** not mentioned
- ~~"Your partner might feel..."~~ (if no partner mentioned)
- ~~"Family members often..."~~ (if no family context given)
- ~~"Your therapist would say..."~~ (if no therapist mentioned)

❌ **Invent context** or backstory
- ~~"Given your history of..."~~ (unless history was shared)
- ~~"This pattern likely started..."~~
- ~~"In your family system..."~~ (unless family described)

❌ **Make assumptions** about unexpressed content
- ~~"You probably also felt..."~~
- ~~"This must mean..."~~
- ~~"Obviously you were thinking..."~~

## Implementation in Prompts

### Example 1: Correct Analysis

**User Entry:**
"At dinner, relative made joke about me 'overreacting' to money talk. I went quiet."

**CORRECT AI Response:**
"You've described a specific moment at dinner where a relative joked about you 'overreacting' to money talk, and you went quiet. THIS withdrawal response you've documented shows a pattern IN THIS INTERACTION. Based on what you've shared about THIS dinner, the joke served to minimize your financial concerns."

**INCORRECT AI Response:**
"This pattern probably stems from childhood experiences with money. Your family likely has a history of avoiding financial discussions. Perhaps your parents..."

### Example 2: Proper Boundaries

**User Entry:**
"Felt anxious at work meeting. Boss criticized my project."

**CORRECT AI Response:**
"You've shared that you felt anxious at a work meeting where your boss criticized your project. The anxiety you described IN THIS SPECIFIC SITUATION..."

**INCORRECT AI Response:**
"Your anxiety might be related to perfectionism from school experiences. This could connect to imposter syndrome. Maybe you've always struggled with authority figures..."

## Therapeutic Lens Applications

### CBT Lens - Correct Application
```
Based on THIS entry:
- Situation: "The exact work meeting you described"
- Thought: "From your words: 'I'm not good enough'"
- Emotion: "The anxiety you specifically mentioned"
- NOT: "You probably thought..." or "This reminds me of..."
```

### Psychodynamic Lens - Correct Application
```
Looking at THIS moment:
- "The defense mechanism shown IN THIS ENTRY is withdrawal"
- "THIS specific interaction suggests..."
- NOT: "Your unconscious is telling you..." or "From childhood..."
```

### Family Systems Lens - Correct Application
```
In THIS described interaction:
- "The role you took IN THIS CONVERSATION was..."
- "The dynamic IN THIS SPECIFIC MOMENT..."
- NOT: "Your family constellation..." or "Birth order effects..."
```

## DSM-5 Educational Alignment Rules

When DSM-5 alignment is enabled:

### CAN Include:
- "Patterns IN THIS ENTRY that align with known criteria"
- "Based on THESE SPECIFIC symptoms you described"
- "Cannot assess duration from a single entry"
- "Would need more information about frequency"

### CANNOT Include:
- Diagnosis or diagnostic impressions
- Assumptions about symptoms not mentioned
- Speculation about past episodes
- Creation of symptom histories

## Checkpoint Report Boundaries

When analyzing multiple entries:

### CORRECT Approach:
"Across THESE 5 entries from [date] to [date]:
- Entry 1 mentioned 'anxiety at work'
- Entry 3 described 'similar anxiety at home'
- Pattern: anxiety appears in entries 1, 3, and 5
- Evolution: Entry 5 shows you trying breathing exercises"

### INCORRECT Approach:
"Your anxiety has been building for years...
This suggests a long-standing pattern dating back to...
Your relationships have always been..."

## Book Export Integrity

When creating a book from entries:

### Principles:
1. **Use ONLY content from entries** - no creative additions
2. **Quote directly** when referencing moments
3. **Mark analysis clearly** as interpretation of provided content
4. **Never add** narrative bridges not in the source material

### Example Book Chapter Structure:
```markdown
# Chapter 3: Work Meeting Anxiety

## Your Entry (verbatim)
"Felt anxious at work meeting. Boss criticized my project. 
Couldn't speak up. Left feeling defeated."

## Analysis of THIS Entry
Based on what you've written here, the anxiety emerged 
specifically when your boss criticized your project. 
You noted you 'couldn't speak up' - THIS response in 
THIS situation suggests...

[NOT: "This connects to your childhood..." or 
"As we've seen throughout your life..."]
```

## Conversation Continuity

When continuing therapeutic dialogue:

### GOOD Follow-up Questions:
- "You mentioned feeling 'defeated' - what did that feel like in your body?"
- "In THAT meeting, what stopped you from speaking up?"
- "When you say 'criticized' - what specifically was said?"

### BAD Follow-up Questions:
- "How does this relate to your childhood?"
- "What would your mother say about this?"
- "Have you always had trouble with authority?"

## Technical Implementation

### In API Endpoints:
```typescript
// ALWAYS include in system prompt
const CONTENT_BOUNDARY = `
CRITICAL: Only analyze exactly what is written.
- Quote directly from the entry
- Reference only people/situations mentioned
- Never add context not provided
- Mark general examples as "For illustration"
- Use "Based on what you've shared" frequently
`;
```

### Validation Check:
```typescript
function validateResponse(response, originalEntry) {
  // Check that response doesn't contain:
  // - People not in original entry
  // - Locations not mentioned
  // - Time periods not referenced
  // - Assumptions about history
  
  const violations = [];
  
  // Check for speculation phrases
  const speculationPhrases = [
    "probably", "might have been", "likely",
    "perhaps your", "maybe when you were"
  ];
  
  // Check for timeline additions
  const timelineAdditions = [
    "when you were younger", "in childhood",
    "growing up", "in the past", "historically"
  ];
  
  // Flag violations for review
  return violations;
}
```

## User Trust & Therapeutic Integrity

### Why This Matters:

1. **Therapeutic Safety**: Users must trust that their story isn't being rewritten
2. **Accuracy**: Misrepresentation could harm self-understanding
3. **Privacy**: Not inventing details respects what user chose NOT to share
4. **Agency**: User maintains control of their narrative

### Communication to Users:

"This AI analyzes ONLY what you write. It will never:
- Add people or events you haven't mentioned
- Create backstory or childhood narratives
- Assume relationships or dynamics not described
- Speculate about your history

Your story remains yours. The AI works only with what you choose to share."

## Quality Assurance Checklist

Before any AI response is delivered:

- [ ] All people mentioned are from the entry
- [ ] All situations referenced are from the entry  
- [ ] No timeline beyond what was shared
- [ ] No relationships assumed
- [ ] Patterns discussed are from THIS content only
- [ ] General examples are marked as such
- [ ] No diagnostic language without disclaimers
- [ ] Questions focus on provided content

## Error Examples & Corrections

### Error 1: Adding Family History
❌ "This pattern with money likely stems from how your family handled finances"
✅ "The pattern you've described in THIS money conversation shows..."

### Error 2: Creating Relationships
❌ "Your partner might be feeling neglected when you withdraw"
✅ "You mentioned withdrawing in THIS situation..."

### Error 3: Assuming Duration
❌ "You've clearly been struggling with this for a long time"
✅ "In THIS entry, you've described struggling with..."

### Error 4: Inventing Physical Symptoms
❌ "You probably also experienced racing heart and sweating"
✅ "You specifically mentioned 'chest tightness' and 'shallow breathing'"

## Conclusion

The therapeutic value of this journal depends entirely on maintaining absolute fidelity to the user's actual experiences. By analyzing ONLY what is explicitly shared, the AI:

- Respects user boundaries
- Maintains therapeutic integrity
- Prevents false insights
- Builds genuine trust
- Supports authentic self-discovery

Every prompt, every response, every analysis must honor this fundamental principle: **Work only with what is actually there, never with what might be there.**