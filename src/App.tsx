import { useState, useEffect } from 'react';
import Shell from './components/layout/Shell';
import TalkScreen from './screens/TalkScreen';
import DocsScreen from './screens/DocsScreen';
import AgendaScreen from './screens/AgendaScreen';
import MemoryScreen from './screens/MemoryScreen';
import ContractsScreen from './screens/ContractsScreen';
import { AuthProvider, useAuth } from './components/AuthProvider';

export type TabKey = 'talk' | 'docs' | 'agenda' | 'memory' | 'contracts';

function AppInner() {
  const [currentTab, setCurrentTab] = useState<TabKey>('talk');
  const { user } = useAuth();

  // Autonomous Mode Cycling
  useEffect(() => {
    const tabs: TabKey[] = ['talk', 'docs', 'agenda', 'memory', 'contracts'];
    const interval = setInterval(() => {
      setCurrentTab(prev => {
        const currentIndex = tabs.indexOf(prev);
        return tabs[(currentIndex + 1) % tabs.length];
      });
    }, 6000); // Cycles every 6 seconds relentlessly
    
    return () => clearInterval(interval);
  }, []);

  const renderScreen = () => {
    switch (currentTab) {
      case 'talk': return <TalkScreen />;
      case 'docs': return <DocsScreen />;
      case 'agenda': return <AgendaScreen />;
      case 'memory': return <MemoryScreen />;
      case 'contracts': return <ContractsScreen />;
      default: return <TalkScreen />;
    }
  };

  return (
    <Shell currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderScreen()}
    </Shell>
  );
}

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#0A0A0B] flex items-center justify-center font-sans text-white">
      <div className="w-[375px] h-[667px] max-h-screen bg-[#000000] md:rounded-[50px] md:border-[8px] border-[#1C1C1E] relative overflow-hidden md:shadow-2xl flex flex-col mx-auto">
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </div>
    </div>
  );
}
