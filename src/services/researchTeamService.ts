export default class ResearchTeamService {
  private apiUrl = '/api/research-team';
  
  async analyzeWithFullTeam(entry: any, historicalContext: any = null) {
    console.log('[ResearchTeamService] Requesting full team analysis...', {
      entryId: entry.id,
      entryTitle: entry.title,
      hasHistoricalContext: !!historicalContext,
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_entry',
          data: { 
            entry, 
            historicalContext 
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('[ResearchTeamService] Team analysis failed:', error);
        throw new Error(`Research team error: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('[ResearchTeamService] Team analysis complete:', {
        success: result.success,
        analysesCount: result.data?.initial_analyses?.length || 0,
        commentariesCount: result.data?.cross_commentary?.length || 0,
        totalWordCount: result.data?.word_count || 0,
        timestamp: result.timestamp
      });
      
      // Log each professional's contribution
      if (result.data?.initial_analyses) {
        result.data.initial_analyses.forEach((analysis: any) => {
          console.log(`[ResearchTeamService] ${analysis.speaker_name}:`, {
            professional: analysis.professional,
            primaryPattern: analysis.analysis?.pattern_identification?.primary_pattern,
            wordCount: analysis.word_count
          });
        });
      }
      
      return result.data;
    } catch (error: any) {
      console.error('[ResearchTeamService] Critical error:', error);
      throw error;
    }
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
  formatHistoricalContext(previousEntries: any[], limit: number = 5): string {
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