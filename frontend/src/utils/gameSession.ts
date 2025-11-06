export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500/20 text-green-400 border-green-500';
    case 'ABANDONED':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    case 'IN_PROGRESS':
      return 'bg-blue-500/20 text-blue-400 border-blue-500';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500';
  }
};
