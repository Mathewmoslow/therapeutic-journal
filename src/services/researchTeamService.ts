export default class ResearchTeamService {
  private apiUrl = '/api/research-team';
  
  async analyzeWithFullTeam(entry: any, historicalContext: any = null, options: { quickMode?: boolean, timeout?: number } = {}) {
    const { quickMode = true, timeout = 45000 } = options; // Default to quick mode
    
    console.log('[ResearchTeamService] Requesting full team analysis...', {
      entryId: entry.id,
      entryTitle: entry.title,
      hasHistoricalContext: !!historicalContext,
      quickMode,
      timeout,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Create an AbortController for client-side timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_entry',
          data: { 
            entry, 
            historicalContext 
          },
          settings: {
            quickMode
          }
        }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        const error = await response.text();
        console.error('[ResearchTeamService] Team analysis failed:', error);
        
        // If it's a timeout or 504, return a simplified fallback
        if (response.status === 504 || response.status === 408) {
          console.warn('[ResearchTeamService] Timeout detected, returning fallback analysis');
          return this.getFallbackAnalysis(entry);
        }
        
        throw new Error(`Research team error: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('[ResearchTeamService] Team analysis complete:', {
        success: result.success,
        quickMode: result.data?.quickMode,
        analysesCount: result.data?.initial_analyses?.length || 0,
        commentariesCount: result.data?.cross_commentary?.length || 0,
        totalWordCount: result.data?.word_count || 0,
        executionTime: result.executionTime,
        timestamp: result.timestamp
      });
      
      // Log each professional's contribution
      if (result.data?.initial_analyses) {
        result.data.initial_analyses.forEach((analysis: any) => {
          if (!analysis.error) {
            console.log(`[ResearchTeamService] ${analysis.speaker_name}:`, {
              professional: analysis.professional,
              primaryPattern: analysis.analysis?.pattern_identification?.primary_pattern,
              wordCount: analysis.word_count
            });
          }
        });
      }
      
      return result.data;
    } catch (error: any) {
      console.error('[ResearchTeamService] Critical error:', error);
      
      // If it's an abort error (timeout), return fallback
      if (error.name === 'AbortError') {
        console.warn('[ResearchTeamService] Client timeout, returning fallback analysis');
        return this.getFallbackAnalysis(entry);
      }
      
      throw error;
    }
  }
  
  // Fallback analysis when the full team times out
  private getFallbackAnalysis(entry: any) {
    return {
      entry_analyzed: {
        id: entry.id,
        title: entry.title,
        date: entry.createdAt
      },
      initial_analyses: [{
        professional: 'system',
        speaker_name: '⚠️ TIMEOUT - PLACEHOLDER ANALYSIS',
        analysis: {
          opening_observation: `⚠️ **ANALYSIS TIMEOUT** - The research team analysis timed out due to high processing demands. This is a PLACEHOLDER response. Your entry "${entry.title}" has been saved but needs to be re-analyzed.`,
          pattern_identification: {
            primary_pattern: '❌ ANALYSIS FAILED - TIMEOUT ERROR',
            evidence: ['This is not real analysis', 'Please retry the analysis'],
            pattern_function: '⚠️ PLACEHOLDER - Not actual analysis',
            pattern_cost: '⚠️ PLACEHOLDER - Not actual analysis'
          },
          theoretical_framework: {
            through_my_lens: '🔄 **TO GET REAL ANALYSIS:** Click the "Retry Analysis" button below or re-submit this entry. The timeout occurred because the AI team took too long to respond.',
            key_concepts: ['TIMEOUT', 'RETRY NEEDED', 'PLACEHOLDER'],
            clinical_observations: '⏱️ **WHY THIS HAPPENED:** The research team analysis can take 30-60 seconds. Your Vercel hosting plan has a timeout limit that was exceeded. Consider upgrading to Vercel Pro for longer timeouts, or use the Quick Mode option.'
          },
          family_dynamics: {
            roles_observed: '❌ NOT ANALYZED - TIMEOUT',
            power_dynamics: '❌ NOT ANALYZED - TIMEOUT', 
            communication_patterns: '❌ NOT ANALYZED - TIMEOUT',
            emotional_rules: '❌ NOT ANALYZED - TIMEOUT'
          },
          therapeutic_implications: '💡 **SOLUTIONS:** 1) Click "Retry Analysis" below, 2) Enable Quick Mode for faster analysis, 3) Upgrade Vercel plan for longer timeouts, or 4) Try again during off-peak hours.'
        },
        error: true
      }],
      cross_commentary: [],
      fallback: true,
      requiresRetry: true,
      timestamp: new Date().toISOString()
    };
  }
  
  // New method to retry failed analysis
  async retryAnalysis(entryId: string, options: { quickMode?: boolean } = { quickMode: true }) {
    console.log('[ResearchTeamService] Retrying analysis for entry:', entryId);
    
    // Retrieve the entry from localStorage
    const storedEntries = localStorage.getItem('journalEntries');
    if (!storedEntries) {
      throw new Error('No entries found in storage');
    }
    
    const entries = JSON.parse(storedEntries);
    const entry = entries.find((e: any) => e.id === entryId);
    
    if (!entry) {
      throw new Error(`Entry ${entryId} not found`);
    }
    
    // Get historical context
    const historicalContext = this.formatHistoricalContext(
      entries.filter((e: any) => e.id !== entryId).slice(0, 5)
    );
    
    // Retry with specified options
    return this.analyzeWithFullTeam(entry, historicalContext, options);
  }
  
  async getSinglePerspective(entry: any, professional: string, historicalContext: any = null) {
    console.log(`[ResearchTeamService] Requesting ${professional} perspective...`);
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'single_perspective',
          data: { 
            entry, 
            professional,
            historicalContext 
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get ${professional} perspective`);
      }
      
      const result = await response.json();
      
      console.log(`[ResearchTeamService] ${professional} analysis complete:`, {
        pattern: result.data?.analysis?.pattern_identification?.primary_pattern,
        wordCount: result.data?.word_count
      });
      
      return result.data;
    } catch (error: any) {
      console.error(`[ResearchTeamService] ${professional} analysis error:`, error);
      throw error;
    }
  }
  
  async generateCheckpoint(entries: any[], previousAnalyses: any[] = []) {
    console.log('[ResearchTeamService] Requesting checkpoint synthesis...', {
      entriesCount: entries.length,
      previousAnalysesCount: previousAnalyses.length,
      timespan: entries.length > 0 ? {
        from: entries[entries.length - 1].createdAt,
        to: entries[0].createdAt
      } : null
    });
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_checkpoint',
          data: { 
            entries, 
            previousAnalyses 
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate checkpoint');
      }
      
      const result = await response.json();
      
      console.log('[ResearchTeamService] Checkpoint complete:', {
        periodAnalyzed: result.data?.period_analyzed,
        consensusPatterns: result.data?.team_consensus?.agreed_patterns?.length || 0,
        divergentViews: result.data?.team_consensus?.divergent_views?.length || 0,
        narrativeLength: result.data?.checkpoint_narrative?.length || 0
      });
      
      return result.data;
    } catch (error: any) {
      console.error('[ResearchTeamService] Checkpoint error:', error);
      throw error;
    }
  }
  
  // Helper method to get historical context from previous entries
  formatHistoricalContext(previousEntries: any[], limit: number = 5): string | null {
    if (!previousEntries || previousEntries.length === 0) {
      return null;
    }
    
    const recentEntries = previousEntries.slice(0, limit);
    
    return recentEntries.map(entry => 
      `Date: ${entry.createdAt}\n` +
      `Title: ${entry.title}\n` +
      `Key Pattern: ${entry.analysis?.pattern_identification?.primary_pattern || 'Not analyzed'}\n` +
      `Themes: ${entry.tags?.join(', ') || 'None'}`
    ).join('\n---\n');
  }
  
  // Method to check if we should generate a checkpoint
  shouldGenerateCheckpoint(entries: any[]): boolean {
    // Generate checkpoint every 10 entries or 30 days
    const shouldByCount = entries.length >= 10;
    
    if (entries.length < 2) return false;
    
    const daysSinceFirst = Math.floor(
      (new Date(entries[0].createdAt).getTime() - 
       new Date(entries[entries.length - 1].createdAt).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    const shouldByTime = daysSinceFirst >= 30;
    
    console.log('[ResearchTeamService] Checkpoint check:', {
      entryCount: entries.length,
      daysSinceFirst,
      shouldByCount,
      shouldByTime,
      shouldGenerate: shouldByCount || shouldByTime
    });
    
    return shouldByCount || shouldByTime;
  }
}