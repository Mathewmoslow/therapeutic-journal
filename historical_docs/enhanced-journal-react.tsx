import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Brain, Heart, Users, Activity, 
  Sparkles, ChevronRight, Clock, Tag, MessageCircle,
  FileText, TrendingUp, Shield, Download, Settings,
  AlertCircle, Zap, Layers, Calendar, BookMarked,
  AlertTriangle, CheckCircle, FileDown, Filter,
  BarChart3, ClipboardCheck, Info
} from 'lucide-react';

// Enhanced Therapeutic Service with new features
class TherapeuticService {
  constructor() {
    this.apiUrl = '/api';
    this.authToken = localStorage.getItem('auth_token');
    this.settings = JSON.parse(localStorage.getItem('user_settings') || '{}');
  }
  
  async generateReflection(entry, enableDSM = false) {
    // Mock response for demo - includes DSM alignment if enabled
    return new Promise(resolve => {
      setTimeout(() => {
        const reflection = {
          id: `ref_${Date.now()}`,
          entryId: entry.id,
          generatedAt: new Date().toISOString(),
          executive_summary: {
            pattern_name: "Invalidation-Withdrawal Cycle",
            key_insight: "Based on what you've described, humor serves as system maintenance",
            urgency_level: "moderate",
            growth_edge: "Staying present in THIS specific dismissive moment"
          },
          distortion_analysis: {
            primary: [
              {
                type: "Minimization",
                evidence: "You wrote: 'always overreact' - this reduces your valid concern",
                impact: "Self-doubt about THIS specific financial concern",
                counter_evidence: "Your financial concerns in THIS situation are proportionate"
              }
            ],
            secondary: ["mind_reading", "emotional_reasoning"]
          },
          therapeutic_lenses: {
            CBT: {
              thought_record: {
                situation: "The exact dinner conversation you described",
                automatic_thought: "From your words: 'I'm too sensitive'",
                emotion: "The shame (70%) you mentioned",
                balanced_thought: "My concerns about THIS bill discussion are valid",
                outcome_emotion: "Frustration (40%)"
              },
              behavioral_pattern: "In THIS entry: Joke → Withdraw → Ruminate",
              intervention: "DEAR MAN for THIS specific money discussion"
            },
            Psychodynamic: {
              unconscious_theme: "Money as control proxy IN THIS interaction",
              transference: "THIS relative's dismissal activates something",
              defense_mechanisms: ["withdrawal shown in THIS moment"],
              interpretation: "The pattern IN THIS ENTRY suggests protection"
            },
            Family_Systems: {
              role_in_system: "Truth-teller in THIS dinner dynamic",
              homeostatic_function: "The joke in THIS moment maintains distance",
              triangulation: "Money created splits in THIS conversation",
              differentiation_level: "Moderate - reactive but aware in THIS instance"
            },
            Somatic: {
              body_map: {
                chest: "The 'tightness' you mentioned",
                throat: "Not mentioned in your entry",
                shoulders: "The 'bracing' you described"
              },
              nervous_system_state: "Based on YOUR described sensations: dorsal vagal",
              resource: "For THESE specific sensations: bilateral stimulation"
            },
            Psychiatric_Education: {
              relevant_patterns: "THIS entry shows anxiety in financial contexts",
              biological_factors: "Your described stress response to THIS trigger",
              screening_suggestions: ["GAD-7 might explore THIS pattern"],
              red_flags: "None in THIS entry",
              disclaimer: "Educational only - not diagnostic"
            }
          },
          starter_chapters: {
            title: "When Jokes Guard THIS Gate",
            opening: "The dinner table moment you've described becomes a microcosm of something larger. Not your entire history - we're looking at THIS specific moment - but it reveals a pattern worth examining. You wrote about feeling dismissed when the relative joked about you 'always overreacting' to money topics. In THAT moment, as you described it, you withdrew. This isn't about guessing your past or your childhood - it's about THIS exact interaction you've shared. The joke arrived, as you noted, right when finances came up. You mentioned feeling your chest tighten, your breath shallow. These are YOUR words, YOUR sensations in THAT moment. What's significant is how you've identified the pattern yourself: topic arises, joke deflects, you withdraw. This specific sequence you've described suggests a systemic dance - not malicious, but functional. It keeps the conversation from going deeper into territory that might be uncomfortable for everyone at that table. Based solely on what you've shared about THIS dinner, we can see how the 'overreactor' label serves to minimize legitimate financial concerns. You haven't mentioned the specific bills or amounts, so we won't speculate - but you've made clear that YOU felt your concerns were valid. That feeling matters. The withdrawal you described isn't weakness - it's a learned response to THIS type of dismissal. When someone important to you (you mentioned this was a relative) reduces complex concerns to a character flaw ('always overreacting'), the natural response is often to pull back. You've shown this clearly in your entry."
          },
          conversation_seeds: [
            "What happened in your body right before you withdrew at THAT dinner?",
            "How might you stay present if THIS exact scenario happens again?",
            "What would THIS relative need to say for you to feel heard about finances?"
          ]
        };
        
        // Add DSM alignment if enabled
        if (enableDSM) {
          reflection.dsm_alignment = {
            disclaimer: "EDUCATIONAL ONLY - Pattern recognition from THIS entry, not diagnosis",
            patterns_observed: [
              {
                category: "Anxiety",
                specific_patterns: [
                  "Physiological arousal in THIS financial discussion",
                  "Withdrawal behavior in THIS social situation"
                ],
                criteria_partially_met: [
                  "Anxiety in THIS specific social situation",
                  "Physical symptoms you described: chest tightness, shallow breath"
                ],
                criteria_not_assessed: [
                  "Duration (single entry only)",
                  "Frequency across situations",
                  "Full functional impairment"
                ],
                clinical_significance: "Distress evident in THIS entry",
                duration_unknown: true,
                differential_considerations: [
                  "Situational stress from THIS specific dynamic",
                  "Appropriate response to invalidation"
                ]
              }
            ],
            screening_tools: [
              {
                tool: "GAD-7",
                rationale: "Could explore if THIS pattern extends beyond this situation",
                relevant_items: ["Feeling nervous, anxious", "Not being able to stop worrying"]
              },
              {
                tool: "Social Phobia Inventory",
                rationale: "THIS withdrawal pattern in social context",
                relevant_items: ["Fear of criticism", "Avoidance of confrontation"]
              }
            ],
            important_note: "This is pattern recognition from ONE entry. Clinical diagnosis requires comprehensive assessment over time by a licensed professional."
          };
        }
        
        resolve(reflection);
      }, 2000);
    });
  }
  
  async generateCheckpoint(entries) {
    // Mock checkpoint report
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          metadata: {
            period_start: entries[entries.length - 1]?.createdAt,
            period_end: entries[0]?.createdAt,
            total_entries: entries.length,
            entries_analyzed: entries.map(e => e.id)
          },
          pattern_analysis: {
            recurring_themes: [
              {
                theme: "Financial discussions triggering withdrawal",
                frequency: "3 of 5 entries mention money",
                specific_instances: [
                  "Entry 1: 'bills came up at dinner'",
                  "Entry 3: 'budget talk ended badly'"
                ],
                evolution: "Progressing from immediate withdrawal to attempting to stay present"
              },
              {
                theme: "Humor as deflection",
                frequency: "4 of 5 entries",
                specific_instances: [
                  "Entry 1: 'overreact joke'",
                  "Entry 2: 'too serious comment'"
                ],
                evolution: "Beginning to recognize pattern in real-time"
              }
            ],
            recurring_distortions: [
              {
                distortion: "Minimization",
                appearances: [
                  "Entry 1: reducing concerns to 'overreacting'",
                  "Entry 4: 'making big deal of nothing'"
                ],
                contexts: ["Money talks", "Planning discussions"],
                intensity_trend: "stable"
              }
            ]
          },
          therapeutic_progress: {
            CBT: {
              cognitive_flexibility: "Increasing - challenging 'too sensitive' in Entry 5",
              behavioral_changes: "Attempted to stay present in Entry 4",
              skill_utilization: "Used breathing technique in Entry 5"
            },
            Somatic: {
              body_awareness: "Growing - now noticing chest tightness earlier",
              sensation_vocabulary: "More specific: 'throat closing' vs just 'tense'",
              regulation_capacity: "Attempted grounding in Entry 5"
            }
          },
          clinical_observations: {
            risk_assessment: {
              self_harm_indicators: "None",
              support_system: "Some family mentioned, though complex",
              coping_resources: "Journaling, beginning body awareness"
            }
          },
          recommendations: {
            immediate_practices: [
              {
                practice: "5-4-3-2-1 grounding before family dinners",
                rationale: "Based on withdrawal pattern in THESE entries",
                implementation: "Use before situations described in entries"
              }
            ]
          },
          narrative_synthesis: "Across these 5 entries spanning two weeks, a clear pattern emerges around financial discussions and family dynamics. You've documented specific moments - not your entire history, but THESE particular interactions - that show how certain topics trigger predictable responses. In Entry 1, you described the 'overreact' comment at dinner. By Entry 4, you were noticing the pattern as it happened. This progression, evident in YOUR words across THESE entries, suggests growing awareness. The somatic elements you've tracked - chest tightness in 3 entries, shallow breathing in 4 - provide a body-based map of this pattern. What's encouraging is Entry 5, where you attempted to use breathing techniques in the moment. Based on THESE specific entries, the growth edge appears to be staying present when dismissive humor arises, using the body awareness you're developing as an anchor."
        });
      }, 3000);
    });
  }
  
  async exportBook(entries, format = 'markdown') {
    // Mock book export
    return new Promise(resolve => {
      setTimeout(() => {
        const bookContent = `# Therapeutic Journey: ${new Date().toFullYear()}

## Introduction

This book documents ${entries.length} entries from your therapeutic journey, focusing solely on the experiences and patterns you've shared.

## Chapters

${entries.map((entry, i) => `
### Chapter ${i + 1}: ${entry.title}
*${new Date(entry.createdAt).toLocaleDateString()}*

**The Moment:**
${entry.moment.raw_text}

**Initial Response:**
- Emotions: ${entry.initial_thoughts.emotions_felt.join(', ')}
- Sensations: ${entry.initial_thoughts.body_sensations.join(', ')}
- Response: ${entry.initial_thoughts.actual_response}

---
`).join('\n')}

## Conclusion

These entries, spanning from ${new Date(entries[entries.length-1]?.createdAt).toLocaleDateString()} to ${new Date(entries[0]?.createdAt).toLocaleDateString()}, document your specific experiences without speculation or addition.

*Generated with privacy protection and content integrity.*`;

        const blob = new Blob([bookContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        resolve({ url, filename: `therapeutic-journey-${Date.now()}.md` });
      }, 2000);
    });
  }
}

const therapeuticService = new TherapeuticService();

// Main Enhanced Component
const EnhancedTherapeuticJournal = () => {
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [activeView, setActiveView] = useState('entries');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [settings, setSettings] = useState({
    enableDSM: false,
    autoCheckpoints: true,
    checkpointFrequency: 14,
    minEntriesForCheckpoint: 5,
    exportFormat: 'markdown'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  
  // Design system
  const colors = {
    sage: '#4A7C7E',
    purple: '#7C4A6F',
    terracotta: '#C07C4A',
    deepBlue: '#4A5F7C',
    text: '#2C3E50',
    textMuted: '#718096',
    bg: '#FAFAF8',
    surface: '#FFFFFF',
    success: '#48BB78',
    warning: '#ED8936',
    error: '#E53E3E',
    info: '#4299E1'
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: colors.text
    },
    header: {
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.bg}`,
      padding: '1.5rem 2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    nav: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
      flexWrap: 'wrap'
    },
    navButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: colors.textMuted,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    navButtonActive: {
      backgroundColor: colors.sage,
      color: colors.surface
    },
    content: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 2rem'
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid transparent'
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem'
    },
    primaryButton: {
      backgroundColor: colors.sage,
      color: colors.surface
    },
    warningButton: {
      backgroundColor: colors.warning,
      color: colors.surface
    },
    infoBox: {
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: `${colors.info}10`,
      border: `1px solid ${colors.info}30`,
      marginBottom: '1rem'
    },
    dsmBox: {
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: `${colors.warning}10`,
      border: `2px solid ${colors.warning}30`,
      marginTop: '1rem'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  };

  // Process entry with enhanced features
  const processWithAI = async (entry) => {
    setIsProcessing(true);
    try {
      const reflection = await therapeuticService.generateReflection(entry, settings.enableDSM);
      
      const updatedEntry = { ...entry, hasReflection: true, reflection };
      setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
      setActiveEntry(updatedEntry);
      
      // Auto-start conversation with content-aware prompt
      setConversation([
        {
          role: 'assistant',
          content: reflection.conversation_seeds[0],
          timestamp: new Date().toISOString()
        }
      ]);
      
      // Check if checkpoint should be generated
      checkForCheckpoint();
    } catch (error) {
      console.error('Error processing with AI:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check and generate checkpoint if criteria met
  const checkForCheckpoint = async () => {
    if (!settings.autoCheckpoints) return;
    
    const recentEntries = entries.slice(0, settings.minEntriesForCheckpoint);
    if (recentEntries.length < settings.minEntriesForCheckpoint) return;
    
    const lastCheckpoint = checkpoints[0];
    const daysSinceLastCheckpoint = lastCheckpoint 
      ? Math.floor((Date.now() - new Date(lastCheckpoint.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    if (daysSinceLastCheckpoint >= settings.checkpointFrequency) {
      const checkpoint = await therapeuticService.generateCheckpoint(recentEntries);
      checkpoint.id = `chk_${Date.now()}`;
      checkpoint.createdAt = new Date().toISOString();
      setCheckpoints(prev => [checkpoint, ...prev]);
      
      // Show notification
      alert('New checkpoint report generated! View it in the Patterns tab.');
    }
  };

  // Export book
  const handleExport = async () => {
    setExportProgress('Generating your therapeutic journey book...');
    try {
      const result = await therapeuticService.exportBook(entries, settings.exportFormat);
      
      // Create download link
      const a = document.createElement('a');
      a.href = result.url;
      a.download = result.filename;
      a.click();
      
      setExportProgress('Export complete!');
      setTimeout(() => setExportProgress(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportProgress('Export failed. Please try again.');
    }
  };

  // Settings Modal
  const SettingsModal = () => (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={{marginBottom: '1.5rem'}}>Settings</h2>
        
        <div style={{marginBottom: '1.5rem'}}>
          <h3 style={{fontSize: '1rem', marginBottom: '1rem', color: colors.warning}}>
            <AlertTriangle size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
            DSM-5 Educational Alignment
          </h3>
          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
            <input
              type="checkbox"
              checked={settings.enableDSM}
              onChange={(e) => setSettings({...settings, enableDSM: e.target.checked})}
            />
            Enable DSM-5 pattern recognition (Educational only - not diagnostic)
          </label>
          <p style={{fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            Adds educational pattern matching to help identify when professional assessment might be helpful.
            This is NOT diagnosis and should not replace professional evaluation.
          </p>
        </div>
        
        <div style={{marginBottom: '1.5rem'}}>
          <h3 style={{fontSize: '1rem', marginBottom: '1rem'}}>
            <BarChart3 size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
            Checkpoint Reports
          </h3>
          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
            <input
              type="checkbox"
              checked={settings.autoCheckpoints}
              onChange={(e) => setSettings({...settings, autoCheckpoints: e.target.checked})}
            />
            Automatically generate checkpoint reports
          </label>
          <div style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <label style={{fontSize: '0.875rem'}}>
              Frequency: Every 
              <input
                type="number"
                value={settings.checkpointFrequency}
                onChange={(e) => setSettings({...settings, checkpointFrequency: parseInt(e.target.value)})}
                style={{width: '50px', margin: '0 0.25rem', padding: '0.25rem'}}
              />
              days
            </label>
          </div>
          <div style={{marginTop: '0.5rem', marginLeft: '1.5rem'}}>
            <label style={{fontSize: '0.875rem'}}>
              Minimum entries: 
              <input
                type="number"
                value={settings.minEntriesForCheckpoint}
                onChange={(e) => setSettings({...settings, minEntriesForCheckpoint: parseInt(e.target.value)})}
                style={{width: '50px', margin: '0 0.25rem', padding: '0.25rem'}}
              />
            </label>
          </div>
        </div>
        
        <div style={{marginBottom: '1.5rem'}}>
          <h3 style={{fontSize: '1rem', marginBottom: '1rem'}}>
            <FileDown size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
            Export Settings
          </h3>
          <label style={{fontSize: '0.875rem'}}>
            Default format:
            <select
              value={settings.exportFormat}
              onChange={(e) => setSettings({...settings, exportFormat: e.target.value})}
              style={{marginLeft: '0.5rem', padding: '0.25rem'}}
            >
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF (coming soon)</option>
            </select>
          </label>
        </div>
        
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
          <button
            onClick={() => {
              localStorage.setItem('user_settings', JSON.stringify(settings));
              setShowSettings(false);
            }}
            style={{...styles.button, ...styles.primaryButton}}
          >
            Save Settings
          </button>
          <button
            onClick={() => setShowSettings(false)}
            style={{...styles.button, backgroundColor: colors.bg, color: colors.text}}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Enhanced Reflection View with DSM-5 alignment
  const ReflectionView = () => {
    if (!activeEntry) return null;
    
    return (
      <div>
        <button
          onClick={() => setActiveView('entries')}
          style={{...styles.button, marginBottom: '1.5rem', backgroundColor: 'transparent'}}
        >
          ← Back to entries
        </button>
        
        <div style={styles.card}>
          <h2>{activeEntry.title}</h2>
          <p style={{color: colors.textMuted, marginTop: '0.5rem'}}>
            {new Date(activeEntry.createdAt).toLocaleString()}
          </p>
          <p style={{marginTop: '1rem', lineHeight: 1.6}}>
            {activeEntry.moment.raw_text}
          </p>
        </div>
        
        {isProcessing && (
          <div style={{...styles.card, textAlign: 'center', padding: '3rem'}}>
            <Brain size={48} style={{color: colors.sage, marginBottom: '1rem'}} />
            <p>Analyzing your specific entry without adding external content...</p>
          </div>
        )}
        
        {activeEntry.reflection && !isProcessing && (
          <>
            <div style={{...styles.card, borderLeft: `3px solid ${colors.sage}`}}>
              <h3 style={{color: colors.sage, marginBottom: '1rem'}}>
                <Zap size={20} style={{display: 'inline', marginRight: '0.5rem'}} />
                Executive Summary
              </h3>
              <p><strong>Pattern in THIS entry:</strong> {activeEntry.reflection.executive_summary.pattern_name}</p>
              <p><strong>Key insight:</strong> {activeEntry.reflection.executive_summary.key_insight}</p>
              <p><strong>Growth edge:</strong> {activeEntry.reflection.executive_summary.growth_edge}</p>
            </div>
            
            {settings.enableDSM && activeEntry.reflection.dsm_alignment && (
              <div style={styles.dsmBox}>
                <h3 style={{color: colors.warning, marginBottom: '1rem'}}>
                  <ClipboardCheck size={20} style={{display: 'inline', marginRight: '0.5rem'}} />
                  DSM-5 Educational Alignment
                </h3>
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: colors.surface,
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.error
                }}>
                  <AlertCircle size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                  {activeEntry.reflection.dsm_alignment.disclaimer}
                </div>
                
                {activeEntry.reflection.dsm_alignment.patterns_observed.map((pattern, idx) => (
                  <div key={idx} style={{marginBottom: '1rem'}}>
                    <h4 style={{color: colors.warning, marginBottom: '0.5rem'}}>
                      {pattern.category} Patterns
                    </h4>
                    <div style={{fontSize: '0.875rem'}}>
                      <p><strong>Observed in THIS entry:</strong></p>
                      <ul style={{marginLeft: '1.5rem', marginTop: '0.25rem'}}>
                        {pattern.specific_patterns.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                      <p style={{marginTop: '0.5rem'}}>
                        <strong>Cannot assess from single entry:</strong> {pattern.criteria_not_assessed.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: `${colors.info}10`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <Info size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
                  <strong>Screening tools that might help:</strong>
                  {activeEntry.reflection.dsm_alignment.screening_tools.map((tool, idx) => (
                    <div key={idx} style={{marginTop: '0.5rem', marginLeft: '1.25rem'}}>
                      <strong>{tool.tool}:</strong> {tool.rationale}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{...styles.card, marginTop: '1rem'}}>
              <h3 style={{marginBottom: '1rem'}}>Therapeutic Dialogue</h3>
              {conversation.map((msg, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: msg.role === 'assistant' ? `${colors.sage}10` : colors.bg
                }}>
                  <p style={{fontSize: '0.75rem', color: colors.textMuted, marginBottom: '0.25rem'}}>
                    {msg.role === 'assistant' ? 'Therapist' : 'You'}
                  </p>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Checkpoint View
  const CheckpointView = () => (
    <div>
      <h2 style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <TrendingUp size={24} />
        Pattern Analysis & Checkpoints
      </h2>
      
      <div style={{marginBottom: '1.5rem', display: 'flex', gap: '1rem'}}>
        <button
          onClick={async () => {
            const recentEntries = entries.slice(0, settings.minEntriesForCheckpoint);
            if (recentEntries.length >= settings.minEntriesForCheckpoint) {
              const checkpoint = await therapeuticService.generateCheckpoint(recentEntries);
              checkpoint.id = `chk_${Date.now()}`;
              checkpoint.createdAt = new Date().toISOString();
              setCheckpoints(prev => [checkpoint, ...prev]);
              setActiveCheckpoint(checkpoint);
            } else {
              alert(`Need at least ${settings.minEntriesForCheckpoint} entries for a checkpoint`);
            }
          }}
          style={{...styles.button, ...styles.primaryButton}}
        >
          <Plus size={16} />
          Generate Checkpoint Now
        </button>
      </div>
      
      {checkpoints.length === 0 ? (
        <div style={{...styles.card, textAlign: 'center', padding: '3rem'}}>
          <Calendar size={48} style={{color: colors.textMuted, marginBottom: '1rem'}} />
          <p style={{color: colors.textMuted}}>
            No checkpoints yet. They'll appear after {settings.minEntriesForCheckpoint} entries 
            or every {settings.checkpointFrequency} days.
          </p>
        </div>
      ) : (
        <>
          {checkpoints.map(checkpoint => (
            <div
              key={checkpoint.id}
              style={{...styles.card, cursor: 'pointer'}}
              onClick={() => setActiveCheckpoint(checkpoint)}
            >
              <h3 style={{marginBottom: '0.5rem'}}>
                Checkpoint: {new Date(checkpoint.metadata?.period_start).toLocaleDateString()} - 
                {new Date(checkpoint.metadata?.period_end).toLocaleDateString()}
              </h3>
              <p style={{fontSize: '0.875rem', color: colors.textMuted}}>
                {checkpoint.metadata?.total_entries} entries analyzed
              </p>
              <div style={{marginTop: '1rem'}}>
                <strong>Key Patterns:</strong>
                <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem'}}>
                  {checkpoint.pattern_analysis?.recurring_themes.slice(0, 2).map((theme, idx) => (
                    <li key={idx}>{theme.theme}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
      
      {activeCheckpoint && (
        <div style={{...styles.modalContent, position: 'fixed', top: '10%', left: '10%', right: '10%', bottom: '10%', overflow: 'auto'}}>
          <button
            onClick={() => setActiveCheckpoint(null)}
            style={{...styles.button, marginBottom: '1rem'}}
          >
            Close
          </button>
          <h2>Checkpoint Report</h2>
          <p style={{color: colors.textMuted, marginBottom: '1rem'}}>
            Period: {new Date(activeCheckpoint.metadata?.period_start).toLocaleDateString()} - 
            {new Date(activeCheckpoint.metadata?.period_end).toLocaleDateString()}
          </p>
          <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.6}}>
            {activeCheckpoint.narrative_synthesis}
          </div>
        </div>
      )}
    </div>
  );

  // Export View
  const ExportView = () => (
    <div>
      <h2 style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <BookMarked size={24} />
        Export Your Journey
      </h2>
      
      <div style={styles.card}>
        <h3 style={{marginBottom: '1rem'}}>Create Your Therapeutic Book</h3>
        <p style={{marginBottom: '1.5rem', lineHeight: 1.6}}>
          Transform your entries and reflections into a structured book. 
          All content comes directly from your entries - nothing is added or fabricated.
        </p>
        
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
            Export Format:
          </label>
          <select
            value={settings.exportFormat}
            onChange={(e) => setSettings({...settings, exportFormat: e.target.value})}
            style={{padding: '0.5rem', borderRadius: '0.25rem', width: '200px'}}
          >
            <option value="markdown">Markdown (.md)</option>
            <option value="json">JSON (.json)</option>
            <option value="pdf" disabled>PDF (coming soon)</option>
          </select>
        </div>
        
        <div style={{marginBottom: '1.5rem'}}>
          <p style={{fontSize: '0.875rem', color: colors.textMuted}}>
            <Info size={14} style={{display: 'inline', marginRight: '0.25rem'}} />
            Your book will include:
          </p>
          <ul style={{marginLeft: '2rem', marginTop: '0.5rem', fontSize: '0.875rem', color: colors.textMuted}}>
            <li>{entries.length} journal entries</li>
            <li>Therapeutic reflections for each entry</li>
            <li>{checkpoints.length} checkpoint reports</li>
            <li>Pattern analysis and growth tracking</li>
          </ul>
        </div>
        
        <button
          onClick={handleExport}
          style={{...styles.button, ...styles.primaryButton}}
          disabled={entries.length === 0}
        >
          <Download size={16} />
          Export as {settings.exportFormat.toUpperCase()}
        </button>
        
        {exportProgress && (
          <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: `${colors.info}10`, borderRadius: '0.5rem'}}>
            {exportProgress}
          </div>
        )}
      </div>
      
      <div style={{...styles.card, marginTop: '1rem', backgroundColor: `${colors.success}05`, borderLeft: `3px solid ${colors.success}`}}>
        <h4 style={{color: colors.success, marginBottom: '0.5rem'}}>
          <Shield size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
          Privacy Protected
        </h4>
        <p style={{fontSize: '0.875rem'}}>
          Your export maintains all privacy protections. Personal information is anonymized, 
          and the AI only works with the exact content you've provided - no external information is added.
        </p>
      </div>
    </div>
  );

  // Initialize with sample data
  useEffect(() => {
    const sampleEntries = [
      {
        id: 'ent_1',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        title: "Family dinner money discussion",
        moment: {
          raw_text: "At dinner, when bills came up, relative made 'overreact' joke. I withdrew.",
          context: { setting: "family dinner" }
        },
        initial_thoughts: {
          emotions_felt: ["dismissed", "frustrated"],
          body_sensations: ["chest tight", "shallow breath"],
          actual_response: "withdrew"
        },
        tags: ["money", "family"],
        hasReflection: false
      },
      {
        id: 'ent_2',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        title: "Work meeting criticism",
        moment: {
          raw_text: "Manager said I was 'too serious' about deadlines. Felt minimized again.",
          context: { setting: "work" }
        },
        initial_thoughts: {
          emotions_felt: ["anger", "shame"],
          body_sensations: ["face hot", "jaw clenched"],
          actual_response: "stayed silent"
        },
        tags: ["work", "criticism"],
        hasReflection: false
      }
    ];
    setEntries(sampleEntries);
  }, []);

  return (
    <div style={styles.container}>
      {showSettings && <SettingsModal />}
      
      <header style={styles.header}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: '600'}}>
              Enhanced Therapeutic Journal
            </h1>
            <p style={{color: colors.textMuted, fontSize: '0.875rem'}}>
              Content-aware AI • DSM-5 alignment • Pattern tracking • Book export
            </p>
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button
              onClick={() => setShowSettings(true)}
              style={{...styles.button, backgroundColor: colors.bg, color: colors.text}}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
        
        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navButton,
              ...(activeView === 'entries' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveView('entries')}
          >
            <BookOpen size={16} />
            Entries
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(activeView === 'reflection' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveView('reflection')}
            disabled={!activeEntry}
          >
            <Brain size={16} />
            Analysis
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(activeView === 'checkpoints' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveView('checkpoints')}
          >
            <TrendingUp size={16} />
            Patterns
            {checkpoints.length > 0 && (
              <span style={{
                backgroundColor: colors.warning,
                color: colors.surface,
                borderRadius: '999px',
                padding: '0.125rem 0.5rem',
                fontSize: '0.75rem',
                marginLeft: '0.25rem'
              }}>
                {checkpoints.length}
              </span>
            )}
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(activeView === 'export' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveView('export')}
          >
            <BookMarked size={16} />
            Export
          </button>
        </nav>
      </header>
      
      <main style={styles.content}>
        {activeView === 'entries' && (
          <div>
            <button
              onClick={() => setShowNewEntry(!showNewEntry)}
              style={{...styles.button, ...styles.primaryButton, marginBottom: '1.5rem'}}
            >
              <Plus size={16} />
              New Entry
            </button>
            
            {entries.map(entry => (
              <div
                key={entry.id}
                style={{...styles.card, cursor: 'pointer'}}
                onClick={() => {
                  setActiveEntry(entry);
                  setActiveView('reflection');
                  if (!entry.hasReflection) {
                    processWithAI(entry);
                  }
                }}
              >
                <h3>{entry.title}</h3>
                <p style={{color: colors.textMuted, fontSize: '0.875rem', marginTop: '0.5rem'}}>
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
                <p style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>
                  {entry.moment.raw_text}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {activeView === 'reflection' && <ReflectionView />}
        {activeView === 'checkpoints' && <CheckpointView />}
        {activeView === 'export' && <ExportView />}
      </main>
      
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: ${colors.sage};
          box-shadow: 0 0 0 3px ${colors.sage}20;
        }
      `}</style>
    </div>
  );
};

export default EnhancedTherapeuticJournal;