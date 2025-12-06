// Local user storage for testing - predefined users
export interface LocalUser {
  email: string;
  password: string;
  fullName: string;
  staffId?: string;
}

// Predefined test users
export const predefinedUsers: LocalUser[] = [
  {
    email: "manager@test.com",
    password: "manager123",
    fullName: "Test Manager",
    staffId: "12345678"
  },
  {
    email: "staff@test.com", 
    password: "staff123",
    fullName: "Test Staff",
    staffId: "12345"
  },
  {
    email: "customer@test.com",
    password: "customer123",
    fullName: "Test Customer"
  }
];

// Get all users (predefined + localStorage)
export const getAllUsers = (): LocalUser[] => {
  const storedUsers = localStorage.getItem('registeredUsers');
  const localUsers: LocalUser[] = storedUsers ? JSON.parse(storedUsers) : [];
  return [...predefinedUsers, ...localUsers];
};

// Register a new user
export const registerUser = (user: LocalUser): boolean => {
  const allUsers = getAllUsers();
  if (allUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    return false; // Email already exists
  }
  const storedUsers = localStorage.getItem('registeredUsers');
  const localUsers: LocalUser[] = storedUsers ? JSON.parse(storedUsers) : [];
  localUsers.push(user);
  localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
  return true;
};

// Validate login credentials
export const validateLogin = (email: string, password: string): LocalUser | null => {
  const allUsers = getAllUsers();
  const user = allUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
};
