
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/HeaderWrapper';
import InvestorForm from '@/components/InvestorForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { InvestorDetails as InvestorDetailsType } from '@/types/investor';
import { useInvestors } from '@/hooks/useInvestors';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MainContent from '@/components/dashboard/MainContent';
import { supabase } from '@/integrations/supabase/client';
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
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const navigate = useNavigate();
  
  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log("No active session, redirecting to login");
          navigate('/login');
          return;
        }
        
        console.log("User authenticated, session found");
        setIsAuthChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Authentication error");
        navigate('/login');
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Investor data and actions
  const { 
    searchResults, 
    selectedInvestor, 
    hasSearched, 
    loading,
    setSelectedInvestor,
    loadAllInvestors,
    handleSearch,
    handleViewDetails,
    handleSaveInvestor,
    handleDeleteInvestor
  } = useInvestors();

  // Handler functions
  const handleEditInvestor = async (pan: string) => {
    // Find the investor in our existing results first to avoid an unnecessary API call
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

  // Show loading state while checking authentication
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
