interface Props {
  status?: string; // Status could be optional, for handling cases where only isActive is used
  isActive?: boolean; // New prop for isActive
}

const StatusBadge: React.FC<Props> = ({ status, isActive }) => {
  let color = '';
  let label = '';

  // Handle isActive first, as it might be more specific than status
  if (isActive !== undefined) {
    color = isActive ? 'border-green-500 text-green-500 ' : 'border-red-500 text-red-500'; // Green for active, red for inactive
    label = isActive ? 'ACTIVE' : 'INACTIVE';
  } else if (status) {
    // Handle status-based coloring
    switch (status) {
      case 'pending':
        color = 'border-yellow-500 text-yellow-500';
        break;
      case 'approved':
        color = 'border-green-500 text-green-500';
        break;
      case 'rejected':
        color = 'border-red-500 text-red-500';
        break;
      default:
        color = 'border-gray-500 text-gray-500';
    }
    label = status.toUpperCase();
  }

  return (
    <span className={` px-3 py-1 rounded badge  ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
