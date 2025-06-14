
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/HeaderWrapper';
import InvestorForm from '@/components/InvestorForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { InvestorDetails as InvestorDetailsType } from '@/types/investor';
import { useInvestors } from '@/hooks/useInvestors';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MainContent from '@/components/dashboard/MainContent';
import { toast } from 'sonner';

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

  // If still checking auth or not authenticated, show loading or redirect
  React.useEffect(() => {
    if (!isAuthChecking && !isAuthenticated) {
      // Routing logic is handled in the hook via navigate already, but as a fallback:
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isAuthChecking, navigate]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-blue-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Prevent rendering the dashboard if user is not authenticated (avoids flicker).
    return null;
  }

  // Handler functions (same as before)
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Dashboard Header with search, actions, etc */}
          <DashboardHeader 
            onSearch={handleSearch}
            onRefresh={loadAllInvestors}
            onAddInvestor={handleAddInvestor}
            onGoHome={handleGoHome}
            loading={loading}
            showDashboard={showDashboard}
            onToggleDashboard={toggleDashboard}
          />

          {/* Main Content Area */}
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
      </main>

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

      <footer className="bg-blue-900 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; 2025 AR Associates. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
