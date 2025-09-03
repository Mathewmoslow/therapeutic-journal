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
      
      const analysis = await journalService.analyzeEntry(entry, entries);
      
      const entryWithAnalysis = {
        ...entry,
        analysis,
        tags: analysis.cognitive_distortions?.map((d: any) => d.type) || []
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
    } catch (error) {
      console.error('Failed to process entry:', error);
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
              <Sparkles size={16} />
              Analyze Entry
            </>
          )}
        </Button>
      </ButtonGroup>
    </Card>
  );

  const renderAnalysis = () => {
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
                      
                      {entry.tags && entry.tags.length > 0 && (
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