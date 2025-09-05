'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, Calendar, Heart, Brain, Activity,
  Award, Target, Zap, ChevronRight, Clock,
  AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// ============================================
// STYLED COMPONENTS
// ============================================

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div<{ $trend?: 'up' | 'down' | 'neutral' }>`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => 
      props.$trend === 'up' ? '#48bb78' : 
      props.$trend === 'down' ? '#f56565' : 
      '#ed8936'
    };
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MetricTitle = styled.h3`
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const MetricChange = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.$positive ? '#48bb78' : '#f56565'};
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 0.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#2d3748' : '#718096'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
`;

const MilestoneCard = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MilestoneIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MilestoneContent = styled.div`
  flex: 1;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.875rem;
    color: #718096;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #718096;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [entries, setEntries] = useState<any[]>([]);
  const [emotionalData, setEmotionalData] = useState<any[]>([]);
  const [patternData, setPatternData] = useState<any[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<any>({});
  const [milestones, setMilestones] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);

  useEffect(() => {
    loadProgressData();
  }, [timeRange]);

  const loadProgressData = () => {
    const storedEntries = localStorage.getItem('journalEntries');
    if (!storedEntries) return;
    
    const entriesData = JSON.parse(storedEntries);
    setEntries(entriesData);
    
    // Process emotional trajectory
    const emotional = processEmotionalData(entriesData);
    setEmotionalData(emotional);
    
    // Process pattern frequency
    const patterns = processPatternData(entriesData);
    setPatternData(patterns);
    
    // Calculate growth metrics
    const metrics = calculateGrowthMetrics(entriesData);
    setGrowthMetrics(metrics);
    
    // Generate milestones
    const achievedMilestones = generateMilestones(entriesData);
    setMilestones(achievedMilestones);
    
    // Generate radar chart data
    const radar = generateRadarData(entriesData);
    setRadarData(radar);
  };

  const processEmotionalData = (entries: any[]) => {
    return entries.slice(0, 30).reverse().map((entry, index) => {
      const emotions = entry.initial_thoughts?.emotions_felt || [];
      const intensity = emotions.length;
      
      // Simple valence calculation
      const negativeEmotions = ['anger', 'frustration', 'shame', 'hurt', 'fear', 'anxiety'];
      const positiveEmotions = ['joy', 'peace', 'gratitude', 'hope', 'love', 'excitement'];
      
      const negative = emotions.filter((e: string) => 
        negativeEmotions.some(ne => e.toLowerCase().includes(ne))
      ).length;
      
      const positive = emotions.filter((e: string) => 
        positiveEmotions.some(pe => e.toLowerCase().includes(pe))
      ).length;
      
      return {
        date: new Date(entry.createdAt).toLocaleDateString(),
        intensity,
        valence: positive - negative,
        entry: index + 1
      };
    });
  };

  const processPatternData = (entries: any[]) => {
    const patternCounts: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      if (entry.teamAnalysis?.initial_analyses) {
        entry.teamAnalysis.initial_analyses.forEach((analysis: any) => {
          const pattern = analysis.pattern;
          if (pattern && !pattern.includes('failed')) {
            const simplified = pattern.split(' ').slice(0, 3).join(' ');
            patternCounts[simplified] = (patternCounts[simplified] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(patternCounts)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateGrowthMetrics = (entries: any[]) => {
    if (entries.length < 2) {
      return {
        consistency: 0,
        insightDepth: 0,
        emotionalRange: 0,
        patternRecognition: 0
      };
    }
    
    // Consistency: frequency of entries
    const daysSinceFirst = Math.floor(
      (Date.now() - new Date(entries[entries.length - 1].createdAt).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const consistency = Math.min(100, (entries.length / Math.max(daysSinceFirst, 1)) * 100);
    
    // Insight depth: average length of reflections
    const avgLength = entries.reduce((sum, e) => 
      sum + (e.moment?.raw_text?.length || 0), 0
    ) / entries.length;
    const insightDepth = Math.min(100, (avgLength / 500) * 100);
    
    // Emotional range: variety of emotions
    const allEmotions = new Set(
      entries.flatMap(e => e.initial_thoughts?.emotions_felt || [])
    );
    const emotionalRange = Math.min(100, allEmotions.size * 10);
    
    // Pattern recognition: unique patterns identified
    const patterns = new Set(
      entries.flatMap(e => 
        e.teamAnalysis?.initial_analyses?.map((a: any) => a.pattern) || []
      )
    );
    const patternRecognition = Math.min(100, patterns.size * 5);
    
    return {
      consistency: Math.round(consistency),
      insightDepth: Math.round(insightDepth),
      emotionalRange: Math.round(emotionalRange),
      patternRecognition: Math.round(patternRecognition),
      overall: Math.round((consistency + insightDepth + emotionalRange + patternRecognition) / 4)
    };
  };

  const generateMilestones = (entries: any[]) => {
    const milestones = [];
    
    if (entries.length >= 1) {
      milestones.push({
        icon: <CheckCircle />,
        title: 'First Entry',
        description: 'Started your therapeutic journey',
        achieved: true
      });
    }
    
    if (entries.length >= 5) {
      milestones.push({
        icon: <Activity />,
        title: 'Gaining Momentum',
        description: 'Completed 5 journal entries',
        achieved: true
      });
    }
    
    if (entries.length >= 10) {
      milestones.push({
        icon: <Award />,
        title: 'Consistent Practice',
        description: 'Reached 10 entries milestone',
        achieved: true
      });
    }
    
    const patterns = new Set(
      entries.flatMap(e => 
        e.teamAnalysis?.initial_analyses?.map((a: any) => a.pattern) || []
      )
    );
    
    if (patterns.size >= 5) {
      milestones.push({
        icon: <Brain />,
        title: 'Pattern Detective',
        description: 'Identified 5+ unique patterns',
        achieved: true
      });
    }
    
    return milestones;
  };

  const generateRadarData = (entries: any[]) => {
    const metrics = calculateGrowthMetrics(entries);
    return [
      {
        dimension: 'Consistency',
        value: metrics.consistency
      },
      {
        dimension: 'Insight Depth',
        value: metrics.insightDepth
      },
      {
        dimension: 'Emotional Range',
        value: metrics.emotionalRange
      },
      {
        dimension: 'Pattern Recognition',
        value: metrics.patternRecognition
      },
      {
        dimension: 'Overall Growth',
        value: metrics.overall
      }
    ];
  };

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title>
              <TrendingUp size={32} />
              Your Progress Journey
            </Title>
            <Subtitle>Track your emotional growth and pattern evolution</Subtitle>
          </div>
          <BackButton href="/">
            Back to Journal
          </BackButton>
        </div>
      </Header>
      
      <MetricsGrid>
        <MetricCard $trend="up">
          <MetricHeader>
            <MetricTitle>Overall Growth</MetricTitle>
            <Heart size={20} color="#ed8936" />
          </MetricHeader>
          <MetricValue>{growthMetrics.overall || 0}%</MetricValue>
          <MetricChange $positive={true}>
            <ArrowUpRight size={16} />
            Improving steadily
          </MetricChange>
        </MetricCard>
        
        <MetricCard $trend="up">
          <MetricHeader>
            <MetricTitle>Consistency</MetricTitle>
            <Calendar size={20} color="#4299e1" />
          </MetricHeader>
          <MetricValue>{growthMetrics.consistency || 0}%</MetricValue>
          <MetricChange $positive={true}>
            <CheckCircle size={16} />
            {entries.length} entries
          </MetricChange>
        </MetricCard>
        
        <MetricCard $trend="neutral">
          <MetricHeader>
            <MetricTitle>Emotional Range</MetricTitle>
            <Activity size={20} color="#9f7aea" />
          </MetricHeader>
          <MetricValue>{growthMetrics.emotionalRange || 0}%</MetricValue>
          <MetricChange $positive={true}>
            <Zap size={16} />
            Expanding awareness
          </MetricChange>
        </MetricCard>
        
        <MetricCard $trend="up">
          <MetricHeader>
            <MetricTitle>Pattern Recognition</MetricTitle>
            <Brain size={20} color="#48bb78" />
          </MetricHeader>
          <MetricValue>{growthMetrics.patternRecognition || 0}%</MetricValue>
          <MetricChange $positive={true}>
            <Target size={16} />
            Deep insights
          </MetricChange>
        </MetricCard>
      </MetricsGrid>
      
      <ChartCard>
        <ChartTitle>
          <Activity size={24} />
          Emotional Trajectory
        </ChartTitle>
        <TabContainer>
          <Tab $active={timeRange === '7d'} onClick={() => setTimeRange('7d')}>
            7 Days
          </Tab>
          <Tab $active={timeRange === '30d'} onClick={() => setTimeRange('30d')}>
            30 Days
          </Tab>
          <Tab $active={timeRange === 'all'} onClick={() => setTimeRange('all')}>
            All Time
          </Tab>
        </TabContainer>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={emotionalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="entry" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255,255,255,0.95)', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="intensity" 
              stroke="#667eea" 
              fill="url(#colorIntensity)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="valence" 
              stroke="#48bb78" 
              fill="url(#colorValence)" 
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorValence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#48bb78" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#48bb78" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <ChartCard>
          <ChartTitle>
            <Brain size={24} />
            Growth Dimensions
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="dimension" stroke="#718096" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#718096" />
              <Radar 
                name="Your Growth" 
                dataKey="value" 
                stroke="#764ba2" 
                fill="#764ba2" 
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>
            <Award size={24} />
            Top Patterns
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patternData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="pattern" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#718096" />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <ChartCard>
        <ChartTitle>
          <Award size={24} />
          Achieved Milestones
        </ChartTitle>
        {milestones.map((milestone, index) => (
          <MilestoneCard key={index}>
            <MilestoneIcon>{milestone.icon}</MilestoneIcon>
            <MilestoneContent>
              <h4>{milestone.title}</h4>
              <p>{milestone.description}</p>
            </MilestoneContent>
            <CheckCircle size={24} color="#48bb78" />
          </MilestoneCard>
        ))}
      </ChartCard>
    </Container>
  );
}