import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: 'admin@apexprocure.com',
    name: 'Sreerag Manager',
    role: 'ADMIN',
    roleLabel: 'System Administrator',
    organization: 'Apex Global Procurement',
    isAuthenticated: true
  });

  const login = (loginData) => {
    const rolesMap = {
      'ADMIN': 'System Administrator',
      'PROCUREMENT_MANAGER': 'Procurement Manager',
      'VENDOR': 'TechCorp Vendor Portal',
      'FINANCE': 'Finance Approver'
    };
    setUser({
      email: loginData.email,
      name: `${loginData.first_name || 'Sreerag'} ${loginData.last_name || 'Manager'}`,
      role: loginData.role || 'ADMIN',
      roleLabel: rolesMap[loginData.role] || 'System Administrator',
      organization: loginData.organization_name || 'Apex Global Procurement',
      isAuthenticated: true
    });
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isAuthenticated: false }));
  };

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
    <AuthContext.Provider value={{ user, login, logout, switchRole, switchOrganization }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
