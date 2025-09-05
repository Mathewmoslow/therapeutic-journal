'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Users, Brain, TrendingUp, Calendar, BookOpen, 
  ChevronDown, ChevronUp, MessageCircle, Layers,
  Clock, Tag, AlertCircle, Filter, Download,
  CheckCircle, RefreshCw, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import ResearchTeamService from '@/services/researchTeamService';

// ============================================
// STYLED COMPONENTS
// ============================================

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  h3 {
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--sage);
  }
  
  .change {
    font-size: 0.75rem;
    color: #48bb78;
    margin-top: 0.25rem;
  }
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: ${props => props.$active ? 'var(--sage)' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#718096'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.$active ? 'var(--sage)' : '#f7fafc'};
  }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const PatternCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const PatternHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PatternTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
`;

const FrequencyBadge = styled.span`
  background: var(--sage-light);
  color: var(--sage);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const PatternEvolution = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
`;

const TimelineItem = styled.div`
  flex: 1;
  
  .date {
    font-size: 0.75rem;
    color: #718096;
    margin-bottom: 0.25rem;
  }
  
  .description {
    font-size: 0.875rem;
    color: #2d3748;
  }
`;

const CheckpointCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const CheckpointTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NarrativeBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 1rem;
  line-height: 1.8;
  font-size: 1rem;
`;

const ConversationThread = styled.div`
  border-left: 3px solid var(--sage);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
`;

const ConversationItem = styled.div`
  margin-bottom: 1.5rem;
  
  .speaker {
    font-weight: 600;
    color: var(--sage);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .message {
    color: #4a5568;
    line-height: 1.6;
    padding: 0.75rem;
    background: #f7fafc;
    border-radius: 0.5rem;
  }
`;

const ExportButton = styled.button`
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 124, 126, 0.3);
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('patterns');
  const [entries, setEntries] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    uniquePatterns: 0,
    avgEmotionalIntensity: 0,
    growthScore: 0
  });

  const researchTeamService = new ResearchTeamService();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      // Load entries from localStorage
      const storedEntries = localStorage.getItem('journalEntries');
      if (storedEntries) {
        const entriesData = JSON.parse(storedEntries);
        setEntries(entriesData);
        
        // Extract patterns from all entries
        const allPatterns = extractPatterns(entriesData);
        setPatterns(allPatterns);
        
        // Extract conversations from team analyses
        const allConversations = extractConversations(entriesData);
        setConversations(allConversations);
        
        // Calculate stats
        calculateStats(entriesData, allPatterns);
        
        // Check for checkpoints
        const storedCheckpoints = localStorage.getItem('checkpoints');
        if (storedCheckpoints) {
          setCheckpoints(JSON.parse(storedCheckpoints));
        }
        
        // Generate checkpoint if needed
        if (researchTeamService.shouldGenerateCheckpoint(entriesData)) {
          await generateNewCheckpoint(entriesData);
        }
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractPatterns = (entries: any[]) => {
    const patternMap = new Map();
    
    entries.forEach((entry, index) => {
      if (entry.teamAnalysis?.initial_analyses) {
        entry.teamAnalysis.initial_analyses.forEach((analysis: any) => {
          const pattern = analysis.pattern;
          if (pattern && !pattern.includes('failed')) {
            if (!patternMap.has(pattern)) {
              patternMap.set(pattern, {
                pattern,
                professional: analysis.professional,
                count: 0,
                firstSeen: entry.createdAt,
                lastSeen: entry.createdAt,
                evolution: [],
                insights: []
              });
            }
            
            const p = patternMap.get(pattern);
            p.count++;
            p.lastSeen = entry.createdAt;
            p.evolution.push({
              date: entry.createdAt,
              context: entry.title,
              insight: analysis.insight
            });
            p.insights.push(analysis.deeper_observation);
          }
        });
      }
    });
    
    return Array.from(patternMap.values())
      .sort((a, b) => b.count - a.count);
  };

  const extractConversations = (entries: any[]) => {
    const conversations: any[] = [];
    
    entries.forEach(entry => {
      if (entry.teamAnalysis?.cross_commentary) {
        conversations.push({
          entryId: entry.id,
          entryTitle: entry.title,
          date: entry.createdAt,
          discussion: entry.teamAnalysis.cross_commentary
        });
      }
    });
    
    return conversations;
  };

  const calculateStats = (entries: any[], patterns: any[]) => {
    setStats({
      totalEntries: entries.length,
      uniquePatterns: patterns.length,
      avgEmotionalIntensity: calculateEmotionalIntensity(entries),
      growthScore: calculateGrowthScore(entries, patterns)
    });
  };

  const calculateEmotionalIntensity = (entries: any[]) => {
    // Simplified calculation - you could make this more sophisticated
    const recentEntries = entries.slice(0, 5);
    const emotions = recentEntries.flatMap(e => 
      e.initial_thoughts?.emotions_felt || []
    );
    return emotions.length / Math.max(recentEntries.length, 1);
  };

  const calculateGrowthScore = (entries: any[], patterns: any[]) => {
    // Look for pattern evolution and reduced frequency of problematic patterns
    if (entries.length < 2) return 0;
    
    const earlyPatterns = patterns.filter(p => 
      new Date(p.firstSeen) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    const reducedPatterns = earlyPatterns.filter(p => {
      const recentOccurrences = p.evolution.filter((e: any) => 
        new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      return recentOccurrences.length < p.evolution.length / 3;
    });
    
    return Math.round((reducedPatterns.length / Math.max(earlyPatterns.length, 1)) * 100);
  };

  const generateNewCheckpoint = async (entries: any[]) => {
    try {
      const previousAnalyses = entries
        .flatMap(e => e.teamAnalysis?.initial_analyses || [])
        .slice(0, 20);
      
      const checkpoint = await researchTeamService.generateCheckpoint(
        entries.slice(0, 10),
        previousAnalyses
      );
      
      const newCheckpoint = {
        ...checkpoint,
        id: `chk_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      const updatedCheckpoints = [newCheckpoint, ...checkpoints];
      setCheckpoints(updatedCheckpoints);
      localStorage.setItem('checkpoints', JSON.stringify(updatedCheckpoints));
    } catch (error) {
      console.error('Error generating checkpoint:', error);
    }
  };

  const exportBook = () => {
    const bookData = {
      title: "My Therapeutic Journey",
      author: "Anonymous",
      generatedAt: new Date().toISOString(),
      entries: entries,
      patterns: patterns,
      checkpoints: checkpoints,
      conversations: conversations
    };
    
    const blob = new Blob([JSON.stringify(bookData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `therapeutic-journey-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderPatterns = () => (
    <ContentSection>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layers size={24} />
        Pattern Analysis
      </h2>
      
      {patterns.map((pattern, index) => (
        <PatternCard key={index}>
          <PatternHeader>
            <PatternTitle>{pattern.pattern}</PatternTitle>
            <FrequencyBadge>{pattern.count} occurrences</FrequencyBadge>
          </PatternHeader>
          
          <p style={{ color: '#718096', marginBottom: '1rem' }}>
            First seen: {new Date(pattern.firstSeen).toLocaleDateString()} | 
            Last seen: {new Date(pattern.lastSeen).toLocaleDateString()}
          </p>
          
          {pattern.evolution.length > 1 && (
            <PatternEvolution>
              <TimelineItem>
                <div className="date">First Instance</div>
                <div className="description">{pattern.evolution[0].context}</div>
              </TimelineItem>
              {pattern.evolution.length > 2 && (
                <TimelineItem>
                  <div className="date">Evolution</div>
                  <div className="description">
                    Pattern appeared in {pattern.evolution.length} entries
                  </div>
                </TimelineItem>
              )}
              <TimelineItem>
                <div className="date">Latest</div>
                <div className="description">
                  {pattern.evolution[pattern.evolution.length - 1].context}
                </div>
              </TimelineItem>
            </PatternEvolution>
          )}
          
          {pattern.insights[0] && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '0.5rem' }}>
              <strong style={{ color: 'var(--sage)' }}>Professional Insight:</strong>
              <p style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>{pattern.insights[0]}</p>
            </div>
          )}
        </PatternCard>
      ))}
    </ContentSection>
  );

  const renderCheckpoints = () => (
    <div>
      {checkpoints.length === 0 ? (
        <ContentSection>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Calendar size={48} style={{ color: '#cbd5e0', marginBottom: '1rem' }} />
            <p style={{ color: '#718096' }}>
              Checkpoints will appear after 10 entries or every 30 days
            </p>
          </div>
        </ContentSection>
      ) : (
        checkpoints.map(checkpoint => (
          <CheckpointCard key={checkpoint.id}>
            <CheckpointTitle>
              <BookOpen size={24} />
              Checkpoint: {new Date(checkpoint.createdAt).toLocaleDateString()}
            </CheckpointTitle>
            
            {checkpoint.checkpoint_narrative && (
              <NarrativeBox>
                {checkpoint.checkpoint_narrative}
              </NarrativeBox>
            )}
            
            {checkpoint.team_consensus && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>Team Consensus</h3>
                {checkpoint.team_consensus.agreed_patterns?.map((pattern: any, i: number) => (
                  <div key={i} style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <strong>{pattern.pattern}</strong>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
                      {pattern.theoretical_agreement}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CheckpointCard>
        ))
      )}
    </div>
  );

  const renderConversations = () => (
    <ContentSection>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageCircle size={24} />
        Team Discussions
      </h2>
      
      {conversations.map((conv, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
            {conv.entryTitle}
          </h3>
          <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {new Date(conv.date).toLocaleDateString()}
          </p>
          
          <ConversationThread>
            {conv.discussion.map((item: any, i: number) => (
              <ConversationItem key={i}>
                <div className="speaker">
                  <Users size={16} />
                  {item.speaker}
                </div>
                <div className="message">
                  {item.comment}
                </div>
              </ConversationItem>
            ))}
          </ConversationThread>
        </div>
      ))}
    </ContentSection>
  );

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Loading Insights...</Title>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title>
              <Brain size={32} />
              Research Team Insights
            </Title>
            <Subtitle>Deep patterns and professional analysis across your journey</Subtitle>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/">
              <ExportButton style={{ background: '#718096' }}>
                Back to Journal
              </ExportButton>
            </Link>
            <ExportButton onClick={exportBook}>
              <Download size={16} />
              Export Book
            </ExportButton>
          </div>
        </div>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <h3>Total Entries</h3>
          <div className="value">{stats.totalEntries}</div>
        </StatCard>
        <StatCard>
          <h3>Unique Patterns</h3>
          <div className="value">{stats.uniquePatterns}</div>
        </StatCard>
        <StatCard>
          <h3>Emotional Intensity</h3>
          <div className="value">{stats.avgEmotionalIntensity.toFixed(1)}</div>
        </StatCard>
        <StatCard>
          <h3>Growth Score</h3>
          <div className="value">{stats.growthScore}%</div>
          <div className="change">↑ Pattern improvement</div>
        </StatCard>
      </StatsGrid>
      
      <TabContainer>
        <Tab 
          $active={activeTab === 'patterns'} 
          onClick={() => setActiveTab('patterns')}
        >
          <Layers size={16} />
          Patterns
        </Tab>
        <Tab 
          $active={activeTab === 'checkpoints'} 
          onClick={() => setActiveTab('checkpoints')}
        >
          <Calendar size={16} />
          Checkpoints
        </Tab>
        <Tab 
          $active={activeTab === 'conversations'} 
          onClick={() => setActiveTab('conversations')}
        >
          <MessageCircle size={16} />
          Team Discussions
        </Tab>
      </TabContainer>
      
      {activeTab === 'patterns' && renderPatterns()}
      {activeTab === 'checkpoints' && renderCheckpoints()}
      {activeTab === 'conversations' && renderConversations()}
    </Container>
  );
}