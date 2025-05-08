import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/HeaderWrapper';
import InvestorForm from '@/components/InvestorForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { InvestorDetails as InvestorDetailsType } from '@/types/investor';
import { useInvestors } from '@/hooks/useInvestors';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import InvestorDetailsSection from '@/components/dashboard/InvestorDetailsSection';
import InvestorsList from '@/components/dashboard/InvestorsList';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import InvestmentDashboard from '@/components/dashboard/InvestmentDashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IndexProps {
  initialShowDashboard?: boolean;
}

const Index = ({ initialShowDashboard = false }: IndexProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [investorToEdit, setInvestorToEdit] = useState<InvestorDetailsType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState<{pan: string, name: string} | null>(null);
  const [showDashboard, setShowDashboard] = useState(initialShowDashboard);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const navigate = useNavigate();
  
  // Check authentication on component mount
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
          <DashboardHeader 
            onSearch={handleSearch}
            onRefresh={loadAllInvestors}
            onAddInvestor={handleAddInvestor}
            onGoHome={handleGoHome}
            loading={loading}
            showDashboard={showDashboard}
            onToggleDashboard={toggleDashboard}
          />

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-blue-300">Loading...</p>
            </div>
          )}

          {/* Results area */}
          {!loading && (
            <div className="space-y-8">
              {showDashboard ? (
                <InvestmentDashboard />
              ) : (
                <>
                  {/* Selected investor details */}
                  <InvestorDetailsSection 
                    investor={selectedInvestor} 
                    onEditInvestor={handleEditInvestor}
                  />

                  {/* Search results or all investors */}
                  <InvestorsList 
                    results={searchResults}
                    hasSearched={hasSearched}
                    onViewDetails={handleViewDetails}
                    onEditInvestor={handleEditInvestor}
                    onDeleteInvestor={handleDeleteClick}
                  />

                  {/* Initial state message */}
                  <WelcomeMessage show={!hasSearched && searchResults.length === 0} />
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Investor form */}
      <InvestorForm 
        onSave={onSaveInvestor}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={investorToEdit}
        isEditing={isEditing}
      />

      {/* Delete confirmation dialog */}
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
