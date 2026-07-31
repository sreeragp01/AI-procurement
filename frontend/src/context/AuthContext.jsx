import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: 'admin@apexprocure.com',
    name: 'Sreerag Manager',
    role: 'ADMIN',
    roleLabel: 'System Administrator',
    organization: 'Apex Global Procurement'
  });

  const switchRole = (newRole) => {
    const rolesMap = {
      'ADMIN': 'System Administrator',
      'PROCUREMENT_MANAGER': 'Procurement Manager',
      'VENDOR': 'TechCorp Vendor Portal',
      'FINANCE': 'Finance Approver'
    };
    setUser(prev => ({
      ...prev,
      role: newRole,
      roleLabel: rolesMap[newRole] || newRole
    }));
  };

  const switchOrganization = (orgName) => {
    setUser(prev => ({
      ...prev,
      organization: orgName
    }));
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, switchOrganization }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
