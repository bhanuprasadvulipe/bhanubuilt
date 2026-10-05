import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Calculator.css';

const OneRMCalculator = () => {
  const [exercise, setExercise] = useState('Bench Press');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState(null);

  const calculateOneRM = (e) => {
    e.preventDefault();
    if (!weight || !reps) return;
    
    const w = parseFloat(weight);
    const r = parseInt(reps);

    // Epley Formula: 1RM = weight * (1 + reps/30)
    const epley = w * (1 + r / 30);
    // Brzycki Formula: 1RM = weight * (36 / (37 - reps))
    const brzycki = w * (36 / (37 - r));
    // Lombardi Formula: 1RM = Weight × Reps^0.1
    const lombardi = w * Math.pow(r, 0.1);
    
    // Average of all three formulas for the best estimate
    const estimate = Math.round((epley + brzycki + lombardi) / 3);

    const percentages = {
      '100%': estimate,
      '95%': Math.round(estimate * 0.95),
      '90%': Math.round(estimate * 0.90),
      '85%': Math.round(estimate * 0.85),
      '80%': Math.round(estimate * 0.80),
      '75%': Math.round(estimate * 0.75),
      '70%': Math.round(estimate * 0.70),
    };

    setResult({ max: estimate, percentages });
  };

  return (
    <div className="calculator-page">
      <div className="container calculator-wrapper">
        <nav className="breadcrumb mb-4">
          <Link to="/">Home</Link> / <span>Tools</span> / <span className="active">1RM Calculator</span>
        </nav>
        
        <h1 className="text-center mb-2">One Rep Max (1RM) <span>Calculator</span></h1>
        <p className="text-center mb-8">Estimate your maximum strength for bench press, squat, deadlift, and more. Compare your strength level against standards and get a full percentage chart for programming.</p>

        <div className="calculator-card">
          <form onSubmit={calculateOneRM}>
            <div className="form-group">
              <label>Exercise</label>
              <select className="form-control" value={exercise} onChange={(e) => setExercise(e.target.value)}>
                <option value="Bench Press">Bench Press</option>
                <option value="Squat">Squat</option>
                <option value="Deadlift">Deadlift</option>
                <option value="Overhead Press">Overhead Press</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Weight Lifted (kg)</label>
                <input type="number" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} required placeholder="e.g. 60" />
              </div>
              <div className="form-group">
                <label>Reps Completed</label>
                <input type="number" className="form-control" value={reps} onChange={(e) => setReps(e.target.value)} required placeholder="e.g. 5" max="20" />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>For best accuracy, use 3-5 reps</small>
              </div>
            </div>

            <div className="form-row mt-4">
              <div className="form-group">
                <label>Your Body Weight (kg) <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>— for strength level comparison</span></label>
                <input type="number" className="form-control" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} placeholder="e.g. 70" />
              </div>
              <div className="form-group">
                <label>Gender <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>— for strength level comparison</span></label>
                <div className="radio-group" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} /> Male
                  </label>
                  <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} /> Female
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4">Calculate My 1 Rep Max</button>
          </form>

          {result && (
            <div className="result-box mt-8">
              <div className="result-value" style={{ fontSize: '3.5rem' }}>{result.max} kg</div>
              <div className="result-label">Estimated 1 Rep Max for {exercise}</div>
              
              <div className="mt-8 text-left" style={{ borderTop: '1px solid rgba(205, 215, 101, 0.3)', paddingTop: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Percentage Breakdown</h4>
                <div className="grid grid-cols-2" style={{ gap: '0.5rem' }}>
                  {Object.entries(result.percentages).reverse().map(([percent, val]) => (
                    <div key={percent} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                      <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>{percent}</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{val} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="calculator-description">
            <h3>How This Calculator Works</h3>
            <p>This calculator estimates your One Rep Max (1RM) — the maximum weight you can lift for a single repetition with proper form. Instead of risking injury with an actual max attempt, you can estimate it from a lighter set.</p>

            <h3 className="mt-6">Formulas Used</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-2"><strong>Epley Formula (most popular):</strong><br/> 1RM = Weight × (1 + Reps ÷ 30)</li>
              <li className="mb-2"><strong>Brzycki Formula:</strong><br/> 1RM = Weight × (36 ÷ (37 − Reps))</li>
              <li className="mb-2"><strong>Lombardi Formula:</strong><br/> 1RM = Weight × Reps^0.1</li>
            </ul>
            <p>We use the average of all three formulas for the best estimate. The Epley and Brzycki formulas tend to give similar results for low rep ranges (1-6), while Lombardi is more conservative for higher rep ranges.</p>

            <h3 className="mt-6">Tips for Accurate Results</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-1">Use a set where you went to true failure or 1-2 reps from failure (RIR 0-2)</li>
              <li className="mb-1">Lower rep sets (3-5 reps) give more accurate 1RM predictions</li>
              <li className="mb-1">Sets above 10 reps tend to overestimate your 1RM</li>
              <li className="mb-1">Ensure proper form — half reps and bounced reps give inflated numbers</li>
              <li className="mb-1">Warm up properly before your test set</li>
            </ul>

            <h3 className="mt-6">Understanding Strength Standards</h3>
            <p>Strength standards are based on body weight ratios. They represent what the average natural lifter can achieve at each training experience level:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-1"><strong>Beginner:</strong> Less than 3 months of consistent training</li>
              <li className="mb-1"><strong>Novice:</strong> 3-12 months of consistent training</li>
              <li className="mb-1"><strong>Intermediate:</strong> 1-3 years of proper training</li>
              <li className="mb-1"><strong>Advanced:</strong> 3-5+ years of dedicated training</li>
              <li className="mb-1"><strong>Elite:</strong> 5+ years, often competitive-level strength</li>
            </ul>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Note: These standards are for natural lifters. Do not compare yourself to enhanced athletes.</p>

            <h3 className="mt-6">Frequently Asked Questions</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', color: 'var(--accent-primary)', marginBottom: '2rem' }}>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">What is a 1 Rep Max (1RM)?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">How accurate are 1RM calculators?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">What is a good bench press for my body weight?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">How often should I test my 1RM?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">Why do different formulas give different results?</li>
            </ul>

            <div className="disclaimer" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem' }}>
              <strong>Disclaimer:</strong> This calculator provides estimates based on mathematical formulas and is intended for informational purposes only. Actual 1RM may differ based on technique, fatigue, training history, and individual physiology. Never attempt a true 1RM without a spotter and proper warm-up. Strength training carries inherent risks of injury. Consult a qualified fitness professional before attempting heavy lifts, especially if you are a beginner or have any pre-existing injuries or medical conditions. The strength standards shown are general guidelines and may not apply to all populations.
            </div>

            <div className="mt-8 text-left">
              <Link to="/tools/macro" style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>← Macro Calculator</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneRMCalculator;
