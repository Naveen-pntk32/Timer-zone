import React, { useState, Suspense, lazy } from 'react';
import styled from 'styled-components';
import SideNav from './components/SideNav';
import Loading from './components/Loading';

// Lazy load components
const Timer = lazy(() => import('./components/Timer'));
const Stopwatch = lazy(() => import('./components/Stopwatch'));
const Calendar = lazy(() => import('./components/Calendar'));
const Notes = lazy(() => import('./components/Notes'));

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  background: #f5f6fa;
  padding: 2rem;
  position: relative;
`;

const ContentWrapper = styled.div<{ isVisible: boolean }>`
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('timer-section');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initial loading simulation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = async (section: string) => {
    setIsTransitioning(true);
    setActiveSection(section);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsTransitioning(false);
  };

  const renderContent = () => {
    return (
      <ContentWrapper isVisible={!isTransitioning}>
        <Suspense fallback={<Loading text="Loading section..." />}>
          {(() => {
            switch (activeSection) {
              case 'timer-section':
                return <Timer />;
              case 'stop-section':
                return <Stopwatch />;
              case 'calendar-section':
                return <Calendar />;
              case 'notes-section':
                return <Notes />;
              default:
                return <Timer />;
            }
          })()}
        </Suspense>
      </ContentWrapper>
    );
  };

  if (isLoading) {
    return <Loading text="Starting PNTK Timer..." />;
  }

  return (
    <AppContainer>
      <SideNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <MainContent>
        {renderContent()}
      </MainContent>
    </AppContainer>
  );
};

export default App;
