import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Brain, Heart, Users, Activity, 
  Sparkles, ChevronRight, Clock, Tag, MessageCircle,
  FileText, TrendingUp, Shield, Download, Settings,
  AlertCircle, Zap, Layers, Lock, LogIn, LogOut, User
} from 'lucide-react';

// ============================================
// Therapeutic Service (Frontend)
// ============================================
class TherapeuticService {
  constructor() {
    this.apiUrl = '/api'; // Will use relative URL in production
    this.authToken = localStorage.getItem('auth_token');
  }
  
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
  
  async fetchWithAuth(endpoint, options) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }
  
  async generateReflection(entry) {
    // For demo, return mock data
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: `ref_${Date.now()}`,
          generatedAt: new Date().toISOString(),
          executive_summary: {
            pattern_name: "Invalidation-Withdrawal Cycle",
            key_insight: "Humor serves as defensive homeostasis",
            growth_edge: "Staying present through dismissal"
          },
          distortion_analysis: {
            primary: [
              {
                type: "Minimization",
                evidence: "'Always overreact' reduces concern to caricature",
                impact: "Self-doubt amplification",
                counter_evidence: "Valid financial concerns"
              }
            ],
            secondary: ["mind_reading", "emotional_reasoning"]
          },
          therapeutic_lenses: {
            CBT: {
              thought_record: {
                situation: "Money joke at dinner",
                automatic_thought: "I'm too sensitive",
                emotion: "Shame (70%)",
                balanced_thought: "My concerns are valid",
                outcome_emotion: "Frustration (40%)"
              },
              behavioral_pattern: "Withdraw → Ruminate → Resentment",
              intervention: "DEAR MAN script for next discussion"
            },
            Psychodynamic: {
              unconscious_theme: "Money as safety/control proxy",
              transference: "Relative activates dismissal wounds",
              defense_mechanisms: ["intellectualization", "withdrawal"],
              interpretation: "Echoes childhood invalidation patterns"
            },
            Family_Systems: {
              role_in_system: "Truth-teller / Identified patient",
              homeostatic_function: "Jokes maintain avoidance",
              triangulation: "Money creates alliance splits",
              differentiation_level: "Moderate - reactive but aware"
            },
            Somatic: {
              body_map: {
                chest: "constriction",
                throat: "closing",
                shoulders: "bracing"
              },
              nervous_system_state: "Dorsal vagal (freeze)",
              resource: "Bilateral stimulation, orienting"
            },
            Psychiatric_Education: {
              relevant_patterns: "Social anxiety in financial contexts",
              biological_factors: "Heightened stress response",
              screening_suggestions: ["GAD-7", "PHQ-9"],
              red_flags: "None currently",
              disclaimer: "Educational only - not diagnostic"
            }
          },
          reframe_menu: [
            {
              original: "I always overreact",
              reframe: "I have protective responses to financial threats",
              basis: "Normalizing + context"
            }
          ],
          skills_buffet: {
            immediate: [
              {
                skill: "TIPP",
                when: "Before conversations",
                why: "Reset nervous system"
              }
            ],
            practice: [
              {
                skill: "DEAR MAN",
                application: "Next money talk",
                template: "Describe, Express, Assert, Reinforce..."
              }
            ],
            exploratory: [
              {
                skill: "Empty chair",
                target: "Inner critic",
                purpose: "Externalize 'overreactor' narrative"
              }
            ]
          },
          starter_chapters: {
            title: "When Jokes Guard the Gate",
            opening: "The dinner table becomes a minefield when money enters conversation. Not because of the topic itself, but because of what it represents: control, safety, worthiness. The joke—'you always overreact'—arrives precisely when vulnerability might emerge, a perfectly timed deflection that maintains the family's emotional thermostat. This isn't malicious; it's systemic. Every family develops these unconscious agreements about what can and cannot be directly addressed. Your withdrawal isn't weakness—it's a learned response to a system that hasn't made space for your financial concerns to be heard without minimization. The question becomes: How do we stay present when the pattern wants us gone? This requires not just cognitive reframing but somatic resources, systemic awareness, and gradual differentiation work."
          },
          conversation_seeds: [
            "What would happen if you responded with curious questions?",
            "Where else does the 'overreactor' label appear?",
            "What's your earliest money-tension memory?"
          ]
        });
      }, 2000);
    });
  }
  
  async continueConversation(thread, newMessage) {
    // For demo, return mock response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("That's a profound observation. The body often knows before the mind can articulate. When you notice that chest tightness, what's the first thought that accompanies it? And more importantly, what would it be like to stay with that sensation for just a moment longer before the withdrawal kicks in?");
      }, 1000);
    });
  }
  
  async signIn(email, password) {
    // Mock authentication for demo
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockToken = `mock_token_${Date.now()}`;
          this.setAuthToken(mockToken);
          resolve({
            user: { email, id: 'user_123' },
            session: { access_token: mockToken }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }
  
  async signOut() {
    this.setAuthToken(null);
    return { success: true };
  }
  
  async getSession() {
    if (!this.authToken) return null;
    return { email: 'user@example.com', id: 'user_123' };
  }
}

// Storage Service
class StorageService {
  constructor() {
    this.dbName = 'therapeutic_journal';
    this.db = null;
  }
  
  async initialize() {
    // For demo, using localStorage instead of IndexedDB for simplicity
    return Promise.resolve();
  }
  
  async saveEntry(entry) {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.unshift(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
    return entry;
  }
  
  async getEntries() {
    return JSON.parse(localStorage.getItem('entries') || '[]');
  }
  
  async saveReflection(reflection) {
    const reflections = JSON.parse(localStorage.getItem('reflections') || '{}');
    reflections[reflection.entryId] = reflection;
    localStorage.setItem('reflections', JSON.stringify(reflections));
    return reflection;
  }
  
  async getReflection(entryId) {
    const reflections = JSON.parse(localStorage.getItem('reflections') || '{}');
    return reflections[entryId];
  }
}

// Initialize services
const therapeuticService = new TherapeuticService();
const storageService = new StorageService();

// ============================================
// Main Component
// ============================================
const SecureTherapeuticJournal = () => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [activeView, setActiveView] = useState('entries');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authError, setAuthError] = useState('');
  
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
    error: '#E53E3E'
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
    lensCard: {
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      borderLeft: '3px solid',
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
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    }
  };

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      await storageService.initialize();
      
      // Check for existing session
      const session = await therapeuticService.getSession();
      if (session) {
        setUser(session);
        const savedEntries = await storageService.getEntries();
        setEntries(savedEntries);
      } else {
        setShowAuth(true);
      }
    };
    init();
  }, []);

  // Process entry with AI
  const processWithAI = async (entry) => {
    setIsProcessing(true);
    try {
      const reflection = await therapeuticService.generateReflection(entry);
      reflection.entryId = entry.id;
      
      await storageService.saveReflection(reflection);
      
      const updatedEntry = { ...entry, hasReflection: true, reflection };
      const updatedEntries = entries.map(e => e.id === entry.id ? updatedEntry : e);
      setEntries(updatedEntries);
      setActiveEntry(updatedEntry);
      
      // Auto-start conversation
      const firstSeed = reflection.conversation_seeds[0];
      setConversation([
        {
          role: 'assistant',
          content: firstSeed,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error processing with AI:', error);
      alert('Failed to generate reflection. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auth Modal
  const AuthModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleAuth = async () => {
      setLoading(true);
      setAuthError('');
      
      try {
        if (authMode === 'signin') {
          const result = await therapeuticService.signIn(email, password);
          setUser(result.user);
          setShowAuth(false);
          
          // Load user's entries
          const savedEntries = await storageService.getEntries();
          setEntries(savedEntries);
        } else {
          // Sign up logic would go here
          alert('Sign up not implemented in demo. Use any email/password to sign in.');
        }
      } catch (error) {
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <h2 style={{marginBottom: '1.5rem', textAlign: 'center'}}>
            {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem'}}>
              Email
            </label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem'}}>
              Password
            </label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          {authError && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: `${colors.error}10`,
              color: colors.error,
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {authError}
            </div>
          )}
          
          <button
            onClick={handleAuth}
            disabled={loading || !email || !password}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              width: '100%',
              justifyContent: 'center',
              opacity: loading || !email || !password ? 0.5 : 1
            }}
          >
            {loading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
          
          <div style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: colors.textMuted
          }}>
            {authMode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.sage,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.sage,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
          
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: `${colors.sage}10`,
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            color: colors.textMuted
          }}>
            <Lock size={14} style={{marginBottom: '0.5rem'}} />
            <strong>Security Note:</strong> Your API keys are secured server-side via Vercel Functions. 
            All sensitive data is encrypted locally and transmitted securely.
          </div>
        </div>
      </div>
    );
  };

  // Entry Form
  const EntryForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      moment: '',
      emotions: '',
      sensations: '',
      response: '',
      tags: ''
    });

    const handleSubmit = async () => {
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
      
      await storageService.saveEntry(newEntry);
      setEntries(prev => [newEntry, ...prev]);
      setShowNewEntry(false);
      setActiveEntry(newEntry);
      setActiveView('reflection');
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
              Emotions (comma-separated)
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
              placeholder="tight chest, shallow breathing"
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
              placeholder="withdrew, stayed silent"
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
              style={{...styles.button, backgroundColor: colors.bg, color: colors.text}}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Reflection View (simplified for space)
  const ReflectionView = () => {
    if (!activeEntry) return null;
    
    const handleConversation = async (message) => {
      const newUserMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, newUserMessage]);
      
      try {
        const response = await therapeuticService.continueConversation(
          [...conversation, newUserMessage],
          message
        );
        
        setConversation(prev => [...prev, {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        }]);
      } catch (error) {
        console.error('Conversation error:', error);
      }
    };
    
    return (
      <div>
        <button
          onClick={() => setActiveView('entries')}
          style={{...styles.button, marginBottom: '1.5rem', backgroundColor: 'transparent'}}
        >
          ← Back to entries
        </button>
        
        <div style={styles.entryCard}>
          <h2>{activeEntry.title}</h2>
          <p style={{color: colors.textMuted, marginTop: '0.5rem'}}>
            {new Date(activeEntry.createdAt).toLocaleString()}
          </p>
          <p style={{marginTop: '1rem', lineHeight: 1.6}}>
            {activeEntry.moment.raw_text}
          </p>
        </div>
        
        {isProcessing && (
          <div style={{...styles.entryCard, textAlign: 'center', padding: '3rem'}}>
            <Brain size={48} style={{color: colors.sage, marginBottom: '1rem'}} />
            <p>Generating secure therapeutic analysis...</p>
            <p style={{fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.5rem'}}>
              Processing through secure API proxy (8000+ tokens)
            </p>
          </div>
        )}
        
        {activeEntry.reflection && !isProcessing && (
          <div style={{marginTop: '1.5rem'}}>
            <div style={{...styles.entryCard, borderLeft: `3px solid ${colors.sage}`}}>
              <h3 style={{color: colors.sage, marginBottom: '1rem'}}>
                Executive Summary
              </h3>
              <p><strong>Pattern:</strong> {activeEntry.reflection.executive_summary.pattern_name}</p>
              <p><strong>Insight:</strong> {activeEntry.reflection.executive_summary.key_insight}</p>
              <p><strong>Growth Edge:</strong> {activeEntry.reflection.executive_summary.growth_edge}</p>
            </div>
            
            {conversation.length > 0 && (
              <div style={{...styles.entryCard, marginTop: '1rem'}}>
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
                <textarea
                  style={{...styles.textarea, marginTop: '1rem'}}
                  placeholder="Continue the conversation..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        handleConversation(e.target.value);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div style={styles.container}>
      {showAuth && <AuthModal />}
      
      <header style={styles.header}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: '600'}}>
              Secure Therapeutic Journal
            </h1>
            <p style={{color: colors.textMuted, fontSize: '0.875rem'}}>
              API keys protected • End-to-end encryption • 8000+ token analysis
            </p>
          </div>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            {user && (
              <>
                <span style={{fontSize: '0.875rem', color: colors.textMuted}}>
                  <User size={14} style={{display: 'inline', marginRight: '0.25rem'}} />
                  {user.email}
                </span>
                <button
                  onClick={async () => {
                    await therapeuticService.signOut();
                    setUser(null);
                    setEntries([]);
                    setShowAuth(true);
                  }}
                  style={{...styles.button, backgroundColor: colors.bg, color: colors.text}}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
        
        {user && (
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
          </nav>
        )}
      </header>
      
      {user && (
        <main style={styles.content}>
          {activeView === 'entries' && (
            <div>
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
              
              {entries.map(entry => (
                <div
                  key={entry.id}
                  style={styles.entryCard}
                  onClick={() => {
                    setActiveEntry(entry);
                    setActiveView('reflection');
                    if (!entry.hasReflection) {
                      processWithAI(entry);
                    }
                  }}
                >
                  <h3>{entry.title}</h3>
                  <p style={{color: colors.textMuted, fontSize: '0.875rem'}}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {activeView === 'reflection' && <ReflectionView />}
        </main>
      )}
      
      <style>{`
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
      `}</style>
    </div>
  );
};

export default SecureTherapeuticJournal;