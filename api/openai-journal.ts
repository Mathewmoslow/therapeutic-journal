// ============================================
// FILE: /api/openai-journal.ts
// Journal-First System with OpenAI API Processing
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================
// OPENAI API SERVICE
// ============================================
class OpenAIService {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private model = 'gpt-4-turbo-preview'; // or 'gpt-4' for higher quality
  
  constructor() {
    console.log('[OpenAIService] Initializing service...');
    this.apiKey = process.env.OPENAI_API_KEY!;
    
    if (!this.apiKey) {
      console.error('[OpenAIService] CRITICAL: OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }
    
    console.log('[OpenAIService] Service initialized successfully', {
      model: this.model,
      apiKeyPresent: !!this.apiKey,
      apiKeyLength: this.apiKey?.length || 0,
      apiKeyPrefix: this.apiKey?.substring(0, 7) + '...' // Show only prefix for security
    });
  }
  
  async sendPrompt(systemPrompt: string, userPrompt: string, options: any = {}): Promise<any> {
    console.log('[OpenAI] Preparing API request...', {
      model: this.model,
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 4000,
      jsonMode: !!options.jsonResponse,
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000,
          response_format: options.jsonResponse ? { type: "json_object" } : undefined
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[OpenAI] API Request Failed:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          model: this.model,
          timestamp: new Date().toISOString()
        });
        
        // Try to parse error for more details
        let errorDetails = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson.error?.message || errorText;
        } catch {}
        
        throw new Error(`OpenAI API error (${response.status}): ${errorDetails}`);
      }
      
      const data = await response.json();
      console.log('[OpenAI] Response received successfully', {
        model: data.model,
        tokensUsed: data.usage?.total_tokens || 0,
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        finishReason: data.choices?.[0]?.finish_reason,
        responseLength: data.choices?.[0]?.message?.content?.length || 0,
        timestamp: new Date().toISOString()
      });
      
      const content = data.choices[0].message.content;
      
      // If expecting JSON, parse it
      if (options.jsonResponse) {
        try {
          return JSON.parse(content);
        } catch (e) {
          console.error('[OpenAI] Failed to parse JSON response:', e);
          return { raw_content: content, parse_error: true };
        }
      }
      
      return content;
    } catch (error: any) {
      console.error('[OpenAI] Critical error in sendPrompt:', {
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }
}

// ============================================
// PROMPT TEMPLATES FOR DIFFERENT ACTIONS
// ============================================
class PromptBuilder {
  
  // System prompt that defines the AI's therapeutic expertise
  static getSystemPrompt(): string {
    return `You are an expert therapeutic AI assistant specializing in:
- Identifying and analyzing cognitive distortions, especially in family dynamics
- Multiple therapeutic modalities: CBT, DBT, Psychodynamic, Family Systems, Somatic therapy
- DSM-5-TR diagnostic criteria and assessment
- Trauma-informed care and attachment theory

Your role is to:
1. Analyze journal entries for patterns and cognitive distortions
2. Provide therapeutic insights from multiple perspectives
3. Offer probabilistic diagnostic assessments when requested
4. Generate therapeutic conversations between different theoretical perspectives
5. Track progress and patterns across entries

Always:
- Quote directly from entries as evidence
- Provide specific, actionable insights
- Include appropriate disclaimers for diagnostic content
- Be warm, professional, and therapeutically valuable`;
  }
  
  // Analyze a journal entry for cognitive distortions
  static buildEntryAnalysisPrompt(entry: any, previousEntries: any[], settings: any): string {
    return `Analyze this journal entry for cognitive distortions, particularly those related to family dynamics.

CURRENT ENTRY:
Date: ${entry.createdAt}
Title: ${entry.title}
Content: ${entry.moment.raw_text}
Emotions: ${entry.initial_thoughts.emotions_felt.join(', ')}
Body Sensations: ${entry.initial_thoughts.body_sensations.join(', ')}
Response: ${entry.initial_thoughts.actual_response}

CONTEXT - Previous ${previousEntries.length} entries for pattern recognition:
${previousEntries.map(e => `- ${e.createdAt}: "${e.title}" - Themes: ${e.tags?.join(', ')}`).join('\n')}

Provide a comprehensive analysis in JSON format with this structure:
{
  "cognitive_distortions": [
    {
      "type": "Name of distortion",
      "quote": "Exact quote from entry",
      "context": "Family member or situation involved",
      "impact": "Emotional and behavioral impact",
      "pattern_frequency": "How often this appears across entries",
      "reframe": "Healthier perspective"
    }
  ],
  "family_dynamics": {
    "patterns_identified": ["List of family patterns"],
    "role_in_family": "User's role in family system",
    "boundaries": "Boundary issues observed",
    "communication_style": "How family communicates"
  },
  "therapeutic_perspectives": {
    "cbt": "Cognitive-behavioral analysis",
    "psychodynamic": "Unconscious patterns and defenses",
    "family_systems": "Systems perspective",
    "somatic": "Body-based observations"
  },
  "growth_opportunities": ["Specific areas for growth"],
  "coping_strategies": ["Recommended tools and techniques"],
  ${settings?.includeDSM ? `
  "diagnostic_indicators": {
    "disclaimer": "Educational only - not a diagnosis",
    "patterns_noted": ["DSM-relevant patterns"],
    "probability_assessment": {
      "condition": "Most likely condition if any",
      "probability": "0-100",
      "evidence": ["Supporting observations"]
    }
  },` : ''}
  "conversation_starters": ["Questions to explore in therapy"]
}`;
  }
  
  // Generate autonomous therapeutic dialogue between perspectives
  static buildAutonomousDialoguePrompt(entries: any[], lastCheckpoint: any): string {
    return `The user hasn't made a journal entry in several days. Generate a therapeutic conversation between two different therapeutic perspectives, discussing patterns from their existing entries to maintain therapeutic momentum.

AVAILABLE DATA:
- ${entries.length} total journal entries
- Most recent themes: ${entries.slice(0, 5).map(e => e.tags).flat().join(', ')}
- Last entry: ${entries[0]?.createdAt} - "${entries[0]?.title}"

Create a dialogue between two therapeutic perspectives (choose from CBT, Psychodynamic, Family Systems, Somatic, or DBT) discussing the user's patterns.

Format as JSON:
{
  "dialogue_type": "autonomous_therapeutic_conversation",
  "participants": ["Perspective 1 Name", "Perspective 2 Name"],
  "topic": "Main pattern being discussed",
  "conversation": [
    {
      "speaker": "Perspective 1",
      "statement": "Opening observation about a pattern",
      "reference": "Which entry or pattern this refers to"
    },
    {
      "speaker": "Perspective 2",
      "response": "Different angle on the same pattern",
      "insight": "What this perspective adds"
    }
    // Continue for 6-8 exchanges
  ],
  "synthesis": "Combined insight from both perspectives",
  "user_prompts": ["Questions for user to consider", "Experiments to try"],
  "relevance": "Why this dialogue is timely"
}`;
  }
  
  // Generate checkpoint report
  static buildCheckpointPrompt(entries: any[], previousCheckpoints: any[]): string {
    return `Generate a comprehensive checkpoint report analyzing patterns across these journal entries.

ENTRIES TO ANALYZE (${entries.length} entries):
${entries.map(e => `
Date: ${e.createdAt}
Title: ${e.title}
Content: ${e.moment.raw_text}
Emotions: ${e.initial_thoughts?.emotions_felt?.join(', ')}
`).join('\n---\n')}

${previousCheckpoints.length > 0 ? `PREVIOUS CHECKPOINT SUMMARY:
${previousCheckpoints[0].summary}` : ''}

Create a checkpoint report in JSON format:
{
  "period_analyzed": {
    "start": "First entry date",
    "end": "Last entry date",
    "total_entries": ${entries.length}
  },
  "primary_patterns": [
    {
      "pattern": "Pattern name",
      "frequency": "How often it appears",
      "evolution": "How it's changing",
      "evidence": ["Quotes from entries"]
    }
  ],
  "cognitive_distortions_summary": {
    "most_common": ["Top 3 distortions"],
    "improving": ["Distortions decreasing"],
    "persistent": ["Distortions unchanging"]
  },
  "family_dynamics_evolution": {
    "role_changes": "Any shifts in family role",
    "boundary_progress": "Boundary improvements",
    "communication_shifts": "Changes in communication"
  },
  "therapeutic_progress": {
    "insights_gained": ["Key realizations"],
    "skills_practiced": ["Techniques tried"],
    "challenges": ["Ongoing difficulties"]
  },
  "recommendations": {
    "focus_areas": ["Priority areas for next period"],
    "specific_practices": ["Concrete exercises"],
    "professional_support": "Whether to seek therapy"
  },
  "narrative_summary": "2-3 paragraph narrative of the period"
}`;
  }
  
  // DSM-5 diagnostic assessment
  static buildDiagnosticPrompt(entries: any[]): string {
    return `Provide a probabilistic diagnostic assessment based on patterns observed across all journal entries. Use DSM-5-TR criteria.

COMPLETE ENTRY HISTORY (${entries.length} entries):
${entries.map(e => `${e.createdAt}: ${e.title} - ${e.moment.raw_text.substring(0, 200)}...`).join('\n\n')}

Provide assessment in JSON format:
{
  "disclaimer": "This is an educational assessment based on journal patterns, not a medical diagnosis. Professional evaluation is recommended.",
  "assessment_date": "${new Date().toISOString()}",
  "entries_analyzed": ${entries.length},
  "time_span": "Duration of entries",
  
  "primary_considerations": [
    {
      "condition": "DSM-5 condition name",
      "icd_10": "ICD-10 code",
      "probability": 0-100,
      "confidence": "low/moderate/high",
      "criteria_evidence": {
        "met": ["Criteria with supporting quotes"],
        "partial": ["Partially met criteria"],
        "insufficient_data": ["Cannot assess"]
      },
      "duration": "How long symptoms present",
      "severity": "mild/moderate/severe",
      "functional_impact": "Impact on daily life"
    }
  ],
  
  "differential_diagnosis": [
    {
      "condition": "Alternative condition",
      "probability": 0-100,
      "distinguishing_factors": "What differentiates"
    }
  ],
  
  "family_factors": {
    "contribution": "How family dynamics affect symptoms",
    "systemic_patterns": "Family patterns influencing condition"
  },
  
  "recommendations": {
    "immediate": ["Any urgent recommendations"],
    "assessment_tools": ["Screening tools to consider"],
    "therapeutic_approaches": ["Recommended therapy types"],
    "medical_consultation": "Whether to see psychiatrist"
  },
  
  "prognosis": "Expected course with/without treatment"
}`;
  }
}

// ============================================
// MAIN API HANDLER
// ============================================
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  console.log(`[API] Request received:`, {
    requestId,
    method: req.method,
    path: '/api/openai-journal',
    headers: {
      contentType: req.headers['content-type'],
      origin: req.headers['origin'],
      userAgent: req.headers['user-agent']
    },
    timestamp: new Date().toISOString()
  });
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log(`[API][${requestId}] Parsing request body...`);
    const { action, data, settings = {} } = req.body;
    
    console.log(`[API][${requestId}] Request details:`, {
      action,
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
      settings,
      bodySize: JSON.stringify(req.body).length
    });
    
    console.log(`[API][${requestId}] Initializing OpenAI service...`);
    const openai = new OpenAIService();
    
    console.log(`[API][${requestId}] Processing action: ${action}`);
    
    let result;
    
    switch (action) {
      case 'analyze_entry':
        // Analyze a journal entry
        const { entry, previousEntries = [] } = data;
        
        console.log(`[API][${requestId}] Analyzing entry:`, {
          entryId: entry?.id,
          entryTitle: entry?.title,
          entryTextLength: entry?.moment?.raw_text?.length || 0,
          emotionsCount: entry?.initial_thoughts?.emotions_felt?.length || 0,
          previousEntriesCount: previousEntries.length
        });
        
        const analysisPrompt = PromptBuilder.buildEntryAnalysisPrompt(
          entry, 
          previousEntries, 
          settings
        );
        
        console.log(`[API][${requestId}] Prompt built, length: ${analysisPrompt.length} characters`);
        
        result = await openai.sendPrompt(
          PromptBuilder.getSystemPrompt(),
          analysisPrompt,
          { jsonResponse: true, maxTokens: 4000 }
        );
        
        console.log(`[API][${requestId}] Entry analysis complete`);
        break;
        
      case 'autonomous_dialogue':
        // Generate therapeutic dialogue when no new entries
        const { entries, lastCheckpoint } = data;
        const dialoguePrompt = PromptBuilder.buildAutonomousDialoguePrompt(
          entries,
          lastCheckpoint
        );
        
        result = await openai.sendPrompt(
          PromptBuilder.getSystemPrompt(),
          dialoguePrompt,
          { jsonResponse: true, maxTokens: 3000, temperature: 0.8 }
        );
        break;
        
      case 'generate_checkpoint':
        // Generate checkpoint report
        const { entries: checkpointEntries, previousCheckpoints = [] } = data;
        const checkpointPrompt = PromptBuilder.buildCheckpointPrompt(
          checkpointEntries,
          previousCheckpoints
        );
        
        result = await openai.sendPrompt(
          PromptBuilder.getSystemPrompt(),
          checkpointPrompt,
          { jsonResponse: true, maxTokens: 5000 }
        );
        break;
        
      case 'diagnostic_assessment':
        // Generate DSM-5 based assessment
        const { entries: allEntries } = data;
        const diagnosticPrompt = PromptBuilder.buildDiagnosticPrompt(allEntries);
        
        result = await openai.sendPrompt(
          PromptBuilder.getSystemPrompt(),
          diagnosticPrompt,
          { jsonResponse: true, maxTokens: 6000, temperature: 0.5 }
        );
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    console.log(`[API][${requestId}] Request processed successfully:`, {
      action,
      resultPresent: !!result,
      resultType: typeof result,
      timestamp: new Date().toISOString()
    });
    
    const response = {
      success: true,
      action,
      data: result,
      timestamp: new Date().toISOString(),
      requestId
    };
    
    console.log(`[API][${requestId}] Sending success response`);
    return res.status(200).json(response);
    
  } catch (error: any) {
    console.error(`[API][${requestId}] Request failed:`, {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Determine appropriate status code
    let statusCode = 500;
    if (error.message?.includes('API key')) statusCode = 401;
    if (error.message?.includes('Invalid action')) statusCode = 400;
    
    const errorResponse = {
      error: 'Processing failed',
      message: error.message,
      timestamp: new Date().toISOString(),
      requestId,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    console.error(`[API][${requestId}] Sending error response:`, errorResponse);
    return res.status(statusCode).json(errorResponse);
  }
}

// ============================================
// FILE: /services/journalService.ts
// Frontend service to interact with API
// ============================================

export class JournalService {
  private apiUrl = '/api/openai-journal';
  
  async analyzeEntry(entry: any, previousEntries: any[] = [], settings: any = {}) {
    console.log('[JournalService] Analyzing entry:', entry.id);
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analyze_entry',
        data: { entry, previousEntries },
        settings
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze entry');
    }
    
    const result = await response.json();
    return result.data;
  }
  
  async generateAutonomousDialogue(entries: any[], lastCheckpoint: any = null) {
    console.log('[JournalService] Generating autonomous dialogue');
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'autonomous_dialogue',
        data: { entries, lastCheckpoint }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate dialogue');
    }
    
    const result = await response.json();
    return result.data;
  }
  
  async generateCheckpoint(entries: any[], previousCheckpoints: any[] = []) {
    console.log('[JournalService] Generating checkpoint for', entries.length, 'entries');
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_checkpoint',
        data: { entries, previousCheckpoints }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate checkpoint');
    }
    
    const result = await response.json();
    return result.data;
  }
  
  async generateDiagnosticAssessment(entries: any[]) {
    console.log('[JournalService] Generating diagnostic assessment');
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'diagnostic_assessment',
        data: { entries }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate assessment');
    }
    
    const result = await response.json();
    return result.data;
  }
  
  // Check if autonomous content should be generated
  shouldGenerateAutonomousContent(lastEntryDate: string): boolean {
    const daysSinceLastEntry = (Date.now() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastEntry > 3; // If no entry for 3+ days
  }
}