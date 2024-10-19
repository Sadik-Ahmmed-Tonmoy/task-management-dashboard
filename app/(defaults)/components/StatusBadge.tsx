interface Props {
  status?: string; // Status could be optional, for handling cases where only isActive is used
  isActive?: boolean; // New prop for isActive
}

const StatusBadge: React.FC<Props> = ({ status, isActive }) => {
  let color = '';
  let label = '';

  // Handle isActive first, as it might be more specific than status
  if (isActive !== undefined) {
    color = isActive ? 'bg-green-500' : 'bg-red-500'; // Green for active, red for inactive
    label = isActive ? 'ACTIVE' : 'INACTIVE';
  } else if (status) {
    // Handle status-based coloring
    switch (status) {
      case 'pending':
        color = 'bg-yellow-500';
        break;
      case 'approved':
        color = 'bg-green-500';
        break;
      case 'rejected':
        color = 'bg-red-500';
        break;
      default:
        color = 'bg-gray-500';
    }
    label = status.toUpperCase();
  }

  return (
    <span className={`text-white px-3 py-1 rounded ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
