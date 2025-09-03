import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Plus, Brain, Heart, Users, Activity, 
  Sparkles, ChevronRight, Clock, Tag, MessageCircle,
  FileText, TrendingUp, Shield, Download, Settings,
  AlertCircle, Zap, Layers
} from 'lucide-react';

const TherapeuticJournal = () => {
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [activeView, setActiveView] = useState('entries');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [conversation, setConversation] = useState([]);
  
  // Design system
  const colors = {
    sage: '#4A7C7E',
    purple: '#7C4A6F', 
    terracotta: '#C07C4A',
    deepBlue: '#4A5F7C',
    text: '#2C3E50',
    textMuted: '#718096',
    bg: '#FAFAF8',
    surface: '#FFFFFF'
  };

  // Styles without Tailwind
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
      marginTop: '1rem'
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
    entryCard: {
      backgroundColor: colors.surface,
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      border: '1px solid transparent',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    entryCardHover: {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderColor: colors.sage
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
    secondaryButton: {
      backgroundColor: colors.bg,
      color: colors.text
    },
    lensCard: {
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      borderLeft: '3px solid',
      backgroundColor: colors.surface
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: `1px solid ${colors.bg}`,
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '150px',
      backgroundColor: colors.surface
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: `1px solid ${colors.bg}`,
      fontSize: '1rem',
      fontFamily: 'inherit',
      backgroundColor: colors.surface
    },
    tag: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginRight: '0.5rem'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };

  // Sample data generator
  const generateSampleEntry = () => ({
    id: `ent_${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: "Family dinner - money discussion",
    moment: {
      raw_text: "At dinner, when bills came up, relative made a joke about me 'always overreacting' to money topics. I felt dismissed and withdrew from the conversation.",
      context: {
        setting: "family dinner",
        trigger_topic: "finances",
        emotional_temperature: 7
      }
    },
    initial_thoughts: {
      emotions_felt: ["dismissed", "frustrated", "shutdown"],
      body_sensations: ["chest_tightness", "shallow_breath"],
      actual_response: "withdrew"
    },
    tags: ["money", "family", "boundaries"],
    hasReflection: false
  });

  const generateSampleReflection = () => ({
    id: `ref_${Date.now()}`,
    generatedAt: new Date().toISOString(),
    executive_summary: {
      pattern_name: "Invalidation-Withdrawal Cycle",
      key_insight: "Humor serves as defensive homeostasis maintaining emotional distance",
      growth_edge: "Staying present through dismissal without withdrawing"
    },
    distortions: [
      {
        type: "Minimization",
        evidence: "'Always overreact' reduces complex concern to caricature",
        impact: "Self-doubt amplification"
      },
      {
        type: "Mind Reading",
        evidence: "Assuming intent behind the joke",
        impact: "Increased emotional reactivity"
      }
    ],
    therapeutic_lenses: {
      CBT: {
        title: "Cognitive-Behavioral",
        color: colors.sage,
        content: "The automatic thought 'I'm too sensitive' emerged from the 'overreact' comment. This triggered shame (70%) and withdrawal behavior. A balanced thought: 'My concerns about shared finances are proportionate and valid.' The behavioral chain: Trigger → Shame → Withdrawal → Rumination → Resentment. Intervention: DEAR MAN script for next money discussion."
      },
      Psychodynamic: {
        title: "Psychodynamic",
        color: colors.purple,
        content: "Money discussions activate early attachment wounds around safety and control. The 'overreactor' label may echo childhood experiences of emotional invalidation. Defense mechanisms observed: intellectualization (analyzing rather than feeling) and withdrawal (avoiding confrontation). The relative may represent a transferential figure embodying past dismissive caregivers."
      },
      Systems: {
        title: "Family Systems",
        color: colors.terracotta,
        content: "Your role: the 'identified patient' or truth-teller who threatens homeostasis. The joke serves a system function - maintaining avoidance of difficult financial realities. Triangulation emerges as family members align around humor against the 'serious one.' Differentiation opportunity: holding your position without reactive withdrawal."
      },
      Somatic: {
        title: "Somatic",
        color: colors.deepBlue,
        content: "Body map: chest constriction, throat closing, shoulder bracing. Nervous system shifted to dorsal vagal (freeze/withdrawal). The body prepared for threat before conscious awareness. Resources: bilateral stimulation, orienting to the room, gentle movement. Before next dinner: 5-minute body scan to establish baseline."
      }
    },
    skills_menu: [
      {
        name: "TIPP",
        timing: "Before triggering conversations",
        description: "Temperature, Intense exercise, Paced breathing, Paired muscle relaxation"
      },
      {
        name: "DEAR MAN Script",
        timing: "For next money discussion",
        description: "Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate"
      },
      {
        name: "Window of Tolerance Check",
        timing: "During conversations",
        description: "Notice if you're in hyper- or hypoarousal; use grounding to return to window"
      }
    ],
    starter_chapter: "The dinner table becomes a minefield when money enters conversation. Not because of the topic itself, but because of what it represents: control, safety, worthiness. The joke—'you always overreact'—arrives precisely when vulnerability might emerge, a perfectly timed deflection that maintains the family's emotional thermostat. This isn't malicious; it's systemic. Every family develops these unconscious agreements about what can and cannot be directly addressed. Your withdrawal isn't weakness—it's a learned response to a system that hasn't made space for your financial concerns to be heard without minimization."
  });

  // Mock AI processing
  const processWithAI = async (entry) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reflection = generateSampleReflection();
    const updatedEntry = { ...entry, hasReflection: true, reflection };
    
    setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
    setActiveEntry(updatedEntry);
    setIsProcessing(false);
    
    // Auto-start conversation
    setTimeout(() => {
      setConversation([
        {
          role: 'assistant',
          content: "I notice the pattern of withdrawal when financial topics arise with humor as deflection. What happens in your body right before you go quiet?",
          timestamp: new Date().toISOString()
        }
      ]);
    }, 500);
  };

  const EntryForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      moment: '',
      emotions: '',
      sensations: '',
      response: '',
      tags: ''
    });

    const handleSubmit = () => {
      if (!formData.title || !formData.moment) {
        alert('Please fill in at least the title and moment fields');
        return;
      }
      
      const newEntry = {
        id: `ent_${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: formData.title,
        moment: {
          raw_text: formData.moment,
          context: {
            setting: "personal reflection",
            emotional_temperature: 5
          }
        },
        initial_thoughts: {
          emotions_felt: formData.emotions.split(',').map(e => e.trim()).filter(e => e),
          body_sensations: formData.sensations.split(',').map(s => s.trim()).filter(s => s),
          actual_response: formData.response
        },
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        hasReflection: false
      };
      
      setEntries(prev => [newEntry, ...prev]);
      setShowNewEntry(false);
      setActiveEntry(newEntry);
      processWithAI(newEntry);
    };

    return (
      <div style={{...styles.entryCard, padding: '2rem'}}>
        <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem'}}>New Entry</h3>
        <div>
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>
              Title
            </label>
            <input
              style={styles.input}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief description of the moment"
            />
          </div>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>
              What happened?
            </label>
            <textarea
              style={styles.textarea}
              value={formData.moment}
              onChange={(e) => setFormData({...formData, moment: e.target.value})}
              placeholder="Describe the moment, interaction, or thought..."
            />
          </div>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>
              Emotions felt (comma-separated)
            </label>
            <input
              style={styles.input}
              value={formData.emotions}
              onChange={(e) => setFormData({...formData, emotions: e.target.value})}
              placeholder="frustrated, dismissed, anxious"
            />
          </div>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>
              Body sensations (comma-separated)
            </label>
            <input
              style={styles.input}
              value={formData.sensations}
              onChange={(e) => setFormData({...formData, sensations: e.target.value})}
              placeholder="tight chest, clenched jaw, shallow breathing"
            />
          </div>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>
              How did you respond?
            </label>
            <input
              style={styles.input}
              value={formData.response}
              onChange={(e) => setFormData({...formData, response: e.target.value})}
              placeholder="withdrew, argued, stayed silent"
            />
          </div>
          
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500'}}>
              Tags (comma-separated)
            </label>
            <input
              style={styles.input}
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="family, work, boundaries"
            />
          </div>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <button
              onClick={handleSubmit}
              style={{...styles.button, ...styles.primaryButton}}
            >
              <Sparkles size={16} />
              Create & Analyze
            </button>
            <button
              onClick={() => setShowNewEntry(false)}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EntriesList = () => {
    const [hoveredEntry, setHoveredEntry] = useState(null);
    
    return (
      <div>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <BookOpen size={20} />
            Your Entries
          </h2>
          
          {!showNewEntry && (
            <button
              onClick={() => setShowNewEntry(true)}
              style={{...styles.button, ...styles.primaryButton, marginBottom: '1.5rem'}}
            >
              <Plus size={16} />
              New Entry
            </button>
          )}
          
          {showNewEntry && <EntryForm />}
          
          {entries.length === 0 && !showNewEntry && (
            <div style={{...styles.entryCard, textAlign: 'center', padding: '3rem'}}>
              <BookOpen size={48} style={{color: colors.textMuted, marginBottom: '1rem'}} />
              <p style={{color: colors.textMuted}}>
                No entries yet. Create your first entry to begin your therapeutic journey.
              </p>
            </div>
          )}
          
          {entries.map(entry => (
            <div
              key={entry.id}
              style={{
                ...styles.entryCard,
                ...(hoveredEntry === entry.id ? styles.entryCardHover : {})
              }}
              onMouseEnter={() => setHoveredEntry(entry.id)}
              onMouseLeave={() => setHoveredEntry(null)}
              onClick={() => {
                setActiveEntry(entry);
                setActiveView('reflection');
                if (!entry.hasReflection) {
                  processWithAI(entry);
                }
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div style={{flex: 1}}>
                  <h3 style={{marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600'}}>
                    {entry.title}
                  </h3>
                  <p style={{color: colors.textMuted, marginBottom: '1rem', fontSize: '0.875rem'}}>
                    {entry.moment.raw_text.substring(0, 150)}...
                  </p>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: colors.textMuted}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                      <Clock size={12} />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                    {entry.hasReflection && (
                      <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: colors.sage}}>
                        <Brain size={12} />
                        Analyzed
                      </span>
                    )}
                  </div>
                  <div style={{marginTop: '0.75rem'}}>
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          ...styles.tag,
                          backgroundColor: `${colors.sage}20`,
                          color: colors.sage
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={20} style={{color: colors.textMuted}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        
        <div style={styles.entryCard}>
          <h2 style={{marginBottom: '1rem', fontSize: '1.5rem'}}>{activeEntry.title}</h2>
          <p style={{color: colors.textMuted, marginBottom: '1rem'}}>
            {new Date(activeEntry.createdAt).toLocaleString()}
          </p>
          <p style={{lineHeight: 1.6, marginBottom: '1.5rem'}}>
            {activeEntry.moment.raw_text}
          </p>
          
          <div style={{display: 'flex', gap: '2rem', fontSize: '0.875rem', color: colors.textMuted, borderTop: `1px solid ${colors.bg}`, paddingTop: '1rem'}}>
            <div>
              <strong>Emotions:</strong> {activeEntry.initial_thoughts.emotions_felt.join(', ')}
            </div>
            <div>
              <strong>Body:</strong> {activeEntry.initial_thoughts.body_sensations.join(', ')}
            </div>
            <div>
              <strong>Response:</strong> {activeEntry.initial_thoughts.actual_response}
            </div>
          </div>
        </div>
        
        {isProcessing && (
          <div style={{...styles.entryCard, textAlign: 'center', padding: '3rem'}}>
            <Brain size={48} style={{color: colors.sage, marginBottom: '1rem', animation: 'pulse 2s infinite'}} />
            <p style={{color: colors.textMuted}}>
              Generating comprehensive therapeutic analysis...
            </p>
            <p style={{fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.5rem'}}>
              Processing through multiple therapeutic lenses (8000+ tokens)
            </p>
          </div>
        )}
        
        {activeEntry.reflection && !isProcessing && (
          <>
            <div style={{...styles.entryCard, borderLeft: `3px solid ${colors.sage}`, marginTop: '1.5rem'}}>
              <h3 style={{...styles.sectionTitle, color: colors.sage}}>
                <Zap size={20} />
                Executive Summary
              </h3>
              <div style={{display: 'grid', gap: '1rem'}}>
                <div>
                  <strong>Pattern:</strong> {activeEntry.reflection.executive_summary.pattern_name}
                </div>
                <div>
                  <strong>Key Insight:</strong> {activeEntry.reflection.executive_summary.key_insight}
                </div>
                <div>
                  <strong>Growth Edge:</strong> {activeEntry.reflection.executive_summary.growth_edge}
                </div>
              </div>
            </div>
            
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <AlertCircle size={20} />
                Cognitive Distortions Detected
              </h3>
              {activeEntry.reflection.distortions.map((distortion, idx) => (
                <div key={idx} style={{...styles.entryCard, borderLeft: `3px solid ${colors.terracotta}`, marginBottom: '1rem'}}>
                  <h4 style={{color: colors.terracotta, marginBottom: '0.5rem'}}>{distortion.type}</h4>
                  <p style={{fontSize: '0.875rem', marginBottom: '0.5rem'}}>{distortion.evidence}</p>
                  <p style={{fontSize: '0.875rem', color: colors.textMuted}}>
                    <strong>Impact:</strong> {distortion.impact}
                  </p>
                </div>
              ))}
            </div>
            
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <Layers size={20} />
                Therapeutic Lenses
              </h3>
              {Object.entries(activeEntry.reflection.therapeutic_lenses).map(([key, lens]) => (
                <div
                  key={key}
                  style={{
                    ...styles.lensCard,
                    borderLeftColor: lens.color,
                    backgroundColor: `${lens.color}08`
                  }}
                >
                  <h4 style={{color: lens.color, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    {key === 'CBT' && <Brain size={16} />}
                    {key === 'Psychodynamic' && <Heart size={16} />}
                    {key === 'Systems' && <Users size={16} />}
                    {key === 'Somatic' && <Activity size={16} />}
                    {lens.title}
                  </h4>
                  <p style={{lineHeight: 1.6, fontSize: '0.9rem'}}>
                    {lens.content}
                  </p>
                </div>
              ))}
            </div>
            
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <Sparkles size={20} />
                Skills Menu
              </h3>
              <div style={{display: 'grid', gap: '1rem'}}>
                {activeEntry.reflection.skills_menu.map((skill, idx) => (
                  <div key={idx} style={styles.entryCard}>
                    <h4 style={{color: colors.deepBlue, marginBottom: '0.5rem'}}>{skill.name}</h4>
                    <p style={{fontSize: '0.875rem', color: colors.textMuted, marginBottom: '0.5rem'}}>
                      <strong>When:</strong> {skill.timing}
                    </p>
                    <p style={{fontSize: '0.875rem'}}>
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{...styles.entryCard, backgroundColor: `${colors.purple}08`, borderLeft: `3px solid ${colors.purple}`}}>
              <h3 style={{...styles.sectionTitle, color: colors.purple}}>
                <FileText size={20} />
                Chapter Starter
              </h3>
              <p style={{lineHeight: 1.8, fontSize: '0.95rem'}}>
                {activeEntry.reflection.starter_chapter}
              </p>
            </div>
            
            {conversation.length > 0 && (
              <div style={{...styles.section, marginTop: '2rem'}}>
                <h3 style={styles.sectionTitle}>
                  <MessageCircle size={20} />
                  Therapeutic Dialogue
                </h3>
                <div style={styles.entryCard}>
                  {conversation.map((turn, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: turn.role === 'assistant' ? `${colors.sage}10` : colors.bg
                      }}
                    >
                      <p style={{fontSize: '0.75rem', color: colors.textMuted, marginBottom: '0.5rem'}}>
                        {turn.role === 'assistant' ? 'AI Therapist' : 'You'}
                      </p>
                      <p>{turn.content}</p>
                    </div>
                  ))}
                  <div style={{marginTop: '1rem'}}>
                    <textarea
                      style={styles.textarea}
                      placeholder="Continue the conversation..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const value = e.target.value;
                          if (value.trim()) {
                            setConversation(prev => [...prev, {
                              role: 'user',
                              content: value,
                              timestamp: new Date().toISOString()
                            }]);
                            e.target.value = '';
                            // Simulate AI response
                            setTimeout(() => {
                              setConversation(prev => [...prev, {
                                role: 'assistant',
                                content: "That's a profound observation. The body often knows before the mind can articulate. When you notice that chest tightness, what's the first thought that accompanies it?",
                                timestamp: new Date().toISOString()
                              }]);
                            }, 1000);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const CheckpointView = () => (
    <div>
      <h2 style={styles.sectionTitle}>
        <TrendingUp size={20} />
        Pattern Analysis
      </h2>
      <div style={styles.entryCard}>
        <p style={{color: colors.textMuted, textAlign: 'center', padding: '2rem'}}>
          Checkpoint reports will appear after 5 entries or 14 days. 
          Reports synthesize patterns across entries using 12,000+ tokens for comprehensive analysis.
        </p>
      </div>
    </div>
  );

  // Initialize with sample data
  useEffect(() => {
    const sampleEntry = generateSampleEntry();
    sampleEntry.hasReflection = true;
    sampleEntry.reflection = generateSampleReflection();
    setEntries([sampleEntry]);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem'}}>
              Therapeutic Journal
            </h1>
            <p style={{color: colors.textMuted, fontSize: '0.875rem'}}>
              Multi-lens AI analysis with 8000+ token reflections
            </p>
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button style={{...styles.button, ...styles.secondaryButton}}>
              <Shield size={16} />
              Privacy
            </button>
            <button style={{...styles.button, ...styles.secondaryButton}}>
              <Download size={16} />
              Export
            </button>
            <button style={{...styles.button, ...styles.secondaryButton}}>
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
              ...(activeView === 'checkpoint' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveView('checkpoint')}
          >
            <TrendingUp size={16} />
            Patterns
          </button>
        </nav>
      </header>
      
      <main style={styles.content}>
        {activeView === 'entries' && <EntriesList />}
        {activeView === 'reflection' && <ReflectionView />}
        {activeView === 'checkpoint' && <CheckpointView />}
      </main>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: ${colors.sage};
          box-shadow: 0 0 0 3px ${colors.sage}20;
        }
        
        ::placeholder {
          color: ${colors.textMuted};
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default TherapeuticJournal;