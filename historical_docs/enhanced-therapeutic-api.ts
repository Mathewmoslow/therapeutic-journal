// ============================================
// FILE: /api/claude.ts
// Enhanced with DSM-5 alignment, strict content boundaries
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

// CRITICAL: Anti-fabrication instructions
const ANTI_FABRICATION_RULES = `
CRITICAL CONTENT BOUNDARIES - YOU MUST FOLLOW THESE RULES:

1. NEVER create, invent, or imagine content that isn't explicitly stated in the entry
2. ONLY analyze what is literally written - do not add scenarios, examples, or situations
3. DO NOT create hypothetical dialogues or interactions that didn't happen
4. DO NOT add people, places, or events not mentioned in the entry
5. When providing examples or illustrations, clearly mark them as "For illustration:" 
6. If information is missing, say "Based on what you've shared..." not make assumptions
7. Use ONLY these phrases when you need more information:
   - "You haven't mentioned..."
   - "Based solely on what you've described..."
   - "From the specific situation you've shared..."
8. NEVER say things like "perhaps your mother..." if no mother was mentioned
9. NEVER create backstory or context not provided
10. If drawing parallels, say "This pattern (not your specific situation) can sometimes..."

VIOLATION EXAMPLES TO AVOID:
❌ "This might stem from childhood experiences with authority"
✓ "The pattern you describe with this specific relative..."

❌ "Perhaps when you were younger, similar situations..."
✓ "In the moment you've described here..."

❌ "Your partner might be feeling..."
✓ "You mentioned feeling dismissed when..."

ONLY work with:
- The exact words and situations provided
- The specific people mentioned (using pronouns/roles given)
- The actual events described
- The emotions explicitly stated
`;

// Enhanced therapeutic prompts with DSM-5 alignment
const THERAPEUTIC_PROMPTS = {
  entry_reflection: (entry: any, enableDSM: boolean = false) => `You are a multi-stance therapeutic thinking partner providing comprehensive analysis.

${ANTI_FABRICATION_RULES}

ENTRY DATA (ONLY analyze what is explicitly written here):
Title: ${entry.title}
Moment: ${entry.moment.raw_text}
Emotions stated: ${entry.initial_thoughts.emotions_felt.join(', ')}
Body sensations stated: ${entry.initial_thoughts.body_sensations.join(', ')}
Response described: ${entry.initial_thoughts.actual_response}
Tags: ${entry.tags.join(', ')}

Provide a comprehensive therapeutic reflection with EXACTLY this JSON structure.
Base EVERYTHING on ONLY the specific content provided above.
DO NOT add any scenarios, people, or situations not explicitly mentioned.

{
  "executive_summary": {
    "pattern_name": "Name for THIS SPECIFIC pattern shown in the entry",
    "key_insight": "Insight about THIS EXACT situation described",
    "urgency_level": "low|moderate|high",
    "growth_edge": "Growth opportunity from THIS specific moment"
  },
  "distortion_analysis": {
    "primary": [
      {
        "type": "Distortion name",
        "evidence": "EXACT quote from the entry showing this",
        "impact": "How this specific distortion affects the person",
        "counter_evidence": "Alternative view of THIS situation"
      }
    ],
    "secondary": ["List", "of", "other", "distortions seen in THIS entry"]
  },
  "therapeutic_lenses": {
    "CBT": {
      "thought_record": {
        "situation": "The EXACT situation from the entry",
        "automatic_thought": "Thought identified from THEIR words",
        "emotion": "Emotion THEY stated and intensity %",
        "balanced_thought": "Reframe of THEIR specific thought",
        "outcome_emotion": "Potential new emotion and %"
      },
      "behavioral_pattern": "Pattern shown in THIS entry only",
      "intervention": "CBT technique for THIS specific issue"
    },
    "Psychodynamic": {
      "unconscious_theme": "Theme evident in THIS moment",
      "transference": "Relational dynamic in THIS interaction",
      "defense_mechanisms": ["Defenses shown in THIS entry"],
      "interpretation": "Understanding of THIS specific dynamic"
    },
    "Family_Systems": {
      "role_in_system": "Role in THIS described interaction",
      "homeostatic_function": "Function of THIS specific behavior",
      "triangulation": "Triangles in THIS situation if evident",
      "differentiation_level": "Level shown in THIS moment"
    },
    "Somatic": {
      "body_map": {
        "chest": "ONLY if they mentioned chest sensation",
        "throat": "ONLY if they mentioned throat",
        "shoulders": "ONLY if they mentioned shoulders"
      },
      "nervous_system_state": "State based on THEIR described sensations",
      "resource": "Somatic intervention for THESE specific sensations"
    },
    "Psychiatric_Education": {
      "relevant_patterns": "Patterns in THIS entry that align with known conditions",
      "biological_factors": "Biological aspects of THEIR described experience",
      "screening_suggestions": ["Appropriate screening tools IF patterns suggest"],
      "red_flags": "Any concerning elements IN THIS ENTRY or 'None'",
      "disclaimer": "Educational framework only - not diagnostic"
    }
  },
  "reframe_menu": [
    {
      "original": "THEIR exact thought from the entry",
      "reframe": "Balanced reframe of that specific thought",
      "basis": "Why this reframe fits THIS situation"
    }
  ],
  "skills_buffet": {
    "immediate": [
      {
        "skill": "Skill name",
        "when": "When to use for THIS specific trigger",
        "why": "Why it helps with THIS pattern"
      }
    ],
    "practice": [
      {
        "skill": "Skill name",
        "application": "How to apply to THIS situation",
        "template": "Script using THEIR specific context"
      }
    ],
    "exploratory": [
      {
        "skill": "Deeper work",
        "target": "THIS specific pattern to explore",
        "purpose": "Goal for THIS issue"
      }
    ]
  },
  "starter_chapters": {
    "title": "Title reflecting THIS entry",
    "opening": "A 500+ word therapeutic narrative about THIS SPECIFIC moment and pattern. Use ONLY the details provided. When discussing patterns, say 'this type of pattern' not 'your history'. Reference ONLY what they shared. No speculation about past, family, or relationships not mentioned."
  },
  "conversation_seeds": [
    "Question about THIS specific moment",
    "Exploration of THIS described pattern",
    "Somatic focus on THEIR stated sensations"
  ]${enableDSM ? `,
  "dsm_alignment": {
    "disclaimer": "EDUCATIONAL ONLY - Pattern recognition, not diagnosis",
    "patterns_observed": [
      {
        "category": "DSM category (e.g., Anxiety, Mood, Trauma)",
        "specific_patterns": ["List patterns FROM THIS ENTRY that align"],
        "criteria_partially_met": ["Specific criteria evident IN THIS ENTRY"],
        "criteria_not_assessed": ["What cannot be determined from THIS entry"],
        "clinical_significance": "Impact described IN THIS ENTRY",
        "duration_unknown": true,
        "differential_considerations": ["Other explanations for THIS behavior"]
      }
    ],
    "screening_tools": [
      {
        "tool": "Tool name (e.g., PHQ-9, GAD-7)",
        "rationale": "Why based on THIS ENTRY",
        "relevant_items": ["Specific items that would explore THIS pattern"]
      }
    ],
    "important_note": "This is pattern recognition from a single entry. Clinical diagnosis requires: comprehensive assessment, duration criteria, functional impairment assessment, differential diagnosis, and licensed clinical evaluation."
  }` : ''}
}

Remember: Write about THIS entry only. Do not create content beyond what was shared.
Minimum 6000 words total. The starter_chapters.opening alone should be 500+ words about THIS moment.

Output ONLY valid JSON.`,

  checkpoint_report: (entries: any[], settings: any) => `Analyze these journal entries for patterns and growth.

${ANTI_FABRICATION_RULES}

IMPORTANT: Only analyze patterns that appear IN THESE ENTRIES. Do not speculate about:
- Childhood or past not mentioned in entries
- Family members not named in entries  
- Relationships not described in entries
- Contexts or situations not in these entries

ENTRIES PROVIDED:
${entries.map((e, i) => `
Entry ${i + 1} (${e.createdAt}):
Title: ${e.title}
Content: ${e.moment.raw_text}
Emotions: ${e.initial_thoughts.emotions_felt.join(', ')}
Sensations: ${e.initial_thoughts.body_sensations.join(', ')}
Response: ${e.initial_thoughts.actual_response}
Tags: ${e.tags.join(', ')}
`).join('\n---\n')}

Generate a checkpoint report analyzing ONLY these entries:

{
  "metadata": {
    "period_start": "${entries[entries.length - 1]?.createdAt || ''}",
    "period_end": "${entries[0]?.createdAt || ''}",
    "total_entries": ${entries.length},
    "entries_analyzed": [${entries.map(e => `"${e.id}"`).join(', ')}]
  },
  
  "pattern_analysis": {
    "recurring_themes": [
      {
        "theme": "Theme that appears in multiple entries",
        "frequency": "How often in THESE entries",
        "specific_instances": ["Entry 1: quote", "Entry 3: quote"],
        "evolution": "How this theme changed across THESE entries"
      }
    ],
    "recurring_distortions": [
      {
        "distortion": "Cognitive distortion name",
        "appearances": ["Entry 2: example", "Entry 5: example"],
        "contexts": ["Situations IN THESE ENTRIES where it appears"],
        "intensity_trend": "increasing|stable|decreasing based on THESE entries"
      }
    ],
    "relational_patterns": {
      "people_mentioned": ["ONLY people actually named in entries"],
      "interaction_patterns": ["Patterns with THESE specific people"],
      "boundary_observations": "Boundary patterns IN THESE ENTRIES"
    },
    "somatic_patterns": {
      "common_sensations": ["ONLY sensations mentioned in entries"],
      "trigger_correlation": "What triggers THESE stated sensations",
      "regulation_attempts": "Strategies mentioned IN THESE ENTRIES"
    }
  },
  
  "therapeutic_progress": {
    "CBT": {
      "cognitive_flexibility": "Changes in thinking across THESE entries",
      "behavioral_changes": "Behavior changes shown IN THESE ENTRIES",
      "skill_utilization": "Skills mentioned or implied IN THESE ENTRIES"
    },
    "Psychodynamic": {
      "insight_development": "Insights evident across THESE entries",
      "defense_evolution": "How defenses changed IN THESE ENTRIES",
      "patterns_recognized": "Patterns the person noticed IN THESE ENTRIES"
    },
    "Systemic": {
      "differentiation_progress": "Differentiation shown IN THESE ENTRIES",
      "role_flexibility": "Role changes across THESE ENTRIES",
      "system_navigation": "How they navigated systems IN THESE ENTRIES"
    },
    "Somatic": {
      "body_awareness": "Body awareness across THESE ENTRIES",
      "sensation_vocabulary": "How they describe sensations IN THESE ENTRIES",
      "regulation_capacity": "Regulation shown IN THESE ENTRIES"
    }
  },
  
  "growth_trajectory": {
    "strengths_demonstrated": [
      {
        "strength": "Strength shown",
        "evidence": ["Entry X: specific example from that entry"]
      }
    ],
    "challenges_persistent": [
      {
        "challenge": "Ongoing challenge",
        "manifestations": ["How it appeared in Entry Y", "How in Entry Z"]
      }
    ],
    "emerging_capacities": [
      {
        "capacity": "New ability emerging",
        "first_appearance": "Entry where first seen",
        "development": "How it evolved in subsequent entries"
      }
    ]
  },
  
  "clinical_observations": {
    "risk_assessment": {
      "self_harm_indicators": "None|Mild|Moderate|Severe based on THESE ENTRIES",
      "support_system": "Support mentioned IN THESE ENTRIES",
      "coping_resources": "Resources used IN THESE ENTRIES",
      "concerning_patterns": ["ONLY if present in these entries"]
    },
    "functioning_assessment": {
      "areas_discussed": ["ONLY areas mentioned in entries"],
      "impairment_level": "Based on THESE ENTRIES only",
      "adaptive_strategies": "Strategies mentioned IN THESE ENTRIES"
    }
  },
  
  ${settings?.enableDSM ? `"dsm_pattern_tracking": {
    "disclaimer": "Educational pattern tracking across entries - not diagnostic",
    "consistent_patterns": [
      {
        "pattern_category": "DSM category",
        "evidence_across_entries": {
          "entry_1": "Specific evidence from this entry",
          "entry_3": "Specific evidence from this entry"
        },
        "frequency": "How often in THESE entries",
        "contexts": "Contexts IN THESE ENTRIES"
      }
    ],
    "symptom_trajectory": {
      "improving": ["Symptoms lessening across THESE entries"],
      "stable": ["Symptoms consistent in THESE entries"],
      "worsening": ["Symptoms increasing in THESE entries"]
    },
    "functional_impact": "Impact on life AS DESCRIBED in entries",
    "recommendation": "Consider professional assessment if patterns persist"
  },` : ''}
  
  "recommendations": {
    "immediate_practices": [
      {
        "practice": "Specific practice for patterns IN THESE ENTRIES",
        "rationale": "Based on THESE specific patterns",
        "implementation": "How to apply to situations IN THESE ENTRIES"
      }
    ],
    "skill_building": [
      {
        "skill": "Skill for challenges IN THESE ENTRIES",
        "target_pattern": "Pattern from THESE ENTRIES",
        "practice_suggestion": "Specific to contexts IN THESE ENTRIES"
      }
    ],
    "professional_support": {
      "indicated": true|false,
      "rationale": "Based on THESE ENTRIES",
      "type_suggested": "Type of support for issues IN THESE ENTRIES"
    }
  },
  
  "narrative_synthesis": "A 1000+ word synthesis that weaves together ONLY the patterns, progress, and possibilities found IN THESE SPECIFIC ENTRIES. Do not reference childhood, family history, or any relationships not explicitly mentioned in these entries. Use phrases like 'Across these ${entries.length} entries...' and 'The patterns shown here...' Reference specific entries by number. This should read like a letter reflecting on THESE EXACT ENTRIES, not speculating beyond them."
}

Write minimum 10000 words total analyzing ONLY these provided entries.
The narrative_synthesis alone should be 1000+ words about THESE SPECIFIC ENTRIES.

Output ONLY valid JSON.`,

  book_export: (entries: any[], reflections: any[], checkpoints: any[]) => `Create a book manuscript from these journal entries and reflections.

${ANTI_FABRICATION_RULES}

Create a book structure using ONLY content from these entries. Do not add any content not present in the source material.

{
  "metadata": {
    "title": "Therapeutic Journey: [Date Range]",
    "author": "Anonymous",
    "generated_date": "${new Date().toISOString()}",
    "entry_count": ${entries.length},
    "checkpoint_count": ${checkpoints.length},
    "word_count_estimate": 0
  },
  
  "front_matter": {
    "introduction": "A 500-word introduction about the therapeutic journey documented IN THESE ENTRIES. Reference the time period covered and themes that emerged FROM THESE ENTRIES ONLY.",
    "how_to_read": "Guide for reading this therapeutic journey based on the structure of THESE ENTRIES.",
    "privacy_note": "Note about anonymization and privacy protections applied."
  },
  
  "chapters": [
    ${entries.map((entry, index) => `{
      "chapter_number": ${index + 1},
      "entry_id": "${entry.id}",
      "title": "${entry.title}",
      "date": "${entry.createdAt}",
      "epigraph": "A meaningful quote FROM THIS ENTRY",
      
      "sections": {
        "the_moment": {
          "content": "The original entry text, formatted for reading"
        },
        
        "initial_response": {
          "emotions": "Emotions from this entry",
          "sensations": "Body sensations from this entry",
          "actions": "Response described in this entry"
        },
        
        "therapeutic_analysis": {
          "executive_insight": "Key insight from THIS entry's reflection",
          "pattern_identified": "Main pattern from THIS entry",
          "distortions_explored": "Distortions found in THIS entry",
          
          "through_the_lenses": {
            "cognitive_behavioral": "CBT analysis of THIS entry",
            "psychodynamic": "Psychodynamic view of THIS entry",
            "systemic": "Systems perspective on THIS entry",
            "somatic": "Body-based understanding of THIS entry"
          },
          
          "reframes_offered": "Reframes for THIS entry's thoughts",
          "skills_suggested": "Skills recommended for THIS entry"
        },
        
        "therapeutic_dialogue": "Any conversation that followed THIS entry",
        
        "reflection_prompt": "A prompt for reader reflection on THIS entry's themes"
      }
    }`).join(',\n')}
  ],
  
  "checkpoint_interludes": [
    ${checkpoints.map((checkpoint, index) => `{
      "position_after_chapter": "Chapter number to place this after",
      "title": "Patterns and Progress: Period ${index + 1}",
      "content": {
        "patterns_observed": "Patterns from THESE SPECIFIC ENTRIES",
        "progress_noted": "Progress shown IN THESE ENTRIES",
        "growth_edges": "Growth opportunities from THESE ENTRIES"
      }
    }`).join(',\n')}
  ],
  
  "conclusion": {
    "journey_summary": "Summary of the journey through THESE ENTRIES ONLY",
    "key_learnings": "Main learnings from THESE SPECIFIC ENTRIES",
    "ongoing_practices": "Practices developed through THESE ENTRIES",
    "future_directions": "Directions suggested by THESE ENTRIES",
    "final_reflection": "Closing thoughts on THIS DOCUMENTED JOURNEY"
  },
  
  "appendices": {
    "skills_compendium": "All skills mentioned across THESE ENTRIES",
    "pattern_index": "Index of patterns found IN THESE ENTRIES",
    "resource_list": "Resources mentioned IN THESE ENTRIES",
    "emergency_resources": "Crisis resources and safety information"
  }
}

Create a cohesive book using ONLY the content from the provided entries, reflections, and checkpoints.
Do not invent new content or add examples not in the source material.

Output ONLY valid JSON.`
};

// DSM-5 Educational Alignment Configuration
const DSM5_EDUCATIONAL_PATTERNS = {
  anxiety_patterns: {
    criteria_markers: [
      'excessive worry', 'restlessness', 'difficulty concentrating',
      'irritability', 'muscle tension', 'sleep disturbance'
    ],
    functional_areas: ['work', 'social', 'family', 'self-care'],
    duration_requirement: '6 months for most anxiety disorders'
  },
  mood_patterns: {
    criteria_markers: [
      'depressed mood', 'loss of interest', 'weight changes',
      'sleep changes', 'psychomotor changes', 'fatigue',
      'worthlessness', 'concentration difficulties', 'suicidal ideation'
    ],
    functional_areas: ['occupational', 'social', 'personal'],
    duration_requirement: '2 weeks for major depressive episode'
  },
  trauma_patterns: {
    criteria_markers: [
      'intrusive memories', 'avoidance', 'negative alterations',
      'arousal changes', 'dissociation', 'reactivity'
    ],
    functional_areas: ['relationships', 'work', 'daily functioning'],
    duration_requirement: '1 month for PTSD'
  }
};

// Export service for creating books
class ExportService {
  static async generateMarkdown(bookData: any): Promise<string> {
    let markdown = '';
    
    // Front matter
    markdown += `# ${bookData.metadata.title}\n\n`;
    markdown += `*Generated: ${new Date(bookData.metadata.generated_date).toLocaleDateString()}*\n\n`;
    markdown += `---\n\n`;
    
    // Introduction
    markdown += `## Introduction\n\n${bookData.front_matter.introduction}\n\n`;
    markdown += `### How to Read This Book\n\n${bookData.front_matter.how_to_read}\n\n`;
    markdown += `---\n\n`;
    
    // Chapters
    for (const chapter of bookData.chapters) {
      markdown += `# Chapter ${chapter.chapter_number}: ${chapter.title}\n\n`;
      markdown += `*${new Date(chapter.date).toLocaleDateString()}*\n\n`;
      
      if (chapter.epigraph) {
        markdown += `> ${chapter.epigraph}\n\n`;
      }
      
      markdown += `## The Moment\n\n${chapter.sections.the_moment.content}\n\n`;
      
      markdown += `## Initial Response\n\n`;
      markdown += `**Emotions:** ${chapter.sections.initial_response.emotions}\n\n`;
      markdown += `**Sensations:** ${chapter.sections.initial_response.sensations}\n\n`;
      markdown += `**Actions:** ${chapter.sections.initial_response.actions}\n\n`;
      
      markdown += `## Therapeutic Analysis\n\n`;
      markdown += `### Key Insight\n\n${chapter.sections.therapeutic_analysis.executive_insight}\n\n`;
      
      markdown += `### Through the Lenses\n\n`;
      markdown += `#### Cognitive-Behavioral\n\n${chapter.sections.therapeutic_analysis.through_the_lenses.cognitive_behavioral}\n\n`;
      markdown += `#### Psychodynamic\n\n${chapter.sections.therapeutic_analysis.through_the_lenses.psychodynamic}\n\n`;
      markdown += `#### Systemic\n\n${chapter.sections.therapeutic_analysis.through_the_lenses.systemic}\n\n`;
      markdown += `#### Somatic\n\n${chapter.sections.therapeutic_analysis.through_the_lenses.somatic}\n\n`;
      
      if (chapter.sections.therapeutic_dialogue) {
        markdown += `## Therapeutic Dialogue\n\n${chapter.sections.therapeutic_dialogue}\n\n`;
      }
      
      markdown += `### Reflection for You\n\n${chapter.sections.reflection_prompt}\n\n`;
      markdown += `---\n\n`;
    }
    
    // Checkpoint interludes
    for (const checkpoint of bookData.checkpoint_interludes) {
      markdown += `# ${checkpoint.title}\n\n`;
      markdown += `## Patterns Observed\n\n${checkpoint.content.patterns_observed}\n\n`;
      markdown += `## Progress Noted\n\n${checkpoint.content.progress_noted}\n\n`;
      markdown += `## Growth Edges\n\n${checkpoint.content.growth_edges}\n\n`;
      markdown += `---\n\n`;
    }
    
    // Conclusion
    markdown += `# Conclusion\n\n`;
    markdown += `## Journey Summary\n\n${bookData.conclusion.journey_summary}\n\n`;
    markdown += `## Key Learnings\n\n${bookData.conclusion.key_learnings}\n\n`;
    markdown += `## Ongoing Practices\n\n${bookData.conclusion.ongoing_practices}\n\n`;
    markdown += `## Final Reflection\n\n${bookData.conclusion.final_reflection}\n\n`;
    
    return markdown;
  }
  
  static async generatePDF(bookData: any): Promise<Blob> {
    // This would integrate with a PDF library like jsPDF or puppeteer
    // For now, returning a placeholder
    const markdown = await this.generateMarkdown(bookData);
    return new Blob([markdown], { type: 'application/pdf' });
  }
  
  static async generateEPUB(bookData: any): Promise<Blob> {
    // This would integrate with an EPUB library
    // For now, returning a placeholder
    const markdown = await this.generateMarkdown(bookData);
    return new Blob([markdown], { type: 'application/epub+zip' });
  }
}

// Main handler with enhanced features
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { action, data, context, settings } = req.body;
    
    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return res.status(500).json({ error: 'API configuration error' });
    }
    
    let prompt: string;
    let maxTokens: number;
    
    switch (action) {
      case 'reflection':
        prompt = THERAPEUTIC_PROMPTS.entry_reflection(data, settings?.enableDSM || false);
        maxTokens = 8000;
        break;
        
      case 'checkpoint':
        prompt = THERAPEUTIC_PROMPTS.checkpoint_report(data.entries, settings);
        maxTokens = 12000;
        break;
        
      case 'export_book':
        prompt = THERAPEUTIC_PROMPTS.book_export(
          data.entries,
          data.reflections,
          data.checkpoints
        );
        maxTokens = 15000;
        break;
        
      case 'conversation':
        prompt = THERAPEUTIC_PROMPTS.conversation_turn(context.thread, data.message);
        maxTokens = 2000;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    // Call Claude API with anti-fabrication instructions
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        system: `You are an expert therapeutic AI with deep knowledge of CBT, DBT, psychodynamic therapy, family systems, somatic therapy, and psychiatric education. 

${ANTI_FABRICATION_RULES}

REMEMBER: Only analyze what is explicitly provided. Never create scenarios, add people, or invent context. Always maintain professional boundaries and include appropriate disclaimers.`
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to generate therapeutic response',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
    
    const result = await response.json();
    const content = result.content[0].text;
    
    // Parse and validate JSON responses
    if (action !== 'conversation') {
      try {
        const parsed = JSON.parse(content);
        
        // Additional validation for DSM content if enabled
        if (settings?.enableDSM && parsed.dsm_alignment) {
          parsed.dsm_alignment.verified_disclaimer = 
            "This is educational pattern recognition only. Not a diagnosis. " +
            "Consult a licensed mental health professional for assessment.";
        }
        
        return res.status(200).json({ success: true, data: parsed });
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        return res.status(500).json({ 
          error: 'Invalid response format from AI'
        });
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      data: { content }
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// ============================================
// FILE: /api/checkpoint.ts
// Automated checkpoint generation
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { user_id, manual = false } = req.body;
  
  try {
    // Get user's recent entries
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user_id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (entriesError) throw entriesError;
    
    // Check if checkpoint criteria met
    const lastCheckpoint = await supabase
      .from('checkpoints')
      .select('created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1);
    
    const daysSinceLastCheckpoint = lastCheckpoint.data?.[0] 
      ? Math.floor((Date.now() - new Date(lastCheckpoint.data[0].created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    if (!manual && (entries.length < 5 || daysSinceLastCheckpoint < 14)) {
      return res.status(200).json({ 
        success: false, 
        message: 'Checkpoint criteria not met',
        entries_count: entries.length,
        days_since_last: daysSinceLastCheckpoint
      });
    }
    
    // Generate checkpoint via Claude API
    const checkpointResponse = await fetch(`${process.env.VERCEL_URL}/api/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'checkpoint',
        data: { entries },
        settings: { enableDSM: false } // Can be configured per user
      })
    });
    
    const checkpointResult = await checkpointResponse.json();
    
    if (!checkpointResult.success) {
      throw new Error('Failed to generate checkpoint');
    }
    
    // Save checkpoint to database
    const { error: insertError } = await supabase
      .from('checkpoints')
      .insert({
        user_id,
        period_start: entries[entries.length - 1].created_at,
        period_end: entries[0].created_at,
        report: checkpointResult.data,
        entry_ids: entries.map(e => e.id)
      });
    
    if (insertError) throw insertError;
    
    return res.status(200).json({ 
      success: true, 
      checkpoint: checkpointResult.data
    });
    
  } catch (error) {
    console.error('Checkpoint generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate checkpoint'
    });
  }
}

// ============================================
// FILE: /api/export.ts
// Export functionality for book creation
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { format, entries, reflections, checkpoints } = req.body;
  
  try {
    // Generate book structure via Claude
    const bookResponse = await fetch(`${process.env.VERCEL_URL}/api/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'export_book',
        data: { entries, reflections, checkpoints }
      })
    });
    
    const bookResult = await bookResponse.json();
    
    if (!bookResult.success) {
      throw new Error('Failed to generate book structure');
    }
    
    let exportData: any;
    let contentType: string;
    let filename: string;
    
    switch (format) {
      case 'markdown':
        exportData = await ExportService.generateMarkdown(bookResult.data);
        contentType = 'text/markdown';
        filename = `therapeutic-journey-${Date.now()}.md`;
        break;
        
      case 'json':
        exportData = JSON.stringify(bookResult.data, null, 2);
        contentType = 'application/json';
        filename = `therapeutic-journey-${Date.now()}.json`;
        break;
        
      case 'pdf':
        // Would require additional PDF generation library
        exportData = await ExportService.generateMarkdown(bookResult.data);
        contentType = 'application/pdf';
        filename = `therapeutic-journey-${Date.now()}.pdf`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid export format' });
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(exportData);
    
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ 
      error: 'Failed to export data'
    });
  }
}