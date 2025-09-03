'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Users, ChevronDown, ChevronUp, Brain, Heart, 
  Activity, Layers, Stethoscope, MessageCircle,
  BookOpen, Clock, AlertCircle
} from 'lucide-react';
import ResearchTeamService from '@/services/researchTeamService';

// Styled Components for Professional Display
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProfessionalCard = styled.div<{ $borderColor: string }>`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 1rem;
  border-left: 5px solid ${props => props.$borderColor};
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ProfessionalHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  cursor: pointer;
  user-select: none;
`;

const ProfessionalInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameAndCredentials = styled.div`
  h3 {
    font-size: 1.25rem;
    color: var(--text);
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-style: italic;
  }
`;

const ExpandIcon = styled.div`
  color: var(--text-muted);
  transition: transform 0.3s ease;
  
  &.expanded {
    transform: rotate(180deg);
  }
`;

const AnalysisContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => props.$isExpanded ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease;
  padding: ${props => props.$isExpanded ? '1.5rem' : '0 1.5rem'};
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  color: var(--text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ObservationText = styled.div`
  line-height: 1.8;
  color: #4a5568;
  font-size: 1rem;
  
  p {
    margin-bottom: 1rem;
  }
`;

const PatternCard = styled.div`
  background: #f7fafc;
  border-left: 3px solid var(--purple);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
`;

const Evidence = styled.div`
  background: #fef5e7;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  font-style: italic;
  color: #6c5ce7;
`;

const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.75rem;
    background: #e8f4fd;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border-left: 3px solid #3498db;
    color: #2c3e50;
  }
`;

const CommentarySection = styled.div`
  background: #f0f4f8;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const DialogueFlow = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  }
`;

const DialogueItem = styled.div`
  position: relative;
  padding-left: 50px;
  margin-bottom: 1.5rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #667eea;
    border: 2px solid white;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: white;
  font-size: 1.2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  
  h2 {
    color: var(--text);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-muted);
  }
`;

// Professional color mapping
const PROFESSIONAL_COLORS = {
  psychodynamic_analyst: '#9b59b6',
  family_systems_therapist: '#3498db', 
  somatic_specialist: '#e74c3c',
  cbt_analyst: '#2ecc71',
  psychiatric_consultant: '#f39c12'
};

const PROFESSIONAL_ICONS = {
  psychodynamic_analyst: Brain,
  family_systems_therapist: Users,
  somatic_specialist: Activity,
  cbt_analyst: Layers,
  psychiatric_consultant: Stethoscope
};

export default function InsightsPage() {
  const [teamAnalysis, setTeamAnalysis] = useState<any>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  
  const researchTeamService = new ResearchTeamService();
  
  useEffect(() => {
    // Load the most recent analysis from localStorage or fetch if available
    const savedAnalysis = localStorage.getItem('latestTeamAnalysis');
    if (savedAnalysis) {
      setTeamAnalysis(JSON.parse(savedAnalysis));
    }
  }, []);
  
  const toggleCard = (professional: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(professional)) {
      newExpanded.delete(professional);
    } else {
      newExpanded.add(professional);
    }
    setExpandedCards(newExpanded);
  };
  
  const renderProfessionalAnalysis = (analysis: any) => {
    const Icon = PROFESSIONAL_ICONS[analysis.professional as keyof typeof PROFESSIONAL_ICONS] || Brain;
    const color = PROFESSIONAL_COLORS[analysis.professional as keyof typeof PROFESSIONAL_COLORS] || '#666';
    const isExpanded = expandedCards.has(analysis.professional);
    
    return (
      <ProfessionalCard key={analysis.professional} $borderColor={color}>
        <ProfessionalHeader onClick={() => toggleCard(analysis.professional)}>
          <ProfessionalInfo>
            <NameAndCredentials>
              <h3>
                <Icon size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {analysis.speaker_name}
              </h3>
              <p>{analysis.professional.replace(/_/g, ' ').toUpperCase()}</p>
            </NameAndCredentials>
            <ExpandIcon className={isExpanded ? 'expanded' : ''}>
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </ExpandIcon>
          </ProfessionalInfo>
        </ProfessionalHeader>
        
        <AnalysisContent $isExpanded={isExpanded}>
          <Section>
            <SectionTitle>
              <BookOpen size={18} />
              Opening Observation
            </SectionTitle>
            <ObservationText>
              <p>{analysis.analysis.opening_observation}</p>
            </ObservationText>
          </Section>
          
          <Section>
            <SectionTitle>
              <AlertCircle size={18} />
              Primary Pattern Identified
            </SectionTitle>
            <PatternCard>
              <h5 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                {analysis.analysis.pattern_identification.primary_pattern}
              </h5>
              <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '0.5rem' }}>
                Function: {analysis.analysis.pattern_identification.pattern_function}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#c0392b' }}>
                Cost: {analysis.analysis.pattern_identification.pattern_cost}
              </p>
              
              {analysis.analysis.pattern_identification.evidence?.map((evidence: string, i: number) => (
                <Evidence key={i}>"{evidence}"</Evidence>
              ))}
            </PatternCard>
          </Section>
          
          <Section>
            <SectionTitle>
              <Brain size={18} />
              Through My Theoretical Lens
            </SectionTitle>
            <ObservationText>
              <p>{analysis.analysis.theoretical_framework.through_my_lens}</p>
            </ObservationText>
            <ObservationText style={{ marginTop: '1rem' }}>
              <strong>Clinical Observations:</strong>
              <p>{analysis.analysis.theoretical_framework.clinical_observations}</p>
            </ObservationText>
          </Section>
          
          <Section>
            <SectionTitle>
              <MessageCircle size={18} />
              Questions for Exploration
            </SectionTitle>
            <QuestionList>
              {analysis.analysis.deeper_exploration.questions_raised?.map((question: string, i: number) => (
                <li key={i}>{question}</li>
              ))}
            </QuestionList>
          </Section>
          
          {analysis.analysis.therapeutic_implications && (
            <Section>
              <SectionTitle>
                <Heart size={18} />
                Therapeutic Implications
              </SectionTitle>
              <ObservationText>
                <p>{analysis.analysis.therapeutic_implications}</p>
              </ObservationText>
            </Section>
          )}
        </AnalysisContent>
      </ProfessionalCard>
    );
  };
  
  const renderCrossCommentary = (commentary: any) => {
    if (!commentary) return null;
    
    return (
      <CommentarySection key={commentary.professional}>
        <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
          {commentary.speaker_name} responds to colleagues:
        </h4>
        
        <DialogueFlow>
          {commentary.commentary.agreements && (
            <DialogueItem>
              <strong>Agreeing with {commentary.commentary.agreements.with_whom}:</strong>
              <p style={{ marginTop: '0.5rem' }}>{commentary.commentary.agreements.what_resonates}</p>
            </DialogueItem>
          )}
          
          {commentary.commentary.expansions && (
            <DialogueItem>
              <strong>Building on {commentary.commentary.expansions.building_on}:</strong>
              <p style={{ marginTop: '0.5rem' }}>{commentary.commentary.expansions.additional_layer}</p>
            </DialogueItem>
          )}
          
          {commentary.commentary.gentle_challenges && (
            <DialogueItem>
              <strong>Alternative perspective:</strong>
              <p style={{ marginTop: '0.5rem' }}>{commentary.commentary.gentle_challenges.your_hypothesis}</p>
            </DialogueItem>
          )}
          
          {commentary.commentary.cross_theoretical_insights && (
            <DialogueItem>
              <strong>Synthesis:</strong>
              <p style={{ marginTop: '0.5rem' }}>{commentary.commentary.cross_theoretical_insights.synthesis}</p>
            </DialogueItem>
          )}
        </DialogueFlow>
      </CommentarySection>
    );
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingState>
          <Users size={48} style={{ marginBottom: '1rem' }} />
          <p>Research team is analyzing...</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>This may take a few moments as each professional provides their analysis</p>
        </LoadingState>
      </Container>
    );
  }
  
  if (!teamAnalysis) {
    return (
      <Container>
        <ContentWrapper>
          <EmptyState>
            <Users size={64} style={{ color: '#667eea', marginBottom: '1rem' }} />
            <h2>No Team Analysis Available</h2>
            <p>Create a journal entry and click "Analyze with Research Team" to see professional perspectives</p>
          </EmptyState>
        </ContentWrapper>
      </Container>
    );
  }
  
  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>
            <Users size={32} />
            Research Team Analysis
          </Title>
          <Subtitle>
            Five professional perspectives on your family dynamics
          </Subtitle>
          {teamAnalysis.entry_analyzed && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
              <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Analyzing: "{teamAnalysis.entry_analyzed.title}" • {new Date(teamAnalysis.entry_analyzed.date).toLocaleDateString()}
            </div>
          )}
        </Header>
        
        <TeamGrid>
          {teamAnalysis.initial_analyses?.map((analysis: any) => 
            renderProfessionalAnalysis(analysis)
          )}
        </TeamGrid>
        
        {teamAnalysis.cross_commentary && teamAnalysis.cross_commentary.length > 0 && (
          <>
            <Header style={{ marginTop: '2rem' }}>
              <Title style={{ fontSize: '1.5rem' }}>
                <MessageCircle size={24} />
                Team Discussion
              </Title>
              <Subtitle>Professionals responding to each other's analyses</Subtitle>
            </Header>
            
            {teamAnalysis.cross_commentary.map((commentary: any) =>
              renderCrossCommentary(commentary)
            )}
          </>
        )}
      </ContentWrapper>
    </Container>
  );
}