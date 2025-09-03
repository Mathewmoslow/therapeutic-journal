import { NextRequest, NextResponse } from 'next/server';

// ============================================
// RESEARCH TEAM CONFIGURATION
// ============================================

const RESEARCH_TEAM = {
  psychodynamic_analyst: {
    name: "Dr. Sarah Chen",
    credentials: "PsyD, Psychoanalytic Training",
    perspective: "unconscious patterns, attachment dynamics, defense mechanisms, transference/countertransference",
    focus_areas: ["early attachment patterns", "repetition compulsion", "internalized object relations", "defensive structures"],
    responds_to: ["family_systems_therapist", "somatic_specialist"],
    conversational_style: "reflective, interpretive, uses metaphor, connects to deeper patterns",
    minimum_words: 1200,
    questions_they_ask: ["What might this pattern be protecting you from knowing?", "How does this mirror earlier relationships?", "What unconscious needs might be at play?"]
  },
  
  family_systems_therapist: {
    name: "Dr. Marcus Williams",
    credentials: "LMFT, Bowen Theory Specialist",
    perspective: "multigenerational patterns, triangulation, differentiation, family roles and rules",
    focus_areas: ["emotional triangles", "cutoffs", "family projection process", "sibling position", "multigenerational transmission"],
    responds_to: ["psychodynamic_analyst", "cbt_analyst"],
    conversational_style: "systemic, curious about patterns, maps relationships, thinks in generations",
    minimum_words: 1200,
    questions_they_ask: ["Who else in the family system holds this role?", "How many generations back does this pattern go?", "What happens to the system when someone breaks this rule?"]
  },
  
  somatic_specialist: {
    name: "Dr. Amara Okonkwo",
    credentials: "PhD, Somatic Experiencing Practitioner",
    perspective: "embodied trauma, nervous system regulation, body memories, physiological patterns",
    focus_areas: ["autonomic nervous system states", "body armoring", "trauma responses", "embodied emotions", "interoception"],
    responds_to: ["psychodynamic_analyst", "psychiatric_consultant"],
    conversational_style: "body-focused, present-oriented, attentive to sensation and movement",
    minimum_words: 800,
    questions_they_ask: ["Where does this live in your body?", "What happens in your nervous system during these interactions?", "How does your body know this pattern?"]
  },
  
  cbt_analyst: {
    name: "Dr. James Park",
    credentials: "PhD, CBT/DBT Certified",
    perspective: "cognitive distortions, behavioral patterns, thought-emotion-behavior cycles, schemas",
    focus_areas: ["automatic thoughts", "core beliefs", "cognitive distortions", "behavioral reinforcement", "schema patterns"],
    responds_to: ["family_systems_therapist", "psychiatric_consultant"],
    conversational_style: "structured, evidence-focused, practical, identifies patterns and cycles",
    minimum_words: 1000,
    questions_they_ask: ["What evidence supports/contradicts this belief?", "What would you tell a friend in this situation?", "How is this thought pattern maintaining the problem?"]
  },
  
  psychiatric_consultant: {
    name: "Dr. Elena Volkov",
    credentials: "MD, Board Certified Psychiatrist",
    perspective: "neurobiological factors, diagnostic patterns, medication considerations, medical rule-outs",
    focus_areas: ["neurotransmitter systems", "genetic vulnerabilities", "diagnostic criteria", "biological markers", "psychopharmacology"],
    responds_to: ["somatic_specialist", "cbt_analyst"],
    conversational_style: "medical, precise, differential diagnosis focused, biological lens",
    minimum_words: 800,
    questions_they_ask: ["What biological factors might contribute?", "Are there patterns suggesting a diagnosable condition?", "How might neurochemistry influence this dynamic?"]
  }
};

// ============================================
// ANTI-FABRICATION RULES
// ============================================

const ANALYSIS_BOUNDARIES = `
CRITICAL: You are analyzing ONLY what is explicitly provided. 

NEVER:
- Invent family members not mentioned
- Create childhood scenarios not described  
- Add events that didn't happen
- Assume relationships not stated
- Generate hypothetical dialogues
- Speculate about the past unless specifically shared

ALWAYS:
- Quote directly from the provided content
- Say "Based on what you've shared..." when analyzing
- Use "In this specific incident..." for observations
- Mark any general examples as "In situations like these (not necessarily yours)..."
- Acknowledge when information is limited
`;

// ============================================
// PROMPT BUILDERS
// ============================================

class ResearchTeamPromptBuilder {
  
  static buildInitialAnalysisPrompt(professional: string, entry: any, historicalContext: any) {
    const prof = RESEARCH_TEAM[professional as keyof typeof RESEARCH_TEAM];
    
    return `You are ${prof.name}, ${prof.credentials}.
    
${ANALYSIS_BOUNDARIES}

Your expertise: ${prof.perspective}
Your focus areas: ${prof.focus_areas.join(', ')}
Your style: ${prof.conversational_style}

ANALYZE THIS FAMILY DYNAMIC:
Date: ${entry.createdAt}
Title: ${entry.title}
Situation: ${entry.moment.raw_text}
Emotional Response: ${entry.initial_thoughts.emotions_felt.join(', ')}
Physical Response: ${entry.initial_thoughts.body_sensations.join(', ')}
Actual Response: ${entry.initial_thoughts.actual_response}

${historicalContext ? `RELEVANT PATTERNS FROM PREVIOUS ENTRIES:
${historicalContext}` : ''}

Provide your analysis in EXACTLY this JSON structure:
{
  "professional": "${professional}",
  "speaker_name": "${prof.name}",
  "timestamp": "${new Date().toISOString()}",
  "analysis": {
    "opening_observation": "Your initial reaction to this family dynamic (200+ words)",
    "pattern_identification": {
      "primary_pattern": "The main pattern you see",
      "evidence": ["Direct quote 1", "Direct quote 2", "Direct quote 3"],
      "pattern_function": "What this pattern accomplishes in the family system",
      "pattern_cost": "What this pattern costs the person"
    },
    "theoretical_framework": {
      "through_my_lens": "Deep analysis from your theoretical perspective (400+ words)",
      "key_concepts": ["Concept 1 from your field", "Concept 2", "Concept 3"],
      "clinical_observations": "What you notice that others might miss from your perspective (300+ words)"
    },
    "family_dynamics": {
      "roles_observed": "Family roles you identify in THIS incident",
      "power_dynamics": "Power structures evident in THIS interaction",
      "communication_patterns": "Communication styles shown HERE",
      "emotional_rules": "Unspoken emotional rules in THIS family"
    },
    "deeper_exploration": {
      "questions_raised": ["${prof.questions_they_ask[0]}", "${prof.questions_they_ask[1]}", "${prof.questions_they_ask[2]}"],
      "hypotheses": "Working hypotheses about this dynamic (300+ words)",
      "areas_for_investigation": ["What to explore further", "What patterns to track", "What to notice"]
    },
    "therapeutic_implications": "If this were a client, what would your approach focus on? (200+ words)"
  },
  "connections_to_explore": "Themes you want to discuss with ${prof.responds_to.join(' and ')}",
  "word_count": ${prof.minimum_words}
}

Write at least ${prof.minimum_words} words total. Be thorough, nuanced, and specific to YOUR theoretical orientation.
Focus on THIS SPECIFIC family incident, not general family dynamics.`;
  }

  static buildCrossCommentaryPrompt(
    commenting_professional: string,
    original_analyses: any[],
    entry: any
  ) {
    const prof = RESEARCH_TEAM[commenting_professional as keyof typeof RESEARCH_TEAM];
    const othersToRespondTo = prof.responds_to;
    
    return `You are ${prof.name}, ${prof.credentials}.

${ANALYSIS_BOUNDARIES}

You've just read your colleagues' analyses of this family dynamic:

ORIGINAL INCIDENT:
${entry.moment.raw_text}

YOUR COLLEAGUES' ANALYSES:
${original_analyses.map(a => `
${a.speaker_name} (${a.professional}):
- Main observation: ${a.analysis.opening_observation}
- Key pattern: ${a.analysis.pattern_identification.primary_pattern}
- Their theoretical take: ${a.analysis.theoretical_framework.through_my_lens}
`).join('\n')}

Now provide your RESPONSE to their analyses, particularly to ${othersToRespondTo.join(' and ')}.

Format as JSON:
{
  "professional": "${commenting_professional}",
  "speaker_name": "${prof.name}",
  "responding_to": ["List who you're specifically responding to"],
  "commentary": {
    "agreements": {
      "with_whom": "Which colleague",
      "what_resonates": "What in their analysis aligns with your perspective (200+ words)",
      "how_it_connects": "How their observation connects to your theoretical framework"
    },
    "expansions": {
      "building_on": "Whose analysis you're expanding",
      "additional_layer": "What your lens adds that they might not see (300+ words)",
      "integration": "How your perspectives combine for deeper understanding"
    },
    "gentle_challenges": {
      "alternative_view": "Where you see it differently (not criticism, but another angle)",
      "your_hypothesis": "Your alternative explanation using your framework (200+ words)",
      "both_and": "How both perspectives might be true"
    },
    "cross_theoretical_insights": {
      "synthesis": "What emerges when we combine our lenses (300+ words)",
      "new_questions": ["Questions that arise from our combined analysis"],
      "deeper_pattern": "A pattern visible only through multiple lenses"
    }
  },
  "collaborative_hypothesis": "A hypothesis we could explore together about this family system",
  "next_direction": "Where our combined analysis points for further exploration",
  "word_count": 800
}

Minimum 800 words. Engage genuinely with your colleagues' ideas while maintaining your theoretical stance.`;
  }

  static buildCheckpointCompactionPrompt(entries: any[], previousAnalyses: any[]) {
    return `As the full research team, create a CHECKPOINT SYNTHESIS of patterns across multiple entries.

${ANALYSIS_BOUNDARIES}

ENTRIES ANALYZED: ${entries.length} family incidents
TIME PERIOD: ${entries[entries.length - 1]?.createdAt} to ${entries[0]?.createdAt}

KEY INCIDENTS:
${entries.slice(0, 10).map(e => `- ${e.title}: ${e.moment.raw_text.substring(0, 150)}...`).join('\n')}

PREVIOUS TEAM ANALYSES THEMES:
${previousAnalyses.map(a => `- ${a.professional}: ${a.analysis?.pattern_identification?.primary_pattern}`).join('\n')}

Create a CHECKPOINT REPORT:
{
  "checkpoint_type": "team_synthesis",
  "period_analyzed": {
    "start_date": "${entries[entries.length - 1]?.createdAt}",
    "end_date": "${entries[0]?.createdAt}",
    "total_entries": ${entries.length}
  },
  "team_consensus": {
    "agreed_patterns": [
      {
        "pattern": "Pattern all team members see",
        "evidence_across_entries": ["Example from entry 1", "Example from entry 5", "Example from entry 8"],
        "theoretical_agreement": "Why all perspectives validate this"
      }
    ],
    "divergent_views": [
      {
        "pattern": "Pattern seen differently",
        "psychodynamic_view": "How psychodynamic sees it",
        "family_systems_view": "How family systems sees it",
        "somatic_view": "How somatic sees it",
        "value_of_divergence": "What we learn from these different views"
      }
    ]
  },
  "evolution_over_time": {
    "patterns_intensifying": ["Patterns getting stronger with evidence"],
    "patterns_softening": ["Patterns decreasing with evidence"],
    "new_patterns_emerging": ["Patterns just starting to appear"],
    "stable_patterns": ["Unchanging patterns across time"]
  },
  "family_system_map": {
    "central_dynamics": "Core family dynamics across all entries",
    "key_players": "Family members most involved in patterns (ONLY those mentioned)",
    "emotional_rules": "Consistent emotional rules across incidents",
    "power_structures": "Recurring power dynamics",
    "communication_patterns": "Persistent communication styles"
  },
  "theoretical_integration": {
    "psychodynamic_themes": "Major unconscious patterns across entries",
    "systemic_patterns": "Family system patterns across entries",
    "somatic_patterns": "Body/nervous system patterns recurring",
    "cognitive_patterns": "Thought patterns consistent across entries",
    "biological_considerations": "Any biological/psychiatric patterns noted"
  },
  "book_relevance": {
    "chapter_themes": ["Potential chapter theme 1", "Theme 2", "Theme 3"],
    "narrative_arc": "The story these entries tell about your family",
    "universal_themes": "What readers might recognize in their own families",
    "unique_dynamics": "What's particular to your family system"
  },
  "research_implications": {
    "gaps_in_understanding": "What we still don't know",
    "areas_for_deeper_exploration": "What to pay attention to in future entries",
    "questions_for_reflection": "Questions for you to consider",
    "patterns_to_track": "Specific patterns to monitor going forward"
  },
  "team_discussion_highlights": {
    "most_generative_debates": "Where our disagreements led to insights",
    "breakthrough_moments": "Moments of sudden clarity from combined perspectives",
    "remaining_puzzles": "What still puzzles us as a team"
  },
  "checkpoint_narrative": "A 1000+ word narrative summary of this period, written as a team, that could serve as a book interlude. Focus on the evolution and deepening understanding of your family patterns. Write this as engaging prose, not clinical notes."
}

This checkpoint should be at least 3000 words total, providing rich material for your book.`;
  }

  static buildMemoryUpdatePrompt(currentMemory: any, newInsights: any) {
    return `Update the research team's collective memory with new insights.

CURRENT MEMORY:
${JSON.stringify(currentMemory, null, 2)}

NEW INSIGHTS TO INTEGRATE:
${JSON.stringify(newInsights, null, 2)}

Create an updated memory structure:
{
  "persistent_patterns": {
    "description": "Patterns consistent across all sessions",
    "evidence_count": "Number of times observed",
    "evolution": "How pattern has evolved"
  },
  "key_family_members": {
    "member_role": {
      "patterns_involved": ["List of patterns"],
      "typical_dynamics": "Their usual role",
      "evolution_noted": "Changes observed over time"
    }
  },
  "theoretical_developments": {
    "psychodynamic_insights": "Cumulative psychodynamic understanding",
    "systemic_insights": "Cumulative family systems understanding",
    "somatic_insights": "Cumulative somatic understanding",
    "cognitive_insights": "Cumulative CBT understanding",
    "biological_insights": "Cumulative psychiatric understanding"
  },
  "unresolved_questions": ["Questions that persist across sessions"],
  "working_hypotheses": ["Current team hypotheses about the family"],
  "book_themes": ["Emerging themes for the book"],
  "session_count": "Total number of analysis sessions",
  "entry_count": "Total entries analyzed",
  "last_updated": "${new Date().toISOString()}"
}`;
  }
}

// ============================================
// OPENAI SERVICE FOR TEAM SIMULATION
// ============================================

class ResearchTeamService {
  private apiKey: string;
  private model = 'gpt-4-turbo-preview';
  
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY!;
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
  }

  async generateAnalysis(prompt: string, maxTokens: number = 4000): Promise<any> {
    console.log('[ResearchTeam] Generating analysis...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional on a research team analyzing family dynamics for a book. Provide deep, nuanced, theoretical analysis while respecting boundaries about not inventing content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Higher for more varied professional voices
        max_tokens: maxTokens,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[ResearchTeam] API Error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  async runFullTeamAnalysis(entry: any, historicalContext: any) {
    console.log('[ResearchTeam] Running full team analysis...');
    
    const teamAnalyses = [];
    const professionals = Object.keys(RESEARCH_TEAM);
    
    // Phase 1: Initial analyses from each professional
    console.log('[ResearchTeam] Phase 1: Generating initial analyses...');
    for (const professional of professionals) {
      const prompt = ResearchTeamPromptBuilder.buildInitialAnalysisPrompt(
        professional,
        entry,
        historicalContext
      );
      
      const analysis = await this.generateAnalysis(prompt, 5000);
      teamAnalyses.push(analysis);
      
      console.log(`[ResearchTeam] ${professional} analysis complete`);
    }
    
    // Phase 2: Cross-commentary - each professional responds to others
    console.log('[ResearchTeam] Phase 2: Generating cross-commentary...');
    const crossCommentaries = [];
    
    for (const professional of professionals) {
      const prompt = ResearchTeamPromptBuilder.buildCrossCommentaryPrompt(
        professional,
        teamAnalyses,
        entry
      );
      
      const commentary = await this.generateAnalysis(prompt, 3000);
      crossCommentaries.push(commentary);
      
      console.log(`[ResearchTeam] ${professional} commentary complete`);
    }
    
    return {
      entry_analyzed: {
        id: entry.id,
        title: entry.title,
        date: entry.createdAt
      },
      initial_analyses: teamAnalyses,
      cross_commentary: crossCommentaries,
      timestamp: new Date().toISOString(),
      word_count: JSON.stringify(teamAnalyses).length + JSON.stringify(crossCommentaries).length
    };
  }

  async generateCheckpoint(entries: any[], previousAnalyses: any[]) {
    console.log('[ResearchTeam] Generating checkpoint synthesis...');
    
    const prompt = ResearchTeamPromptBuilder.buildCheckpointCompactionPrompt(
      entries,
      previousAnalyses
    );
    
    return await this.generateAnalysis(prompt, 8000);
  }
}

// ============================================
// API ROUTE HANDLER
// ============================================

export async function POST(request: NextRequest) {
  const requestId = `team-${Date.now()}`;
  
  console.log(`[ResearchTeam][${requestId}] Request received`);
  
  try {
    const body = await request.json();
    const { action, data, settings = {} } = body;
    
    console.log(`[ResearchTeam][${requestId}] Action: ${action}`);
    
    const teamService = new ResearchTeamService();
    let result;
    
    switch (action) {
      case 'analyze_entry':
        // Full team analysis of a single entry
        const { entry, historicalContext = null } = data;
        
        console.log(`[ResearchTeam][${requestId}] Analyzing entry: ${entry.title}`);
        
        result = await teamService.runFullTeamAnalysis(
          entry,
          historicalContext
        );
        
        console.log(`[ResearchTeam][${requestId}] Team analysis complete`);
        break;
        
      case 'generate_checkpoint':
        // Checkpoint synthesis across multiple entries
        const { entries, previousAnalyses = [] } = data;
        
        console.log(`[ResearchTeam][${requestId}] Generating checkpoint for ${entries.length} entries`);
        
        result = await teamService.generateCheckpoint(
          entries,
          previousAnalyses
        );
        
        console.log(`[ResearchTeam][${requestId}] Checkpoint complete`);
        break;
        
      case 'single_perspective':
        // Get analysis from just one professional
        const { entry, professional, historicalContext = null } = data;
        
        console.log(`[ResearchTeam][${requestId}] Single perspective: ${professional}`);
        
        const prompt = ResearchTeamPromptBuilder.buildInitialAnalysisPrompt(
          professional,
          entry,
          historicalContext
        );
        
        result = await teamService.generateAnalysis(prompt, 5000);
        
        console.log(`[ResearchTeam][${requestId}] ${professional} analysis complete`);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action', message: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      action,
      data: result,
      requestId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error(`[ResearchTeam][${requestId}] Error:`, error);
    
    return NextResponse.json(
      {
        error: 'Processing failed',
        message: error.message,
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}