
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import InvestorCard from '@/components/InvestorCard';
import InvestorForm from '@/components/InvestorForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { searchInvestors, getInvestorByPan, addInvestor, editInvestor, deleteInvestor, getAllInvestors } from '@/services/investorService';
import { InvestorDetails } from '@/types/investor';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';

const Index = () => {
  const [searchResults, setSearchResults] = useState<InvestorDetails[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [investorToEdit, setInvestorToEdit] = useState<InvestorDetails | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState<{pan: string, name: string} | null>(null);
  const { toast } = useToast();

  // Load all investors on first render
  useEffect(() => {
    loadAllInvestors();
  }, []);

  const loadAllInvestors = () => {
    const allInvestors = getAllInvestors();
    setSearchResults(allInvestors);
    setHasSearched(false); // Reset search flag to show "All Investors" title
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      loadAllInvestors();
      return;
    }

    const results = searchInvestors(query);
    setSearchResults(results);
    setSelectedInvestor(null); // Clear the selected investor when performing a new search
    setHasSearched(true);

    if (results.length === 0) {
      toast({
        title: "No results found",
        description: "No investors match your search criteria.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Search results",
        description: `Found ${results.length} investor${results.length > 1 ? 's' : ''}.`,
      });
    }
  };

  const handleViewDetails = (pan: string) => {
    const investor = getInvestorByPan(pan);
    if (investor) {
      setSelectedInvestor(investor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast({
        title: "Error",
        description: "Could not find investor details.",
        variant: "destructive",
      });
    }
  };

  const handleEditInvestor = (pan: string) => {
    const investor = getInvestorByPan(pan);
    if (investor) {
      setInvestorToEdit(investor);
      setIsEditing(true);
      setFormOpen(true);
    } else {
      toast({
        title: "Error",
        description: "Could not find investor to edit.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvestor = (pan: string) => {
    const investor = getInvestorByPan(pan);
    if (investor) {
      setInvestorToDelete({ pan: investor.pan, name: investor.name });
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (investorToDelete) {
      const success = deleteInvestor(investorToDelete.pan);
      if (success) {
        // If the deleted investor was the selected one, clear it
        if (selectedInvestor && selectedInvestor.pan === investorToDelete.pan) {
          setSelectedInvestor(null);
        }
        
        // Update search results if the deleted investor was in the list
        setSearchResults(prevResults => 
          prevResults.filter(investor => investor.pan !== investorToDelete.pan)
        );
        
        toast({
          title: "Investor deleted",
          description: `${investorToDelete.name} has been deleted successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete investor.",
          variant: "destructive",
        });
      }
      setDeleteDialogOpen(false);
      setInvestorToDelete(null);
    }
  };

  const handleAddInvestor = () => {
    setInvestorToEdit(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleSaveInvestor = (investor: InvestorDetails) => {
    if (isEditing) {
      const success = editInvestor(investor);
      if (success) {
        // Update the selected investor if it's the one being edited
        if (selectedInvestor && selectedInvestor.pan === investor.pan) {
          setSelectedInvestor(investor);
        }
        
        // Update search results if the edited investor is in the list
        setSearchResults(prevResults => 
          prevResults.map(i => i.pan === investor.pan ? investor : i)
        );
        
        toast({
          title: "Investor updated",
          description: `${investor.name} has been updated successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update investor.",
          variant: "destructive",
        });
      }
    } else {
      addInvestor(investor);
      // Add the new investor to the search results if we're showing all investors
      if (!hasSearched) {
        setSearchResults(prevResults => [...prevResults, investor]);
      }
      toast({
        title: "Success",
        description: `Investor ${investor.name} has been added successfully.`,
      });
    }
    setFormOpen(false);
    setIsEditing(false);
    setInvestorToEdit(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-finance mb-4 md:mb-0">Investor Management</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={loadAllInvestors}
                  className="whitespace-nowrap"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> All Investors
                </Button>
                <Button 
                  className="bg-finance hover:bg-finance-dark whitespace-nowrap" 
                  onClick={handleAddInvestor}
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Add Investor
                </Button>
              </div>
            </div>
          </div>

          {/* Results area */}
          <div className="space-y-8">
            {/* Selected investor details */}
            {selectedInvestor && (
              <section>
                <h3 className="text-xl font-semibold text-finance mb-4">Investor Details</h3>
                <InvestorCard investor={selectedInvestor} />
              </section>
            )}

            {/* Search results or all investors */}
            <section>
              <h3 className="text-xl font-semibold text-finance mb-4">
                {hasSearched ? "Search Results" : "All Investors"}
              </h3>
              {searchResults.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                  <SearchResults 
                    results={searchResults} 
                    onViewDetails={handleViewDetails}
                    onEditInvestor={handleEditInvestor}
                    onDeleteInvestor={handleDeleteInvestor}
                  />
                </div>
              ) : (
                <Card className="p-8 text-center text-gray-500">
                  {hasSearched 
                    ? "No investors found matching your search criteria." 
                    : "No investors found in the system. Add your first investor to get started."}
                </Card>
              )}
            </section>

            {/* Initial state message only when there are no investors and no search was performed */}
            {!hasSearched && searchResults.length === 0 && (
              <div className="text-center p-12 bg-finance-highlight rounded-lg border border-finance-light">
                <h3 className="text-xl font-semibold text-finance mb-2">Welcome to Folio Finder Elite</h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first investor using the "Add Investor" button above.
                </p>
                <div className="text-sm text-gray-500">
                  You'll be able to view personal details, nominee information, bank accounts, and investment schemes.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Investor form */}
      <InvestorForm 
        onSave={handleSaveInvestor}
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

      <footer className="bg-finance-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; 2025 Folio Finder Elite. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
