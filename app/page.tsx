'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BookOpen, Plus, Brain, Heart, Users, Activity, 
  Sparkles, ChevronRight, Clock, MessageCircle,
  FileText, TrendingUp, Shield, Download, Settings,
  AlertCircle, Zap, Layers
} from 'lucide-react';
import JournalService from '@/services/journalService';
import ResearchTeamService from '@/services/researchTeamService';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg);
`;

const Header = styled.header`
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1rem 1.5rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background-color: ${props => props.$active ? 'var(--sage)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-muted)'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--sage)' : 'rgba(0,0,0,0.05)'};
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Card = styled.div`
  background-color: var(--surface);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
`;

const EntryCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--sage);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const EntryTitle = styled.h3`
  font-weight: 600;
  color: var(--text);
`;

const EntryDate = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const EntryContent = styled.p`
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: rgba(0,0,0,0.05);
  color: var(--text-muted);
  font-size: 0.75rem;
  border-radius: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: ${props => props.$variant === 'secondary' ? '1px solid var(--border)' : 'none'};
  background-color: ${props => props.$variant === 'secondary' ? 'transparent' : 'var(--sage)'};
  color: ${props => props.$variant === 'secondary' ? 'var(--text)' : 'white'};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$variant === 'secondary' ? 'rgba(0,0,0,0.05)' : '#3A6C6E'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NewEntryButton = styled(Card)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--sage);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(74, 124, 126, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(74, 124, 126, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Spinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--text-muted);
  
  svg {
    width: 3rem;
    height: 3rem;
    margin: 0 auto 0.75rem;
    opacity: 0.3;
  }
  
  p {
    font-size: 0.875rem;
  }
`;

const AnalysisSection = styled.div`
  margin-top: 1rem;
`;

const AnalysisTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DistortionCard = styled.div`
  border-left: 4px solid var(--purple);
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

const DistortionType = styled.h4`
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.25rem;
`;

const Quote = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
  margin: 0.5rem 0;
`;

const Reframe = styled.p`
  font-size: 0.875rem;
  color: var(--text);
  margin-top: 0.5rem;
`;

const PerspectivesSection = styled.div`
  margin-top: 1.5rem;
`;

const PerspectiveCard = styled.div`
  background-color: rgba(0,0,0,0.02);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const PerspectiveTitle = styled.h4`
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text);
  text-transform: capitalize;
  margin-bottom: 0.25rem;
`;

const PerspectiveContent = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
`;

export default function HomePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [activeView, setActiveView] = useState('entries');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    moment: { raw_text: '' },
    initial_thoughts: {
      emotions_felt: [] as string[],
      body_sensations: [] as string[],
      actual_response: ''
    }
  });

  const journalService = new JournalService();
  const researchTeamService = new ResearchTeamService();
  const [retryingEntries, setRetryingEntries] = useState<Set<string>>(new Set());

  const handleRetryAnalysis = async (entryId: string) => {
    if (retryingEntries.has(entryId)) return;
    
    setRetryingEntries(prev => {
      const next = new Set(prev);
      next.add(entryId);
      return next;
    });
    
    try {
      console.log(`[Main] Retrying analysis for entry ${entryId}`);
      
      // Use the retry method with quick mode
      const teamAnalysis = await researchTeamService.retryAnalysis(entryId, { quickMode: true });
      
      // Update the entry with the new analysis
      setEntries(prev => prev.map(entry => {
        if (entry.id === entryId) {
          // Extract patterns from successful analysis
          const primaryPatterns = teamAnalysis.initial_analyses?.map((a: any) => 
            a.pattern || a.analysis?.pattern_identification?.primary_pattern
          ).filter((p: any) => p && !p.includes('TIMEOUT') && !p.includes('failed')) || [];
          
          return {
            ...entry,
            teamAnalysis,
            tags: primaryPatterns.length > 0 ? primaryPatterns.slice(0, 3) : entry.tags,
            hasTeamAnalysis: true,
            requiresRetry: teamAnalysis.fallback || false
          };
        }
        return entry;
      }));
      
      // Update active entry if it's the one being retried
      if (activeEntry?.id === entryId) {
        const updatedEntry = entries.find(e => e.id === entryId);
        if (updatedEntry) {
          setActiveEntry({
            ...updatedEntry,
            teamAnalysis,
            requiresRetry: teamAnalysis.fallback || false
          });
        }
      }
      
      // Save updated analysis to localStorage
      localStorage.setItem('latestTeamAnalysis', JSON.stringify(teamAnalysis));
      
      console.log('[Main] Retry successful for entry:', entryId);
    } catch (error) {
      console.error('[Main] Retry failed:', error);
      alert('Retry failed. Please try again later or enable Quick Mode.');
    } finally {
      setRetryingEntries(prev => {
        const next = new Set(prev);
        next.delete(entryId);
        return next;
      });
    }
  };

  useEffect(() => {
    const mockEntries = [
      {
        id: '1',
        createdAt: new Date().toISOString(),
        title: 'Family Dinner Tensions',
        moment: { raw_text: 'Had dinner with parents. Mom criticized my career choices again...' },
        initial_thoughts: {
          emotions_felt: ['frustrated', 'inadequate'],
          body_sensations: ['chest tightness', 'jaw tension'],
          actual_response: 'I stayed quiet and changed the subject'
        },
        tags: ['family', 'boundaries', 'self-worth']
      }
    ];
    setEntries(mockEntries);
  }, []);

  const handleSubmitEntry = async () => {
    if (!newEntry.title || !newEntry.moment.raw_text) return;
    
    setIsProcessing(true);
    try {
      const entry = {
        ...newEntry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        tags: []
      };
      
      // Get historical context for the research team
      const historicalContext = researchTeamService.formatHistoricalContext(entries, 3);
      
      // Use research team for analysis instead of simple analysis
      console.log('[Main] Requesting research team analysis...');
      const teamAnalysis = await researchTeamService.analyzeWithFullTeam(entry, historicalContext);
      
      // Save the team analysis to localStorage for the insights page
      localStorage.setItem('latestTeamAnalysis', JSON.stringify(teamAnalysis));
      
      // Extract key patterns from team analysis for display
      const primaryPatterns = teamAnalysis.initial_analyses?.map((a: any) => 
        a.pattern || a.analysis?.pattern_identification?.primary_pattern
      ).filter(Boolean) || [];
      
      const entryWithAnalysis = {
        ...entry,
        teamAnalysis,
        tags: primaryPatterns.slice(0, 3), // Use top 3 patterns as tags
        hasTeamAnalysis: true,
        requiresRetry: teamAnalysis.fallback || false
      };
      
      setEntries([entryWithAnalysis, ...entries]);
      setActiveEntry(entryWithAnalysis);
      setShowNewEntry(false);
      setNewEntry({
        title: '',
        moment: { raw_text: '' },
        initial_thoughts: {
          emotions_felt: [],
          body_sensations: [],
          actual_response: ''
        }
      });
      
      // Check if we should generate a checkpoint
      const updatedEntries = [entryWithAnalysis, ...entries];
      if (researchTeamService.shouldGenerateCheckpoint(updatedEntries)) {
        console.log('[Main] Generating checkpoint...');
        const checkpoint = await researchTeamService.generateCheckpoint(
          updatedEntries.slice(0, 10),
          updatedEntries.map(e => e.teamAnalysis?.initial_analyses || []).flat()
        );
        localStorage.setItem('latestCheckpoint', JSON.stringify(checkpoint));
        console.log('[Main] Checkpoint saved');
      }
    } catch (error) {
      console.error('Failed to process entry with research team:', error);
      alert('Failed to analyze entry. Please check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderNewEntryForm = () => (
    <Card>
      <h2>New Journal Entry</h2>
      
      <FormGroup>
        <Label>Title</Label>
        <Input
          type="text"
          value={newEntry.title}
          onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
          placeholder="Give this entry a title..."
        />
      </FormGroup>

      <FormGroup>
        <Label>What happened?</Label>
        <TextArea
          value={newEntry.moment.raw_text}
          onChange={(e) => setNewEntry({
            ...newEntry,
            moment: { raw_text: e.target.value }
          })}
          placeholder="Describe the situation..."
          style={{ minHeight: '120px' }}
        />
      </FormGroup>

      <FormGroup>
        <Label>How did you respond?</Label>
        <TextArea
          value={newEntry.initial_thoughts.actual_response}
          onChange={(e) => setNewEntry({
            ...newEntry,
            initial_thoughts: {
              ...newEntry.initial_thoughts,
              actual_response: e.target.value
            }
          })}
          placeholder="What did you say or do?"
        />
      </FormGroup>

      <ButtonGroup>
        <Button $variant="secondary" onClick={() => setShowNewEntry(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmitEntry}
          disabled={isProcessing || !newEntry.title || !newEntry.moment.raw_text}
        >
          {isProcessing ? (
            <>
              <Spinner />
              Processing...
            </>
          ) : (
            <>
              <Users size={16} />
              Analyze with Research Team
            </>
          )}
        </Button>
      </ButtonGroup>
    </Card>
  );

  const renderAnalysis = () => {
    // Check for research team analysis first
    if (activeEntry?.teamAnalysis) {
      return (
        <Card>
          <AnalysisTitle>
            <Users size={20} style={{ color: 'var(--sage)' }} />
            Research Team Analysis
          </AnalysisTitle>
          
          <AnalysisSection>
            {activeEntry.teamAnalysis.initial_analyses?.map((analysis: any, i: number) => (
              <PerspectiveCard key={i} style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginBottom: '0.75rem',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '0.5rem'
                }}>
                  <Brain size={16} style={{ color: 'var(--sage)' }} />
                  <PerspectiveTitle style={{ margin: 0 }}>
                    {analysis.name || analysis.speaker_name}
                  </PerspectiveTitle>
                </div>
                
                {analysis.pattern && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: 'var(--sage)', fontSize: '0.875rem' }}>Pattern:</strong>
                    <div style={{ marginTop: '0.25rem' }}>{analysis.pattern}</div>
                  </div>
                )}
                
                {analysis.insight && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: 'var(--sage)', fontSize: '0.875rem' }}>Insight:</strong>
                    <div style={{ marginTop: '0.25rem', lineHeight: 1.6 }}>{analysis.insight}</div>
                  </div>
                )}
                
                {analysis.question && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem',
                    backgroundColor: 'var(--sage-light)',
                    borderRadius: '6px',
                    borderLeft: '3px solid var(--sage)'
                  }}>
                    <strong style={{ fontSize: '0.875rem' }}>💭 Reflection:</strong>
                    <div style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>
                      {analysis.question}
                    </div>
                  </div>
                )}
              </PerspectiveCard>
            ))}
            
            {activeEntry.teamAnalysis.synthesis && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#f0f7f0',
                borderRadius: '8px',
                border: '1px solid var(--sage)'
              }}>
                <h4 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--sage)' }}>
                  Team Synthesis
                </h4>
                <p style={{ margin: 0, lineHeight: 1.6 }}>
                  {activeEntry.teamAnalysis.synthesis}
                </p>
              </div>
            )}
          </AnalysisSection>
        </Card>
      );
    }
    
    // Fallback to old analysis format if no team analysis
    if (!activeEntry?.analysis) return null;

    return (
      <Card>
        <AnalysisTitle>
          <Brain size={20} style={{ color: 'var(--sage)' }} />
          AI Analysis
        </AnalysisTitle>
        
        <AnalysisSection>
          {activeEntry.analysis.cognitive_distortions?.map((distortion: any, i: number) => (
            <DistortionCard key={i}>
              <DistortionType>{distortion.type}</DistortionType>
              <Quote>"{distortion.quote}"</Quote>
              <Reframe>{distortion.reframe}</Reframe>
            </DistortionCard>
          ))}

          {activeEntry.analysis.therapeutic_perspectives && (
            <PerspectivesSection>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>
                Therapeutic Perspectives
              </h3>
              {Object.entries(activeEntry.analysis.therapeutic_perspectives).map(([key, value]) => (
                <PerspectiveCard key={key}>
                  <PerspectiveTitle>{key}</PerspectiveTitle>
                  <PerspectiveContent>{value as string}</PerspectiveContent>
                </PerspectiveCard>
              ))}
            </PerspectivesSection>
          )}
        </AnalysisSection>
      </Card>
    );
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>
            <BookOpen size={24} style={{ color: 'var(--sage)' }} />
            <h1>Therapeutic Journal</h1>
          </Logo>
          
          <Nav>
            <NavButton
              $active={activeView === 'entries'}
              onClick={() => setActiveView('entries')}
            >
              <FileText size={16} />
              Entries
            </NavButton>
            <NavButton
              $active={activeView === 'insights'}
              onClick={() => setActiveView('insights')}
            >
              <Brain size={16} />
              Insights
            </NavButton>
            <NavButton
              $active={activeView === 'progress'}
              onClick={() => setActiveView('progress')}
            >
              <TrendingUp size={16} />
              Progress
            </NavButton>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <Grid>
          <div>
            {!showNewEntry ? (
              <>
                <NewEntryButton as="button" onClick={() => setShowNewEntry(true)}>
                  <Plus size={20} />
                  New Entry
                </NewEntryButton>
                
                <div style={{ marginTop: '1.5rem' }}>
                  {entries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      onClick={() => setActiveEntry(entry)}
                    >
                      <EntryHeader>
                        <EntryTitle>{entry.title}</EntryTitle>
                        <EntryDate>
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </EntryDate>
                      </EntryHeader>
                      
                      <EntryContent>{entry.moment.raw_text}</EntryContent>
                      
                      {entry.requiresRetry && (
                        <div style={{ 
                          marginTop: '0.75rem', 
                          padding: '0.75rem', 
                          backgroundColor: '#fff3cd', 
                          borderRadius: '6px',
                          border: '1px solid #ffc107'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem'
                          }}>
                            <span style={{ color: '#856404', fontWeight: 600 }}>
                              ⚠️ Analysis Timed Out
                            </span>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetryAnalysis(entry.id);
                            }}
                            disabled={retryingEntries.has(entry.id)}
                            style={{ 
                              fontSize: '0.875rem', 
                              padding: '0.375rem 0.75rem',
                              backgroundColor: retryingEntries.has(entry.id) ? '#f5f5f5' : '#ffc107',
                              color: retryingEntries.has(entry.id) ? '#999' : '#000',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: retryingEntries.has(entry.id) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {retryingEntries.has(entry.id) ? (
                              <>
                                <Spinner />
                                Retrying Analysis...
                              </>
                            ) : (
                              '🔄 Retry Analysis'
                            )}
                          </Button>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#666', 
                            marginTop: '0.5rem' 
                          }}>
                            Quick mode enabled for faster processing
                          </div>
                        </div>
                      )}
                      
                      {entry.tags && entry.tags.length > 0 && !entry.requiresRetry && (
                        <TagContainer>
                          {entry.tags.slice(0, 3).map((tag: string, i: number) => (
                            <Tag key={i}>{tag}</Tag>
                          ))}
                        </TagContainer>
                      )}
                    </EntryCard>
                  ))}
                </div>
              </>
            ) : (
              renderNewEntryForm()
            )}
          </div>

          <div>
            {activeEntry && renderAnalysis()}
            
            {!activeEntry && !showNewEntry && (
              <Card>
                <EmptyState>
                  <Brain />
                  <p>Select an entry to view AI analysis</p>
                </EmptyState>
              </Card>
            )}
          </div>
        </Grid>
      </Main>
    </Container>
  );
}