import { useState, useEffect } from 'react';

// Container Pattern / Custom Hook
// Separates the business logic (intervals, random math) from the presentational component

export function useWebDevDashboard() {
  const [users, setUsers] = useState(12402);
  const [chartHeights, setChartHeights] = useState([30, 45, 60, 50, 75, 65, 90]);

  useEffect(() => {
    // Live Users Counter Logic
    const updateUsers = (prev: number) => {
      const change = Math.floor(Math.random() * 20) - 8; // Fluctuation
      return prev + change;
    };
    const userInterval = setInterval(() => setUsers(updateUsers), 2000);

    // Live Chart Fluctuations Logic
    const updateHeights = (prev: number[]) => {
      return prev.map(h => {
        const change = Math.floor(Math.random() * 15) - 7;
        const newHeight = h + change;
        return Math.max(10, Math.min(100, newHeight)); // Clamp between 10% and 100%
      });
    };
    const chartInterval = setInterval(() => setChartHeights(updateHeights), 3000);

    // Cleanup
    return () => {
      clearInterval(userInterval);
      clearInterval(chartInterval);
    };
  }, []);

  return {
    users,
    chartHeights
  };
}
