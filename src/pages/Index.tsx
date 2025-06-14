
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/HeaderWrapper';
import InvestorForm from '@/components/InvestorForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { InvestorDetails as InvestorDetailsType } from '@/types/investor';
import { useInvestors } from '@/hooks/useInvestors';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MainContent from '@/components/dashboard/MainContent';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';

interface IndexProps {
  initialShowDashboard?: boolean;
}

const Index = ({ initialShowDashboard = false }: IndexProps) => {
  // Form and dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [investorToEdit, setInvestorToEdit] = useState<InvestorDetailsType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState<{pan: string, name: string} | null>(null);
  const [showDashboard, setShowDashboard] = useState(initialShowDashboard);

  const navigate = useNavigate();
  
  // Use Investors hook - handles authentication and all data logic!
  const { 
    searchResults, 
    selectedInvestor, 
    hasSearched, 
    loading,
    isAuthenticated,
    isAuthChecking,
    setSelectedInvestor,
    loadAllInvestors,
    handleSearch,
    handleViewDetails,
    handleSaveInvestor,
    handleDeleteInvestor
  } = useInvestors();

  // If still checking auth, show loading
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Spinner" className="w-10 sm:w-12 mb-4 sm:mb-5 animate-pulse opacity-40" />
            <p className="text-blue-200 text-base sm:text-lg font-semibold tracking-tight animate-fade-in text-center">
              Checking authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect
  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  // Handler functions
  const handleEditInvestor = async (pan: string) => {
    const investor = searchResults.find(inv => inv.pan === pan);
    if (investor) {
      setInvestorToEdit(investor);
      setIsEditing(true);
      setFormOpen(true);
    }
  };

  const handleDeleteClick = (pan: string) => {
    const investor = searchResults.find(inv => inv.pan === pan);
    if (investor) {
      setInvestorToDelete({ pan: investor.pan, name: investor.name });
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (investorToDelete) {
      await handleDeleteInvestor(investorToDelete.pan);
      setDeleteDialogOpen(false);
      setInvestorToDelete(null);
    }
  };

  const handleAddInvestor = () => {
    setInvestorToEdit(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleGoHome = () => {
    setSelectedInvestor(null);
    setShowDashboard(false);
    loadAllInvestors();
  };

  const onSaveInvestor = async (investor: InvestorDetailsType) => {
    await handleSaveInvestor(investor, isEditing);
    setFormOpen(false);
    setIsEditing(false);
    setInvestorToEdit(null);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    if (!showDashboard) {
      setSelectedInvestor(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white pb-24 lg:pb-0" style={{ background: 'var(--mac-gradient)' }}>
      <div className="sticky top-0 z-30 shadow-lg backdrop-blur-md">
        <Header />
      </div>
      <main className="flex-1 flex justify-center relative" style={{ minHeight: '79vh' }}>
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-3 py-4 sm:py-8">
          {/* Dashboard Header with search, actions, etc */}
          <div className="mb-4 sm:mb-6 glass-card shadow-lg p-3 sm:p-4 md:p-5 rounded-2xl apple-blur-bg">
            <DashboardHeader 
              onSearch={handleSearch}
              onRefresh={loadAllInvestors}
              onAddInvestor={handleAddInvestor}
              onGoHome={handleGoHome}
              loading={loading}
              showDashboard={showDashboard}
              onToggleDashboard={toggleDashboard}
            />
          </div>
          {/* Main Content Area */}
          <div className="glass-card rounded-2xl apple-blur-bg shadow-xl p-2 sm:p-3 md:p-5 overflow-hidden">
            <MainContent 
              showDashboard={showDashboard}
              loading={loading}
              selectedInvestor={selectedInvestor}
              searchResults={searchResults}
              hasSearched={hasSearched}
              onViewDetails={handleViewDetails}
              onEditInvestor={handleEditInvestor}
              onDeleteInvestor={handleDeleteClick}
            />
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation - Fixed at bottom of viewport */}
      <MobileBottomNav
        onRefresh={loadAllInvestors}
        onAddInvestor={handleAddInvestor}
        onGoHome={handleGoHome}
        loading={loading}
        showDashboard={showDashboard}
        onToggleDashboard={toggleDashboard}
      />

      {/* Modals and dialogs */}
      <InvestorForm 
        onSave={onSaveInvestor}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={investorToEdit}
        isEditing={isEditing}
      />

      <DeleteConfirmationDialog 
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        investorName={investorToDelete?.name || ''}
      />

      <footer className="apple-footer glass-card shadow-xl mt-4 sm:mt-8 px-0 pb-1 mb-20 lg:mb-0">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-slate-200/90 tracking-tight">
          &copy; 2025 AR Associates. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
