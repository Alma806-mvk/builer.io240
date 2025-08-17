// Handler for sending trend ideas to calendar
const handleSendTrendToCalendar = (idea: { type: string; title: string; trend: string }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const newEvent: CalendarEvent = {
    id: `trend-${Date.now()}`,
    title: `${idea.type}: ${idea.title}`,
    description: `Content idea from trend: ${idea.trend}\n\nSuggested content type: ${idea.type}\nIdea: ${idea.title}`,
    date: tomorrow.toISOString().split('T')[0],
    time: "10:00",
    platform: "youtube" as Platform, // Default platform, user can change it
    color: "#8B5CF6", // Purple color to indicate it's from trend analysis
    content: idea.title,
    status: "draft" as const,
  };
  
  setCalendarEvents((prev) => [...prev, newEvent]);
  
  // Show confirmation to user
  setTimeout(() => {
    alert(`✅ "${idea.title}" has been added to your calendar for tomorrow!`);
  }, 100);
};