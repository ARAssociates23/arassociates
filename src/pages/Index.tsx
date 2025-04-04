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
import { UserPlus, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<InvestorDetails[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [investorToEdit, setInvestorToEdit] = useState<InvestorDetails | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState<{pan: string, name: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load all investors on first render
  useEffect(() => {
    loadAllInvestors();
  }, []);

  const loadAllInvestors = async () => {
    setLoading(true);
    try {
      const allInvestors = await getAllInvestors();
      setSearchResults(allInvestors);
      setHasSearched(false); // Reset search flag to show "All Investors" title
      setLoading(false);
    } catch (error) {
      console.error("Error loading investors:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load investors",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadAllInvestors();
      return;
    }

    setLoading(true);
    try {
      const results = await searchInvestors(query);
      setSearchResults(results);
      setSelectedInvestor(null); // Clear the selected investor when performing a new search
      setHasSearched(true);
      setLoading(false);

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
    } catch (error) {
      console.error("Error searching investors:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to search investors",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = async (pan: string) => {
    setLoading(true);
    try {
      const investor = await getInvestorByPan(pan);
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
    } catch (error) {
      console.error("Error fetching investor details:", error);
      toast({
        title: "Error",
        description: "Failed to load investor details",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEditInvestor = async (pan: string) => {
    setLoading(true);
    try {
      const investor = await getInvestorByPan(pan);
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
    } catch (error) {
      console.error("Error fetching investor for edit:", error);
      toast({
        title: "Error",
        description: "Failed to load investor for editing",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteInvestor = (pan: string) => {
    const investor = searchResults.find(inv => inv.pan === pan);
    if (investor) {
      setInvestorToDelete({ pan: investor.pan, name: investor.name });
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (investorToDelete) {
      setLoading(true);
      try {
        const success = await deleteInvestor(investorToDelete.pan);
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
      } catch (error) {
        console.error("Error deleting investor:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the investor",
          variant: "destructive",
        });
      }
      setDeleteDialogOpen(false);
      setInvestorToDelete(null);
      setLoading(false);
    }
  };

  const handleAddInvestor = () => {
    setInvestorToEdit(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleGoHome = () => {
    setSelectedInvestor(null);
    loadAllInvestors();
    setHasSearched(false);
  };

  const handleSaveInvestor = async (investor: InvestorDetails) => {
    setLoading(true);
    try {
      if (isEditing) {
        const success = await editInvestor(investor);
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
        const success = await addInvestor(investor);
        if (success) {
          // Add the new investor to the search results if we're showing all investors
          if (!hasSearched) {
            setSearchResults(prevResults => [...prevResults, investor]);
          }
          toast({
            title: "Success",
            description: `Investor ${investor.name} has been added successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add investor.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving investor:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the investor",
        variant: "destructive",
      });
    }
    setFormOpen(false);
    setIsEditing(false);
    setInvestorToEdit(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="outline"
                onClick={handleGoHome}
                className="mr-4"
              >
                <Home className="h-4 w-4 mr-2" /> Home
              </Button>
              <h2 className="text-2xl font-bold text-finance">Investor Management</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={loadAllInvestors}
                  className="whitespace-nowrap"
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> All Investors
                </Button>
                <Button 
                  className="bg-finance hover:bg-finance-dark whitespace-nowrap" 
                  onClick={handleAddInvestor}
                  disabled={loading}
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Add Investor
                </Button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-finance">Loading...</p>
            </div>
          )}

          {/* Results area */}
          {!loading && (
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
          )}
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
          &copy; 2025 AR Associates. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
