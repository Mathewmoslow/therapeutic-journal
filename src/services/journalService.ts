export default class JournalService {
  private apiUrl = '/api/openai-journal';
  
  async analyzeEntry(entry: any, previousEntries: any[] = [], settings: any = {}) {
    console.log('[JournalService] Starting entry analysis...', {
      entryId: entry.id,
      entryTitle: entry.title,
      previousEntriesCount: previousEntries.length,
      timestamp: new Date().toISOString()
    });
    
    const requestPayload = {
      action: 'analyze_entry',
      data: { entry, previousEntries },
      settings
    };
    
    console.log('[JournalService] Request payload prepared:', {
      action: requestPayload.action,
      hasEntry: !!requestPayload.data.entry,
      entryTextLength: entry.moment?.raw_text?.length || 0,
      settings: settings
    });
    
    try {
      console.log('[JournalService] Sending request to:', this.apiUrl);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });
      
      console.log('[JournalService] Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: {
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[JournalService] API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          url: response.url
        });
        
        let errorMessage = `API Error (${response.status}): `;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage += errorJson.error || errorJson.message || response.statusText;
        } catch {
          errorMessage += errorText || response.statusText;
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      console.log('[JournalService] Analysis complete:', {
        success: result.success,
        hasData: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : [],
        timestamp: result.timestamp
      });
      
      if (result.data) {
        console.log('[JournalService] Analysis results:', {
          cognitiveDistortions: result.data.cognitive_distortions?.length || 0,
          hasFamilyDynamics: !!result.data.family_dynamics,
          hasTherapeuticPerspectives: !!result.data.therapeutic_perspectives,
          growthOpportunities: result.data.growth_opportunities?.length || 0
        });
      }
      
      return result.data;
    } catch (error: any) {
      console.error('[JournalService] Critical error during analysis:', {
        errorMessage: error.message,
        errorStack: error.stack,
        errorName: error.name,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }
  
  async generateAutonomousDialogue(entries: any[], lastCheckpoint: any = null) {
    console.log('[JournalService] Generating autonomous dialogue');
    
    try {
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
    } catch (error) {
      console.error('[JournalService] Error generating dialogue:', error);
      throw error;
    }
  }
  
  async generateCheckpoint(entries: any[], previousCheckpoints: any[] = []) {
    console.log('[JournalService] Generating checkpoint for', entries.length, 'entries');
    
    try {
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
    } catch (error) {
      console.error('[JournalService] Error generating checkpoint:', error);
      throw error;
    }
  }
  
  async generateDiagnosticAssessment(entries: any[]) {
    console.log('[JournalService] Generating diagnostic assessment');
    
    try {
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
    } catch (error) {
      console.error('[JournalService] Error generating assessment:', error);
      throw error;
    }
  }
  
  shouldGenerateAutonomousContent(lastEntryDate: string): boolean {
    const daysSinceLastEntry = (Date.now() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastEntry > 3;
  }
}