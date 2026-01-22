import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ 
              fontSize: 'var(--text-4xl)', 
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)'
            }}
          >
            Choose Your Learning Path
          </h1>
          <p 
            className="text-lg"
            style={{ 
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)'
            }}
          >
            Select the practice mode that best fits your English speaking goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic Mode Card */}
          <Link
            to="/basic"
            className="block p-8 transition-all duration-300 hover:transform hover:scale-105 rounded-xl border"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              borderColor: 'var(--color-emerald-border)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
          >
            <div className="text-center">
              <div 
                className="inline-block px-4 py-2 rounded-lg text-sm font-medium mb-4"
                style={{
                  backgroundColor: 'var(--color-emerald-surface)',
                  color: 'var(--color-primary-emerald)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)'
                }}
              >
                Basic Mode
              </div>
              <h2 
                className="text-2xl mb-4"
                style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Practice & Analysis
              </h2>
              <div 
                className="space-y-2 text-left mb-6"
                style={{ 
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <p>• Real-time speech analysis</p>
                <p>• Speaking metrics & feedback</p>
                <p>• Flexible conversation practice</p>
                <p>• Session history tracking</p>
              </div>
              <div 
                className="inline-block px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: 'var(--color-primary-emerald)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-emerald-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-emerald)';
                }}
              >
                Start Basic Mode
              </div>
            </div>
          </Link>

          {/* IELTS Mode Card */}
          <Link
            to="/ielts"
            className="block p-8 transition-all duration-300 hover:transform hover:scale-105 rounded-xl border-2"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              borderColor: 'var(--color-blue-border)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
          >
            <div className="text-center">
              <div 
                className="inline-block px-4 py-2 rounded-lg text-sm font-medium mb-4"
                style={{
                  backgroundColor: 'var(--color-blue-surface)',
                  color: 'var(--color-primary-blue)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)'
                }}
              >
                IELTS Speaking Test
              </div>
              <h2 
                className="text-2xl mb-4"
                style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Official Test Simulation
              </h2>
              <div 
                className="space-y-2 text-left mb-6"
                style={{ 
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <p>• Complete IELTS Speaking format</p>
                <p>• Official timing & structure</p>
                <p>• AI examiner interaction</p>
                <p>• Band score evaluation</p>
              </div>
              <div 
                className="inline-block px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: 'var(--color-primary-blue)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-blue-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-blue)';
                }}
              >
                Start IELTS Test
              </div>
            </div>
          </Link>
        </div>
        
        <div className="text-center mt-12">
          <p 
            className="text-sm"
            style={{ 
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)'
            }}
          >
            Both modes include AI-powered feedback and personalized learning paths
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;